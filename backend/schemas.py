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
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    address: Optional[str] = None
    city: Optional[str] = None


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
    hdl_cholesterol: Optional[float] = Field(None, ge=20.0, le=120.0)

    hypertension: bool = False
    diabetes: bool = False
    heart_disease: bool = False

    smoking_status: Optional[str] = Field(None, pattern="^(never|former|current)$")

    chest_pain: bool = False
    breathlessness: bool = False
    fatigue: bool = False
    edema: bool = False
    mri_image_path: Optional[str] = None

    mri_image_path: Optional[str] = None

    medication_history: Optional[List[str]] = []
    family_history: Optional[Dict[str, bool]] = {}


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
    cross_intelligence_insights: Optional[List[Dict[str, Any]]] = None
    billing_codes: Optional[Dict[str, Any]] = None


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


# ============================================================
# Chat & Appointment Schemas
# ============================================================


class ChatRequest(BaseModel):
    message: str
    history: List[Dict[str, str]] = []


class ChatResponse(BaseModel):
    response: str
    intent: Optional[str] = None  # "booking" or "question"


class AppointmentCreate(BaseModel):
    patient_name: str
    date: str
    time: str
    department: Optional[str] = "General"
    status: str = "Pending"


class AppointmentResponse(AppointmentCreate):
    id: int
    created_at: datetime


# ============================================================
# Auth & User Schemas
# ============================================================


