from typing import List, Optional
import os
import shutil
import uuid

import uvicorn
from fastapi import Depends, FastAPI, HTTPException, status, File, UploadFile, Form, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from prometheus_fastapi_instrumentator import Instrumentator # APM
from sqlalchemy.orm import Session
from starlette.responses import Response, StreamingResponse

from backend import crud, models, schemas  # noqa: F401
from backend.database import Base, engine, get_db
from backend.routers import analytics, chat, auth as auth_router, doctors, human_consultations, messages, documents, organizations
from backend.services import HealthAnalysisService
from backend.utils.pdf_generator import PDFReportGenerator
from src.agents.heart_agent import generate_shap_plot

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
app.include_router(auth_router.router)
app.include_router(doctors.router)
app.include_router(human_consultations.router)
app.include_router(messages.router)
app.include_router(documents.router)
app.include_router(organizations.router)
app.include_router(analytics.router)
app.include_router(chat.router)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize APM
Instrumentator().instrument(app).expose(app)


# ============================================================
# WebSocket Connection Manager
# ============================================================


class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, room_id: str):
        await websocket.accept()
        if room_id not in self.active_connections:
            self.active_connections[room_id] = []
        self.active_connections[room_id].append(websocket)

    def disconnect(self, websocket: WebSocket, room_id: str):
        if room_id in self.active_connections:
            self.active_connections[room_id].remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: str, room_id: str):
        if room_id in self.active_connections:
            for connection in self.active_connections[room_id]:
                await connection.send_text(message)


manager = ConnectionManager()


@app.websocket("/ws/chat/{consultation_id}")
async def websocket_endpoint(websocket: WebSocket, consultation_id: str):
    await manager.connect(websocket, consultation_id)
    try:
        while True:
            data = await websocket.receive_text()
            # In a production app, we would save the message to DB here
            await manager.broadcast(f"{data}", consultation_id)
    except WebSocketDisconnect:
        manager.disconnect(websocket, consultation_id)


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
    patient_name: str,
    age: int,
    gender: str,
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
    # We map the inputs to the standard schema
    request = schemas.AnalyzeHealthRequest(
        patient_data=schemas.PatientCreate(
            name=patient_name,
            age=age,
            gender=gender,
            email=f"temp_{uuid.uuid4()}@example.com",  # Temporary email
            medical_record_number=f"MRI-{uuid.uuid4().hex[:6]}",
        ),
        medical_data=schemas.MedicalRecordBase(
            mri_image_path=abs_file_path,
            # Defaults for fields not relevant to this specific trial
            systolic_bp=120,
            diastolic_bp=80,
            heart_rate=72,
            cholesterol_total=200,
            blood_sugar_fasting=100,
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
