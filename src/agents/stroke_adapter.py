def adapt_stroke_features(patient):
    """
    Features EXACTLY as used during stroke model training.
    Uses normal clinical values as defaults when data unavailable.
    """
    return {
        "gender": patient.get("gender") if patient.get("gender") is not None else 0,
        "age": patient.get("age") if patient.get("age") is not None else 50,
        "hypertension": patient.get("hypertension") if patient.get("hypertension") is not None else 0,
        "heart_disease": patient.get("heart_disease") if patient.get("heart_disease") is not None else 0,
        "work_type": patient.get("work_type") if patient.get("work_type") is not None else 0,
        "avg_glucose_level": patient.get("blood_glucose") if patient.get("blood_glucose") is not None else 100,
        "bmi": patient.get("bmi") if patient.get("bmi") is not None else 24.0,
    }