class UserBase(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    role: str = Field(..., pattern="^(super_admin|org_admin|doctor|nurse|patient|researcher)$")
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    organization_id: Optional[str] = None


class UserCreate(UserBase):
    password: str = Field(..., min_length=8, max_length=128)


class UserLogin(BaseModel):
    email: EmailStr
    password: str
    organization_id: Optional[str] = None


class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str


class TokenData(BaseModel):
    user_id: Optional[str] = None
    role: Optional[str] = None
    organization_id: Optional[str] = None


class UserResponse(UserBase):
    id: str
    is_active: bool
    is_approved: bool
    created_at: datetime
    last_login: Optional[datetime] = None

    class Config:
        from_attributes = True


# ============================================================
# Organization Schemas
# ============================================================


class OrganizationBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    organization_type: str = Field(..., pattern="^(hospital|clinic|diagnostic|insurance|research|corporate)$")
    email_domain: Optional[str] = None
    subdomain: Optional[str] = None
    admin_email: EmailStr
    contact_phone: Optional[str] = None
    address: Optional[str] = None
    logo_url: Optional[str] = None
    primary_color: Optional[str] = Field(None, pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$")


class OrganizationCreate(OrganizationBase):
    pass


class OrganizationResponse(OrganizationBase):
    id: str
    is_verified: bool
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


# ============================================================
# Doctor Schemas
# ============================================================


class DoctorBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    email: EmailStr
    phone: Optional[str] = None
    medical_license_number: str = Field(..., min_length=1, max_length=50)
    specialization: str = Field(..., min_length=1, max_length=100)
    sub_specializations: List[str] = []

    # Location
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    postal_code: Optional[str] = None
    country: str = "India"

    hospital_affiliation: Optional[str] = None
    clinic_address: Optional[str] = None
    years_of_experience: Optional[int] = Field(None, ge=0)
    qualifications: List[str] = []
    consultation_fee: Optional[float] = Field(None, ge=0)
    availability_schedule: Dict[str, Any] = {}
    bio: Optional[str] = None


class DoctorCreate(DoctorBase):
    user_id: str


class DoctorUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    specialization: Optional[str] = None
    sub_specializations: Optional[List[str]] = None
    hospital_affiliation: Optional[str] = None
    clinic_address: Optional[str] = None
    years_of_experience: Optional[int] = None
    qualifications: Optional[List[str]] = None
    consultation_fee: Optional[float] = None
    availability_schedule: Optional[Dict[str, Any]] = None
    bio: Optional[str] = None
    is_available: Optional[bool] = None


class DoctorResponse(DoctorBase):
    id: str
    user_id: str
    license_verified: bool
    rating: float
    total_consultations: int
    is_available: bool
    is_verified: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ============================================================
# Doctor Consultation Schemas
# ============================================================


class DoctorConsultationBase(BaseModel):
    doctor_id: str
    patient_id: str
    consultation_type: str = Field(..., pattern="^(video|audio|chat|in-person)$")
    symptoms: Optional[str] = None


class DoctorConsultationCreate(DoctorConsultationBase):
    ai_assessment_id: Optional[str] = None


class DoctorConsultationUpdate(BaseModel):
    status: Optional[str] = Field(None, pattern="^(pending|accepted|in-progress|completed|cancelled)$")
    scheduled_for: Optional[datetime] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    diagnosis: Optional[str] = None
    prescription: Optional[Dict[str, Any]] = None
    notes: Optional[str] = None
    consultation_fee: Optional[float] = None
    payment_status: Optional[str] = None
    meeting_link: Optional[str] = None
    rating: Optional[int] = Field(None, ge=1, le=5)
    patient_feedback: Optional[str] = None


class DoctorConsultationResponse(DoctorConsultationBase):
    id: str
    status: str
    requested_at: datetime
    scheduled_for: Optional[datetime] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    ai_assessment_id: Optional[str] = None
    diagnosis: Optional[str] = None
    prescription: Optional[Dict[str, Any]] = None
    notes: Optional[str] = None
    consultation_fee: Optional[float] = None
    payment_status: str
    meeting_link: Optional[str] = None
    rating: Optional[int] = None
    patient_feedback: Optional[str] = None

    class Config:
        from_attributes = True


# ============================================================
# Messaging Schemas
# ============================================================


class MessageBase(BaseModel):
    consultation_id: str
    sender_id: str
    sender_type: str = Field(..., pattern="^(patient|doctor)$")
    message_type: str = Field("text", pattern="^(text|image|file|voice)$")
    content: Optional[str] = None
    file_url: Optional[str] = None


class MessageCreate(MessageBase):
    pass


class MessageResponse(MessageBase):
    id: str
    is_read: bool
    read_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True


# ============================================================
# Document Schemas
# ============================================================


class DocumentBase(BaseModel):
    document_type: str = Field(
        ..., pattern="^(lab_report|radiology|prescription|discharge|insurance|vaccination|other)$"
    )
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    tags: List[str] = []


class DocumentCreate(DocumentBase):
    patient_id: str


class DocumentUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    document_type: Optional[str] = None
    tags: Optional[List[str]] = None
    is_verified: Optional[bool] = None
    shared_with_doctor_id: Optional[str] = None
    share_expires_at: Optional[datetime] = None


class DocumentResponse(DocumentBase):
    id: str
    patient_id: str
    file_name: str
    file_size: int
    file_type: str
    thumbnail_path: Optional[str] = None
    is_encrypted: bool
    uploaded_by: Optional[str] = None
    uploaded_at: datetime
    shared_with_doctor_id: Optional[str] = None
    shared_at: Optional[datetime] = None
    share_expires_at: Optional[datetime] = None
    parsed_data: Optional[Dict[str, Any]] = None
    is_verified: bool
    verified_by: Optional[str] = None
    verified_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class DocumentShareRequest(BaseModel):
    doctor_id: str
    expires_in_hours: int = 24


class DocumentAccessLogResponse(BaseModel):
    id: str
    document_id: str
    accessed_by: str
    access_type: str
    ip_address: Optional[str] = None
    accessed_at: datetime

    class Config:
        from_attributes = True


class AuditLogResponse(AuditLogCreate):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True


# ============================================================
# Prescription Schemas
# ============================================================


class PrescriptionBase(BaseModel):
    consultation_id: str
    medicines: List[Dict[str, Any]]
    notes: Optional[str] = None
    digital_signature: Optional[str] = None


class PrescriptionCreate(PrescriptionBase):
    doctor_id: str
    patient_id: str


class PrescriptionResponse(PrescriptionBase):
    id: str
    doctor_id: str
    patient_id: str
    created_at: datetime

    class Config:
        from_attributes = True


# ============================================================
# Emergency SOS Schemas
# ============================================================


class SOSAlertBase(BaseModel):
    patient_id: str
    latitude: float
    longitude: float
    severity: str = "critical"
    detected_condition: Optional[str] = None


class SOSAlertCreate(SOSAlertBase):
    nearby_hospitals: List[Dict[str, Any]] = []


class SOSAlertResponse(SOSAlertBase):
    id: str
    status: str
    nearby_hospitals: List[Dict[str, Any]]
    created_at: datetime
    resolved_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ============================================================
# Payment Schemas
# ============================================================


class PaymentBase(BaseModel):
    consultation_id: str
    amount: float
    currency: str = "USD"
    payment_method: Optional[str] = None


class PaymentCreate(PaymentBase):
    transaction_id: Optional[str] = None


class PaymentResponse(PaymentBase):
    id: str
    status: str
    transaction_id: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True
