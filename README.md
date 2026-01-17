🩺 AI Doctor – Multi-Agent Healthcare Decision Support System
A conversational, multi-agent AI healthcare assistant that combines machine learning disease risk models with an LLM-powered Doctor Agent to provide explainable, guideline-aware clinical decision support.

⚠️ Important Disclaimer
This system does NOT perform diagnosis or treatment.
All outputs are advisory only and must be reviewed by a licensed healthcare professional.

🚀 Overview
This project simulates a real-world clinical workflow:

A doctor conducts a polite, adaptive conversation

Patient data is collected in a structured medical form

Multiple ML models assess health risks

An LLM doctor agent generates:

Patient-friendly explanations

Doctor-facing clinical notes (SOAP)

EMR-ready SOAP JSON

Results are explainable, safe, and guideline-aware

This is designed as a clinical decision support system (CDSS) — not a diagnostic engine.

🧠 Key Features
🤖 LLM Doctor Agent
Human-like medical conversation

Confidence-based questioning (stops automatically)

Nurse-style case summarization

Safety-first prompting (no diagnosis, no prescriptions)

🩺 Multi-Disease Risk Prediction
ML models for:

Diabetes

Heart Disease

Stroke

Kidney Disease

Liver Disease

Each model outputs:

Risk score (%)

Risk level (Low / Moderate / Critical)

🔍 Explainability & Guidelines
Why a risk was flagged

Guideline-based clinical considerations

Drug–disease interaction warnings

Transparent reasoning (no black box)

🧑‍⚕️ Dual Reports
Patient Report (simple, reassuring language)

Doctor Report (SOAP format, clinical tone)

📄 SOAP → JSON (EMR-Ready)
Strict JSON output

Structured for EHR / EMR integration

No markdown, no hallucinated fields

🏗️ System Architecture 🔁 High-Level Flow

User
│
▼
Streamlit UI
│
▼
Doctor Agent (LLM)
│ ├─ Conversational questioning
│ ├─ Confidence-based stopping
│ └─ Case summarization
│
▼
Patient State (Normalized)
│
▼
Coordinator / Orchestrator
│
├─ Disease ML Agents
│ ├─ Diabetes Agent
│ ├─ Heart Agent
│ ├─ Stroke Agent
│ ├─ Kidney Agent
│ └─ Liver Agent
│
├─ Explainability Engine
├─ Guideline Engine
├─ Rule Engine
└─ Interaction Engine
│
▼
Aggregated Risk Report
│
▼
Doctor Agent (LLM)
│ ├─ Patient Report
│ ├─ Doctor SOAP Note
│ └─ SOAP JSON
│
▼
Final UI Output

📂 Project Structure

HEALTHCARE_PROJECT/
│
├── streamlit_app.py # Main Streamlit application
│
├── src/
│ ├── agents/ # Disease & Doctor agents
│ │ ├── doctor_agent.py
│ │ ├── diabetes_agent.py
│ │ ├── heart_agent.py
│ │ ├── stroke_agent.py
│ │ ├── kidney_agent.py
│ │ └── liver_agent.py
│ │
│ ├── coordinator/ # Orchestration & reasoning
│ │ ├── executor.py
│ │ ├── aggregator.py
│ │ ├── explainability_engine.py
│ │ ├── guideline_engine.py
│ │ ├── rule_engine.py
│ │ └── patient_state.py
│ │
│ ├── core/ # Core utilities
│ │ ├── llm_client.py
│ │ ├── patient_schema.py
│ │ └── clinical_normalizer.py
│ │
│ └── models/ # Model loading
│ └── model_loader.py
│
├── models/ # Trained ML models (.pkl)
├── notebooks/ # Archived experiments
├── data/ # Raw datasets
└── README.md

🛠️ Tech Stack
Language: Python 3.11

Frontend: Streamlit

ML: Scikit-learn

LLM: Google Gemini API

Speech Input: SpeechRecognition

Architecture: Agent-based, modular

🧪 Safety & Ethics
This project follows medical AI safety principles:

❌ No diagnosis

❌ No prescriptions

❌ No dosage recommendations

✅ Explainability

✅ Human-in-the-loop design

✅ Explicit disclaimers

📌 Intended Use
✔ Educational
✔ Research
✔ Portfolio / Interview
✔ Clinical AI prototyping

❌ Not for autonomous medical decision-making

🏁 Final Note
This project demonstrates:

Real-world ML + LLM integration

Agent-based system design

Healthcare AI safety awareness

Production-ready code structure

Built to showcase engineering depth — not just predictions.

## 🏗️ Backend Architecture

This project now includes a **FastAPI + PostgreSQL** backend for production-ready deployment:

### Database Schema

- **patients** - Patient demographics and contact info
- **consultations** - Consultation sessions with conversation history
- **medical_records** - Patient vitals, labs, and medical history
- **health_assessments** - ML risk assessments and LLM reports
- **audit_logs** - System event tracking and compliance

### API Features

- ✅ RESTful API with automatic OpenAPI documentation
- ✅ PostgreSQL database with SQLAlchemy ORM
- ✅ Complete CRUD operations for all entities
- ✅ All-in-one `/api/analyze` endpoint for health analysis
- ✅ Audit logging for compliance
- ✅ Request validation with Pydantic schemas

### Quick Start

#### 1. Backend Server

```bash
# In the project root (HEALTHCARE_PROJECT)
pip install -r requirements.txt
python -m backend.main
```

**Expected**: Server running on `http://localhost:8000`

#### 2. Frontend Application

```bash
# Navigate to frontend directory
cd frontend
# Install dependencies (first time only)
npm install
# Run development server
npm run dev
```

**Expected**: Application running on `http://localhost:5173`

For detailed backend documentation, see **[Backend Guide](BACKEND_GUIDE.md)**.

## 🛠️ Getting Started

For detailed installation and execution instructions, please refer to the **[Setup Guide](SETUP.md)**.
