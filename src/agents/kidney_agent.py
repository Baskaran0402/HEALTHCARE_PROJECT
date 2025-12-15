import pickle
import numpy as np

from src.agents.kidney_adapter import adapt_kidney_features

with open(
    "models/kidneyDiseasePrediction/kidney_disease_prediction_model.pkl",
    "rb"
) as f:
    kidney_model = pickle.load(f)



FEATURE_ORDER = [
    "age","bp","sg","al","su","rbc","pc","pcc","ba","bgr","bu","sc",
    "sod","pot","hemo","pcv","wc","rc","htn","dm","cad","appet","pe","ane"
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

def kidney_risk(patient_data):
    adapted = adapt_kidney_features(patient_data)

    X = np.array(
        [[adapted[f] for f in FEATURE_ORDER]],
        dtype=float
    )

    probas = kidney_model.predict_proba(X)[0]
    classes = kidney_model.classes_

    # In this dataset: 0 = CKD (disease), 1 = NOT CKD
    disease_index = list(classes).index(0)

    probability = probas[disease_index]
    risk_score = float(round(probability * 100, 2))

    return {
        "disease": "Kidney Disease",
        "risk_score": risk_score,
        "risk_level": risk_level(risk_score)
    }

