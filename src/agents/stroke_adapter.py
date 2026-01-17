def adapt_stroke_features(patient):
    """
    Features EXACTLY as used during stroke model training.
    Uses normal clinical values as defaults when data unavailable.
    """
    return {
        "gender": patient.get("gender", 0),  # 0 = Female, 1 = Male
        "age": patient.get("age", 50),
        "hypertension": patient.get("hypertension", 0),
        "heart_disease": patient.get("heart_disease", 0),
        # IMPORTANT: model was trained on work_type
        # Default to 0 (assuming employed/active) if not provided
        "work_type": patient.get("work_type", 0),
        "avg_glucose_level": patient.get("blood_glucose", 100),  # Normal: 70-100 mg/dL
        "bmi": patient.get("bmi", 24.0),  # Normal: 18.5-24.9
    }
