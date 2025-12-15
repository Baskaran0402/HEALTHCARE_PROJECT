def adapt_liver_features(patient):
    return {
        "Age": patient.get("age", 0),

        # training encoding: Male=1, Female=0
        "Gender": 1 if patient.get("gender") in [1, "male", "Male"] else 0,

        "Total_Bilirubin": patient.get("bilirubin_total", 0),
        "Direct_Bilirubin": patient.get("bilirubin_direct", 0),
        "Alkaline_Phosphotase": patient.get("alkaline_phosphatase", 0),
        "Alamine_Aminotransferase": patient.get("alt", 0),
        "Aspartate_Aminotransferase": patient.get("ast", 0),
        "Total_Protiens": patient.get("total_protein", 0),
        "Albumin": patient.get("albumin", 0),
        "Albumin_and_Globulin_Ratio": patient.get("albumin_globulin_ratio", 0),
    }
