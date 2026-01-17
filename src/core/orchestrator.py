from src.agents.diabetes_agent import diabetes_risk
from src.agents.heart_agent import heart_risk
from src.agents.kidney_agent import kidney_risk


def run_health_assessment(patient_data):
    report = {}

    if patient_data.get("age") and patient_data.get("chol"):
        report["heart_risk"] = heart_risk(patient_data)

    if patient_data.get("HbA1c_level"):
        report["diabetes_risk"] = diabetes_risk(patient_data)

    if patient_data.get("sc"):
        report["kidney_risk"] = kidney_risk(patient_data)

    return report
