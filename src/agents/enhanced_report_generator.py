"""
Enhanced LLM Report Generator with Comprehensive Explainability

This module generates detailed, patient-friendly and doctor-facing reports
with strong emphasis on explainability and actionable insights.
"""


def generate_comprehensive_patient_report(ml_report: dict, patient_name: str = "Patient") -> str:
    """
    Generate a comprehensive, explainable patient report using the ML risk assessment.

    Args:
        ml_report: Dictionary containing individual_risks and overall_risk
        patient_name: Patient's name for personalization

    Returns:
        Formatted patient report with explainability
    """
    individual_risks = ml_report.get("individual_risks", [])
    overall_risk = ml_report.get("overall_risk", {})

    # Build the report
    report_sections = []

    # 1. Header
    report_sections.append("# HEALTH SCREENING REPORT")
    report_sections.append(f"**Patient:** {patient_name}")
    report_sections.append(f"**Report Date:** {_get_current_date()}")
    report_sections.append("")

    # 2. Executive Summary
    report_sections.append("## Executive Summary")
    report_sections.append("")
    summary = _generate_executive_summary(overall_risk, individual_risks)
    report_sections.append(summary)
    report_sections.append("")

    # 3. Overall Risk Assessment
    report_sections.append("## Overall Health Risk Assessment")
    report_sections.append("")
    report_sections.append(f"**Risk Level:** {overall_risk.get('level', 'Unknown')}")
    report_sections.append(f"**Risk Score:** {overall_risk.get('score', 0):.1f}%")

    if overall_risk.get("primary_concerns"):
        report_sections.append(f"**Primary Areas of Concern:** {', '.join(overall_risk['primary_concerns'])}")
    report_sections.append("")

    # 4. Detailed Risk Analysis by Condition
    report_sections.append("## Detailed Risk Analysis")
    report_sections.append("")

    for risk in individual_risks:
        disease = risk.get("disease", "Unknown Condition")
        level = risk.get("risk_level", "Unknown")
        score = risk.get("risk_score", 0)
        reasons = risk.get("why", [])
        impression = risk.get("clinical_impression", "")
        guidelines = risk.get("guidelines", [])

        report_sections.append(f"### {disease}")
        report_sections.append(f"**Risk Level:** {level} ({score}%)")
        report_sections.append("")

        # Explain what this means
        report_sections.append("**What This Means:**")
        report_sections.append(_explain_risk_level(level, disease))
        report_sections.append("")

        # Contributing factors (EXPLAINABILITY)
        if reasons:
            report_sections.append("**Why This Risk Exists (Contributing Factors):**")
            for i, reason in enumerate(reasons, 1):
                report_sections.append(f"{i}. {reason}")
            report_sections.append("")

        # Clinical context
        if impression:
            report_sections.append("**Clinical Context:**")
            report_sections.append(impression)
            report_sections.append("")

        # Recommendations
        if guidelines:
            report_sections.append("**Recommended Actions:**")
            for guideline in guidelines:
                report_sections.append(f"• {guideline}")
            report_sections.append("")

        report_sections.append("---")
        report_sections.append("")

    # 5. General Recommendations
    report_sections.append("## General Health Recommendations")
    report_sections.append("")
    report_sections.append(_generate_general_recommendations(individual_risks))
    report_sections.append("")

    # 6. Next Steps
    report_sections.append("## Next Steps")
    report_sections.append("")
    report_sections.append(_generate_next_steps(overall_risk, individual_risks))
    report_sections.append("")

    # 7. Important Disclaimer
    report_sections.append("## Important Medical Disclaimer")
    report_sections.append("")
    report_sections.append(_get_disclaimer())

    return "\n".join(report_sections)


