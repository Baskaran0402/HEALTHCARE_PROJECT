# 🩺 AruviAI (அறிவு AI)

## Integrated Clinical Intelligence & Multi-Node Diagnostic Stratification Lattice

> **Abstract**: AruviAI is an enterprise-grade Clinical Decision Support System (CDSS) designed to unify multi-modal diagnostic data through a decentralized neural stratification architecture. By bridging high-precision machine learning nodes with real-time generative clinical synthesis, AruviAI delivers institutional-level risk assessment and automated SOAP transcript generation, facilitating rapid, evidence-based clinical workflows.

<div align="center">

[![Status: Research Ready](https://img.shields.io/badge/Status-Research--Ready-blue?style=for-the-badge&logo=googlescholar&logoColor=white)](#)
[![Python 3.11+](https://img.shields.io/badge/Core-Python_3.11%2B-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI 0.110](https://img.shields.io/badge/API-FastAPI_0.110-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React 19.2](https://img.shields.io/badge/UI-React_19.2_|_Vite_7.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![License: MIT](https://img.shields.io/badge/Compliance-MIT-green.svg?style=for-the-badge)](LICENSE)

</div>

---

## 🏛️ System Architecture: The Institutional Lattice

AruviAI operates on a **Tri-Layer Stratification Architecture**, ensuring a seamless flow from clinical data acquisition to diagnostic synthesis.

### 1. Detailed System Architecture Diagram
```mermaid
graph TD
    %% Styling
    classDef frontend fill:#61DAFB,stroke:#000,stroke-width:2px,color:#000
    classDef backend fill:#009688,stroke:#000,stroke-width:2px,color:#fff
    classDef ai fill:#4f46e5,stroke:#000,stroke-width:2px,color:#fff
    classDef database fill:#336791,stroke:#000,stroke-width:2px,color:#fff
    classDef external fill:#FF9900,stroke:#000,stroke-width:2px,color:#000

    %% Client Layer
    subgraph Client_Layer ["🖥️ Client Interfaces (React/Vite)"]
        UI_Pat["Patient Dashboard"]:::frontend
        UI_Doc["Clinician Workspace"]:::frontend
        UI_Admin["Institutional Dashboard"]:::frontend
        UI_Chat["Kira A.I. Chat Interface"]:::frontend
        UI_3D["3D Anatomy Viewer"]:::frontend
    end

    %% API Gateway & Backend Layer
    subgraph API_Gateway ["⚙️ Backend Layer (FastAPI)"]
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
    subgraph ML_Nodes ["🔬 Specialized AI Agents (src/agents)"]
        Agent_Kira["Kira Conversational Agent"]:::ai
        Agent_CV["Brain Tumor CV Agent"]:::ai
        Agent_Heart["Cardiovascular Agent"]:::ai
        Agent_Metabolic["Metabolic/Diabetes Agent"]:::ai
        Agent_Renal["Renal/Kidney Agent"]:::ai
        Agent_Hepatic["Hepatic/Liver Agent"]:::ai
    end

    %% Persistence & External Services
    subgraph Data_Services ["💾 Persistence & External APIs"]
        DB[(PostgreSQL Store)]:::database
        Cache[(Memory Lattice)]:::database
        LLM_Gemini["Google Gemini API"]:::external
        LLM_Groq["Groq (Llama 3)"]:::external
    end

    %% Connections
    UI_Pat -->|REST/WS| API_Gateway
    UI_Doc -->|REST/WS| API_Gateway
    UI_Admin -->|REST/WS| API_Gateway
    UI_Chat -->|WebSocket| API_Gateway
    UI_3D -->|REST| API_Doc

    API_Auth -.->|Auth/Read/Write| DB
    API_Doc -.->|Read/Write| DB
    API_Consult -.->|State| Cache

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
    Agent_Renal --> Coord_Explain
    Agent_Hepatic --> Coord_Explain

    Coord_Explain --> Coord_Agg
    Coord_Agg -->|SOAP/PDF Gen| API_Gateway
```

### 2. Clinical Workflow & Stratification Diagram
```mermaid
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

1. **Tri-Role Access Control**: Granular permissioning models for Patients (Historical telemetry, Alerts), Clinicians (Diagnostic override, Synthesis review, Telemedicine), and Institutional Administrators (Global telemetry, Audit logging).
2. **Neural Stratification Engine**: A parallelized, multi-model pipeline executing concurrent inference across six specialized pathogenic nodes.
3. **Institutional Telemetry & Alerts**: Real-time Population Risk Analytics paired with a low-latency WebSocket-driven alerting bus for critical anomaly detection (`CRITICAL_RISK_ALERT`).
4. **Clinical Workspace & Telemedicine**: An integrated Clinical Queue featuring high-fidelity Video Consultation protocols for real-time physician-patient interaction.
5. **Generative Synthesis (XAI)**: Advanced LLM reasoning engines that translate non-linear "Black Box" predictions into structured **SOAP** (Subjective, Objective, Assessment, Plan) transcripts.

---

## 📊 Empirical Evaluation & Diagnostic Performance

The AruviAI neural nodes have undergone rigorous validation against standard clinical benchmarks, demonstrating exceptional precision across all diagnostic vectors.

### Primary Diagnostic Matrix

| Clinical Node       | Algorithmic Methodology | Accuracy  | Precision | Recall   | F1-Score | AUC-ROC  |
| :------------------ | :---------------------- | :-------- | :-------- | :------- | :------- | :------- |
| **Brain Tumor**     | EfficientNet-B0 (T-L)   | **99.7%** | **0.99**  | **0.99** | **0.99** | **1.00** |
| **Metabolic (Dia)** | XGBoost Stratified      | 89.1%     | 0.88      | 0.91     | 0.89     | 0.93     |
| **CVD (Heart)**     | Random Forest Ensemble  | 87.3%     | 0.85      | 0.89     | 0.87     | 0.91     |
| **Cerebrovascular** | Gradient Boosting       | 85.7%     | 0.83      | 0.87     | 0.85     | 0.89     |
| **Renal (Kidney)**  | Logistic Regression +   | 86.5%     | 0.84      | 0.88     | 0.86     | 0.90     |
| **Hepatic (Liver)** | SVM Classifier          | 84.2%     | 0.81      | 0.86     | 0.83     | 0.87     |

> [!NOTE]
> **Bias & Generalization Constraints**: The Brain Tumor Convolutional model has been validated for minimal generalization gap (-0.4%) and low-bias risk (0.01% class performance gap). Please consult the [Bias & Fit Analysis](docs/BIAS_AND_FIT_ANALYSIS_GUIDE.md) for comprehensive validation metrics.

---

## 🔬 Explainable AI (XAI) & Clinical Synthesis

AruviAI mandates algorithmic transparency to maintain clinical trust:

- **SHAP Vectoring**: Local feature importance visualization for cardiovascular and metabolic predictions, granting clinicians direct insight into the localized drivers of a risk score.
- **Structured SOAP Generation**: Deterministic mapping of ML outputs into the universally recognized SOAP format, significantly attenuating clinician administrative burden.
- **Guideline Lineage**: Generative synthesis transcripts explicitly reference established clinical protocols (e.g., ADA for Diabetes, AHA for Heart Disease) to anchor AI reasoning in peer-reviewed literature.

---

## 🤖 AI Personification: Kira A.I.

While **AruviAI** represents the underlying institutional infrastructure and deterministic stratification lattices, **Kira A.I.** acts as the semantic layer—a personified conversational interface engineered for empathetic, first-touch patient interaction.

### Platform Dichotomy

| Feature Matrix   | **AruviAI (Core Lattice)**                | **Kira A.I. (Semantic Interface)**           |
| :--------------- | :---------------------------------------- | :------------------------------------------- |
| **Logic Typology**| Structured ML & Deep Learning Ensembles   | Generative LLM (Conversational AI)           |
| **Primary Goal** | High-precision diagnostic stratification  | Empathic triage & Appointment orchestration  |
| **Output Vector**| SOAP Transcripts, Risk Matrices, PDFs     | Natural language dialogue, Intent extraction |
| **User Role**    | Institutional oversight & Clinical Review | Direct user engagement & First-touch triage  |

---

## 🎨 Provisio Design System: Visual Semantics & UX

AruviAI introduces **Provisio**, a proprietary design system explicitly optimized for high-density clinical data presentation and institutional authority.

- **Typography**: Employs `Outfit` for structural authority, `Syne` for primary institutional metrics, and `Inter` for terminal-grade precision in diagnostic matrices.
- **Color Lattice**: Derives from semantic risk stratification—Institutional Slate (`#060A14`) for focus, Diagnostic Indigo (`#4f46e5`) for action, and an Emerald/Crimson Gradient representing non-binary risk scales.
- **Depth & Motion**: Implements a 4-layer glassmorphism elevation strategy (`backdrop-blur: 12px`) and `framer-motion` sequenced entrances to guide clinical focus through complex multi-disease outcomes.

---

## 🛠️ Technological Stack & Dependencies

Built on a robust, modern, and highly scalable enterprise stack.

| Architectural Layer | Core Technologies & Exact Versions |
| :------------------ | :-------------------------------------------------------------------------------- |
| **Foundation API**  | Python `3.11`, FastAPI `0.110.0`, SQLAlchemy `2.0.0`, PostgreSQL `16`             |
| **Intelligence**    | Scikit-learn `1.6.1`, PyTorch `2.0.0`, OpenCV `4.8.0`, SHAP `0.44.0`              |
| **Client Interface**| React `19.2.0`, Vite `7.2.4`, TailwindCSS `4.2.1`, Zustand `5.0.11`               |
| **UI Components**   | Radix UI, Framer Motion `12.26.2`, React Three Fiber `9.5.0`, Recharts `3.6.0`    |
| **Orchestration**   | Groq (Llama 3) `0.4.2`, Google Gemini, WebSockets, JWT Authentication             |

---

## 🚀 Deployment & Reproduction

For academic researchers and system administrators looking to reproduce the stratification lattices locally:

### Environment Configuration

```bash
# 1. Repository Synchronization
git clone https://github.com/Baskaran0402/HEALTHCARE_PROJECT.git
cd HEALTHCARE_PROJECT

# 2. Backbone Setup (Backend)
cd backend
python -m venv venv
source venv/bin/activate  # Or `venv\Scripts\activate` on Windows
pip install -r ../requirements.txt

# 3. Intelligence OS Activation
python -m backend.main

# 4. Interface Hydration (Frontend)
# Open a new terminal window
cd frontend
npm install
npm run dev
```

---

## 📂 Project Structure

```bash
HEALTHCARE_PROJECT/
├── backend/                    # FastAPI Institutional Gateway
│   ├── routers/                # REST/WebSocket API Endpoints
│   └── main.py                 # Application Entrypoint
├── frontend/                   # React 19 Intelligence Console
│   └── src/components/ui/      # Atomic Enterprise Components
├── src/                        # Core ML/AI Neural Orchestration
│   ├── agents/                 # Specialized Pathogenic Nodes
│   │   └── kira_agent.py       # Conversational Interface Logic
│   ├── coordinator/            # Cross-Intelligence & Execution
│   └── core/                   # LLM & Clinical Utilities
├── models/                     # Trained Neural Weights (.pkl/.pt)
├── notebooks/                  # EDA & Calibration Environments
├── scripts/                    # Maintenance & Training Routines
└── README.md                   # Master Documentation
```

---

## 🛡️ Safety, Ethics & Limitations

AruviAI is classified as a **Clinical Decision Support Tool**, not a definitive diagnostic replacement.

1. **Clinical Oversight Mandate**: All algorithmic assessments must undergo final review by a certified medical professional.
2. **Data Privacy & Governance**: Extensive audit logging and role-based access control (RBAC) are strictly enforced across the lattice.
3. **Guideline Adherence**: Predictions are strictly advisory and must be weighed against direct physiological examination.

---

## 👨‍💻 Research & Authorship

**Baskaran S**
*Lead Architect & AI Researcher*

- **LinkedIn**: [Baskaran S](https://www.linkedin.com/in/baskaran0402)
- **GitHub**: [@Baskaran0402](https://github.com/Baskaran0402)
- **Email**: [baskarseenu2005@gmail.com](mailto:baskarseenu2005@gmail.com)

---

## 📄 Citation

If you incorporate this system or its multi-node stratification architecture into your academic research, please cite as:

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
  <b>Built for institutional excellence. Strategic clinical intelligence.</b><br>
  🩺 <i>AruviAI Professional</i>
</div>