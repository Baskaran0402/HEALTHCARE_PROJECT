def adapt_liver_features(patient):
    """
    Adapt patient data for liver disease model.
    Uses normal clinical ranges as defaults when lab values unavailable.
    """
    age = patient.get("age", 50)
    
    return {
        "Age": age,

        # training encoding: Male=1, Female=0
        "Gender": 1 if patient.get("gender") in [1, "male", "Male"] else 0,

        # Liver function tests - use normal ranges as defaults
        "Total_Bilirubin": patient.get("bilirubin_total", 1.0),  # Normal: 0.3-1.2 mg/dL
        "Direct_Bilirubin": patient.get("bilirubin_direct", 0.3),  # Normal: 0.1-0.3 mg/dL
        "Alkaline_Phosphotase": patient.get("alkaline_phosphatase", 70),  # Normal: 30-120 U/L
        "Alamine_Aminotransferase": patient.get("alt", 30),  # Normal: 7-56 U/L
        "Aspartate_Aminotransferase": patient.get("ast", 30),  # Normal: 10-40 U/L
        "Total_Protiens": patient.get("total_protein", 7.0),  # Normal: 6.0-8.3 g/dL
        "Albumin": patient.get("albumin", 4.0),  # Normal: 3.5-5.5 g/dL
        "Albumin_and_Globulin_Ratio": patient.get("albumin_globulin_ratio", 1.2),  # Normal: 1.0-2.5
    }
