from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from backend import crud, schemas, auth, models
from backend.database import get_db

router = APIRouter(prefix="/api/emergency", tags=["Emergency Services"])

@router.post("/sos", response_model=schemas.SOSAlertResponse)
def trigger_sos(sos: schemas.SOSAlertBase, db: Session = Depends(get_db)):
    # 1. Logic to find nearest hospitals (Mocked for now)
    # In a real app, this would call a Places API or query hospital locations in DB
    nearest_hospitals = [
        {
            "name": "City Emergency Hospital",
            "distance": "0.8 km",
            "type": "hospital",
            "phone": "+91 98888 77777",
            "location": {"lat": sos.latitude + 0.005, "lng": sos.longitude + 0.005}
        },
        {
            "name": "Manipal Emergency Care",
            "distance": "1.5 km",
            "type": "hospital",
            "phone": "+91 90000 11111",
            "location": {"lat": sos.latitude - 0.008, "lng": sos.longitude - 0.002}
        }
    ]
    
    # 2. Create SOS Alert
    sos_data = schemas.SOSAlertCreate(
        **sos.model_dump(),
        nearby_hospitals=nearest_hospitals
    )
    
    db_sos = crud.create_sos_alert(db, sos_data)
    
    # 3. Logic to notify emergency contacts would go here
    
    return db_sos

@router.get("/status/{patient_id}", response_model=schemas.SOSAlertResponse)
def get_sos_status(patient_id: str, db: Session = Depends(get_db)):
    sos = crud.get_active_sos(db, patient_id)
    if not sos:
        raise HTTPException(status_code=404, detail="No active SOS alert for this patient")
    return sos

@router.post("/resolve/{sos_id}", response_model=schemas.SOSAlertResponse)
def resolve_sos(sos_id: str, db: Session = Depends(get_db)):
    return crud.resolve_sos(db, sos_id)
