def normalize_smoking(smoking):
    """
    Normalize smoking history to match training categories exactly
    """
    if smoking is None:
        return "non-smoker"

    smoking = str(smoking).lower()

    if smoking in ["never", "no", "non-smoker", "nep"]:
        return "non-smoker"
    elif smoking in ["former", "ex-smoker", "quit", "past_smoker"]:
        return "past_smoker"
    elif smoking in ["current", "smoker", "yes"]:
        return "current"
    else:
        # safest fallback → MUST be a known category
        return "non-smoker"



def adapt_diabetes_features(patient):
    """
    Maps unified patient schema to diabetes model features.
    This adapter ONLY consumes normalized clinical inputs.
    """

    return {
        # Gender must match training format
        "gender": "Male" if patient.get("gender") == 1 else "Female",

        "age": patient.get("age", 0),
        "hypertension": patient.get("hypertension", 0),
        "heart_disease": patient.get("heart_disease", 0),

        # ✅ SAFE categorical input (already normalized)
        "smoking_history": patient.get("smoking_history_norm", "non-smoker"),

        "bmi": patient.get("bmi", 0),
        "HbA1c_level": patient.get("hba1c", 0),
        "blood_glucose_level": patient.get("blood_glucose", 0),
    }

