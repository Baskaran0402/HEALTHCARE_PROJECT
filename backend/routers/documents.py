import os
import uuid
from datetime import datetime, timedelta
from typing import List, Optional

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from fastapi.responses import Response
from sqlalchemy.orm import Session

from backend import auth, models, schemas
from backend.database import get_db
from backend.utils.crypto import decrypt_content, decrypt_file_key, encrypt_content, encrypt_file_key, generate_file_key

router = APIRouter(prefix="/api/documents", tags=["Patient Documents"])

# Local storage configuration (could be swapped for S3)
STORAGE_BASE_DIR = os.path.join(os.getcwd(), "storage", "patients")


@router.post("/upload", response_model=schemas.DocumentResponse)
async def upload_document(
    patient_id: str = Form(...),
    document_type: str = Form(...),
    title: str = Form(...),
    description: Optional[str] = Form(None),
    tags: Optional[str] = Form(None),  # comma separated
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user),
):
    # 1. Validation
    if file.size > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large (max 10MB)")

    # 1.5 Authorization: Check if current_user can upload for this patient
    is_admin = current_user.role in ["super_admin", "admin", "org_admin"]
    is_patient_owner = (current_user.id == patient_id) or (
        current_user.role == "patient" and current_user.patient_profile and current_user.patient_profile.id == patient_id
    )
    is_assigned_doctor = current_user.role == "doctor" # Temporary broad doctor access for upload

    if not (is_admin or is_patient_owner or is_assigned_doctor):
        raise HTTPException(status_code=403, detail="Not authorized to upload documents for this patient")

    # 2. Security: Encryption
    file_key = generate_file_key()
    content = await file.read()
    encrypted_content = encrypt_content(content, file_key)

    # 3. Path Generation
    now = datetime.now()
    file_id = str(uuid.uuid4())
    ext = os.path.splitext(file.filename)[1]
    rel_path = os.path.join(patient_id, "documents", str(now.year), f"{now.month:02d}", f"{file_id}{ext}.enc")
    abs_path = os.path.join(STORAGE_BASE_DIR, rel_path)
    os.makedirs(os.path.dirname(abs_path), exist_ok=True)

    # 4. Save Encrypted File
    with open(abs_path, "wb") as f:
        f.write(encrypted_content)

    # 5. DB Entry
    tags_list = [t.strip() for t in tags.split(",")] if tags else []

    new_doc = models.PatientDocument(
        id=file_id,
        patient_id=patient_id,
        document_type=document_type,
        title=title,
        description=description,
        file_name=file.filename,
        file_path=rel_path,
        file_size=len(content),
        file_type=file.content_type,
        is_encrypted=True,
        encryption_key=encrypt_file_key(file_key),
        tags=tags_list,
        uploaded_by=current_user.id,
    )

    db.add(new_doc)

    # Access Log
    log = models.DocumentAccessLog(document_id=file_id, accessed_by=current_user.id, access_type="upload")
    db.add(log)

    db.commit()
    db.refresh(new_doc)
    return new_doc


@router.get("/patient/{patient_id}", response_model=List[schemas.DocumentResponse])
def get_patient_documents(
    patient_id: str, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_active_user)
):
    # Authorization check
    is_admin = current_user.role in ["super_admin", "admin", "org_admin"]
    is_patient_owner = (current_user.id == patient_id) or (
        current_user.role == "patient" and current_user.patient_profile and current_user.patient_profile.id == patient_id
    )

    # If it's a doctor, they can only see documents explicitly shared with them
    # OR if they have a privileged role (handled by is_admin)
    if not (is_admin or is_patient_owner):
        if current_user.role == "doctor":
            doctor_id = current_user.doctor_profile.id if current_user.doctor_profile else current_user.id
            docs = db.query(models.PatientDocument).filter(
                models.PatientDocument.patient_id == patient_id,
                models.PatientDocument.shared_with_doctor_id == doctor_id,
                (models.PatientDocument.share_expires_at == None) | (models.PatientDocument.share_expires_at > datetime.now())
            ).all()
            return docs

        raise HTTPException(status_code=403, detail="Not authorized to access these documents")

    docs = db.query(models.PatientDocument).filter(models.PatientDocument.patient_id == patient_id).all()
    return docs


