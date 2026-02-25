def explain_risk(disease, patient, agent_result=None):
    # Ensure no None values exist for numerical comparisons
    safe_patient = {k: (v if v is not None else 0) for k, v in patient.items()}
    explanations = []

    if disease == "Brain Tumor Detection":
        if agent_result and agent_result.get("prediction") == "Brain Tumor":
            msg = f"AI Detected potential tumor features in {agent_result.get('lobe_location', 'Brain MRI')}."
            explanations.append(msg)
            explanations.append("High-intensity regions in the scan suggest abnormal tissue structure.")
        elif agent_result and agent_result.get("prediction") == "Healthy":
            explanations.append("No significant tumor features detected in the MRI scan.")
        else:
            explanations.append("Analysis based on deep learning pattern recognition of MRI scan.")

    elif disease == "Diabetes":
        if safe_patient.get("hba1c", 0) >= 6.5:
            explanations.append("Elevated HbA1c suggests poor long-term glucose control.")
        if safe_patient.get("blood_glucose", 0) >= 200:
            explanations.append("High blood glucose levels indicate hyperglycemia.")
        if safe_patient.get("bmi", 0) >= 30:
            explanations.append("Increased BMI is a known risk factor for insulin resistance.")

    elif disease == "Heart Disease":
        if safe_patient.get("blood_pressure", 0) >= 140:
            explanations.append("Elevated blood pressure increases cardiovascular risk.")
        if safe_patient.get("cholesterol", 0) >= 240:
            explanations.append("High cholesterol is associated with atherosclerosis.")
        if safe_patient.get("chest_pain", 0) == 1:
            explanations.append("Presence of chest pain raises concern for cardiac origin.")

    elif disease == "Kidney Disease":
        if safe_patient.get("creatinine", 0) > 1.3:
            explanations.append("Elevated creatinine may indicate reduced kidney function.")
        if safe_patient.get("hypertension", 0) == 1:
            explanations.append("Hypertension is a major contributor to kidney damage.")

    elif disease == "Liver Disease":
        explanations.append("Abnormal liver-related indicators were detected in the model input.")

    elif disease == "Stroke":
        if safe_patient.get("hypertension", 0) == 1:
            explanations.append("Hypertension significantly increases stroke risk.")
        if safe_patient.get("diabetes", 0) == 1:
            explanations.append("Diabetes is a known cerebrovascular risk factor.")

    elif "Brain Tumor" in disease:
        prediction = agent_result.get("prediction", "Healthy") if agent_result else "Healthy"
        if prediction == "Brain Tumor":
            explanations.append("The MRI image analysis identified patterns consistent with brain tumor tissue.")
            explanations.append("Deep learning model analysis shows high confidence in localized structural abnormalities.")
        else:
            explanations.append("The MRI analysis shows normal brain structure with no significant masses detected.")
            explanations.append("Neural network confidence is high for the absence of tumorous characteristics.")

    if not explanations:
        explanations.append("Risk inferred based on combined clinical feature patterns.")

    return explanations
