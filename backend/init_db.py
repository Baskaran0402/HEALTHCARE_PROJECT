"""
Database initialization script.
Creates all tables in PostgreSQL database.
"""

from backend.database import engine, Base
from backend.models import Patient, Consultation, MedicalRecord, HealthAssessment, AuditLog

def init_db():
    """Create all database tables"""
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("[SUCCESS] Database tables created successfully!")

if __name__ == "__main__":
    init_db()
