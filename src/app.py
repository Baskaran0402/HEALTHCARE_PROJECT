from src.agents.stroke_agent import stroke_risk

patient = {
    "age": 68,
    "gender": 1,
    "hypertension": 1,
    "heart_disease": 1,
    "married": 1,
    "work_type": 2,  # matches encoded training values
    "residence": "Urban",
    "blood_glucose": 210,
    "bmi": 31.2,
    "smoking": 1,
}

print(stroke_risk(patient))
