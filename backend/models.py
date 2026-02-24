import uuid

from sqlalchemy import JSON, Boolean, Column, DateTime, Float, ForeignKey, Integer, Numeric, String, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from backend.database import Base


class Organization(Base):
    __tablename__ = "organizations"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(200), unique=True, nullable=False)
    organization_type = Column(String(50), nullable=False)  # hospital, clinic, diagnostic, research, etc.
    
    email_domain = Column(String(100), nullable=True)  # e.g., svce.ac.in
    subdomain = Column(String(100), unique=True, nullable=True)
    
    admin_email = Column(String(255), nullable=False)
    contact_phone = Column(String(20), nullable=True)
    address = Column(Text, nullable=True)
    
    logo_url = Column(String(500), nullable=True)
    primary_color = Column(String(7), nullable=True)  # hex
    
    is_verified = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    users = relationship("User", back_populates="organization")


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    organization_id = Column(String, ForeignKey("organizations.id"), nullable=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    
    # role: super_admin, org_admin, doctor, nurse, patient, researcher
    role = Column(String(50), nullable=False) 
    
    first_name = Column(String(100), nullable=True)
    last_name = Column(String(100), nullable=True)
    phone = Column(String(20), nullable=True)
    
    is_active = Column(Boolean, default=True)
    is_approved = Column(Boolean, default=False)
    approved_by = Column(String, nullable=True)
    approved_at = Column(DateTime(timezone=True), nullable=True)
    
    two_factor_enabled = Column(Boolean, default=False)
    two_factor_secret = Column(String(500), nullable=True)
    
    last_login = Column(DateTime(timezone=True), nullable=True)
    login_count = Column(Integer, default=0)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    organization = relationship("Organization", back_populates="users")
    patient_profile = relationship("Patient", back_populates="user", uselist=False)
    doctor_profile = relationship("Doctor", back_populates="user", uselist=False)
    sessions = relationship("UserSession", back_populates="user", cascade="all, delete-orphan")


class UserSession(Base):
    __tablename__ = "user_sessions"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    
    access_token = Column(String(500), nullable=False, unique=True)
    refresh_token = Column(String(500), nullable=False, unique=True)
    
    device_info = Column(JSON, nullable=True)
    ip_address = Column(String(45), nullable=True)
    user_agent = Column(Text, nullable=True)
    
    is_active = Column(Boolean, default=True)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    user = relationship("User", back_populates="sessions")


class LoginAttempt(Base):
    __tablename__ = "login_attempts"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String(255), nullable=False)
    ip_address = Column(String(45), nullable=True)
    success = Column(Boolean, default=False)
    failure_reason = Column(String(255), nullable=True)
    attempted_at = Column(DateTime(timezone=True), server_default=func.now())


class Patient(Base):
    __tablename__ = "patients"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=True)

    # Patient Identification
    name = Column(String(200), nullable=False)
    medical_record_number = Column(String(50), unique=True, nullable=True)

    # Demographics
    age = Column(Integer, nullable=False)
    gender = Column(String(10), nullable=False)  # Male/Female

    # Location
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    address = Column(Text, nullable=True)
    city = Column(String(100), nullable=True)

    # Contact (optional)
    email = Column(String(255), unique=True, nullable=True)
    phone = Column(String(20), nullable=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="patient_profile")
    consultations = relationship("Consultation", back_populates="patient", cascade="all, delete-orphan")
    medical_records = relationship("MedicalRecord", back_populates="patient", cascade="all, delete-orphan")
    human_consultations = relationship("DoctorConsultation", back_populates="patient")
    documents = relationship("PatientDocument", back_populates="patient", cascade="all, delete-orphan")


class Doctor(Base):
    __tablename__ = "doctors"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    name = Column(String(200), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    phone = Column(String(20), nullable=True)
    medical_license_number = Column(String(50), unique=True, nullable=False)
    license_verified = Column(Boolean, default=False)

    specialization = Column(String(100), nullable=False)
    sub_specializations = Column(JSON, default=list)  # TEXT[] equivalent

    # Location
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    address = Column(Text, nullable=True)
    city = Column(String(100), nullable=True)
    state = Column(String(100), nullable=True)
    postal_code = Column(String(20), nullable=True)
    country = Column(String(100), default="India")

    hospital_affiliation = Column(String(200), nullable=True)
    clinic_address = Column(Text, nullable=True)
    years_of_experience = Column(Integer, nullable=True)
    qualifications = Column(JSON, default=list)  # TEXT[] equivalent

    consultation_fee = Column(Numeric(10, 2), nullable=True)
    availability_schedule = Column(JSON, default=dict)

    profile_photo = Column(String(500), nullable=True)
    bio = Column(Text, nullable=True)
    rating = Column(Float, default=0.0)
    total_consultations = Column(Integer, default=0)

    is_available = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="doctor_profile")
    consultations = relationship("DoctorConsultation", back_populates="doctor")
    verified_documents = relationship("PatientDocument", foreign_keys="[PatientDocument.verified_by]", back_populates="verifier")


