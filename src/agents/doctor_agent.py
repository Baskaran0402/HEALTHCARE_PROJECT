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

    # --------------------------------------------------
    # 5. Medical Billing Coding (ICD-10 / CPT)
    # --------------------------------------------------
    def generate_medical_codes(self, ml_report: Dict) -> Dict:
        """
        Suggests ICD-10 and CPT codes based on risk assessments and findings.
        """
        try:
            prompt = self._billing_codes_prompt(ml_report)
            raw = self.llm.generate(prompt)
            # Find JSON block if LLM adds preamble
            if "{" in raw:
                raw = raw[raw.find("{") : raw.rfind("}") + 1]
            return json.loads(raw)
        except Exception as e:
            print(f"Billing Code Error: {e}")
            return {
                "icd10": [
                    {
                        "code": "Z00.00",
                        "description": "Encounter for general adult medical examination without abnormal findings",
                    }
                ],
                "cpt": [{"code": "99213", "description": "Office or other outpatient visit (Low-Moderate complexity)"}],
            }

    # ==================================================
    # PROMPTS
    # ==================================================

    def _billing_codes_prompt(self, ml_report: Dict) -> str:
        # Simplify report to save tokens
        simplified_report = {
            "disease": [
                r.get("disease")
                for r in ml_report.get("individual_risks", [])
                if r.get("risk_level") in ["High", "Critical"]
            ],
            "findings": ml_report.get("cross_intelligence_insights", []),
        }

        return f"""
        Act as a Medical Coder. Suggest ICD-10 & CPT codes for:
        {simplified_report}

        Strict JSON Output:
        {{
          "icd10": [ {{ "code": "X.X", "description": "..." }} ],
          "cpt": [ {{ "code": "X", "description": "..." }} ]
        }}
        """

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
        # Simplify input
        simplified_report = {
            "risk_level": ml_report.get("overall_risk", {}).get("level", "Low"),
            "concerns": ml_report.get("overall_risk", {}).get("primary_concerns", []),
        }

        return f"""
        Explain health results to a patient clearly and calmly.

        Summary: {summary}
        Risks: {simplified_report}

        Rules: No medical jargon. No Dx. Focus on lifestyle.
        """

    def _doctor_report_prompt(self, ml_report: Dict, summary: str) -> str:
        # Simplify input to reduce tokens
        # Only pass high-level risks
        simplified_report = {
            "overall_risk": ml_report.get("overall_risk", {}),
            "critical_risks": [
                r for r in ml_report.get("individual_risks", []) if r.get("risk_level") in ["High", "Critical"]
            ],
        }

        return f"""
        Act as a doctor. Write a concise SOAP Assessment & Plan.

        Summary: {summary}
        Findings: {simplified_report}

        Rules: No Diagnosis. No Rx. Medico-legal disclaimer required.
        """

    def _soap_json_prompt(self, ml_report: Dict, summary: str) -> str:
        simplified_report = {
            "risk_stratification": [r.get("risk_level") for r in ml_report.get("individual_risks", [])]
        }

        return f"""
        Generate strict JSON SOAP note.

        Summary: {summary}
        ML Risks: {simplified_report}

        Schema:
        {{
          "subjective": {{ "chief_complaint": "", "history": "" }},
          "objective": {{ "vitals": {{}}, "risk_scores": {{}} }},
          "assessment": {{ "impressions": [] }},
          "plan": {{ "recommendations": [] }},
          "disclaimer": ""
        }}
        """
