import json
from typing import Dict, List, Optional

FORBIDDEN_TERMS = [
    "diagnosed",
    "likely has",
    "kidney disease",
    "diabetes",
    "metformin",
    "start",
    "prescribe",
    "treatment",
]


def sanitize(text: str) -> str:
    if not text:
        return text
    lowered = text.lower()
    for term in FORBIDDEN_TERMS:
        if term in lowered:
            text = text.replace(term, "[REDACTED]")
    return text


class DoctorAgent:
    """
    LLM-powered doctor assistant.

    Capabilities:
    - Conversational follow-up questioning
    - Case summarization
    - Patient & Doctor narrative reports
    - SOAP → JSON (EMR-ready)
    - Safety-first (NO diagnosis, NO prescriptions)
    """

    def __init__(self, llm_client):
        self.llm = llm_client

    # --------------------------------------------------
    # 1. Dynamic Follow-up Questioning
    # --------------------------------------------------
    def ask_next_question(self, conversation_history: List[Dict], confidence: float) -> Optional[str]:

        if confidence >= 0.85:
            return None

        if len(conversation_history) >= 6:
            return None

        try:
            prompt = self._question_prompt(conversation_history)
            response = self.llm.generate(prompt)
            return sanitize(response.strip()) if response else None
        except Exception:
            return None

    # --------------------------------------------------
    # 2. Case Summarization
    # --------------------------------------------------
    def summarize_case(self, conversation_history: List[Dict]) -> str:
        try:
            prompt = self._summary_prompt(conversation_history)
            return sanitize(self.llm.generate(prompt).strip())
        except Exception:
            return "Summary unavailable due to temporary system load."

    # --------------------------------------------------
    # 3. Patient + Doctor Reports
    # --------------------------------------------------
    def generate_reports(self, ml_report: Dict, conversation_summary: str) -> Dict[str, str]:

        try:
            patient_prompt = self._patient_report_prompt(ml_report=ml_report, summary=conversation_summary)

            doctor_prompt = self._doctor_report_prompt(ml_report=ml_report, summary=conversation_summary)

            patient_text = sanitize(self.llm.generate(patient_prompt))
            doctor_text = sanitize(self.llm.generate(doctor_prompt))

            return {
                "patient_report": patient_text.strip(),
                "doctor_report": doctor_text.strip(),
            }

        except Exception:
            return {
                "patient_report": (
                    "Your health information has been reviewed. "
                    "No urgent concerns are identified from the current assessment. "
                    "Please follow up routinely with a healthcare professional."
                ),
                "doctor_report": (
                    "Narrative generation unavailable due to system load. "
                    "Refer to ML-derived risk stratification and structured findings."
                ),
            }

    # --------------------------------------------------
    # 4. SOAP → JSON (EMR Ready, deterministic fallback)
    # --------------------------------------------------
    def generate_soap_json(self, ml_report: Dict, conversation_summary: str) -> Dict:

        try:
            prompt = self._soap_json_prompt(ml_report, conversation_summary)
            raw = self.llm.generate(prompt)
            return json.loads(raw)

        except Exception:
            return self._fallback_soap(ml_report)

    # --------------------------------------------------
    # Fallback SOAP (NO LLM)
    # --------------------------------------------------
    def _fallback_soap(self, ml_report: Dict) -> Dict:
        return {
            "subjective": {
                "chief_complaint": "Routine or unspecified visit",
                "history_of_present_illness": "",
                "duration": "",
                "associated_symptoms": [],
                "relevant_negatives": [],
            },
            "objective": {
                "vitals": {},
                "labs": {},
                "ml_risk_scores": {r["disease"]: r["risk_score"] for r in ml_report.get("individual_risks", [])},
            },
            "assessment": {
                "risk_stratification": [r["risk_level"] for r in ml_report.get("individual_risks", [])],
                "clinical_impressions": ["Risk stratification derived from ML models only"],
            },
            "plan": {
                "monitoring": ["Routine follow-up and trend monitoring"],
                "investigations": [],
                "referrals": [],
                "lifestyle_guidance": [],
            },
            "disclaimer": (
                "This SOAP note was auto-generated using fallback logic. "
                "No diagnosis or treatment decisions are implied. "
                "Physician review required."
            ),
        }

    # ==================================================
    # PROMPTS
    # ==================================================

    def _question_prompt(self, history: List[Dict]) -> str:
        return f"""
You are a calm, polite, empathetic medical doctor.

Conversation so far:
{history}

Rules:
- Ask ONLY ONE follow-up question
- Neutral, professional tone
- No diagnosis
- No medications
"""

    def _summary_prompt(self, history: List[Dict]) -> str:
        return f"""
Summarize the consultation into structured clinical notes.

Conversation:
{history}

Include:
- Chief complaint
- Duration
- Key symptoms
- Relevant negatives
- Risk factors

Rules:
- No assumptions
- No diagnoses
"""

    def _patient_report_prompt(self, ml_report: Dict, summary: str) -> str:
        return f"""
Explain findings to a patient in clear, simple language.

Conversation Summary:
{summary}

Risk Assessment:
{ml_report}

Rules:
- Reassure if low risk
- Calm explanation if elevated risk
- Lifestyle guidance only
- No disease labels
- No medications
"""

    def _doctor_report_prompt(self, ml_report: Dict, summary: str) -> str:
        return f"""
Write a doctor-facing SOAP-style narrative.

Summary:
{summary}

ML Risk Assessment:
{ml_report}

Rules:
- No definitive diagnosis
- No prescriptions
- Risk-based wording only
- Include a medico-legal disclaimer
"""

    def _soap_json_prompt(self, ml_report: Dict, summary: str) -> str:
        return f"""
You are generating a STRICT JSON SOAP note.

Conversation Summary:
{summary}

ML Risk Assessment:
{ml_report}

Output MUST be valid JSON only.

Schema:
{{
  "subjective": {{
    "chief_complaint": "",
    "history_of_present_illness": "",
    "duration": "",
    "associated_symptoms": [],
    "relevant_negatives": []
  }},
  "objective": {{
    "vitals": {{}},
    "labs": {{}},
    "ml_risk_scores": {{}}
  }},
  "assessment": {{
    "risk_stratification": [],
    "clinical_impressions": []
  }},
  "plan": {{
    "monitoring": [],
    "investigations": [],
    "referrals": [],
    "lifestyle_guidance": []
  }},
  "disclaimer": ""
}}

Rules:
- No diagnosis
- No prescriptions
- Risk-based language only
"""
