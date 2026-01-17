import warnings

import speech_recognition as sr
import streamlit as st
from sklearn.exceptions import DataConversionWarning

from src.agents.doctor_agent import DoctorAgent
from src.coordinator.executor import run_selected_agents
from src.coordinator.patient_state import PatientState
from src.core.llm_client import GeminiClient

# ============================================================
# Silence sklearn warnings (cosmetic only)
# ============================================================

warnings.filterwarnings("ignore", category=UserWarning)
warnings.filterwarnings("ignore", category=DataConversionWarning)

# ============================================================
# Imports
# ============================================================


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
# Custom CSS for Enhanced UI
# ============================================================


def load_custom_css():
    st.markdown(
        """
    <style>
    /* Main container styling */
    .main {
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    }

    /* Header styling */
    .main-header {
        text-align: center;
        padding: 2rem 0;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border-radius: 15px;
        margin-bottom: 2rem;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    }

    .main-header h1 {
        font-size: 2.5rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
    }

    .main-header p {
        font-size: 1.1rem;
        opacity: 0.95;
    }

    /* Card styling */
    .card {
        background: white;
        padding: 2rem;
        border-radius: 15px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.08);
        margin-bottom: 1.5rem;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    }

    /* Button styling */
    .stButton>button {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 10px;
        padding: 0.75rem 2rem;
        font-weight: 600;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    }

    .stButton>button:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
    }

    /* Chat message styling */
    .chat-message {
        padding: 1.5rem;
        border-radius: 15px;
        margin-bottom: 1rem;
        animation: fadeIn 0.5s ease;
    }

    .doctor-message {
        background: linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%);
        border-left: 5px solid #00bcd4;
    }

    .patient-message {
        background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%);
        border-left: 5px solid #9c27b0;
    }

    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }

    /* Progress bar styling */
    .progress-container {
        background: #e0e0e0;
        border-radius: 10px;
        height: 8px;
        margin: 1rem 0;
        overflow: hidden;
    }

    .progress-bar {
        height: 100%;
        background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
        border-radius: 10px;
        transition: width 0.5s ease;
    }

    /* Input field styling */
    .stTextInput>div>div>input {
        border-radius: 10px;
        border: 2px solid #e0e0e0;
        padding: 0.75rem;
        transition: border-color 0.3s ease;
    }

    .stTextInput>div>div>input:focus {
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    /* Risk level badges */
    .risk-badge {
        display: inline-block;
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-weight: 600;
        margin: 0.5rem 0;
    }

    .risk-critical {
        background: #ffebee;
        color: #c62828;
        border: 2px solid #ef5350;
    }

    .risk-moderate {
        background: #fff3e0;
        color: #e65100;
        border: 2px solid #ff9800;
    }

    .risk-low {
        background: #e8f5e9;
        color: #2e7d32;
        border: 2px solid #4caf50;
    }

    /* Section headers */
    .section-header {
        font-size: 1.5rem;
        font-weight: 700;
        color: #333;
        margin: 2rem 0 1rem 0;
        padding-bottom: 0.5rem;
        border-bottom: 3px solid #667eea;
    }

    /* Metric cards */
    .metric-card {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 1.5rem;
        border-radius: 15px;
        text-align: center;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    }

    .metric-value {
        font-size: 2.5rem;
        font-weight: 700;
        margin: 0.5rem 0;
    }

    .metric-label {
        font-size: 1rem;
        opacity: 0.9;
    }

    /* Info boxes */
    .info-box {
        background: #e3f2fd;
        border-left: 5px solid #2196f3;
        padding: 1rem;
        border-radius: 8px;
        margin: 1rem 0;
    }

    .warning-box {
        background: #fff3e0;
        border-left: 5px solid #ff9800;
        padding: 1rem;
        border-radius: 8px;
        margin: 1rem 0;
    }

    .success-box {
        background: #e8f5e9;
        border-left: 5px solid #4caf50;
        padding: 1rem;
        border-radius: 8px;
        margin: 1rem 0;
    }

    /* Hide Streamlit branding */
    #MainMenu {visibility: hidden;}
    footer {visibility: hidden;}
    </style>
    """,
        unsafe_allow_html=True,
    )


