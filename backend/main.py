import os
import shutil
import uuid
from typing import Any, Dict, List, Optional

import uvicorn
from fastapi import Depends, FastAPI, File, Form, HTTPException, UploadFile, WebSocket, WebSocketDisconnect, status
from fastapi.middleware.cors import CORSMiddleware
from prometheus_fastapi_instrumentator import Instrumentator  # APM
from sqlalchemy.orm import Session
from starlette.responses import Response, StreamingResponse

from backend import crud, models, schemas  # noqa: F401
from backend.database import Base, engine, get_db
from backend.routers import (
    admin,
    analytics,
)
from backend.routers import auth as auth_router
from backend.routers import (
    chat,
    doctors,
    documents,
    emergency,
    human_consultations,
    messages,
    organizations,
    payments,
)
from backend.services import HealthAnalysisService
from backend.utils.pdf_generator import PDFReportGenerator
from src.agents.heart_agent import generate_shap_plot
from backend.websocket_manager import manager

# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title="AruviAI Clinical Intelligence API",
    description="FastAPI backend for AruviAI — Knowledge-driven clinical intelligence for Indian healthcare",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

# Include Routers
app.include_router(auth_router.router)
app.include_router(admin.router)
app.include_router(doctors.router)
app.include_router(human_consultations.router)
app.include_router(messages.router)
app.include_router(documents.router)
app.include_router(organizations.router)
app.include_router(emergency.router)
app.include_router(payments.router)
app.include_router(analytics.router)
app.include_router(chat.router)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize APM
Instrumentator().instrument(app).expose(app)


@app.websocket("/ws/chat/{consultation_id}")
async def websocket_endpoint(websocket: WebSocket, consultation_id: str):
    await manager.connect(websocket, consultation_id)
    try:
        while True:
            data = await websocket.receive_text()
            await manager.broadcast(f"{data}", consultation_id)
    except WebSocketDisconnect:
        manager.disconnect(websocket, consultation_id)


@app.websocket("/ws/alerts/{room_id}")
async def alerts_websocket_endpoint(websocket: WebSocket, room_id: str):
    await manager.connect(websocket, room_id)
    try:
        while True:
            # Just keep the connection alive, alerts are server-to-client
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket, room_id)


# ============================================================
# Health Check
# ============================================================


