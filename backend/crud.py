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
    db_patient = models.Patient(**patient.model_dump())
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
    db_consultation = models.Consultation(patient_id=consultation.patient_id, role=consultation.role)
    db.add(db_consultation)
    db.commit()
    db.refresh(db_consultation)
    return db_consultation


def get_consultation(db: Session, consultation_id: str):
    return db.query(models.Consultation).filter(models.Consultation.id == consultation_id).first()


def update_consultation(db: Session, consultation_id: str, update: schemas.ConsultationUpdate):
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


def get_patient_assessments(db: Session, patient_id: str):
    return (
        db.query(models.HealthAssessment)
        .join(models.Consultation)
        .filter(models.Consultation.patient_id == patient_id)
        .order_by(models.HealthAssessment.assessed_at.desc())
        .all()
    )


def get_assessment(db: Session, assessment_id: str):
    return db.query(models.HealthAssessment).filter(models.HealthAssessment.id == assessment_id).first()


# ============================================================
# Audit Log CRUD
# ============================================================


def create_audit_log(db: Session, log: schemas.AuditLogCreate):
    db_log = models.AuditLog(**log.model_dump())
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log


# ============================================================
# User CRUD
# ============================================================


# ============================================================
# Organization CRUD
# ============================================================


def create_organization(db: Session, org: schemas.OrganizationCreate):
    db_org = models.Organization(**org.model_dump())
    db.add(db_org)
    db.commit()
    db.refresh(db_org)
    return db_org


def get_organization(db: Session, org_id: str):
    return db.query(models.Organization).filter(models.Organization.id == org_id).first()


def get_organization_by_domain(db: Session, domain: str):
    return db.query(models.Organization).filter(models.Organization.email_domain == domain).first()


# ============================================================
# User CRUD
# ============================================================


def get_user(db: Session, user_id: str):
    return db.query(models.User).filter(models.User.id == user_id).first()


def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()


def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def create_user(db: Session, user: schemas.UserCreate, hashed_password: str):
    user_data = user.model_dump(exclude={"password"})
    db_user = models.User(
        **user_data,
        hashed_password=hashed_password,
        # Default approval based on role for simplicity in demo
        # Patients are auto-approved, doctors/staff need admin review
        is_approved=True if user.role == "patient" else False
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def update_user_login(db: Session, user_id: str):
    db_user = get_user(db, user_id)
    if db_user:
        db_user.last_login = datetime.utcnow()
        db_user.login_count += 1
        db.commit()


# ============================================================
# Session CRUD
# ============================================================


def create_session(db: Session, session_data: dict):
    db_session = models.UserSession(**session_data)
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    return db_session


def get_session_by_refresh_token(db: Session, refresh_token: str):
    return db.query(models.UserSession).filter(
        models.UserSession.refresh_token == refresh_token,
        models.UserSession.is_active == True,
        models.UserSession.expires_at > datetime.utcnow()
    ).first()


def revoke_session(db: Session, refresh_token: str):
    session = db.query(models.UserSession).filter(models.UserSession.refresh_token == refresh_token).first()
    if session:
        session.is_active = False
        db.commit()


# ============================================================
# Doctor CRUD
# ============================================================


def create_doctor(db: Session, doctor: schemas.DoctorCreate):
    db_doctor = models.Doctor(**doctor.model_dump())
    db.add(db_doctor)
    db.commit()
    db.refresh(db_doctor)
    return db_doctor


def get_doctor(db: Session, doctor_id: str):
    return db.query(models.Doctor).filter(models.Doctor.id == doctor_id).first()


def get_doctor_by_user_id(db: Session, user_id: str):
    return db.query(models.Doctor).filter(models.Doctor.user_id == user_id).first()


def search_doctors(db: Session, specialization: Optional[str] = None, name: Optional[str] = None):
    query = db.query(models.Doctor).filter(models.Doctor.is_verified == True)
    if specialization:
        query = query.filter(models.Doctor.specialization.ilike(f"%{specialization}%"))
    if name:
        query = query.filter(models.Doctor.name.ilike(f"%{name}%"))
    return query.all()


def search_nearby_doctors(
    db: Session, 
    lat: float, 
    lng: float, 
    radius_km: float = 10.0,
    specialization: Optional[str] = None
):
    # This query uses Haversine formula for distance calculation in SQL
    # It calculates the distance between (lat, lng) and doctor's coordinates
    
    # 6371 is the earth radius in KM
    distance_clause = f"""
        (6371 * acos(
            cos(radians({lat})) * cos(radians(latitude)) * 
            cos(radians(longitude) - radians({lng})) + 
            sin(radians({lat})) * sin(radians(latitude))
        ))
    """
    
    query_str = f"""
        SELECT *, {distance_clause} AS distance
        FROM doctors
        WHERE is_verified = TRUE 
        AND is_available = TRUE
        AND latitude IS NOT NULL 
        AND longitude IS NOT NULL
    """
    
    if specialization:
        query_str += f" AND specialization ILIKE '%{specialization}%'"
        
    query_str += f" AND {distance_clause} <= {radius_km}"
    query_str += " ORDER BY distance ASC"
    
    result = db.execute(models.text(query_str))
    # Convert result proxy to list of dicts/models
    doctors = []
    for row in result:
        # Note: mapping sqlalchemy Row to models.Doctor would be better
        # but for simplicity we return the rows
        doctors.append(row)
    return doctors


def update_doctor(db: Session, doctor_id: str, update: schemas.DoctorUpdate):
    db_doctor = get_doctor(db, doctor_id)
    if db_doctor is None:
        return None

    update_data = update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_doctor, key, value)

    db.commit()
    db.refresh(db_doctor)
    return db_doctor