# ============================================================
# Page Setup
# ============================================================


st.set_page_config(
    page_title="AI Doctor — Personalized Healthcare Recommendation System",
    layout="wide",
    initial_sidebar_state="collapsed",
)

load_custom_css()

# ============================================================
# Session State
# ============================================================

if "stage" not in st.session_state:
    st.session_state.stage = "intro"

if "conversation" not in st.session_state:
    st.session_state.conversation = []

if "confidence" not in st.session_state:
    st.session_state.confidence = 0.3

if "role" not in st.session_state:
    st.session_state.role = None

# ============================================================
# STAGE 0 — INTRO + ROLE SELECTION
# ============================================================

if st.session_state.stage == "intro":
    # Header
    st.markdown(
        """
    <div class="main-header">
        <h1>🩺 AI Doctor</h1>
        <p>Intelligent Multi-Agent Healthcare Recommendation System</p>
    </div>
    """,
        unsafe_allow_html=True,
    )

    # Welcome section
    col1, col2, col3 = st.columns([1, 2, 1])

    with col2:
        st.markdown(
            """
        <div class="card">
            <h2 style="text-align: center; color: #667eea;">Welcome to Your AI Health Assistant</h2>
            <p style="text-align: center; font-size: 1.1rem; color: #666; margin-top: 1rem;">
                Experience advanced AI-powered clinical decision support designed to assist healthcare professionals
                and empower patients with intelligent health insights.
            </p>
        </div>
        """,
            unsafe_allow_html=True,
        )

        # Features
        st.markdown('<div class="section-header">✨ Key Features</div>', unsafe_allow_html=True)

        feat_col1, feat_col2 = st.columns(2)

        with feat_col1:
            st.markdown(
                """
            <div class="card">
                <h3>🤖 AI-Powered Analysis</h3>
                <p>Advanced machine learning models analyze your health data comprehensively</p>
            </div>
            """,
                unsafe_allow_html=True,
            )

            st.markdown(
                """
            <div class="card">
                <h3>💬 Natural Conversation</h3>
                <p>Interactive consultation with voice input support</p>
            </div>
            """,
                unsafe_allow_html=True,
            )

        with feat_col2:
            st.markdown(
                """
            <div class="card">
                <h3>📊 Risk Assessment</h3>
                <p>Multi-disease risk evaluation with actionable insights</p>
            </div>
            """,
                unsafe_allow_html=True,
            )

            st.markdown(
                """
            <div class="card">
                <h3>👨‍⚕️ Clinical Support</h3>
                <p>Evidence-based recommendations and SOAP documentation</p>
            </div>
            """,
                unsafe_allow_html=True,
            )

        # Important disclaimer
        st.markdown(
            """
        <div class="warning-box">
            <h4>⚠️ Important Medical Disclaimer</h4>
            <ul>
                <li>This system provides AI-assisted clinical decision support only</li>
                <li>Does not provide medical diagnoses or prescriptions</li>
                <li>All outputs must be reviewed by a licensed healthcare professional</li>
                <li>Not a substitute for professional medical advice</li>
            </ul>
        </div>
        """,
            unsafe_allow_html=True,
        )

        # Role selection
        st.markdown('<div class="section-header">👤 Select Your Role</div>', unsafe_allow_html=True)

        role_col1, role_col2 = st.columns(2)

        with role_col1:
            if st.button("👨‍⚕️ I'm a Healthcare Professional", use_container_width=True):
                st.session_state.role = "Doctor"
                st.session_state.stage = "consultation"
                st.rerun()

        with role_col2:
            if st.button("🧑‍🦱 I'm a Patient", use_container_width=True):
                st.session_state.role = "Patient"
                st.session_state.stage = "consultation"
                st.rerun()

# ============================================================
# STAGE 1 — DOCTOR CONSULTATION
# ============================================================