def generate_comprehensive_doctor_report(ml_report: dict, patient_name: str = "Patient") -> str:
    """
    Generate a comprehensive doctor-facing clinical report.

    Args:
        ml_report: Dictionary containing individual_risks and overall_risk
        patient_name: Patient's name

    Returns:
        Formatted clinical report for healthcare professionals
    """
    individual_risks = ml_report.get("individual_risks", [])
    overall_risk = ml_report.get("overall_risk", {})

    report_sections = []

    # 1. Header
    report_sections.append("# CLINICAL DECISION SUPPORT REPORT")
    report_sections.append(f"**Patient:** {patient_name}")
    report_sections.append(f"**Assessment Date:** {_get_current_date()}")
    report_sections.append("**Report Type:** AI-Assisted Risk Stratification")
    report_sections.append("")

    # 2. Clinical Summary
    report_sections.append("## Clinical Summary")
    report_sections.append("")
    report_sections.append(
        f"**Overall Risk Stratification:** {overall_risk.get('level', 'Unknown')} ({overall_risk.get('score', 0):.1f}%)"
    )

    if overall_risk.get("primary_concerns"):
        report_sections.append(f"**High-Priority Concerns:** {', '.join(overall_risk['primary_concerns'])}")
    report_sections.append("")

    # 3. Risk Stratification by System
    report_sections.append("## Multi-System Risk Stratification")
    report_sections.append("")

    # Group by risk level
    critical_risks = [r for r in individual_risks if r.get("risk_level") == "Critical"]
    high_risks = [r for r in individual_risks if r.get("risk_level") == "High"]
    moderate_risks = [r for r in individual_risks if r.get("risk_level") == "Moderate"]
    low_risks = [r for r in individual_risks if r.get("risk_level") == "Low"]

    if critical_risks:
        report_sections.append("### Critical Risk Conditions")
        for risk in critical_risks:
            report_sections.append(_format_doctor_risk_entry(risk))
        report_sections.append("")

    if high_risks:
        report_sections.append("### High Risk Conditions")
        for risk in high_risks:
            report_sections.append(_format_doctor_risk_entry(risk))
        report_sections.append("")

    if moderate_risks:
        report_sections.append("### Moderate Risk Conditions")
        for risk in moderate_risks:
            report_sections.append(_format_doctor_risk_entry(risk))
        report_sections.append("")

    if low_risks:
        report_sections.append("### Low Risk Conditions")
        for risk in low_risks:
            report_sections.append(_format_doctor_risk_entry(risk))
        report_sections.append("")

    # 4. Clinical Recommendations
    report_sections.append("## Clinical Recommendations")
    report_sections.append("")
    report_sections.append(_generate_doctor_recommendations(individual_risks, overall_risk))
    report_sections.append("")

    # 5. Suggested Investigations
    report_sections.append("## Suggested Further Investigations")
    report_sections.append("")
    report_sections.append(_generate_investigation_recommendations(individual_risks))
    report_sections.append("")

    # 6. Model Information
    report_sections.append("## AI Model Information")
    report_sections.append("")
    report_sections.append("**Models Used:**")
    for risk in individual_risks:
        report_sections.append(f"• {risk.get('disease')}: Machine Learning Risk Prediction Model")
    report_sections.append("")
    report_sections.append("**Confidence Level:** Based on available clinical data and model training")
    report_sections.append("")

    # 7. Professional Disclaimer
    report_sections.append("## Professional Disclaimer")
    report_sections.append("")
    report_sections.append(_get_professional_disclaimer())

    return "\n".join(report_sections)


# Helper Functions


def _get_current_date():
    """Get current date in readable format"""
    from datetime import datetime

    return datetime.now().strftime("%B %d, %Y")


def _get_risk_emoji(level: str) -> str:
    """Get emoji for risk level"""
    emoji_map = {"Critical": "🔴", "High": "🟠", "Moderate": "🟡", "Low": "🟢"}
    return emoji_map.get(level, "⚪")


def _explain_risk_level(level: str, disease: str) -> str:
    """Explain what a risk level means in patient-friendly terms"""
    explanations = {
        "Critical": (
            f"The screening indicates a significantly elevated risk for {disease}. "
            "This means several risk factors are present that warrant immediate "
            "medical attention and further testing."
        ),
        "High": (
            f"The screening shows an elevated risk for {disease}. Multiple risk factors "
            "have been identified that suggest you should consult with a healthcare "
            "provider for further evaluation."
        ),
        "Moderate": (
            f"The screening indicates a moderate risk for {disease}. Some risk factors "
            "are present, and lifestyle modifications along with regular monitoring "
            "are recommended."
        ),
        "Low": (
            f"The screening shows a low risk for {disease} based on current indicators. "
            "Continue maintaining healthy habits and regular check-ups."
        ),
    }
    return explanations.get(level, f"Risk assessment for {disease} has been completed.")


