def aggregate_risks(agent_results):
    """
    Aggregates multiple disease risks into an overall health risk.
    """

    if not agent_results:
        return {
            "overall_risk_score": 0.0,
            "overall_risk_level": "Low",
            "primary_concerns": [],
        }

    scores = []
    concerns = []

    for disease, result in agent_results.items():
        score = result.get("risk_score", 0)
        scores.append(score)

        if score >= 70:
            concerns.append(result.get("disease"))

    max_score = max(scores)
    avg_score = sum(scores) / len(scores)

    # weighted combination
    overall_score = round(0.6 * max_score + 0.4 * avg_score, 2)

    if overall_score < 20:
        level = "Low"
    elif overall_score < 50:
        level = "Moderate"
    elif overall_score < 75:
        level = "High"
    else:
        level = "Critical"

    return {
        "overall_risk_score": overall_score,
        "overall_risk_level": level,
        "primary_concerns": concerns,
    }
