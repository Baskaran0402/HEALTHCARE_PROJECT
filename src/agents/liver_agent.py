import pickle

import pandas as pd

from src.agents.liver_adapter import adapt_liver_features

with open(
    "models/liverdiseasepredictionmodel/liverdiseasepredictionmodel.pkl", "rb"
) as f:
    liver_model = pickle.load(f)

FEATURE_ORDER = [
    "Age",
    "Gender",
    "Total_Bilirubin",
    "Direct_Bilirubin",
    "Alkaline_Phosphotase",
    "Alamine_Aminotransferase",
    "Aspartate_Aminotransferase",
    "Total_Protiens",
    "Albumin",
    "Albumin_and_Globulin_Ratio",
]


def risk_level(score):
    if score < 20:
        return "Low"
    elif score < 50:
        return "Moderate"
    elif score < 75:
        return "High"
    else:
        return "Critical"


def liver_risk(patient_data):
    adapted = adapt_liver_features(patient_data)

    X = pd.DataFrame([[adapted[f] for f in FEATURE_ORDER]], columns=FEATURE_ORDER)

    probas = liver_model.predict_proba(X)[0]
    classes = liver_model.classes_

    # training labels: 1 = liver disease, 2 = no disease
    disease_index = list(classes).index(1)

    probability = probas[disease_index]
    risk_score = float(round(probability * 100, 2))

    return {
        "disease": "Liver Disease",
        "risk_score": risk_score,
        "risk_level": risk_level(risk_score),
    }
