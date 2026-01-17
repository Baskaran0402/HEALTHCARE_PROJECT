"""
Database initialization script.
Creates all tables in PostgreSQL database.
"""

from backend.database import Base, engine
from backend.models import Consultation  # noqa: F401
from backend.models import AuditLog, HealthAssessment, MedicalRecord, Patient  # noqa: F401


def init_db():
    """Create all database tables"""
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("[SUCCESS] Database tables created successfully!")


if __name__ == "__main__":
    init_db()
