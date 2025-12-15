def route_agents(patient):
    """
    Decide which disease agents should be executed
    based on patient state.
    """

    agents = set()

    # --- HEART ---
    if (
        patient.age is not None and patient.age > 40
        or patient.chest_pain
        or patient.breathlessness
        or patient.hypertension
    ):
        agents.add("heart")

    # --- DIABETES ---
    if (
        patient.blood_glucose is not None and patient.blood_glucose > 140
        or patient.hba1c is not None and patient.hba1c > 6.5
        or patient.diabetes
    ):
        agents.add("diabetes")

    # --- KIDNEY ---
    if (
        patient.creatinine is not None and patient.creatinine > 1.3
        or patient.urea is not None and patient.urea > 40
        or patient.edema
        or patient.diabetes
        or patient.hypertension
    ):
        agents.add("kidney")

    # --- LIVER ---
    if (
        patient.bilirubin_total is not None and patient.bilirubin_total > 1.2
        or patient.alt is not None and patient.alt > 55
        or patient.ast is not None and patient.ast > 55
    ):
        agents.add("liver")

    # --- STROKE ---
    if (
        patient.age is not None and patient.age > 55
        or patient.hypertension
        or patient.heart_disease
    ):
        agents.add("stroke")

    return list(agents)
