class ClinicalNormalizer:
    SMOKING_MAP = {
        "never": "never",
        "no": "never",
        "non-smoker": "never",
        "former": "former",
        "ex-smoker": "former",
        "current": "current",
        "smoker": "current",
        None: "never",
        "": "never"
    }

    @staticmethod
    def normalize_smoking(value):
        return ClinicalNormalizer.SMOKING_MAP.get(
            str(value).lower(), "never"
        )

    @staticmethod
    def normalize_gender(value):
        if value in [1, "male", "Male"]:
            return "Male"
        return "Female"

    @staticmethod
    def safe_int(value, default=0):
        try:
            return int(value)
        except:
            return default

    @staticmethod
    def safe_float(value, default=0.0):
        try:
            return float(value)
        except:
            return default
