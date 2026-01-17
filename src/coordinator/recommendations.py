def lifestyle_recommendations(disease, level):
    tips = {
        "Diabetes": [
            "Limit refined sugar and processed carbohydrates",
            "Engage in at least 30 minutes of physical activity daily",
            "Monitor blood glucose regularly",
        ],
        "Heart Disease": [
            "Reduce salt and saturated fat intake",
            "Avoid smoking and alcohol",
            "Practice stress management techniques",
        ],
        "Kidney Disease": [
            "Limit sodium and protein intake",
            "Stay hydrated as advised by a doctor",
            "Avoid over-the-counter painkillers",
        ],
    }

    if level == "Critical":
        return tips.get(disease, [])[:2] + ["Consult a specialist urgently"]

    return tips.get(disease, [])
