from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend import crud, schemas, auth, models
from backend.database import get_db

router = APIRouter(prefix="/api/consultations", tags=["Human Consultations"])


@router.post("/request", response_model=schemas.DoctorConsultationResponse)
def request_consultation(
    consultation: schemas.DoctorConsultationCreate, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.check_role(["patient"]))
):
    # Verify patient_id matches user's patient profile
    # (Assuming patient profile is linked to user)
    return crud.create_doctor_consultation(db=db, consultation=consultation)


@router.get("/{consultation_id}", response_model=schemas.DoctorConsultationResponse)
def get_consultation(consultation_id: str, db: Session = Depends(get_db)):
    db_consultation = crud.get_doctor_consultation(db, consultation_id=consultation_id)
    if not db_consultation:
        raise HTTPException(status_code=404, detail="Consultation not found")
    return db_consultation


@router.put("/{consultation_id}/status", response_model=schemas.DoctorConsultationResponse)
def update_consultation_status(
    consultation_id: str, 
    status_update: str, # pending/accepted/in-progress/completed/cancelled
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user)
):
    update = schemas.DoctorConsultationUpdate(status=status_update)
    return crud.update_doctor_consultation(db, consultation_id=consultation_id, update=update)


@router.get("/patient/{patient_id}", response_model=List[schemas.DoctorConsultationResponse])
def get_patient_consultations(patient_id: str, db: Session = Depends(get_db)):
    return crud.get_patient_human_consultations(db, patient_id=patient_id)


@router.get("/doctor/{doctor_id}", response_model=List[schemas.DoctorConsultationResponse])
def get_doctor_consultations(doctor_id: str, db: Session = Depends(get_db)):
    return crud.get_doctor_human_consultations(db, doctor_id=doctor_id)


@router.post("/{consultation_id}/start-video")
def start_video_consultation(consultation_id: str, db: Session = Depends(get_db)):
    # Placeholder for Agora/Twilio token generation
    return {"token": f"mock_token_{consultation_id}", "channel": f"room_{consultation_id}"}


@router.get("/{consultation_id}/video-token")
def get_video_token(consultation_id: str, db: Session = Depends(get_db)):
    return {"token": f"mock_token_{consultation_id}", "channel": f"room_{consultation_id}"}
