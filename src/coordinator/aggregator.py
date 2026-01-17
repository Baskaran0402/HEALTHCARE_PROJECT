def aggregate_risks(agent_results):
    """
    Aggregates multiple disease risks into an overall health risk.
    """

    # Handle new dictionary format
    if "individual_risks" in agent_results:
        risks_list = agent_results["individual_risks"]
    else:
        # Fallback/Legacy support
        risks_list = agent_results.values() if isinstance(agent_results, dict) else []

    if not risks_list:
        return {
            "overall_risk_score": 0.0,
            "overall_risk_level": "Low",
            "primary_concerns": [],
        }

    scores = []
    concerns = []

    for result in risks_list:
        score = result.get("risk_score", 0)
        scores.append(score)

        if score >= 70:
            concerns.append(result.get("disease"))

    if not scores: # Handle cases where risks_list might be empty after processing
         return {
            "overall_risk_score": 0.0,
            "overall_risk_level": "Low",
            "primary_concerns": [],
        }

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
