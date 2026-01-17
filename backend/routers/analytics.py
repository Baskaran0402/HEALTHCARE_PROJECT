from typing import Any, Dict, List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend import models
from backend.database import get_db

router = APIRouter(prefix="/api/analytics", tags=["Analytics"])


@router.get("/patients/{patient_id}/history", response_model=List[Dict[str, Any]])
def get_patient_history(patient_id: str, db: Session = Depends(get_db)):
    """
    Get longitudinal risk history for a patient.
    Returns a list of assessments sorted by date.
    """
    # 1. Fetch all consultations for the patient
    consultations = db.query(models.Consultation).filter(models.Consultation.patient_id == patient_id).all()

    history = []

    for consult in consultations:
        # Get assessments for this consultation
        assessments = (
            db.query(models.HealthAssessment).filter(models.HealthAssessment.consultation_id == consult.id).all()
        )

        for assessment in assessments:
            # Parse individual risks if stored as JSON string (though model says JSON type)
            # SQLAlchemy handles JSON type automatically for supported backends,
            # but safety check doesn't hurt if we migrate DBs.
            risks = assessment.individual_risks

            # Extract scores per disease
            # Expected format of risks: [{"disease": "Kidney Disease", "risk_score": 88.0, ...}, ...]

            risk_map = {
                "date": assessment.assessed_at.isoformat(),
                "overall_score": assessment.overall_risk_score,
                "overall_level": assessment.overall_risk_level,
            }

            if risks:
                for r in risks:
                    disease_name = r.get("disease", "Unknown")
                    score = r.get("risk_score", 0)
                    risk_map[disease_name] = score

            history.append(risk_map)

    # Sort by date
    history.sort(key=lambda x: x["date"])

    return history
