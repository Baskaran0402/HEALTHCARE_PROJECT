from typing import List

import uvicorn
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from backend import crud, models, schemas  # noqa: F401
from backend.database import Base, engine, get_db
from backend.routers import analytics
from backend.services import HealthAnalysisService

# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title="AI Doctor Healthcare API",
    description="FastAPI backend for AI-powered healthcare decision support system",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

# Include Routers
app.include_router(analytics.router)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# Health Check
# ============================================================


@app.get("/", tags=["Health"])
def root():
    return {
        "message": "AI Doctor Healthcare API",
        "status": "running",
        "docs": "/api/docs",
    }


@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "healthy"}


# ============================================================
# Patient Endpoints
# ============================================================


@app.post(
    "/api/patients",
    response_model=schemas.PatientResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["Patients"],
)
def create_patient(patient: schemas.PatientCreate, db: Session = Depends(get_db)):
    """Create a new patient"""
    return crud.create_patient(db=db, patient=patient)


@app.get(
    "/api/patients/{patient_id}",
    response_model=schemas.PatientResponse,
    tags=["Patients"],
)
def get_patient(patient_id: str, db: Session = Depends(get_db)):
    """Get patient by ID"""
    db_patient = crud.get_patient(db, patient_id=patient_id)
    if db_patient is None:
        raise HTTPException(status_code=404, detail="Patient not found")
    return db_patient


@app.get(
    "/api/patients", response_model=List[schemas.PatientResponse], tags=["Patients"]
)
def list_patients(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """List all patients"""
    patients = crud.get_patients(db, skip=skip, limit=limit)
    return patients


# ============================================================
# Medical Records Endpoints
# ============================================================


@app.post(
    "/api/medical-records",
    response_model=schemas.MedicalRecordResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["Medical Records"],
)
def create_medical_record(
    record: schemas.MedicalRecordCreate, db: Session = Depends(get_db)
):
    """Create a new medical record"""
    return crud.create_medical_record(db=db, record=record)


@app.get(
    "/api/patients/{patient_id}/medical-records",
    response_model=List[schemas.MedicalRecordResponse],
    tags=["Medical Records"],
)
def get_patient_medical_records(patient_id: str, db: Session = Depends(get_db)):
    """Get all medical records for a patient"""
    return crud.get_patient_medical_records(db, patient_id=patient_id)


# ============================================================
# Consultation Endpoints
# ============================================================


@app.post(
    "/api/consultations",
    response_model=schemas.ConsultationResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["Consultations"],
)
def create_consultation(
    consultation: schemas.ConsultationCreate, db: Session = Depends(get_db)
):
    """Start a new consultation"""
    return crud.create_consultation(db=db, consultation=consultation)


@app.get(
    "/api/consultations/{consultation_id}",
    response_model=schemas.ConsultationResponse,
    tags=["Consultations"],
)
def get_consultation(consultation_id: str, db: Session = Depends(get_db)):
    """Get consultation by ID"""
    db_consultation = crud.get_consultation(db, consultation_id=consultation_id)
    if db_consultation is None:
        raise HTTPException(status_code=404, detail="Consultation not found")
    return db_consultation


@app.patch(
    "/api/consultations/{consultation_id}",
    response_model=schemas.ConsultationResponse,
    tags=["Consultations"],
)
def update_consultation(
    consultation_id: str,
    update: schemas.ConsultationUpdate,
    db: Session = Depends(get_db),
):
    """Update consultation (stage, confidence, conversation)"""
    db_consultation = crud.update_consultation(
        db, consultation_id=consultation_id, update=update
    )
    if db_consultation is None:
        raise HTTPException(status_code=404, detail="Consultation not found")
    return db_consultation


# ============================================================
# Health Assessment Endpoints
# ============================================================


@app.post(
    "/api/assessments",
    response_model=schemas.HealthAssessmentResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["Assessments"],
)
def create_assessment(
    assessment: schemas.HealthAssessmentCreate, db: Session = Depends(get_db)
):
    """Create a new health assessment"""
    return crud.create_health_assessment(db=db, assessment=assessment)


@app.get(
    "/api/consultations/{consultation_id}/assessments",
    response_model=List[schemas.HealthAssessmentResponse],
    tags=["Assessments"],
)
def get_consultation_assessments(consultation_id: str, db: Session = Depends(get_db)):
    """Get all assessments for a consultation"""
    return crud.get_consultation_assessments(db, consultation_id=consultation_id)


# ============================================================
# Complete Analysis Endpoint (All-in-One)
# ============================================================


@app.post(
    "/api/analyze", response_model=schemas.AnalyzeHealthResponse, tags=["Analysis"]
)
async def analyze_health(
    request: schemas.AnalyzeHealthRequest, db: Session = Depends(get_db)
):
    """
    Complete health analysis workflow:
    1. Create/update patient
    2. Store medical record
    3. Create consultation
    4. Run ML risk assessment
    5. Generate LLM reports
    6. Store assessment
    7. Return complete results
    """
    service = HealthAnalysisService(db)
    return await service.analyze_health(request)


# ============================================================
# Run Server
# ============================================================

if __name__ == "__main__":
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
