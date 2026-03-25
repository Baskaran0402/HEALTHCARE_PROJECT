from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend import auth, crud, models, schemas
from backend.database import get_db

router = APIRouter(prefix="/api/doctors", tags=["Doctors"])


@router.post("/register", response_model=schemas.DoctorResponse)
def register_doctor(
    doctor: schemas.DoctorBase,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.check_role(["doctor", "admin", "institution"])),
):
    # Check if user already has a doctor profile
    existing = crud.get_doctor_by_user_id(db, user_id=current_user.id)
    if existing:
        raise HTTPException(status_code=400, detail="Doctor profile already exists for this user")

    doctor_create = schemas.DoctorCreate(**doctor.model_dump(), user_id=current_user.id)
    return crud.create_doctor(db=db, doctor=doctor_create)


@router.get("/nearby", response_model=List[schemas.DoctorResponse])
def get_nearby_doctors(
    lat: float, lng: float, radius: float = 10.0, specialization: Optional[str] = None, db: Session = Depends(get_db)
):
    return crud.search_nearby_doctors(db, lat=lat, lng=lng, radius_km=radius, specialization=specialization)


@router.get("/search", response_model=List[schemas.DoctorResponse])
def search_doctors(specialization: Optional[str] = None, name: Optional[str] = None, db: Session = Depends(get_db)):
    return crud.search_doctors(db, specialization=specialization, name=name)


@router.get("/{doctor_id}", response_model=schemas.DoctorResponse)
def get_doctor(doctor_id: str, db: Session = Depends(get_db)):
    db_doctor = crud.get_doctor(db, doctor_id=doctor_id)
    if not db_doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    return db_doctor


@router.put("/{doctor_id}", response_model=schemas.DoctorResponse)
def update_doctor(
    doctor_id: str,
    update: schemas.DoctorUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_user),
):
    db_doctor = crud.get_doctor(db, doctor_id=doctor_id)
    if not db_doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")

    if db_doctor.user_id != current_user.id and current_user.role not in ["admin", "institution"]:
        raise HTTPException(status_code=403, detail="Not authorized to update this profile")

    return crud.update_doctor(db, doctor_id=doctor_id, update=update)


@router.post("/{doctor_id}/verify-license", response_model=schemas.DoctorResponse)
def verify_doctor_license(
    doctor_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.check_role(["admin", "institution"])),
):
    db_doctor = crud.get_doctor(db, doctor_id=doctor_id)
    if not db_doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")

    return crud.update_doctor(db, doctor_id=doctor_id, update=schemas.DoctorUpdate(is_verified=True))
