def encode_heart_features(patient):
    encoded = {}

    # Numerical features
    encoded["age"] = patient.get("age", 0)
    encoded["resting_blood_pressure"] = patient.get("blood_pressure", 0)
    encoded["cholesterol"] = patient.get("cholesterol", 0)
    encoded["max_heart_rate_achieved"] = patient.get("max_heart_rate", 0)
    encoded["st_depression"] = patient.get("st_depression", 0)
    encoded["num_major_vessels"] = patient.get("num_major_vessels", 0)

    # Sex
    encoded["sex_male"] = 1 if patient.get("gender") == 1 else 0

    # Chest pain (one-hot)
    cp = patient.get("chest_pain_type", "").lower()
    encoded["chest_pain_type_atypical angina"] = int(cp == "atypical angina")
    encoded["chest_pain_type_non-anginal pain"] = int(cp == "non-anginal pain")
    encoded["chest_pain_type_typical angina"] = int(cp == "typical angina")

    # Fasting blood sugar
    encoded["fasting_blood_sugar_lower than 120mg/ml"] = int(
        patient.get("fasting_blood_sugar", 0) < 120
    )

    # Rest ECG
    ecg = patient.get("rest_ecg", "").lower()
    encoded["rest_ecg_left ventricular hypertrophy"] = int(
        ecg == "left ventricular hypertrophy"
    )
    encoded["rest_ecg_normal"] = int(ecg == "normal")

    # Exercise induced angina
    encoded["exercise_induced_angina_yes"] = int(
        patient.get("exercise_induced_angina") == 1
    )

    # ST slope
    slope = patient.get("st_slope", "").lower()
    encoded["st_slope_flat"] = int(slope == "flat")
    encoded["st_slope_upsloping"] = int(slope == "upsloping")

    # Thalassemia
    thal = patient.get("thalassemia", "").lower()
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