def _generate_executive_summary(overall_risk: dict, individual_risks: list) -> str:
    """Generate executive summary"""
    level = overall_risk.get("level", "Unknown")

    critical_count = sum(1 for r in individual_risks if r.get("risk_level") == "Critical")
    high_count = sum(1 for r in individual_risks if r.get("risk_level") == "High")

    if level == "Critical" or critical_count > 0:
        return (
            f"This health screening has identified **{level.lower()} risk** areas that "
            f"require prompt medical attention. {critical_count + high_count} condition(s) "
            "show elevated risk levels. We strongly recommend scheduling a consultation "
            "with your healthcare provider for comprehensive evaluation and personalized "
            "care planning."
        )
    elif level == "High" or high_count > 0:
        return (
            f"This screening shows **{level.lower()} risk** in certain health areas. "
            f"{high_count} condition(s) have elevated risk indicators. We recommend "
            "consulting with your healthcare provider to discuss these findings "
            "and develop an appropriate monitoring or intervention plan."
        )
    elif level == "Moderate":
        return (
            "This screening indicates **moderate risk** in some health areas. "
            "While not immediately concerning, these findings suggest opportunities "
            "for preventive care and lifestyle optimization. Regular monitoring "
            "and healthy habits are recommended."
        )
    else:
        return (
            "This screening shows **low risk** across assessed health areas. "
            "Continue maintaining your current healthy practices and schedule "
            "regular check-ups as recommended by your healthcare provider."
        )


def _generate_general_recommendations(individual_risks: list) -> str:
    """Generate general health recommendations"""
    recommendations = [
        "**Lifestyle Modifications:**",
        "• Maintain a balanced diet rich in fruits, vegetables, whole grains, and lean proteins",
        "• Engage in regular physical activity (at least 150 minutes of moderate exercise per week)",
        "• Maintain a healthy weight (BMI 18.5-24.9)",
        "• Limit alcohol consumption and avoid tobacco products",
        "• Manage stress through relaxation techniques, adequate sleep, and social support",
        "",
        "**Monitoring:**",
        "• Schedule regular health check-ups with your healthcare provider",
        "• Monitor your blood pressure, blood sugar, and cholesterol levels as recommended",
        "• Keep track of any new or changing symptoms",
        "",
        "**Prevention:**",
        "• Stay up-to-date with recommended health screenings",
        "• Take prescribed medications as directed",
        "• Maintain good sleep hygiene (7-9 hours per night)",
        "• Stay hydrated and limit processed foods",
    ]

    return "\n".join(recommendations)


def _generate_next_steps(overall_risk: dict, individual_risks: list) -> str:
    """Generate next steps based on risk level"""
    level = overall_risk.get("level", "Low")

    if level == "Critical":
        return """**Immediate Actions Required:**
1. **Schedule an appointment with your healthcare provider within the next 1-2 weeks**
2. Bring this report to your appointment for discussion
3. Be prepared to discuss your symptoms, medical history, and lifestyle
4. Your doctor may order additional tests or imaging studies
5. Do not make any medication changes without consulting your doctor

**When to Seek Emergency Care:**
• Severe chest pain or pressure
• Difficulty breathing or shortness of breath at rest
• Sudden severe headache or vision changes
• Loss of consciousness or severe confusion
• Any symptoms that feel life-threatening"""

    elif level == "High":
        return """**Recommended Actions:**
1. **Schedule an appointment with your healthcare provider within the next 2-4 weeks**
2. Share this report with your doctor
3. Begin implementing lifestyle modifications now
4. Monitor your symptoms and keep a health diary
5. Follow up on any recommended tests or screenings

**Seek Medical Attention If:**
• Symptoms worsen or new concerning symptoms develop
• You experience chest pain, severe headaches, or breathing difficulties
• You have questions or concerns about your health"""

    elif level == "Moderate":
        return """**Suggested Actions:**
1. **Schedule a routine check-up within the next 1-3 months**
2. Discuss these findings with your healthcare provider
3. Focus on preventive lifestyle modifications
4. Continue regular health monitoring
5. Stay informed about your health conditions

**Consult Your Doctor If:**
• You develop new symptoms
• Existing symptoms change or worsen
• You have questions about prevention strategies"""

    else:
        return """**Maintenance Actions:**
1. **Continue your current healthy practices**
2. Schedule routine annual check-ups
3. Maintain awareness of your health status
4. Stay proactive about preventive care
5. Report any new or concerning symptoms to your doctor

**Remember:**
• Low risk doesn't mean zero risk
• Continue healthy lifestyle habits
• Stay current with recommended screenings"""


