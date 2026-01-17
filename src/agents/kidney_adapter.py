def adapt_kidney_features(patient):
    """
    Adapt patient data for kidney disease model.
    Uses normal clinical ranges as defaults when lab values unavailable.
    """
    return {
        "age": patient.get("age", 50),
        "bp": patient.get("blood_pressure", 120),
        # Urinalysis - normal values as defaults
        "sg": patient.get("specific_gravity", patient.get("sg", 1.020)),  # Normal: 1.005-1.030
        "al": patient.get("albumin", patient.get("al", 0)),  # Normal: 0 (no albumin in urine)
        "su": patient.get("blood_sugar", patient.get("su", 0)),  # Normal: 0 (no sugar in urine)
        # categorical → match training encoding (0 = normal, 1 = abnormal)
        "rbc": 1 if patient.get("rbc") in [1, "abnormal"] else 0,
        "pc": 1 if patient.get("pus_cell") in [1, "abnormal"] else 0,
        "pcc": 1 if patient.get("pus_cell_clumps") in [1, "present"] else 0,
        "ba": 1 if patient.get("bacteria") in [1, "present"] else 0,
        # Blood chemistry - normal ranges as defaults
        "bgr": patient.get("blood_glucose", patient.get("bgr", 100)),  # Normal: 70-100 mg/dL
        "bu": patient.get("urea", 30),  # Normal: 7-20 mg/dL (using conservative 30)
        "sc": patient.get("creatinine", 1.0),  # Normal: 0.6-1.2 mg/dL
        # Electrolytes - normal ranges
        "sod": patient.get("sodium", 140),  # Normal: 135-145 mEq/L
        "pot": patient.get("potassium", 4.5),  # Normal: 3.5-5.0 mEq/L
        "hemo": patient.get("hemoglobin", 14.0),  # Normal: 12-16 g/dL (average)
        # Blood counts - normal ranges
        "pcv": patient.get("pcv", 40),  # Normal: 36-48%
        "wc": patient.get("wc", 8000),  # Normal: 4000-11000 cells/cumm
        "rc": patient.get("rc", 5.0),  # Normal: 4.5-5.5 million cells/cumm
        # Medical history
        "htn": 1 if patient.get("hypertension") in [1, "yes"] else 0,
        "dm": 1 if patient.get("diabetes") in [1, "yes"] else 0,
        "cad": 1 if patient.get("coronary_artery_disease") in [1, "yes", True] else 0,
        # Symptoms
        "appet": 1 if patient.get("poor_appetite") in [1, "poor"] else 0,
        "pe": 1 if patient.get("edema") in [1, "yes", True] else 0,
        "ane": 1 if patient.get("anemia") in [1, "yes"] else 0,
    }
