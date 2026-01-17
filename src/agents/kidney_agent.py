import pickle

import pandas as pd

from src.agents.kidney_adapter import adapt_kidney_features

with open(
    "models/kidneyDiseasePrediction/kidney_disease_prediction_model.pkl", "rb"
) as f:
    kidney_model = pickle.load(f)


FEATURE_ORDER = [
    "age",
    "blood_pressure",
    "specific_gravity",
    "albumin",
    "sugar",
    "red_blood_cells",
    "pus_cell",
    "pus_cell_clumps",
    "bacteria",
    "blood_glucose_random",
    "blood_urea",
    "serum_creatinine",
    "sodium",
    "potassium",
    "haemoglobin",
    "packed_cell_volume",
    "white_blood_cell_count",
    "red_blood_cell_count",
    "hypertension",
    "diabetes_mellitus",
    "coronary_artery_disease",
    "appetite",
    "peda_edema",
    "aanemia",
]

# Map adapter abbreviations to model feature names
FEATURE_MAP = {
    "age": "age",
    "bp": "blood_pressure",
    "sg": "specific_gravity",
    "al": "albumin",
    "su": "sugar",
    "rbc": "red_blood_cells",
    "pc": "pus_cell",
    "pcc": "pus_cell_clumps",
    "ba": "bacteria",
    "bgr": "blood_glucose_random",
    "bu": "blood_urea",
    "sc": "serum_creatinine",
    "sod": "sodium",
    "pot": "potassium",
    "hemo": "haemoglobin",
    "pcv": "packed_cell_volume",
    "wc": "white_blood_cell_count",
    "rc": "red_blood_cell_count",
    "htn": "hypertension",
    "dm": "diabetes_mellitus",
    "cad": "coronary_artery_disease",
    "appet": "appetite",
    "pe": "peda_edema",
    "ane": "aanemia",
}


def risk_level(score):
    if score < 20:
        return "Low"
    elif score < 50:
        return "Moderate"
    elif score < 75:
        return "High"
    else:
        return "Critical"


def kidney_risk(patient_data):
    adapted = adapt_kidney_features(patient_data)

    X = pd.DataFrame(
        [
            [adapted[k] for k in FEATURE_MAP.keys()]
        ],  # Map using the keys corresponding to abbreviations
        columns=FEATURE_ORDER,
    )

    # Correct mapping logic: adapt_kidney_features returns abbreviations (keys of FEATURE_MAP).
    # We need to construct a dict {full_name: value}

    input_data = {}
    for abbrev, value in adapted.items():
        if abbrev in FEATURE_MAP:
            full_name = FEATURE_MAP[abbrev]
            input_data[full_name] = value

    # Ensure all required features are present, default to 0 if missing (safety)
    for feature in FEATURE_ORDER:
        if feature not in input_data:
            input_data[feature] = 0

    X = pd.DataFrame([input_data], columns=FEATURE_ORDER)

    probas = kidney_model.predict_proba(X)[0]
    classes = kidney_model.classes_

    # In this dataset: 0 = CKD (disease), 1 = NOT CKD
    disease_index = list(classes).index(0)

    probability = probas[disease_index]
    risk_score = float(round(probability * 100, 2))

    return {
        "disease": "Kidney Disease",
        "risk_score": risk_score,
        "risk_level": risk_level(risk_score),
    }