elif st.session_state.stage == "consultation":
    # Header with progress
    st.markdown(
        """
    <div class="main-header">
        <h1>🩺 AI Doctor Consultation</h1>
        <p>Interactive Health Assessment</p>
    </div>
    """,
        unsafe_allow_html=True,
    )

    # Progress indicator
    progress = min(st.session_state.confidence * 100, 100)
    st.markdown(
        f"""
    <div style="background: white; padding: 1.5rem; border-radius: 15px;
                margin-bottom: 2rem; box-shadow: 0 5px 15px rgba(0,0,0,0.08);">
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
            <span style="font-weight: 600; color: #667eea;">Consultation Progress</span>
            <span style="font-weight: 600; color: #667eea;">{progress:.0f}%</span>
        </div>
        <div class="progress-container">
            <div class="progress-bar" style="width: {progress}%;"></div>
        </div>
    </div>
    """,
        unsafe_allow_html=True,
    )

    # Main consultation area
    col1, col2 = st.columns([2, 1])

    with col1:
        # Conversation history
        if st.session_state.conversation:
            st.markdown('<div class="section-header">💬 Conversation History</div>', unsafe_allow_html=True)

            for msg in st.session_state.conversation[-6:]:  # Show last 6 messages
                if msg["role"] == "doctor":
                    st.markdown(
                        f"""
                    <div class="chat-message doctor-message">
                        <strong>👨‍⚕️ Doctor:</strong><br>{msg["content"]}
                    </div>
                    """,
                        unsafe_allow_html=True,
                    )
                else:
                    st.markdown(
                        f"""
                    <div class="chat-message patient-message">
                        <strong>🧑‍🦱 You:</strong><br>{msg["content"]}
                    </div>
                    """,
                        unsafe_allow_html=True,
                    )

        # Current question
        if not st.session_state.conversation:
            question = "Hello, welcome. I'm here to listen and help. " "What brings you in today?"
        else:
            question = doctor_agent.ask_next_question(st.session_state.conversation, st.session_state.confidence)

        if question is None:
            st.success("✅ Thank you. I have enough information to proceed with the assessment.")
            if st.button("Continue to Medical Form →", use_container_width=True):
                st.session_state.stage = "medical_form"
                st.rerun()
        else:
            st.markdown(
                f"""
            <div class="chat-message doctor-message"
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none;">
                <strong style="font-size: 1.1rem;">👨‍⚕️ Doctor:</strong><br>
                <p style="font-size: 1.05rem; margin-top: 0.5rem;">{question}</p>
            </div>
            """,
                unsafe_allow_html=True,
            )

            # Input area
            st.markdown("### Your Response")

            input_col1, input_col2 = st.columns([4, 1])

            with input_col1:
                answer = st.text_input("Type your answer:", key="answer_input", label_visibility="collapsed")

            with input_col2:
                if st.button("🎤 Voice", use_container_width=True):
                    voice_text = get_voice_input()
                    if voice_text:
                        answer = voice_text
                        st.rerun()

            if answer:
                st.session_state.conversation.extend(
                    [
                        {"role": "doctor", "content": question},
                        {"role": "patient", "content": answer},
                    ]
                )

                st.session_state.confidence = min(st.session_state.confidence + 0.15, 1.0)

                st.rerun()

    with col2:
        # Tips sidebar
        st.markdown(
            """
        <div class="card">
            <h3 style="color: #667eea;">💡 Tips for Better Assessment</h3>
            <ul style="line-height: 1.8;">
                <li>Be specific about your symptoms</li>
                <li>Mention when symptoms started</li>
                <li>Describe severity and frequency</li>
                <li>Share relevant medical history</li>
                <li>Use voice input for convenience</li>
            </ul>
        </div>
        """,
            unsafe_allow_html=True,
        )

        # Quick actions
        st.markdown(
            """
        <div class="card" style="margin-top: 1rem;">
            <h3 style="color: #667eea;">⚡ Quick Actions</h3>
        </div>
        """,
            unsafe_allow_html=True,
        )

        if st.button("🔄 Restart Consultation", use_container_width=True):
            st.session_state.conversation = []
            st.session_state.confidence = 0.3
            st.rerun()

