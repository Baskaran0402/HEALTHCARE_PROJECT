import streamlit as st
import speech_recognition as sr
import warnings
from sklearn.exceptions import DataConversionWarning

# ============================================================
# Silence sklearn warnings (cosmetic only)
# ============================================================

warnings.filterwarnings("ignore", category=UserWarning)
warnings.filterwarnings("ignore", category=DataConversionWarning)

# ============================================================
# Imports
# ============================================================

from src.coordinator.patient_state import PatientState
from src.coordinator.executor import run_selected_agents

from src.core.llm_client import GeminiClient
from src.agents.doctor_agent import DoctorAgent

# ============================================================
# Initialize LLM Doctor Agent
# ============================================================

llm = GeminiClient()
doctor_agent = DoctorAgent(llm)

# ============================================================
# Voice Input Helper
# ============================================================

def get_voice_input():
    r = sr.Recognizer()
    try:
        with sr.Microphone() as source:
            st.info("🎙️ Listening... please speak")
            audio = r.listen(source, timeout=5)
        return r.recognize_google(audio)
    except Exception:
        return ""

# ============================================================
# Lightweight NLP → ML only
# ============================================================

def extract_symptoms(text):
    text = text.lower()
    return {
        "chest_pain": int("chest" in text),
        "breathlessness": int("breath" in text),
        "fatigue": int("tired" in text or "fatigue" in text),
        "edema": int("swelling" in text or "edema" in text),
    }

# ============================================================
# Page Setup
# ============================================================

st.set_page_config(
    page_title="AI Doctor – Personalized Healthcare Recommendation System",
    layout="centered",
)

st.title("🩺 AI Doctor")
st.caption("Conversational, Multi-Agent Healthcare Recommendation System")

# ============================================================
# Session State
# ============================================================

if "stage" not in st.session_state:
    st.session_state.stage = "intro"

if "conversation" not in st.session_state:
    st.session_state.conversation = []

if "confidence" not in st.session_state:
    st.session_state.confidence = 0.3

# ============================================================
# STAGE 0 — INTRO (PLAY BUTTON)
# ============================================================

if st.session_state.stage == "intro":
    st.subheader("Welcome")

    st.markdown(
        """
        This system simulates a **doctor-style clinical consultation**  
        followed by **AI-assisted health risk analysis**.

        - No diagnosis
        - No prescriptions
        - Physician review required
        """
    )

    if st.button("▶ Start Consultation"):
        st.session_state.stage = "consultation"
        st.rerun()

# ============================================================
# STAGE 1 — LLM Doctor Consultation
# ============================================================

elif st.session_state.stage == "consultation":
    st.subheader("👨‍⚕️ Doctor Consultation")

    # First doctor message ONLY after play
    if not st.session_state.conversation:
        question = (
            "Hello, welcome. I’m here to listen and help. "
            "What brings you in today?"
        )
    else:
        question = doctor_agent.ask_next_question(
            st.session_state.conversation,
            st.session_state.confidence
        )

    # Natural stopping
    if question is None:
        st.success("Thank you. I have enough information to continue.")
        st.session_state.stage = "medical_form"
        st.rerun()

    st.markdown(f"**👨‍⚕️ Doctor:** {question}")

    col1, col2 = st.columns([3, 1])

    with col1:
        answer = st.text_input("You:")

    with col2:
        if st.button("🎤 Speak"):
            voice_text = get_voice_input()
            if voice_text:
                answer = voice_text

    if answer:
        st.session_state.conversation.extend([
            {"role": "doctor", "content": question},
            {"role": "patient", "content": answer},
        ])

        st.session_state.confidence = min(
            st.session_state.confidence + 0.15, 1.0
        )

        st.rerun()

# ============================================================
# STAGE 2 — STRUCTURED MEDICAL FORM
# ============================================================

