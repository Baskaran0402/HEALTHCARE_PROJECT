from typing import List
import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend import auth, crud, models, schemas
from backend.database import get_db

router = APIRouter(prefix="/api/consultations", tags=["Human Consultations"])


@router.post("/request", response_model=schemas.DoctorConsultationResponse)
def request_consultation(
    consultation: schemas.DoctorConsultationCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.check_role(["patient"])),
):
    # Resolve the patient profile from the authenticated user.
    # The frontend may send the User.id, but the FK requires the Patient profile id.
    patient = db.query(models.Patient).filter(
        models.Patient.user_id == current_user.id
    ).first()

    if not patient:
        # Auto-create a minimal patient profile if the user hasn't done an assessment yet
        patient = models.Patient(
            id=str(uuid.uuid4()),
            user_id=current_user.id,
            name=f"{current_user.first_name or ''} {current_user.last_name or ''}".strip() or current_user.username,
            age=0,  # placeholder — updated when they complete an assessment
            gender="Unknown",
            email=current_user.email,
        )
        db.add(patient)
        db.commit()
        db.refresh(patient)

    # Always use the resolved patient profile id — never trust the frontend value
    consultation_data = schemas.DoctorConsultationCreate(
        **{**consultation.model_dump(), "patient_id": patient.id}
    )
    return crud.create_doctor_consultation(db=db, consultation=consultation_data)


@router.get("/{consultation_id}", response_model=schemas.DoctorConsultationResponse)
def get_consultation(consultation_id: str, db: Session = Depends(get_db)):
    db_consultation = crud.get_doctor_consultation(db, consultation_id=consultation_id)
    if not db_consultation:
        raise HTTPException(status_code=404, detail="Consultation not found")
    return db_consultation


@router.put("/{consultation_id}/status", response_model=schemas.DoctorConsultationResponse)
def update_consultation_status(
    consultation_id: str,
    status_update: str,  # pending/accepted/in-progress/completed/cancelled
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user),
):
    update = schemas.DoctorConsultationUpdate(status=status_update)
    return crud.update_doctor_consultation(db, consultation_id=consultation_id, update=update)


@router.get("/patient/{patient_id}", response_model=List[schemas.DoctorConsultationResponse])
def get_patient_consultations(patient_id: str, db: Session = Depends(get_db)):
    return crud.get_patient_human_consultations(db, patient_id=patient_id)


@router.get("/doctor/{doctor_id}", response_model=List[schemas.DoctorConsultationResponse])
def get_doctor_consultations(doctor_id: str, db: Session = Depends(get_db)):
    return crud.get_doctor_human_consultations(db, doctor_id=doctor_id)


@router.post("/prescriptions", response_model=schemas.PrescriptionResponse)
def create_prescription(
    prescription: schemas.PrescriptionCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.check_role(["doctor"])),
):
    # Verify doctor is who they say they are
    if current_user.doctor_profile.id != prescription.doctor_id:
        raise HTTPException(status_code=403, detail="Not authorized to issue prescription for this doctor")

    db_prescription = models.Prescription(**prescription.model_dump())
    db.add(db_prescription)
    db.commit()
    db.refresh(db_prescription)
    return db_prescription


@router.get("/{consultation_id}/prescriptions", response_model=List[schemas.PrescriptionResponse])
def get_consultation_prescriptions(consultation_id: str, db: Session = Depends(get_db)):
    return db.query(models.Prescription).filter(models.Prescription.consultation_id == consultation_id).all()