def _format_doctor_risk_entry(risk: dict) -> str:
    """Format a risk entry for doctor report"""
    disease = risk.get("disease", "Unknown")
    score = risk.get("risk_score", 0)
    reasons = risk.get("why", [])

    entry = [f"**{disease}** (Risk Score: {score}%)"]
    if reasons:
        entry.append("  - Risk Factors:")
        for reason in reasons:
            entry.append(f"    • {reason}")

    return "\n".join(entry)


def _generate_doctor_recommendations(individual_risks: list, overall_risk: dict) -> str:
    """Generate clinical recommendations for doctors"""
    recommendations = []

    critical_risks = [r for r in individual_risks if r.get("risk_level") == "Critical"]
    high_risks = [r for r in individual_risks if r.get("risk_level") == "High"]

    if critical_risks or high_risks:
        recommendations.append("**Priority Actions:**")
        recommendations.append("• Comprehensive clinical evaluation recommended")
        recommendations.append("• Consider specialist referral based on risk profile")
        recommendations.append("• Initiate appropriate diagnostic workup")
        recommendations.append("• Discuss risk modification strategies with patient")
        recommendations.append("")

    recommendations.append("**General Clinical Approach:**")
    recommendations.append("• Review patient's complete medical history")
    recommendations.append("• Perform focused physical examination")
    recommendations.append("• Order confirmatory laboratory/imaging studies as indicated")
    recommendations.append("• Develop individualized care plan")
    recommendations.append("• Schedule appropriate follow-up intervals")
    recommendations.append("• Provide patient education on risk factors")

    return "\n".join(recommendations)


def _generate_investigation_recommendations(individual_risks: list) -> str:
    """Generate investigation recommendations"""
    investigations = []

    for risk in individual_risks:
        disease = risk.get("disease", "")
        level = risk.get("risk_level", "")

        if level in ["Critical", "High"]:
            if "Diabetes" in disease:
                investigations.append("• Fasting blood glucose, HbA1c, oral glucose tolerance test")
            if "Heart" in disease:
                investigations.append("• ECG, echocardiogram, stress test, cardiac biomarkers")
            if "Kidney" in disease:
                investigations.append("• Complete metabolic panel, urinalysis, eGFR, kidney ultrasound")
            if "Liver" in disease:
                investigations.append("• Liver function tests, hepatitis panel, liver ultrasound")
            if "Stroke" in disease:
                investigations.append("• Carotid ultrasound, brain MRI/CT, lipid panel")

    if not investigations:
        investigations.append("• Routine health screening labs as per age and risk factors")
        investigations.append("• Baseline ECG and vital signs")

    return "\n".join(list(set(investigations)))  # Remove duplicates


def _get_disclaimer() -> str:
    """Get patient disclaimer"""
    return """**This report is generated by an AI-powered health screening tool and is intended \
for health awareness, educational purposes, and informational use.**

**⚠️ IMPORTANT - Results MUST be interpreted by a certified medical professional:**
• This is NOT a medical diagnosis
• This is a SECOND OPINION TOOL to assist, not replace, professional medical judgment
• All findings must be reviewed and interpreted by a licensed healthcare provider
• Do not make any treatment decisions based solely on this report
• Seek immediate medical attention for any emergency symptoms

**About This Tool:**
• Designed to boost clinical experience and assist healthcare professionals
• Provides health risk awareness for patients and general population
• Can support clinical decision-making but NEVER replaces doctor's judgment

**Accuracy Note:** AI models are trained on large datasets but may not account for \
all individual variations. Clinical judgment by a qualified healthcare professional \
is essential for accurate diagnosis and treatment planning."""


def _get_professional_disclaimer() -> str:
    """Get professional disclaimer for doctors"""
    return """**Clinical Decision Support Tool - For Healthcare Professional Review**

This report is generated by machine learning models trained on clinical datasets. \
The risk scores and assessments are intended as a SECOND OPINION to support, not replace, clinical judgment.

**Positioning:**
• Designed to ASSIST and BOOST clinical experience, never replace doctors
• Serves as a productivity and quality tool for clinical decision support
• Accessible to patients for health awareness, but results require professional interpretation

**Limitations:**
• Models may not capture all clinical nuances
• Risk scores are probabilistic, not deterministic
• Individual patient factors may not be fully represented
• Models require validation against clinical findings

**Recommendations:**
• Use this report as one component of comprehensive clinical assessment
• Correlate AI findings with clinical examination and patient history
• Order confirmatory tests as clinically indicated
• Apply professional judgment in all diagnostic and treatment decisions

**Liability:** This tool provides decision support only. Final diagnostic and treatment \
decisions remain the responsibility of the attending physician."""