class PatientDocument(Base):
    __tablename__ = "patient_documents"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    patient_id = Column(String, ForeignKey("patients.id", ondelete="CASCADE"), nullable=False)

    document_type = Column(String(50), nullable=False)  # lab_report, radiology, prescription, etc.
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)

    file_name = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    file_size = Column(Integer, nullable=True)  # in bytes
    file_type = Column(String(50), nullable=True)  # MIME type

    thumbnail_path = Column(String(500), nullable=True)

    is_encrypted = Column(Boolean, default=True)
    encryption_key = Column(String(500), nullable=True)  # encrypted with master key

    tags = Column(JSON, default=list)  # TEXT[] equivalent

    uploaded_by = Column(String, nullable=True)  # user_id who uploaded
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())

    shared_with_doctor_id = Column(String, ForeignKey("doctors.id"), nullable=True)
    shared_at = Column(DateTime(timezone=True), nullable=True)
    share_expires_at = Column(DateTime(timezone=True), nullable=True)

    parsed_data = Column(JSON, nullable=True)  # extracted lab values, OCR text, etc.

    is_verified = Column(Boolean, default=False)
    verified_by = Column(String, ForeignKey("doctors.id"), nullable=True)
    verified_at = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    patient = relationship("Patient", back_populates="documents")
    shared_doctor = relationship("Doctor", foreign_keys=[shared_with_doctor_id])
    verifier = relationship("Doctor", foreign_keys=[verified_by], back_populates="verified_documents")
    access_logs = relationship("DocumentAccessLog", back_populates="document", cascade="all, delete-orphan")


class DocumentAccessLog(Base):
    __tablename__ = "document_access_logs"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    document_id = Column(String, ForeignKey("patient_documents.id"), nullable=False)
    accessed_by = Column(String, nullable=False)
    access_type = Column(String(50), nullable=True)  # view, download, share, delete
    ip_address = Column(String(45), nullable=True)
    accessed_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    document = relationship("PatientDocument", back_populates="access_logs")


class DoctorConsultation(Base):
    __tablename__ = "doctor_consultations"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    patient_id = Column(String, ForeignKey("patients.id"), nullable=False)
    doctor_id = Column(String, ForeignKey("doctors.id"), nullable=False)
    consultation_type = Column(String(50), nullable=False)  # video, audio, chat, in-person

    status = Column(String(50), default="pending")  # pending, accepted, in-progress, completed, cancelled

    requested_at = Column(DateTime(timezone=True), server_default=func.now())
    scheduled_for = Column(DateTime(timezone=True), nullable=True)
    started_at = Column(DateTime(timezone=True), nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)

    ai_assessment_id = Column(String, ForeignKey("health_assessments.id"), nullable=True)

    symptoms = Column(Text, nullable=True)
    diagnosis = Column(Text, nullable=True)
    prescription = Column(JSON, nullable=True)
    notes = Column(Text, nullable=True)

    consultation_fee = Column(Numeric(10, 2), nullable=True)
    payment_status = Column(String(50), default="pending")

    meeting_link = Column(String(500), nullable=True)  # Telemedicine stub
    rating = Column(Integer, nullable=True)
    patient_feedback = Column(Text, nullable=True)

    # Relationships
    patient = relationship("Patient", back_populates="human_consultations")
    doctor = relationship("Doctor", back_populates="consultations")
    ai_assessment = relationship("HealthAssessment")
    messages = relationship("Message", back_populates="consultation", cascade="all, delete-orphan")
    prescriptions = relationship("Prescription", back_populates="consultation")


class Prescription(Base):
    __tablename__ = "prescriptions"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    consultation_id = Column(String, ForeignKey("doctor_consultations.id"), nullable=False)
    doctor_id = Column(String, ForeignKey("doctors.id"), nullable=False)
    patient_id = Column(String, ForeignKey("patients.id"), nullable=False)

    medicines = Column(JSON, nullable=False)  # List of {name, dosage, frequency, duration}
    notes = Column(Text, nullable=True)
    digital_signature = Column(Text, nullable=True)  # Base64 or hash
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    consultation = relationship("DoctorConsultation", back_populates="prescriptions")


class SOSAlert(Base):
    __tablename__ = "sos_alerts"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    patient_id = Column(String, ForeignKey("patients.id"), nullable=False)
    
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    status = Column(String(50), default="active")  # active, responded, resolved
    
    severity = Column(String(20), default="critical")
    detected_condition = Column(String(100), nullable=True)
    
    nearby_hospitals = Column(JSON, default=list)  # Snapshotted nearest facilities
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    resolved_at = Column(DateTime(timezone=True), nullable=True)

    patient = relationship("Patient")


