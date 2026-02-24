"""
Cross-Disease Intelligence Engine (Hybrid AI)
Combines results from multiple specialized agents to identify complex
co-morbidities and ensembled risks.
"""


def evaluate_cross_intelligence(patient_dict, individual_risks):
    """
    Analyzes combinations of laboratory data and AI agent results to
    identify multi-system health risks.
    """
    ensemble_insights = []

    # 1. Extract existing risk scores for convenience
    risks_map = {r["disease"]: r for r in individual_risks}

    # --- RULE 1: Vascular Neuro-Risk (Hypertension + Brain/Stroke Indicators) ---
    bp = patient_dict.get("blood_pressure")
    bp = bp if bp is not None else 0
    has_hypertension = bp >= 140 or patient_dict.get("hypertension") == 1

    brain_risk = risks_map.get("Brain Tumor Detection", {})
    stroke_risk = risks_map.get("Stroke", {})

    if has_hypertension:
        if brain_risk.get("prediction") == "Brain Tumor" or stroke_risk.get("risk_score", 0) > 60:
            ensemble_insights.append(
                {
                    "title": "High Vascular Neuro-Risk",
                    "severity": "Critical",
                    "finding": (
                        "Combination of systemic hypertension and neural structural/vascular" " abnormalities detected."
                    ),
                    "interpretation": (
                        "Elevated blood pressure alongside localized brain indicators significantly"
                        " increases the risk of Vascular Dementia or acute cerebrovascular events."
                    ),
                    "recommendations": [
                        "Immediate referral to Neurology and Cardiology",
                        "Aggressive blood pressure management",
                        "Carotid Doppler ultrasound study",
                    ],
                }
            )

    # --- RULE 2: Cardio-Renal Syndrome (Heart + Kidney Synchronization) ---
    heart_risk_score = risks_map.get("Heart Disease", {}).get("risk_score", 0)
    kidney_risk_score = risks_map.get("Kidney Disease", {}).get("risk_score", 0)

    if heart_risk_score > 50 and kidney_risk_score > 50:
        ensemble_insights.append(
            {
                "title": "Cardio-Renal Synchronization Risk",
                "severity": "High",
                "finding": "Concurrent elevated risk in both cardiovascular and renal systems.",
                "interpretation": (
                    "Interdependent failure/stress detected. Heart and kidney issues often"
                    " exacerbate each other, requiring synchronized management."
                ),
                "recommendations": [
                    "Integrated care plan with Cardiologist and Nephrologist",
                    "Strict fluid and electrolyte monitoring",
                    "Optimization of ACE inhibitors/ARBs",
                ],
            }
        )

    # --- RULE 3: Metabolic-Neurological Stress (Diabetes + Brain/Stroke) ---
    hba1c = patient_dict.get("hba1c")
    hba1c = hba1c if hba1c is not None else 0

    glucose = patient_dict.get("blood_glucose")
    glucose = glucose if glucose is not None else 0
    has_metabolic_issue = hba1c >= 7.0 or glucose > 180 or patient_dict.get("diabetes") == 1

    if has_metabolic_issue and (brain_risk.get("risk_level") == "Critical" or stroke_risk.get("risk_score", 0) > 50):
        ensemble_insights.append(
            {
                "title": "Metabolic-Neurological Stress",
                "severity": "High",
                "finding": "Poor glycemic control identified alongside neurological risk indicators.",
                "interpretation": (
                    "Hyperglycemia accelerates vascular damage in the brain and can mimic"
                    " or worsen neurological symptoms."
                ),
                "recommendations": [
                    "Strict glycemic control to prevent neuro-vascular progression",
                    "Fundoscopic examination for diabetic retinopathy",
                    "Neurological monitoring for metabolic encephalopathy",
                ],
            }
        )

    return ensemble_insights