@router.get("/{document_id}", response_model=schemas.DocumentResponse)
def get_document(
    document_id: str, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_active_user)
):
    doc = db.query(models.PatientDocument).filter(models.PatientDocument.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    # Authorization check
    is_admin = current_user.role in ["super_admin", "admin", "org_admin"]
    is_patient_owner = (current_user.id == doc.patient_id) or (
        current_user.role == "patient" and current_user.patient_profile and current_user.patient_profile.id == doc.patient_id
    )

    # Check if explicitly shared with this doctor
    is_shared = False
    if current_user.role == "doctor":
        doctor_id = current_user.doctor_profile.id if current_user.doctor_profile else current_user.id
        if doc.shared_with_doctor_id == doctor_id or doc.uploaded_by == current_user.id:
            if doc.share_expires_at is None or doc.share_expires_at > datetime.now():
                is_shared = True

    if not (is_admin or is_patient_owner or is_shared):
        raise HTTPException(status_code=403, detail="Not authorized to access this document")

    return doc


@router.get("/{document_id}/download")
async def download_document(
    document_id: str, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_active_user)
):
    doc = db.query(models.PatientDocument).filter(models.PatientDocument.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    # Authorization check
    is_admin = current_user.role in ["super_admin", "admin", "org_admin"]
    is_patient_owner = (current_user.id == doc.patient_id) or (
        current_user.role == "patient" and current_user.patient_profile and current_user.patient_profile.id == doc.patient_id
    )

    is_shared = False
    if current_user.role == "doctor":
        doctor_id = current_user.doctor_profile.id if current_user.doctor_profile else current_user.id
        if doc.shared_with_doctor_id == doctor_id or doc.uploaded_by == current_user.id:
            if doc.share_expires_at is None or doc.share_expires_at > datetime.now():
                is_shared = True

    if not (is_admin or is_patient_owner or is_shared):
        raise HTTPException(status_code=403, detail="Not authorized to download this document")

    abs_path = os.path.join(STORAGE_BASE_DIR, doc.file_path)
    if not os.path.exists(abs_path):
        raise HTTPException(status_code=404, detail="File not found on storage")

    # 1. Read encrypted content
    with open(abs_path, "rb") as f:
        encrypted_content = f.read()

    # 2. Decrypt
    file_key = decrypt_file_key(doc.encryption_key)
    decrypted_content = decrypt_content(encrypted_content, file_key)

    # 3. Log access
    log = models.DocumentAccessLog(document_id=doc.id, accessed_by=current_user.id, access_type="download")
    db.add(log)
    db.commit()

    return Response(
        content=decrypted_content,
        media_type=doc.file_type,
        headers={"Content-Disposition": f"attachment; filename={doc.file_name}"},
    )


@router.delete("/{document_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_document(
    document_id: str, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_active_user)
):
    doc = db.query(models.PatientDocument).filter(models.PatientDocument.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    # Authorization: Usually only the owner (patient) or privileged roles can delete
    is_privileged = current_user.role in ["admin", "super_admin", "org_admin"]  # More restricted for deletion
    is_patient = (current_user.id == doc.patient_id) or (
        current_user.role == "patient" and current_user.patient_profile and current_user.patient_profile.id == doc.patient_id
    )

    if not (is_privileged or is_patient):
        raise HTTPException(status_code=403, detail="Not authorized to delete this document")

    # Delete from storage
    abs_path = os.path.join(STORAGE_BASE_DIR, doc.file_path)
    if os.path.exists(abs_path):
        os.remove(abs_path)

    db.delete(doc)
    db.commit()
    return None


@router.post("/{document_id}/share", response_model=schemas.DocumentResponse)
def share_document(
    document_id: str,
    share_req: schemas.DocumentShareRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user),
):
    doc = db.query(models.PatientDocument).filter(models.PatientDocument.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    # Authorization: only the patient themselves or privileged roles
    is_privileged = current_user.role in ["doctor", "admin", "super_admin", "institution", "org_admin"]
    is_patient = (current_user.id == doc.patient_id) or (
        current_user.role == "patient" and current_user.patient_profile and current_user.patient_profile.id == doc.patient_id
    )

    if not (is_privileged or is_patient):
        raise HTTPException(status_code=403, detail="Not authorized to share this document")

    doc.shared_with_doctor_id = share_req.doctor_id
    doc.shared_at = datetime.now()
    doc.share_expires_at = datetime.now() + timedelta(hours=share_req.expires_in_hours)

    db.commit()
    return doc