class Payment(Base):
    __tablename__ = "payments"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    consultation_id = Column(String, ForeignKey("doctor_consultations.id"), nullable=False)
    
    amount = Column(Numeric(10, 2), nullable=False)
    currency = Column(String(10), default="USD")
    status = Column(String(50), default="pending")  # pending, completed, failed, refunded
    
    transaction_id = Column(String(255), unique=True, nullable=True)
    payment_method = Column(String(50), nullable=True)  # razorpay, stripe, wallet
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Message(Base):
    __tablename__ = "messages"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    consultation_id = Column(String, ForeignKey("doctor_consultations.id"), nullable=False)
    sender_id = Column(String, nullable=False)
    sender_type = Column(String(20), nullable=False)  # patient or doctor

    message_type = Column(String(20), default="text")  # text, image, file, voice
    content = Column(Text, nullable=True)
    file_url = Column(String(500), nullable=True)

    is_read = Column(Boolean, default=False)
    read_at = Column(DateTime(timezone=True), nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    consultation = relationship("DoctorConsultation", back_populates="messages")


class Consultation(Base):
    __tablename__ = "consultations"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    patient_id = Column(String, ForeignKey("patients.id"), nullable=False)

    # Consultation metadata
    role = Column(String(20), nullable=False)  # Doctor/Patient
    stage = Column(String(50), default="intro")  # intro, consultation, medical_form, report
    confidence = Column(Float, default=0.3)

    # Conversation history (stored as JSON)
    conversation_history = Column(JSON, default=list)

    # Timestamps
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    patient = relationship("Patient", back_populates="consultations")
    assessments = relationship("HealthAssessment", back_populates="consultation", cascade="all, delete-orphan")


class MedicalRecord(Base):
    __tablename__ = "medical_records"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    patient_id = Column(String, ForeignKey("patients.id"), nullable=False)

    # Vitals
    bmi = Column(Float, nullable=True)
    blood_pressure = Column(Integer, nullable=True)  # Systolic

    # Lab Values
    blood_glucose = Column(Float, nullable=True)
    hba1c = Column(Float, nullable=True)
    cholesterol = Column(Float, nullable=True)
    creatinine = Column(Float, nullable=True)
    urea = Column(Float, nullable=True)
    bilirubin_total = Column(Float, nullable=True)
    alt = Column(Float, nullable=True)
    ast = Column(Float, nullable=True)
    hdl_cholesterol = Column(Float, nullable=True)  # Added for Risk Calculators

    # Medical History
    hypertension = Column(Boolean, default=False)
    diabetes = Column(Boolean, default=False)
    heart_disease = Column(Boolean, default=False)

    # Lifestyle
    smoking_status = Column(String(20), nullable=True)  # never, former, current

    # Symptoms
    chest_pain = Column(Boolean, default=False)
    breathlessness = Column(Boolean, default=False)
    fatigue = Column(Boolean, default=False)
    edema = Column(Boolean, default=False)
    
    mri_image_path = Column(String(500), nullable=True)

    # Expanded Clinical Features
    medication_history = Column(JSON, default=list)
    family_history = Column(JSON, default=dict)

    # Timestamps
    recorded_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    patient = relationship("Patient", back_populates="medical_records")


class HealthAssessment(Base):
    __tablename__ = "health_assessments"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    consultation_id = Column(String, ForeignKey("consultations.id"), nullable=False)

    # Overall Risk
    overall_risk_score = Column(Float, nullable=False)
    overall_risk_level = Column(String(20), nullable=False)  # Low, Moderate, High, Critical
    primary_concerns = Column(JSON, default=list)

    # Individual Risk Results (stored as JSON)
    individual_risks = Column(JSON, nullable=False)

    # LLM Generated Reports
    patient_report = Column(Text, nullable=True)
    doctor_report = Column(Text, nullable=True)
    soap_json = Column(JSON, nullable=True)
    conversation_summary = Column(Text, nullable=True)
    cross_intelligence_insights = Column(JSON, nullable=True)
    billing_codes = Column(JSON, nullable=True)

    # Timestamps
    assessed_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    consultation = relationship("Consultation", back_populates="assessments")


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))

    # Event details
    event_type = Column(String(50), nullable=False)  # consultation_started, assessment_completed, etc.
    entity_type = Column(String(50), nullable=False)  # patient, consultation, assessment
    entity_id = Column(String, nullable=False)

    # User/System info
    user_role = Column(String(20), nullable=True)  # Doctor/Patient
    ip_address = Column(String(45), nullable=True)

    # Event data
    event_data = Column(JSON, nullable=True)

    # Timestamp
    created_at = Column(DateTime(timezone=True), server_default=func.now())
