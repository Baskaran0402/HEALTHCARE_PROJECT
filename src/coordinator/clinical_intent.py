def detect_intents(text):
    text = text.lower()
    intents = set()

    if any(k in text for k in ["tired", "fatigue", "weak"]):
        intents.add("metabolic")

    if any(k in text for k in ["chest", "heart", "palpitation"]):
        intents.add("cardiac")

    if any(k in text for k in ["breath", "breathless", "shortness"]):
        intents.add("respiratory")

    if any(k in text for k in ["swelling", "edema"]):
        intents.add("renal")

    if any(k in text for k in ["sugar", "diabetes", "glucose"]):
        intents.add("diabetes")

    return intents