# ============================================================
# STAGE 2 — STRUCTURED MEDICAL FORM
# ============================================================

elif st.session_state.stage == "medical_form":
    st.markdown(
        """
    <div class="main-header">
        <h1>📋 Medical Information Form</h1>
        <p>Complete Your Health Profile</p>
    </div>
    """,
        unsafe_allow_html=True,
    )

    with st.form("medical_form"):
        # Demographics
        st.markdown('<div class="section-header">👤 Demographics</div>', unsafe_allow_html=True)
        demo_col1, demo_col2, demo_col3 = st.columns(3)

        with demo_col1:
            age = st.number_input("Age", 0, 120, 40)
        with demo_col2:
            gender = st.selectbox("Gender", ["Male", "Female"])
        with demo_col3:
            bmi = st.number_input("BMI", 10.0, 60.0, 24.0)

        # Vital Signs
        st.markdown('<div class="section-header">🩺 Vital Signs & Lab Values</div>', unsafe_allow_html=True)
        vital_col1, vital_col2, vital_col3, vital_col4 = st.columns(4)

        with vital_col1:
            bp = st.number_input("Blood Pressure (mmHg)", 60, 250, 120)
        with vital_col2:
            glucose = st.number_input("Blood Glucose (mg/dL)", 50, 500, 100)
        with vital_col3:
            hba1c = st.number_input("HbA1c (%)", 3.0, 15.0, 5.5)
        with vital_col4:
            cholesterol = st.number_input("Cholesterol (mg/dL)", 100, 400, 180)

        creatinine = st.number_input("Creatinine (mg/dL)", 0.1, 10.0, 1.0)

        # Medical History
        st.markdown('<div class="section-header">🏥 Medical History</div>', unsafe_allow_html=True)
        history_col1, history_col2, history_col3 = st.columns(3)

        with history_col1:
            hypertension = st.checkbox("Hypertension")
            diabetes = st.checkbox("Diabetes")
        with history_col2:
            heart_disease = st.checkbox("Heart Disease")
            chest_pain = st.checkbox("Chest Pain")
        with history_col3:
            breathlessness = st.checkbox("Breathlessness")
            edema = st.checkbox("Swelling (Edema)")

        # Lifestyle
        st.markdown('<div class="section-header">🚬 Lifestyle Factors</div>', unsafe_allow_html=True)
        smoking = st.selectbox("Smoking History", ["Never", "Former", "Current"])

        st.markdown("<br>", unsafe_allow_html=True)
        submit = st.form_submit_button("🔍 Analyze My Health", use_container_width=True)

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

        full_text = " ".join(m["content"] for m in st.session_state.conversation)
        extracted = extract_symptoms(full_text)

        patient.chest_pain |= extracted["chest_pain"]
        patient.breathlessness |= extracted["breathlessness"]
        patient.edema |= extracted["edema"]

        with st.spinner("🧠 AI Doctor is analyzing your health profile..."):
            st.session_state.ml_report = run_selected_agents(patient)

            summary = doctor_agent.summarize_case(st.session_state.conversation)

            st.session_state.llm_reports = doctor_agent.generate_reports(
                ml_report=st.session_state.ml_report, conversation_summary=summary
            )

            st.session_state.soap_json = doctor_agent.generate_soap_json(
                ml_report=st.session_state.ml_report, conversation_summary=summary
            )

        st.session_state.stage = "report"
        st.rerun()

# ============================================================
# STAGE 3 — ROLE-BASED REPORTS
# ============================================================

