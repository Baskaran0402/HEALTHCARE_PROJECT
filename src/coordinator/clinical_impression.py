def clinical_impression(disease, risk_score):
    if risk_score >= 85:
        return f"High likelihood of {disease} based on current clinical indicators."
    elif risk_score >= 60:
        return f"Moderate likelihood of {disease}. Further clinical evaluation may be required."
    else:
        return f"Low likelihood of {disease} at present."
