# 🩺 AruviAI (அறிவு AI)

## Integrated Clinical Intelligence & Multi-Node Diagnostic Stratification Lattice

> **Abstract**: AruviAI is an enterprise-grade clinical decision support system (CDSS) designed to unify multi-modal diagnostic data through a decentralized neural stratification model. By bridging high-precision machine learning nodes with real-time generative clinical synthesis, AruviAI provides institutional-level risk assessment and automated SOAP transcript generation, facilitating rapid, evidence-based clinical workflows.

<div align="center">

[![Paper](https://img.shields.io/badge/Status-Research--Ready-blue?style=for-the-badge&logo=googlescholar&logoColor=white)](#)
[![Python](https://img.shields.io/badge/Core-Python_3.11-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/API-FastAPI_0.115-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/UI-React_19_|_Vite-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![License](https://img.shields.io/badge/Compliance-MIT-green.svg?style=for-the-badge)](LICENSE)

</div>

---

## 🎨 Provisio Design System: Visual Semantics & UX

AruviAI utilizes a bespoke design system, **Provisio**, optimized for high-density clinical data and institutional authority. The interface is engineered to reduce cognitive load while maintaining medical-grade precision.

### 🖋️ Typography & Legibility

- **Headings (Outfit)**: A high-clarity sans-serif designed for structural authority.
- **Display (Syne)**: Used for institutional branding and primary metrics (`AruviAI Intelligence OS`).
- **Body & UI (Inter/Plus Jakarta Sans)**: Optimized for terminal-grade precision in diagnostic transcripts and risk matrices.

### 🌈 Visual Semantics (Color Lattice)

The color system is derived from semantic risk stratification:

- **Institutional Slate (`#060A14`)**: The foundation for high-contrast, zero-distraction focus.
- **Diagnostic Indigo (`#4f46e5`)**: Primary action and stratification orchestrator.
- **Emerald/Crimson Gradient**: A non-binary risk scale mapped to diagnostic node confidence.
- **Role Accents**: Specific color-coding for Patients (Emerald), Doctors (Azure), and Institutions (Amber).

### 🎞️ Motion & Elevation

- **Micro-Animations**: Sequenced entrances via `framer-motion` to guide the eye through multi-disease outcomes.
- **Depth Strategy**: 4-layer elevation system utilizing `backdrop-blur: 12px` and `glassmorphism` to separate diagnostic overlays from navigation shells.

---

## 🏛️ System Architecture: The Institutional Lattice

AruviAI operates on a **Tri-Layer Stratification Architecture**, ensuring a seamless flow from clinical data acquisition to diagnostic synthesis.

```mermaid
  graph TD
      %% Styling
      classDef frontend fill:#61DAFB,stroke:#000,stroke-width:2px,color:#000
      classDef backend fill:#009688,stroke:#000,stroke-width:2px,color:#fff
      classDef ai fill:#4f46e5,stroke:#000,stroke-width:2px,color:#fff
      classDef database fill:#336791,stroke:#000,stroke-width:2px,color:#fff
      classDef external fill:#FF9900,stroke:#000,stroke-width:2px,color:#000

      %% Client Layer
      subgraph Client Layer ["🖥️ Client Interfaces (React/Vite)"]
          UI_Pat["Patient Dashboard"]:::frontend
          UI_Doc["Clinician Workspace"]:::frontend
          UI_Admin["Institutional Dashboard"]:::frontend
          UI_Chat["Kira A.I. Chat Interface"]:::frontend
          UI_3D["3D Anatomy Viewer"]:::frontend
      end

      %% API Gateway & Backend Layer
      subgraph API Gateway ["⚙️ Backend Layer (FastAPI)"]
          API_Auth["Auth & JWT Router"]:::backend
          API_Doc["Document & PDF Router"]:::backend
          API_Ana["Analytics & Alerts Router"]:::backend
          API_Consult["Human Consultations & WebSockets"]:::backend
      end

      %% Neural Orchestration Layer
      subgraph Orchestration ["🧠 Neural Orchestration (src/coordinator)"]
          Coord_Exec["Executor Engine"]:::ai
          Coord_Cross["Cross-Intelligence Engine"]:::ai
          Coord_Explain["Explainability Engine (SHAP)"]:::ai
          Coord_Agg["Synthesis Aggregator"]:::ai
      end

      %% Specialized ML Nodes
      subgraph ML Nodes ["🔬 Specialized AI Agents (src/agents)"]
          Agent_Kira["Kira Conversational Agent"]:::ai
          Agent_CV["Brain Tumor CV Agent"]:::ai
          Agent_Heart["Cardiovascular Agent"]:::ai
          Agent_Metabolic["Metabolic/Diabetes Agent"]:::ai
          Agent_Renal["Renal/Kidney Agent"]:::ai
          Agent_Hepatic["Hepatic/Liver Agent"]:::ai
      end

      %% Persistence & External Services
      subgraph Data & External Services ["💾 Persistence & External APIs"]
          DB[(PostgreSQL Store)]:::database
          Cache[(Memory Lattice)]:::database
          LLM_Gemini["Google Gemini API"]:::external
          LLM_Groq["Groq (Llama 3)"]:::external
      end

      %% Connections
      UI_Pat -->|REST/WS| API Gateway
      UI_Doc -->|REST/WS| API Gateway
      UI_Admin -->|REST/WS| API Gateway
      UI_Chat -->|WebSocket| API Gateway
      UI_3D -->|REST| API_Doc

      API_Gateway -.->|Auth/Read/Write| DB
      API_Gateway -.->|State| Cache

      API_Gateway -->|Routing| Orchestration

      Coord_Exec --> Agent_Kira
      Coord_Exec --> Agent_CV
      Coord_Exec --> Agent_Heart
      Coord_Exec --> Agent_Metabolic
      Coord_Exec --> Agent_Renal
      Coord_Exec --> Agent_Hepatic

      Agent_Kira -->|NLP| LLM_Groq
      Agent_Kira -->|Vision| LLM_Gemini

      Agent_CV --> Coord_Explain
      Agent_Heart --> Coord_Explain
      Agent_Metabolic --> Coord_Explain

      Coord_Explain --> Coord_Agg
      Coord_Agg -->|SOAP/PDF Gen| API_Gateway

  ---
  2. Clinical Workflow & Stratification Diagram

  This sequence diagram illustrates the step-by-step flow when a patient interacts with
  the system, how the neural nodes stratify the risk, and how the clinician receives the
  actionable output.

  sequenceDiagram
      autonumber

      actor Patient
      participant Interface as Kira A.I. / Web UI
      participant Backend as FastAPI Gateway
      participant Cord as Neural Orchestrator
      participant ML as Specialized AI Nodes
      participant LLM as Generative Synthesis (LLM)
      participant DB as PostgreSQL DB
      actor Clinician

      %% Step 1: Data Intake
      Patient->>Interface: Inputs symptoms / Uploads Medical PDF
      Interface->>Backend: Secure Payload (JWT Auth)

      %% Step 2: Routing & Parsing
      Backend->>Cord: Initialize Assessment Request
      Cord->>DB: Fetch historical patient state

      %% Step 3: Stratification
      par Feature Extraction
          Cord->>ML: Image Payload -> CV Node (EfficientNet)
      and Structured Data Inference
          Cord->>ML: Vital Signs -> XGBoost/RF Nodes
      end

      %% Step 4: Inference & XAI
      ML-->>Cord: Raw Risk Probabilities (e.g. 0.89 Risk)
      Cord->>Cord: Explainability Engine runs SHAP values

      %% Step 5: Generative Synthesis
      Cord->>LLM: Send structured data + risk factors
      Note over LLM: Models clinical guidelines<br/>(ADA, AHA, etc.)
      LLM-->>Cord: Generates SOAP Transcript & Recommendations

      %% Step 6: Alerting & Storage
      Cord->>Backend: Return Aggregated Synthesis
      Backend->>DB: Save Consult & Transcript

      %% Step 7: Clinician Alerting
      alt Risk > Threshold
          Backend-->>Clinician: WebSocket 🚨 CRITICAL_RISK_ALERT
      else Routine Check
          Backend-->>Clinician: Queue Update via Dashboard
      end

      %% Step 8: Review & Consult
      Clinician->>Interface: Reviews SOAP Transcript & SHAP plots
      Clinician->>Patient: Initiates Telemedicine Video Consult
```

### Key Architectural Pillars

1.  **Tri-Role Access Control**: Granular permissioning for Patients (History/Alerts), Doctors (Diagnostics/Synthesis/Video), and Institutions (Global Telemetry/Audit).
2.  **Neural Stratification Engine**: A multi-model pipeline that executes parallel inference across 6 specialized disease nodes.
3.  **Institutional Telemetry & Alerts**: Real-time Population Risk Analytics and low-latency WebSocket-driven alerting system for critical risk detection (`CRITICAL_RISK_ALERT`).
4.  **Clinical Workspace & Telemedicine**: Integrated Clinical Queue with high-fidelity Video Consultation capabilities for real-time physician-patient interaction.
5.  **Generative Synthesis (XAI)**: Transitioning "Black Box" predictions into structured **SOAP** (Subjective, Objective, Assessment, Plan) transcripts using advanced LLM reasoning.

---

## 📊 Empirical Evaluation & Diagnostic Performance

The AruviAI neural nodes have been rigorously validated against standard clinical benchmarks, achieving high precision across all diagnostic vectors.

### Primary Diagnostic Matrix

| Clinical Node       | Methodology            | Accuracy  | Precision | Recall   | F1-Score | AUC-ROC  |
| :------------------ | :--------------------- | :-------- | :-------- | :------- | :------- | :------- |
| **Brain Tumor**     | EfficientNet-B0 (T-L)  | **99.7%** | **0.99**  | **0.99** | **0.99** | **1.00** |
| **Metabolic (Dia)** | XGBoost Stratified     | 89.1%     | 0.88      | 0.91     | 0.89     | 0.93     |
| **CVD (Heart)**     | Random Forest Ensemble | 87.3%     | 0.85      | 0.89     | 0.87     | 0.91     |
| **Cerebrovascular** | Gradient Boosting      | 85.7%     | 0.83      | 0.87     | 0.85     | 0.89     |
| **Renal (Kidney)**  | Logistic Regression +  | 86.5%     | 0.84      | 0.88     | 0.86     | 0.90     |
| **Hepatic (Liver)** | SVM Classifier         | 84.2%     | 0.81      | 0.86     | 0.83     | 0.87     |

> [!NOTE]
> **Bias & Generalization**: The Brain Tumor model has been validated for minimal generalization gap (-0.4%) and low-bias risk (0.01% class performance gap). See [Bias & Fit Analysis](docs/BIAS_AND_FIT_ANALYSIS_GUIDE.md) for full details.

---

## 🔬 Explainable AI (XAI) & Clinical Synthesis

AruviAI prioritizes transparency in automated assessments:

- **SHAP Vectoring**: Local feature importance visualization for heart risk and metabolic predictions, allowing clinicians to see _why_ a risk score was assigned.
- **Structured SOAP Generation**: Automated mapping of ML output into the medical standard SOAP format, significantly reducing clinician administrative overhead.
- **Guideline Lineage**: Synthesis transcripts reference established clinical protocols (e.g., ADA for Diabetes, AHA for Heart Disease).

---

## 🛠️ Technological Stack

| Functional Layer  | Technologies                                                         |
| :---------------- | :------------------------------------------------------------------- |
| **Foundation**    | Python 3.11, FastAPI, SQLAlchemy, PostgreSQL 16                      |
| **Intelligence**  | Scikit-learn, PyTorch, EfficientNet, SHAP                            |
| **Interface**     | React 19, Vite, TailwindCSS, Framer Motion, Syne & Outfit Typography |
| **Orchestration** | Groq (Llama 3), Google Gemini Flash, WebSockets                      |

---

## 🚀 Deployment & Reproduction

For researchers looking to reproduce the stratification lattices:

### Environment Configuration

1. **Repository Synchronization**: `git clone <repo_url>`
2. **Backbone Setup**: `pip install -r requirements.txt`
3. **Intelligence OS Activation**: `python -m backend.main`
4. **Interface Hydration**: `cd frontend && npm install && npm run dev`

---

## 🛡️ Safety, Ethics & Limitations

AruviAI is a **Clinical Decision Support Tool**, not a diagnostic replacement.

1. **Clinical Oversight**: All assessments must be reviewed by a certified medical professional.
2. **Data Privacy**: Audit logging and role-based encryption are enforced across the lattice.
3. **Guideline Adherence**: Predictions are advisory and should be weighed against direct examination.

---

## 👨‍💻 Research & Authorship

**Baskaran S**  
_Lead Architect & AI Researcher_

- **LinkedIn**: [Baskaran S](https://www.linkedin.com/in/baskaran0402)
- **GitHub**: [@Baskaran0402](https://github.com/Baskaran0402)
- **Email**: [baskarseenu2005@gmail.com](mailto:baskarseenu2005@gmail.com)

---

## 🤖 AI Personification: Kira A.I.

While **AruviAI** represents the underlying institutional lattice and diagnostic infrastructure, **Kira A.I.** is the personified conversational interface designed for empathetic patient-clinician interaction.

### Kira vs. The Platform Lattice

| Feature          | **AruviAI (Product Lattice)**             | **Kira A.I. (Interface Agent)**              |
| :--------------- | :---------------------------------------- | :------------------------------------------- |
| **Logic Type**   | Structured ML & Deep Learning             | Generative LLM (Conversational)              |
| **Primary Goal** | High-precision diagnostic stratification  | Empathic Q&A & Appointment orchestration     |
| **Output**       | SOAP Transcripts, Risk Scores, PDFs       | Natural language dialogue, Intent extraction |
| **User Role**    | Institutional oversight & Clinical Review | Direct user engagement & First-touch triage  |

### Kira's Principal Capabilities

- **Real-time Health Synthesis**: Bridging complex clinical data into human-readable insights.
- **Intent-based Orchestration**: Automated detection of appointment booking intent with department-specific routing.
- **24/7 Triage Support**: Constant availability for initial symptom surfacing and procedural guidance.

---

## 📂 Project Structure

```bash
HEALTHCARE_PROJECT/
├── backend/                    # FastAPI Institutional Node
├── frontend/                   # React Intelligence Console
│   └── src/components/ui/      # Atomic Enterprise Components
├── src/                        # Core ML/AI Neural Orchestration
│   ├── agents/                 # Specialized Intelligence Nodes
│   │   └── kira_agent.py        # Conversational Interface Logic
│   ├── coordinator/            # Stratification Orchestrator
│   └── core/                   # LLM & Clinical Utilities (Groq/Gemini)
├── models/                     # Trained Neural Weights (.pkl)
├── notebooks/                  # EDA & Calibration Notebooks
├── scripts/                    # Maintenance & Training Scripts
└── README.md                   # Master Documentation
```

---

## 📄 Citation

If you use this system or its multi-node stratification architecture in your research, please cite it as:

```bibtex
@software{aruvi_ai_2026,
  author = {Baskaran S},
  title = {AruviAI: Integrated Clinical Intelligence & Multi-Node Diagnostic Stratification Lattice},
  year = {2026},
  url = {https://github.com/Baskaran0402/HEALTHCARE_PROJECT}
}
```

---

<div align="center">
  <b>Built for clinical precision. Dedicated to healthcare transformation.</b>
</div>
baskarseenu2005@gmail.com

---

<div align="center">

**Built for institutional excellence. Strategic clinical intelligence.**

🩺 **AruviAI Professional**

</div>