# ============================================================
# Doctor Consultation CRUD
# ============================================================


def create_doctor_consultation(db: Session, consultation: schemas.DoctorConsultationCreate):
    db_consultation = models.DoctorConsultation(**consultation.model_dump())
    db.add(db_consultation)
    db.commit()
    db.refresh(db_consultation)
    return db_consultation


def get_doctor_consultation(db: Session, consultation_id: str):
    return (
        db.query(models.DoctorConsultation)
        .filter(models.DoctorConsultation.id == consultation_id)
        .first()
    )


def update_doctor_consultation(
    db: Session, consultation_id: str, update: schemas.DoctorConsultationUpdate
):
    db_consultation = get_doctor_consultation(db, consultation_id)
    if db_consultation is None:
        return None

    update_data = update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_consultation, key, value)

    db.commit()
    db.refresh(db_consultation)
    return db_consultation


def get_patient_human_consultations(db: Session, patient_id: str):
    return (
        db.query(models.DoctorConsultation)
        .filter(models.DoctorConsultation.patient_id == patient_id)
        .order_by(models.DoctorConsultation.requested_at.desc())
        .all()
    )


def get_doctor_human_consultations(db: Session, doctor_id: str):
    return (
        db.query(models.DoctorConsultation)
        .filter(models.DoctorConsultation.doctor_id == doctor_id)
        .order_by(models.DoctorConsultation.requested_at.desc())
        .all()
    )


# ============================================================
# Message CRUD
# ============================================================


def create_message(db: Session, message: schemas.MessageCreate):
    db_message = models.Message(**message.model_dump())
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message


def get_consultation_messages(db: Session, consultation_id: str):
    return (
        db.query(models.Message)
        .filter(models.Message.consultation_id == consultation_id)
        .order_by(models.Message.created_at.asc())
        .all()
    )


def mark_message_as_read(db: Session, message_id: str):
    db_message = db.query(models.Message).filter(models.Message.id == message_id).first()
    if db_message:
        db_message.is_read = True
        db_message.read_at = datetime.utcnow()
        db.commit()
        db.refresh(db_message)
    return db_message


def create_audit_log(db: Session, audit_log: schemas.AuditLogCreate):
    db_audit_log = models.AuditLog(**audit_log.model_dump())
    db.add(db_audit_log)
    db.commit()
    db.refresh(db_audit_log)
    return db_audit_log
