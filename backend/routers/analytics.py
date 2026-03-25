from typing import Any, Dict, List
from datetime import datetime, timedelta
import random

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from backend import models
from backend.database import get_db

router = APIRouter(prefix="/api/analytics", tags=["Analytics"])


@router.get("/dashboard", response_model=Dict[str, Any])
def get_dashboard_metrics(db: Session = Depends(get_db)):
    """
    Get high-level dashboard metrics for the entire system.
    """
    total_patients = db.query(models.Patient).count()
    total_consultations = db.query(models.Consultation).count()
    total_assessments = db.query(models.HealthAssessment).count()

    # Mock trajectory data for the frontend chart
    days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    trajectory = [{"name": day, "val": random.randint(10, 80)} for day in days]

    # Mock distribution
    distribution = [
        {"name": "Cardiology", "value": 45, "color": "teal"},
        {"name": "Neurology", "value": 32, "color": "indigo"},
        {"name": "Oncology", "value": 23, "color": "amber"},
    ]

    return {
        "total_throughput": str(total_assessments),
        "uptime": "99.9%",
        "anomaly_count": "02",
        "total_patients": total_patients,
        "total_consultations": total_consultations,
        "trajectory": trajectory,
        "distribution": distribution
    }


@router.get("/throughput", response_model=Dict[str, Any])
def get_throughput(range_type: str = Query("7D", alias="range"), db: Session = Depends(get_db)):
    """
    Get throughput data over time.
    """
    # Simply return random data for now to satisfy the frontend visuals
    days_count = 7 if range_type == "7D" else 30
    base_date = datetime.now()

    data = []
    for i in range(days_count):
        date = base_date - timedelta(days=i)
        data.append({
            "timestamp": date.strftime("%Y-%m-%d"),
            "val": random.randint(20, 100)
        })

    return {
        "range": range_type,
        "data": sorted(data, key=lambda x: x["timestamp"])
    }


@router.get("/logs", response_model=List[Dict[str, Any]])
def get_execution_logs(limit: int = 10, db: Session = Depends(get_db)):
    """
    Get recent system execution logs.
    """
    # Mock logs for now
    logs = [
        {"id": 1, "level": "INFO", "message": "Neural node heartbeat nominal", "timestamp": datetime.now().isoformat()},
        {
            "id": 2,
            "level": "INFO",
            "message": "E2EE handshake successful",
            "timestamp": (datetime.now() - timedelta(minutes=5)).isoformat(),
        },
        {
            "id": 3,
            "level": "WARNING",
            "message": "High latency detected in Lobal Mapping node",
            "timestamp": (datetime.now() - timedelta(minutes=15)).isoformat(),
        },
        {
            "id": 4,
            "level": "INFO",
            "message": "Patient sync complete",
            "timestamp": (datetime.now() - timedelta(hours=1)).isoformat(),
        },
    ]
    return logs[:limit]


@router.get("/patients/{patient_id}/history", response_model=List[Dict[str, Any]])
def get_patient_history(patient_id: str, db: Session = Depends(get_db)):
    """
    Get longitudinal risk history for a patient.
    Returns a list of assessments sorted by date.
    """
    consultations = db.query(models.Consultation).filter(models.Consultation.patient_id == patient_id).all()
    history = []

    for consult in consultations:
        assessments = (
            db.query(models.HealthAssessment).filter(models.HealthAssessment.consultation_id == consult.id).all()
        )

        for assessment in assessments:
            risks = assessment.individual_risks
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

    history.sort(key=lambda x: x["date"])
    return history
