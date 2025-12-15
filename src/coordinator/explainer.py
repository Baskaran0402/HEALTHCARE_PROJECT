def explain_results(patient, agent_results, overall_summary):
    """
    Generates a clean, doctor-style explanation
    using structured sections and concise language.
    """

    lines = []

    # --- HEADER ---
    lines.append("Health Risk Summary")
    lines.append("-" * 20)
    lines.append(
        f"Overall Risk Level: {overall_summary['overall_risk_level'].upper()}"
    )
    lines.append("")

    # --- KEY CONCERNS ---
    if agent_results:
        lines.append("Key Concerns:")

        for _, result in agent_results.items():
            disease = result["disease"]
            score = result["risk_score"]
            level = result["risk_level"]

            if level in ["High", "Critical"]:
                lines.append(
                    f"• {disease} ({score}%) – {level}"
                )
            elif level == "Moderate":
                lines.append(
                    f"• {disease} ({score}%) – Moderate"
                )

        lines.append("")

    # --- DOCTOR ASSESSMENT ---
    lines.append("Doctor’s Assessment:")

    explanations = []

    for _, result in agent_results.items():
        disease = result["disease"]
        level = result["risk_level"]

        if level == "Critical":
            explanations.append(
                f"Your results indicate a critical risk of {disease.lower()}, "
                "which requires prompt medical evaluation."
            )
        elif level == "High":
            explanations.append(
                f"There is a high risk indication for {disease.lower()}, "
                "and further testing is advised."
            )

    if explanations:
        lines.append(" ".join(explanations))
    else:
        lines.append(
            "No immediate high-risk conditions were identified, "
            "but regular monitoring is recommended."
        )

    lines.append("")

    # --- RECOMMENDATION ---
    lines.append("Recommended Action:")

    if overall_summary["overall_risk_level"] in ["High", "Critical"]:
        lines.extend([
            "• Consult a qualified healthcare professional soon",
            "• Additional laboratory tests or imaging may be required",
            "• Do not ignore symptoms such as fatigue, swelling, or breathlessness",
        ])
    else:
        lines.extend([
            "• Maintain a healthy lifestyle",
            "• Continue routine health checkups",
        ])

    lines.append("")

    # --- DISCLAIMER ---
    lines.append("Disclaimer:")
    lines.append(
        "This is not a medical diagnosis. "
        "It is a risk-based assessment intended to support informed healthcare decisions."
    )

    return "\n".join(lines)
