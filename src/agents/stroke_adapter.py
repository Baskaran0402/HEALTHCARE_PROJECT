def adapt_stroke_features(patient):
    """
    Features EXACTLY as used during stroke model training
    """
    return {
        "gender": patient.get("gender", 0),
        "age": patient.get("age", 0),
        "hypertension": patient.get("hypertension", 0),
        "heart_disease": patient.get("heart_disease", 0),

        # IMPORTANT: model was trained on work_type, not ever_married
        "work_type": patient.get("work_type", 0),

        "avg_glucose_level": patient.get("blood_glucose", 0),
        "bmi": patient.get("bmi", 0),
    }