@app.get("/", tags=["Health"])
def root():
    return {
        "message": "AruviAI Clinical Intelligence API",
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


@app.get("/api/patients", response_model=List[schemas.PatientResponse], tags=["Patients"])
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
def create_medical_record(record: schemas.MedicalRecordCreate, db: Session = Depends(get_db)):
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
def create_consultation(consultation: schemas.ConsultationCreate, db: Session = Depends(get_db)):
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
    db_consultation = crud.update_consultation(db, consultation_id=consultation_id, update=update)
    if db_consultation is None:
        raise HTTPException(status_code=404, detail="Consultation not found")
    return db_consultation


@app.get(
    "/api/consultations",
    response_model=List[schemas.ConsultationResponse],
    tags=["Consultations"],
)
def list_consultations(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """List all consultations"""
    return crud.get_consultations(db, skip=skip, limit=limit)


# ============================================================
# Health Assessment Endpoints
# ============================================================


@app.post(
    "/api/assessments",
    response_model=schemas.HealthAssessmentResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["Assessments"],
)
def create_assessment(assessment: schemas.HealthAssessmentCreate, db: Session = Depends(get_db)):
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


@app.get(
    "/api/patients/{patient_id}/assessments",
    response_model=List[schemas.HealthAssessmentResponse],
    tags=["Assessments"],
)
def get_patient_assessments(patient_id: str, db: Session = Depends(get_db)):
    """Get all assessments for a patient"""
    return crud.get_patient_assessments(db, patient_id=patient_id)


# ============================================================
# Complete Analysis Endpoint (All-in-One)
# ============================================================


@app.post("/api/analyze", response_model=schemas.AnalyzeHealthResponse, tags=["Analysis"])
async def analyze_health(request: schemas.AnalyzeHealthRequest, db: Session = Depends(get_db)):
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


@app.post("/api/analyze/brain-tumor", response_model=schemas.AnalyzeHealthResponse, tags=["Analysis"])
async def analyze_brain_tumor(
    patient_name: str = Form(...),
    age: int = Form(...),
    gender: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    """
    Dedicated endpoint for Brain Tumor MRI Analysis.
    Handles file upload and triggers the diagnostic pipeline.
    """
    # 1. Save uploaded file
    upload_dir = "data/uploads"
    os.makedirs(upload_dir, exist_ok=True)

    file_extension = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(upload_dir, unique_filename)

    # Save absolute path for the agent
    abs_file_path = os.path.abspath(file_path)

    with open(abs_file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # 2. Construct Analysis Request
    # Heuristic lookup to avoid duplicate patient records
    db_patient = None
    all_potential_patients = db.query(models.Patient).filter(
        models.Patient.age == age
    ).all()

    # Decrypt and compare names manually since name is an EncryptedString
    db_patient: Optional[models.Patient] = None
    p: models.Patient
    for p in all_potential_patients:
        if p.name == patient_name:
            db_patient = p
            break

    # Existing user data or defaults
    existing_vitals: Dict[str, Any] = {}
    patient_email = f"temp_{uuid.uuid4()}@example.com"
    # Slicing UUID hex string safely
    mrn_suffix: str = str(uuid.uuid4().hex)[:6]  # type: ignore
    mrn = f"MRI-{mrn_suffix}"

    if db_patient is not None:
        patient_email = str(db_patient.email)
        mrn = str(db_patient.medical_record_number or mrn)
        latest_record = crud.get_latest_medical_record(db, db_patient.id)
        if latest_record:
            # Fetch existing vitals from the latest record
            # Only use fields defined in schemas.MedicalRecordBase
            existing_vitals = {
                "blood_pressure": latest_record.blood_pressure,
                "cholesterol": latest_record.cholesterol,
                "blood_glucose": latest_record.blood_glucose,
                "hba1c": latest_record.hba1c,
                "hdl_cholesterol": latest_record.hdl_cholesterol,
                "bmi": latest_record.bmi,
                "hypertension": latest_record.hypertension,
                "diabetes": latest_record.diabetes,
                "heart_disease": latest_record.heart_disease,
                "smoking_status": latest_record.smoking_status,
            }

    request = schemas.AnalyzeHealthRequest(
        patient_data=schemas.PatientCreate(
            name=patient_name,
            age=age,
            gender=gender,
            email=patient_email,
            medical_record_number=mrn,
        ),
        medical_data=schemas.MedicalRecordBase(
            mri_image_path=abs_file_path,
            **existing_vitals
        ),
        role="Doctor",
        conversation_history=[],
    )

    # 3. Run Analysis
    service = HealthAnalysisService(db)
    return await service.analyze_health(request)


# ============================================================
# Utilities Endpoints
# ============================================================


@app.post("/api/generate-pdf", tags=["Utilities"])
def generate_pdf(data: schemas.AnalyzeHealthResponse):
    """Generate a PDF report from analysis results"""
    # model_dump() for Pydantic v2, dict() for v1. Using dict() for safety as schemas use v1 style config
    data_dict = data.dict()
    pdf_buffer = PDFReportGenerator.generate_report(data_dict)
    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=health_report.pdf"},
    )


@app.post("/api/explain/heart", tags=["Utilities"])
def explain_heart_risk(patient_data: dict):
    """Generate SHAP plot for heart disease prediction"""
    img_str = generate_shap_plot(patient_data)
    if img_str:
        return Response(content=img_str, media_type="text/plain")
    else:
        raise HTTPException(status_code=500, detail="Could not generate SHAP plot")


# ============================================================
# Run Server
# ============================================================

if __name__ == "__main__":
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
