import pickle
import pandas as pd

from src.agents.diabetes_adapter import adapt_diabetes_features
from src.agents.diabetes_adapter import normalize_smoking


with open(
    "models/diabetes_hypertension_model/diabetes_and_hypertension_prediction_model.pkl",
    "rb"
) as f:
    diabetes_model = pickle.load(f)


def risk_level(score):
    if score < 20:
        return "Low"
    elif score < 50:
        return "Moderate"
    elif score < 75:
        return "High"
    else:
        return "Critical"


def diabetes_risk(patient_data):
    # 1️⃣ Adapt raw patient data
    features = adapt_diabetes_features(patient_data)

    # 2️⃣ NORMALIZE categorical inputs (CRITICAL FIX)
    features["smoking_history"] = normalize_smoking(
        features.get("smoking_history")
    )

    # 3️⃣ Create DataFrame with correct schema
    X = pd.DataFrame([features])

    # 4️⃣ Predict risk
    probability = diabetes_model.predict_proba(X)[0][1]
    risk_score = float(round(probability * 100, 2))

    return {
        "disease": "Diabetes",
        "risk_score": risk_score,
        "risk_level": risk_level(risk_score)
    }
