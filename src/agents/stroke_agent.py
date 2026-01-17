import pickle

import pandas as pd

from src.agents.stroke_adapter import adapt_stroke_features

with open("models/strokePrediction/strokeprediction.pkl", "rb") as f:
    stroke_model = pickle.load(f)


def risk_level(score):
    if score < 20:
        return "Low"
    elif score < 50:
        return "Moderate"
    elif score < 75:
        return "High"
    else:
        return "Critical"


def stroke_risk(patient_data):
    adapted = adapt_stroke_features(patient_data)

    X = pd.DataFrame([adapted])

    probas = stroke_model.predict_proba(X)[0]
    classes = stroke_model.classes_

    # stroke = 1
    disease_index = list(classes).index(1)

    probability = probas[disease_index]
    risk_score = float(round(probability * 100, 2))

    return {
        "disease": "Stroke",
        "risk_score": risk_score,
        "risk_level": risk_level(risk_score),
    }
