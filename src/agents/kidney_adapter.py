def adapt_kidney_features(patient):
    return {
        "age": patient.get("age", 0),
        "bp": patient.get("blood_pressure", 0),

        "sg": patient.get("specific_gravity", patient.get("sg", 1.020)),
        "al": patient.get("albumin", patient.get("al", 0)),
        "su": patient.get("blood_sugar", patient.get("su", 0)),

        # categorical → match training encoding
        "rbc": 1 if patient.get("rbc") in [1, "abnormal"] else 0,
        "pc": 1 if patient.get("pus_cell") in [1, "abnormal"] else 0,
        "pcc": 1 if patient.get("pus_cell_clumps") in [1, "present"] else 0,
        "ba": 1 if patient.get("bacteria") in [1, "present"] else 0,

        "bgr": patient.get("blood_glucose", patient.get("bgr", 0)),
        "bu": patient.get("urea", 0),
        "sc": patient.get("creatinine", 0),

        "sod": patient.get("sodium", 0),
        "pot": patient.get("potassium", 0),
        "hemo": patient.get("hemoglobin", 0),

        "pcv": patient.get("pcv", 0),
        "wc": patient.get("wc", 0),
        "rc": patient.get("rc", 0),

        "htn": 1 if patient.get("hypertension") in [1, "yes"] else 0,
        "dm": 1 if patient.get("diabetes") in [1, "yes"] else 0,
        "cad": 1 if patient.get("coronary_artery_disease") in [1, "yes"] else 0,

        "appet": 1 if patient.get("poor_appetite") in [1, "poor"] else 0,
        "pe": 1 if patient.get("edema") in [1, "yes"] else 0,
        "ane": 1 if patient.get("anemia") in [1, "yes"] else 0,
    }
