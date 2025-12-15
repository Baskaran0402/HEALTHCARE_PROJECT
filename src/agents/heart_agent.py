import numpy as np
import pickle


from src.agents.heart_encoder import encode_heart_features

# Load heart disease model
with open(
    "models/heart_disease_model/heart_disease_prediction.pkl", "rb"
) as f:
    heart_model = pickle.load(f)





def heart_risk(patient_data):
    encoded = encode_heart_features(patient_data)

    feature_order = heart_model.feature_names_in_
    X = np.array([[encoded[f] for f in feature_order]], dtype=float)


    probability = heart_model.predict_proba(X)[0][1]
    risk_score = float(round(probability * 100, 2))


    return {
        "disease": "Heart Disease",
        "risk_score": risk_score,
        "risk_level": (
            "Low" if risk_score < 20 else
            "Moderate" if risk_score < 50 else
            "High" if risk_score < 75 else
            "Critical"
        )
    }
