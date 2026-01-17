from src.agents.diabetes_agent import diabetes_risk
from src.agents.heart_agent import heart_risk
from src.agents.kidney_agent import kidney_risk
from src.agents.liver_agent import liver_risk
from src.agents.stroke_agent import stroke_risk
from src.coordinator.clinical_impression import clinical_impression
from src.coordinator.explainability_engine import explain_risk
from src.coordinator.guideline_engine import GUIDELINES
from src.coordinator.interaction_engine import INTERACTION_WARNINGS
from src.coordinator.rule_engine import route_agents
from src.core.clinical_normalizer import ClinicalNormalizer

AGENT_REGISTRY = {
    "heart": heart_risk,
    "diabetes": diabetes_risk,
    "kidney": kidney_risk,
    "liver": liver_risk,
    "stroke": stroke_risk,
}


def run_selected_agents(patient):
    """
    Runs relevant disease agents and returns
    a structured healthcare recommendation report.
    """

    # -------------------------------
    # 1. Convert PatientState to dict
    # -------------------------------
    patient_dict = patient.to_dict()

    # -------------------------------
    # 2. Normalize raw clinical inputs
    # -------------------------------
    patient_dict["smoking_history_norm"] = ClinicalNormalizer.normalize_smoking(
        patient_dict.get("smoking_raw")
    )

    # (Future-proof)
    # patient_dict["alcohol_norm"] = ClinicalNormalizer.normalize_alcohol(...)
    # patient_dict["diet_norm"] = ClinicalNormalizer.normalize_diet(...)

    # -------------------------------
    # 3. Select relevant agents
    # -------------------------------
    selected_agents = route_agents(patient)

    individual_risks = []

    # -------------------------------
    # 4. Run agents
    # -------------------------------
    for agent_name in selected_agents:
        agent_fn = AGENT_REGISTRY[agent_name]
        result = agent_fn(patient_dict)

        individual_risks.append(
            {
                "disease": result["disease"],
                "risk_score": float(result["risk_score"]),
                "risk_level": result["risk_level"],
                "why": explain_risk(result["disease"], patient_dict),
                "interaction_warnings": INTERACTION_WARNINGS.get(result["disease"], {}),
            }
        )

    # -------------------------------
    # 5. Safety check
    # -------------------------------
    if not individual_risks:
        return {
            "individual_risks": [
                {
                    "disease": "General Health",
                    "risk_score": 0.0,
                    "risk_level": "Low",
                    "why": [
                        "Vital signs are within normal range",
                        "No significant laboratory abnormalities detected",
                        "No high-risk chronic conditions identified",
                    ],
                    "clinical_impression": (
                        "Overall health indicators are within normal limits. "
                        "No immediate medical concerns identified."
                    ),
                    "guidelines": [
                        "Maintain a balanced diet",
                        "Engage in regular physical activity (150 minutes/week)",
                        "Continue routine health screenings",
                        "Avoid smoking and excessive alcohol consumption",
                    ],
                    "interaction_warnings": {},
                }
            ],
            "overall_risk": {
                "score": 0.0,
                "level": "Low",
                "primary_concerns": [],
            },
        }

    # -------------------------------
    # 6. Aggregate overall risk
    # -------------------------------
    critical = [r["disease"] for r in individual_risks if r["risk_level"] == "Critical"]
    moderate = [r["disease"] for r in individual_risks if r["risk_level"] == "Moderate"]

    overall_score = round(
        sum(r["risk_score"] for r in individual_risks) / len(individual_risks), 2
    )

    if critical:
        level = "Critical"
    elif moderate:
        level = "Moderate"
    else:
        level = "Low"

    overall_risk = {
        "score": overall_score,
        "level": level,
        "primary_concerns": critical if critical else moderate,
    }

    # -------------------------------
    # 7. Enrich with clinical guidance
    # -------------------------------
    enhanced_risks = []

    for r in individual_risks:
        enhanced_risks.append(
            {
                **r,
                "clinical_impression": clinical_impression(
                    r["disease"], r["risk_score"]
                ),
                "guidelines": GUIDELINES.get(r["disease"], []),
            }
        )

    return {
        "individual_risks": enhanced_risks,
        "overall_risk": overall_risk,
    }
