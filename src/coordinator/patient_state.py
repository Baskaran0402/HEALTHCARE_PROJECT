class PatientState:
    """
    Unified patient state used by the Coordinator Agent
    """

    def __init__(self):
        # demographics
        self.age = None
        self.gender = None

        # vitals
        self.bmi = None
        self.blood_pressure = None

        # labs
        self.blood_glucose = None
        self.hba1c = None
        self.cholesterol = None
        self.creatinine = None
        self.urea = None
        self.bilirubin_total = None
        self.alt = None
        self.ast = None

        # conditions
        self.hypertension = None
        self.diabetes = None
        self.heart_disease = None

        # lifestyle
        self.smoking = None

        # symptoms
        self.chest_pain = None
        self.breathlessness = None
        self.fatigue = None
        self.edema = None

    def to_dict(self):
        return self.__dict__
