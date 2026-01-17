from datetime import datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, EmailStr, Field

# ============================================================
# Patient Schemas
# ============================================================


class PatientBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    medical_record_number: Optional[str] = Field(None, max_length=50)
    age: int = Field(..., ge=0, le=120)
    gender: str = Field(..., pattern="^(Male|Female)$")
    email: Optional[EmailStr] = None
    phone: Optional[str] = None


class PatientCreate(PatientBase):
    pass


class PatientResponse(PatientBase):
    id: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ============================================================
# Medical Record Schemas
# ============================================================


class MedicalRecordBase(BaseModel):
    bmi: Optional[float] = Field(None, ge=10.0, le=60.0)
    blood_pressure: Optional[int] = Field(None, ge=60, le=250)
    blood_glucose: Optional[float] = Field(None, ge=50.0, le=500.0)
    hba1c: Optional[float] = Field(None, ge=3.0, le=15.0)
    cholesterol: Optional[float] = Field(None, ge=100.0, le=400.0)
    creatinine: Optional[float] = Field(None, ge=0.1, le=10.0)
    urea: Optional[float] = None
    bilirubin_total: Optional[float] = None
    alt: Optional[float] = None
    ast: Optional[float] = None

    hypertension: bool = False
    diabetes: bool = False
    heart_disease: bool = False

    smoking_status: Optional[str] = Field(None, pattern="^(never|former|current)$")

    chest_pain: bool = False
    breathlessness: bool = False
    fatigue: bool = False
    edema: bool = False


class MedicalRecordCreate(MedicalRecordBase):
    patient_id: str


class MedicalRecordResponse(MedicalRecordBase):
    id: str
    patient_id: str
    recorded_at: datetime

    class Config:
        from_attributes = True


# ============================================================
# Consultation Schemas
# ============================================================


class ConsultationBase(BaseModel):
    role: str = Field(..., pattern="^(Doctor|Patient)$")


class ConsultationCreate(ConsultationBase):
    patient_id: str


class ConsultationUpdate(BaseModel):
    stage: Optional[str] = None
    confidence: Optional[float] = Field(None, ge=0.0, le=1.0)
    conversation_history: Optional[List[Dict[str, str]]] = None


class ConsultationResponse(ConsultationBase):
    id: str
    patient_id: str
    stage: str
    confidence: float
    conversation_history: List[Dict[str, str]]
    started_at: datetime
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ============================================================
# Health Assessment Schemas
# ============================================================


class HealthAssessmentCreate(BaseModel):
    consultation_id: str
    overall_risk_score: float
    overall_risk_level: str
    primary_concerns: List[str]
    individual_risks: List[Dict[str, Any]]
    patient_report: Optional[str] = None
    doctor_report: Optional[str] = None
    soap_json: Optional[Dict[str, Any]] = None
    conversation_summary: Optional[str] = None


class HealthAssessmentResponse(HealthAssessmentCreate):
    id: str
    assessed_at: datetime

    class Config:
        from_attributes = True


# ============================================================
# Combined Request/Response Schemas
# ============================================================


class AnalyzeHealthRequest(BaseModel):
    """Request for complete health analysis"""

    patient_data: PatientCreate
    medical_data: MedicalRecordBase
    conversation_history: List[Dict[str, str]] = []
    role: str = Field("Patient", pattern="^(Doctor|Patient)$")


class AnalyzeHealthResponse(BaseModel):
    """Complete health analysis response"""

    patient: PatientResponse
    medical_record: MedicalRecordResponse
    consultation: ConsultationResponse
    assessment: HealthAssessmentResponse


# ============================================================
# Audit Log Schema
# ============================================================


class AuditLogCreate(BaseModel):
    event_type: str
    entity_type: str
    entity_id: str
    user_role: Optional[str] = None
    ip_address: Optional[str] = None
    event_data: Optional[Dict[str, Any]] = None