elif st.session_state.stage == "report":
    role = st.session_state.role
    ml_report = st.session_state.ml_report
    llm_reports = st.session_state.llm_reports

    st.markdown(
        """
    <div class="main-header">
        <h1>📊 Health Assessment Report</h1>
        <p>Your Personalized AI-Generated Analysis</p>
    </div>
    """,
        unsafe_allow_html=True,
    )

    # Risk Summary Cards
    st.markdown('<div class="section-header">🎯 Risk Assessment Summary</div>', unsafe_allow_html=True)

    risk_items = ml_report.get("individual_risks", [])

    for item in risk_items:
        risk_level = item["risk_level"]

        # Determine card style
        if risk_level == "Critical":
            border_color = "#ef5350"
            bg_gradient = "linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)"
            icon = "🔴"
        elif risk_level == "Moderate":
            border_color = "#ff9800"
            bg_gradient = "linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)"
            icon = "🟡"
        else:
            border_color = "#4caf50"
            bg_gradient = "linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)"
            icon = "🟢"

        st.markdown(
            f"""
        <div style="background: {bg_gradient}; border-left: 5px solid {border_color};
                    padding: 1.5rem; border-radius: 15px; margin-bottom: 1.5rem;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.08);">
            <h3 style="margin: 0; color: #333;">{icon} {item['disease']} - {item['risk_level']} Risk</h3>
        </div>
        """,
            unsafe_allow_html=True,
        )

        # Expandable details
        with st.expander("📖 View Detailed Analysis", expanded=(risk_level != "Low")):
            st.markdown("**🔍 Key Risk Factors:**")
            for reason in item.get("why", []):
                st.markdown(f"• {reason}")

            if role == "Doctor":
                st.markdown(f"**📊 Risk Score:** {item['risk_score']}%")

                if item["risk_level"] != "Low":
                    st.markdown("**📚 Clinical Guidelines:**")
                    for g in item.get("guidelines", []):
                        st.markdown(f"• {g}")

                if item.get("interaction_warnings"):
                    st.markdown("**⚠️ Medication Interactions:**")
                    for drug, warning in item["interaction_warnings"].items():
                        st.markdown(f"• **{drug}**: {warning}")

    st.markdown("<br>", unsafe_allow_html=True)

    # Role-specific reports
    if role == "Patient":
        st.markdown('<div class="section-header">📄 Your Health Report</div>', unsafe_allow_html=True)
        st.markdown(
            f"""
        <div class="card">
            {llm_reports.get("patient_report", "Report unavailable")}
        </div>
        """,
            unsafe_allow_html=True,
        )

    if role == "Doctor":
        col1, col2 = st.columns([2, 1])

        with col1:
            st.markdown('<div class="section-header">📋 Clinical Narrative</div>', unsafe_allow_html=True)
            st.markdown(
                f"""
            <div class="card">
                {llm_reports.get("doctor_report", "Report unavailable")}
            </div>
            """,
                unsafe_allow_html=True,
            )

        with col2:
            st.markdown('<div class="section-header">🎯 System Metrics</div>', unsafe_allow_html=True)

            confidence_pct = ml_report.get("confidence", 0) * 100

            st.markdown(
                f"""
            <div class="metric-card">
                <div class="metric-label">Assessment Confidence</div>
                <div class="metric-value">{confidence_pct:.0f}%</div>
            </div>
            """,
                unsafe_allow_html=True,
            )

            st.markdown("<br>", unsafe_allow_html=True)

            st.markdown(
                f"""
            <div class="metric-card">
                <div class="metric-label">Model Agreement</div>
                <div class="metric-value">{ml_report.get("model_agreement", "N/A")}</div>
            </div>
            """,
                unsafe_allow_html=True,
            )

        st.markdown('<div class="section-header">📄 SOAP Documentation</div>', unsafe_allow_html=True)
        with st.expander("View Clinical SOAP Note (For EMR Integration)"):
            st.json(st.session_state.soap_json)

    # Disclaimer
    st.markdown(
        """
    <div class="info-box">
        <strong>ℹ️ Medical Disclaimer:</strong> This system provides AI-assisted clinical decision support only.
        All outputs must be reviewed and validated by a licensed healthcare professional
        before any clinical decisions are made. This is not a substitute for professional
        medical advice, diagnosis, or treatment.
    </div>
    """,
        unsafe_allow_html=True,
    )

    # Actions
    st.markdown("<br>", unsafe_allow_html=True)
    action_col1, action_col2, action_col3 = st.columns([1, 1, 1])

    with action_col2:
        if st.button("🔄 Start New Consultation", use_container_width=True):
            st.session_state.clear()
            st.rerun()
