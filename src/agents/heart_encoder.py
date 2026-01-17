def encode_heart_features(patient):
    """
    Encode heart disease features with intelligent defaults for missing data.
    Uses age-based estimation for cardiac metrics when advanced tests unavailable.
    """
    encoded = {}

    # Numerical features
    age = patient.get("age", 50)
    encoded["age"] = age
    encoded["resting_blood_pressure"] = patient.get("blood_pressure", 120)
    encoded["cholesterol"] = patient.get("cholesterol", 200)

    # Estimate max heart rate if not provided (220 - age formula)
    encoded["max_heart_rate_achieved"] = patient.get("max_heart_rate", 220 - age)

    # Default to no ST depression if not measured
    encoded["st_depression"] = patient.get("st_depression", 0)

    # Default to 0 major vessels if catheterization not done
    encoded["num_major_vessels"] = patient.get("num_major_vessels", 0)

    # Sex
    encoded["sex_male"] = 1 if patient.get("gender") == 1 else 0

    # Chest pain (one-hot) - use symptom data if available
    cp = patient.get("chest_pain_type", "").lower()
    has_chest_pain = patient.get("chest_pain", 0)

    # If no specific type but patient has chest pain, assume atypical angina (most common)
    if not cp and has_chest_pain:
        cp = "atypical angina"

    encoded["chest_pain_type_atypical angina"] = int(cp == "atypical angina")
    encoded["chest_pain_type_non-anginal pain"] = int(cp == "non-anginal pain")
    encoded["chest_pain_type_typical angina"] = int(cp == "typical angina")

    # Fasting blood sugar - use blood glucose if available
    fbs = patient.get("fasting_blood_sugar")
    if fbs is None:
        # Use blood_glucose as proxy if available
        glucose = patient.get("blood_glucose")
        fbs = glucose if glucose is not None else 100  # Default to normal if both None

    encoded["fasting_blood_sugar_lower than 120mg/ml"] = int(fbs < 120)

    # Rest ECG - default to normal if not measured
    ecg = patient.get("rest_ecg", "normal").lower()
    encoded["rest_ecg_left ventricular hypertrophy"] = int(
        ecg == "left ventricular hypertrophy"
    )
    encoded["rest_ecg_normal"] = int(ecg == "normal")

    # Exercise induced angina - infer from breathlessness/fatigue if not tested
    eia = patient.get("exercise_induced_angina")
    if eia is None:
        # If patient has breathlessness or fatigue, assume possible exercise angina
        breathlessness = patient.get("breathlessness", 0)
        fatigue = patient.get("fatigue", 0)
        eia = 1 if (breathlessness or fatigue) else 0

    encoded["exercise_induced_angina_yes"] = int(eia == 1)

    # ST slope - default to upsloping (normal) if not measured
    slope = patient.get("st_slope", "upsloping").lower()
    encoded["st_slope_flat"] = int(slope == "flat")
    encoded["st_slope_upsloping"] = int(slope == "upsloping")

    # Thalassemia - default to normal if not tested
    thal = patient.get("thalassemia", "normal").lower()
    encoded["thalassemia_fixed defect"] = int(thal == "fixed defect")
    encoded["thalassemia_normal"] = int(thal == "normal")
    encoded["thalassemia_reversible defect"] = int(thal == "reversible defect")

    # Force numeric values only
    for k, v in encoded.items():
        if v is None:
            encoded[k] = 0
        elif isinstance(v, bool):
            encoded[k] = int(v)
        elif isinstance(v, (int, float)):
            encoded[k] = v
        else:
            encoded[k] = 0

    return encoded
