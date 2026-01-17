import uuid

from sqlalchemy import (JSON, Boolean, Column, DateTime, Float, ForeignKey,
                        Integer, String, Text)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from backend.database import Base


class Patient(Base):
    __tablename__ = "patients"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))

    # Patient Identification
    name = Column(String(200), nullable=False)
    medical_record_number = Column(String(50), unique=True, nullable=True)

    # Demographics
    age = Column(Integer, nullable=False)
    gender = Column(String(10), nullable=False)  # Male/Female

    # Contact (optional)
    email = Column(String(255), unique=True, nullable=True)
    phone = Column(String(20), nullable=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    consultations = relationship(
        "Consultation", back_populates="patient", cascade="all, delete-orphan"
    )
    medical_records = relationship(
        "MedicalRecord", back_populates="patient", cascade="all, delete-orphan"
    )


class Consultation(Base):
    __tablename__ = "consultations"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    patient_id = Column(String, ForeignKey("patients.id"), nullable=False)

    # Consultation metadata
    role = Column(String(20), nullable=False)  # Doctor/Patient
    stage = Column(
        String(50), default="intro"
    )  # intro, consultation, medical_form, report
    confidence = Column(Float, default=0.3)

    # Conversation history (stored as JSON)
    conversation_history = Column(JSON, default=list)

    # Timestamps
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    patient = relationship("Patient", back_populates="consultations")
    assessments = relationship(
        "HealthAssessment", back_populates="consultation", cascade="all, delete-orphan"
    )


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
    overall_risk_level = Column(
        String(20), nullable=False
    )  # Low, Moderate, High, Critical
    primary_concerns = Column(JSON, default=list)

    # Individual Risk Results (stored as JSON)
    individual_risks = Column(JSON, nullable=False)

    # LLM Generated Reports
    patient_report = Column(Text, nullable=True)
    doctor_report = Column(Text, nullable=True)
    soap_json = Column(JSON, nullable=True)
    conversation_summary = Column(Text, nullable=True)

    # Timestamps
    assessed_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    consultation = relationship("Consultation", back_populates="assessments")


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))

    # Event details
    event_type = Column(
        String(50), nullable=False
    )  # consultation_started, assessment_completed, etc.
    entity_type = Column(
        String(50), nullable=False
    )  # patient, consultation, assessment
    entity_id = Column(String, nullable=False)

    # User/System info
    user_role = Column(String(20), nullable=True)  # Doctor/Patient
    ip_address = Column(String(45), nullable=True)

    # Event data
    event_data = Column(JSON, nullable=True)

    # Timestamp
    created_at = Column(DateTime(timezone=True), server_default=func.now())