elif st.session_state.stage == "medical_form":
    st.subheader("🧾 Medical Information")

    with st.form("medical_form"):
        col1, col2 = st.columns(2)

        with col1:
            age = st.number_input("Age", 0, 120, 40)
            gender = st.selectbox("Gender", ["Male", "Female"])
            bmi = st.number_input("BMI", 10.0, 60.0, 24.0)
            bp = st.number_input("Blood Pressure (mmHg)", 60, 250, 120)

        with col2:
            glucose = st.number_input("Blood Glucose (mg/dL)", 50, 500, 100)
            hba1c = st.number_input("HbA1c (%)", 3.0, 15.0, 5.5)
            cholesterol = st.number_input("Cholesterol (mg/dL)", 100, 400, 180)
            creatinine = st.number_input("Creatinine (mg/dL)", 0.1, 10.0, 1.0)

        hypertension = st.checkbox("Hypertension")
        diabetes = st.checkbox("Diabetes")
        heart_disease = st.checkbox("Heart Disease")
        chest_pain = st.checkbox("Chest Pain")
        breathlessness = st.checkbox("Breathlessness")
        edema = st.checkbox("Swelling (Edema)")

        smoking = st.selectbox(
            "Smoking History",
            ["Never", "Former", "Current"]
        )

        submit = st.form_submit_button("🔍 Analyze Health")

    if submit:
        patient = PatientState()

        patient.age = age
        patient.gender = 1 if gender == "Male" else 0
        patient.bmi = bmi
        patient.blood_pressure = bp
        patient.blood_glucose = glucose
        patient.hba1c = hba1c
        patient.cholesterol = cholesterol
        patient.creatinine = creatinine

        patient.hypertension = int(hypertension)
        patient.diabetes = int(diabetes)
        patient.heart_disease = int(heart_disease)
        patient.chest_pain = int(chest_pain)
        patient.breathlessness = int(breathlessness)
        patient.edema = int(edema)
        patient.smoking_raw = smoking.lower()

        full_text = " ".join(
            m["content"] for m in st.session_state.conversation
        )
        extracted = extract_symptoms(full_text)

        patient.chest_pain |= extracted["chest_pain"]
        patient.breathlessness |= extracted["breathlessness"]
        patient.edema |= extracted["edema"]

        with st.spinner("🧠 AI Doctor is analyzing your health..."):
            st.session_state.ml_report = run_selected_agents(patient)

            summary = doctor_agent.summarize_case(
                st.session_state.conversation
            )

            st.session_state.llm_reports = doctor_agent.generate_reports(
                ml_report=st.session_state.ml_report,
                conversation_summary=summary
            )

            st.session_state.soap_json = doctor_agent.generate_soap_json(
                ml_report=st.session_state.ml_report,
                conversation_summary=summary
            )

        st.session_state.stage = "report"
        st.rerun()

# ============================================================
# STAGE 3 — REPORTS
# ============================================================

elif st.session_state.stage == "report":
    ml_report = st.session_state.ml_report
    llm_reports = st.session_state.llm_reports

    st.subheader("🧾 Health Risk Assessment")

    if not ml_report["individual_risks"]:
        st.success(
            "All health indicators appear within normal limits. "
            "Continue routine healthy activities."
        )

    for item in ml_report["individual_risks"]:
        label = f"{item['disease']} — {item['risk_score']}%"

        if item["risk_level"] == "Critical":
            st.error(label + " (Critical)")
        elif item["risk_level"] == "Moderate":
            st.warning(label + " (Moderate)")
        else:
            st.success(label + " (Low)")

        st.markdown("**Why this risk was flagged:**")
        for reason in item.get("why", []):
            st.markdown(f"- {reason}")

        if item["risk_level"] != "Low":
            st.markdown("**Suggested Management (Physician Review):**")
            for g in item.get("guidelines", []):
                st.markdown(f"- {g}")

        if item.get("interaction_warnings"):
            st.markdown("**Medication & Substance Cautions:**")
            for drug, warning in item["interaction_warnings"].items():
                st.markdown(f"- **{drug}**: {warning}")

        st.divider()

    st.subheader("🧑‍⚕️ Patient Report")
    st.markdown(llm_reports["patient_report"])

    st.subheader("📋 Doctor Report")
    st.markdown(llm_reports["doctor_report"])

    st.subheader("📄 SOAP (Structured JSON)")
    st.json(st.session_state.soap_json)

    st.info(
        "This system provides AI-assisted clinical decision support only. "
        "All outputs must be reviewed by a licensed healthcare professional."
    )

    if st.button("🔄 New Consultation"):
        st.session_state.clear()
        st.rerun()
