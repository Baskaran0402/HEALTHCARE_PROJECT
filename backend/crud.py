from datetime import datetime

from sqlalchemy.orm import Session

from backend import models, schemas

# ============================================================
# Patient CRUD
# ============================================================


def get_patient(db: Session, patient_id: str):
    return db.query(models.Patient).filter(models.Patient.id == patient_id).first()


def get_patient_by_email(db: Session, email: str):
    return db.query(models.Patient).filter(models.Patient.email == email).first()


def get_patients(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Patient).offset(skip).limit(limit).all()


def create_patient(db: Session, patient: schemas.PatientCreate):
    db_patient = models.Patient(
        name=patient.name,
        medical_record_number=patient.medical_record_number,
        age=patient.age,
        gender=patient.gender,
        email=patient.email,
        phone=patient.phone,
    )
    db.add(db_patient)
    db.commit()
    db.refresh(db_patient)
    return db_patient


# ============================================================
# Medical Record CRUD
# ============================================================


def create_medical_record(db: Session, record: schemas.MedicalRecordCreate):
    db_record = models.MedicalRecord(**record.model_dump())
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    return db_record


def get_patient_medical_records(db: Session, patient_id: str):
    return (
        db.query(models.MedicalRecord)
        .filter(models.MedicalRecord.patient_id == patient_id)
        .order_by(models.MedicalRecord.recorded_at.desc())
        .all()
    )


def get_latest_medical_record(db: Session, patient_id: str):
    return (
        db.query(models.MedicalRecord)
        .filter(models.MedicalRecord.patient_id == patient_id)
        .order_by(models.MedicalRecord.recorded_at.desc())
        .first()
    )


# ============================================================
# Consultation CRUD
# ============================================================


def create_consultation(db: Session, consultation: schemas.ConsultationCreate):
    db_consultation = models.Consultation(
        patient_id=consultation.patient_id, role=consultation.role
    )
    db.add(db_consultation)
    db.commit()
    db.refresh(db_consultation)
    return db_consultation


def get_consultation(db: Session, consultation_id: str):
    return (
        db.query(models.Consultation)
        .filter(models.Consultation.id == consultation_id)
        .first()
    )


def update_consultation(
    db: Session, consultation_id: str, update: schemas.ConsultationUpdate
):
    db_consultation = get_consultation(db, consultation_id)
    if db_consultation is None:
        return None

    update_data = update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_consultation, key, value)

    # Mark as completed if stage is 'report'
    if update.stage == "report" and db_consultation.completed_at is None:
        db_consultation.completed_at = datetime.utcnow()

    db.commit()
    db.refresh(db_consultation)
    return db_consultation


def get_patient_consultations(db: Session, patient_id: str):
    return (
        db.query(models.Consultation)
        .filter(models.Consultation.patient_id == patient_id)
        .order_by(models.Consultation.started_at.desc())
        .all()
    )


def get_consultations(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Consultation).offset(skip).limit(limit).all()


# ============================================================
# Health Assessment CRUD
# ============================================================


def create_health_assessment(db: Session, assessment: schemas.HealthAssessmentCreate):
    db_assessment = models.HealthAssessment(**assessment.model_dump())
    db.add(db_assessment)
    db.commit()
    db.refresh(db_assessment)
    return db_assessment


def get_consultation_assessments(db: Session, consultation_id: str):
    return (
        db.query(models.HealthAssessment)
        .filter(models.HealthAssessment.consultation_id == consultation_id)
        .order_by(models.HealthAssessment.assessed_at.desc())
        .all()
    )


def get_assessment(db: Session, assessment_id: str):
    return (
        db.query(models.HealthAssessment)
        .filter(models.HealthAssessment.id == assessment_id)
        .first()
    )


# ============================================================
# Audit Log CRUD
# ============================================================


def create_audit_log(db: Session, log: schemas.AuditLogCreate):
    db_log = models.AuditLog(**log.model_dump())
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log
