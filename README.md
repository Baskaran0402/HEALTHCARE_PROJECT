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
    subgraph "Access Control Layer (ACL)"
        U_Pat["Patient Node"] --> ACL["Identity Lattice (JWT/OAuth2)"]
        U_Doc["Clinician Node"] --> ACL
        U_Inst["Institutional Admin"] --> ACL
    end

    subgraph "Orchestration Layer"
        ACL --> Cord["Neural Orchestrator"]
        Cord --> Cache["Memory Lattice"]
    end

    subgraph "Inference & Intelligence Layer"
        Cord --> ML_Nodes["Specialized ML Nodes (XGBoost/RF)"]
        Cord --> CV_Node["Computer Vision Node (EfficientNet-B0)"]
        Cord --> LLM_Synthesis["Generative Synthesis (Llama/Gemini)"]
    end

    subgraph "Persistence & Output"
        ML_Nodes & CV_Node & LLM_Synthesis --> Agg["Synthesis Engine"]
        Agg --> DB[("PostgreSQL Lattice Store")]
        Agg --> PDF["Clinical Transcript (SOAP)"]
        Agg --> Sock["Real-time Alerting (WebSocket)"]
    end

    style Cord fill:#4f46e5,color:#fff
    style Agg fill:#10b981,color:#fff
    style ACL fill:#0f172a,color:#fff
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

| Clinical Node      | Methodology            | Accuracy | Precision | Recall | F1-Score | AUC-ROC |
| :----------------- | :--------------------- | :------- | :-------- | :----- | :------- | :------ |
| **Brain Tumor**    | EfficientNet-B0 (T-L)  | **99.7%**| **0.99**  | **0.99**| **0.99**  | **1.00**|
| **Metabolic (Dia)**| XGBoost Stratified     | 89.1%    | 0.88      | 0.91   | 0.89     | 0.93    |
| **CVD (Heart)**    | Random Forest Ensemble | 87.3%    | 0.85      | 0.89   | 0.87     | 0.91    |
| **Cerebrovascular**| Gradient Boosting      | 85.7%    | 0.83      | 0.87   | 0.85     | 0.89    |
| **Renal (Kidney)** | Logistic Regression + | 86.5%    | 0.84      | 0.88   | 0.86     | 0.90    |
| **Hepatic (Liver)**| SVM Classifier         | 84.2%    | 0.81      | 0.86   | 0.83     | 0.87    |

> [!NOTE]
> **Bias & Generalization**: The Brain Tumor model has been validated for minimal generalization gap (-0.4%) and low-bias risk (0.01% class performance gap). See [Bias & Fit Analysis](docs/BIAS_AND_FIT_ANALYSIS_GUIDE.md) for full details.

---

## 🔬 Explainable AI (XAI) & Clinical Synthesis

AruviAI prioritizes transparency in automated assessments:

-   **SHAP Vectoring**: Local feature importance visualization for heart risk and metabolic predictions, allowing clinicians to see *why* a risk score was assigned.
-   **Structured SOAP Generation**: Automated mapping of ML output into the medical standard SOAP format, significantly reducing clinician administrative overhead.
-   **Guideline Lineage**: Synthesis transcripts reference established clinical protocols (e.g., ADA for Diabetes, AHA for Heart Disease).

---

## 🛠️ Technological Stack

| Functional Layer | Technologies |
| :--- | :--- |
| **Foundation** | Python 3.11, FastAPI, SQLAlchemy, PostgreSQL 16 |
| **Intelligence** | Scikit-learn, PyTorch, EfficientNet, SHAP |
| **Interface** | React 19, Vite, TailwindCSS, Framer Motion, Syne & Outfit Typography |
| **Orchestration** | Groq (Llama 3), Google Gemini Flash, WebSockets |

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
*Lead Architect & AI Researcher*

- **LinkedIn**: [Baskaran S](https://www.linkedin.com/in/baskaran0402)
- **GitHub**: [@Baskaran0402](https://github.com/Baskaran0402)
- **Email**: [baskarseenu2005@gmail.com](mailto:baskarseenu2005@gmail.com)

---

## 🤖 AI Personification: Kira A.I.

While **AruviAI** represents the underlying institutional lattice and diagnostic infrastructure, **Kira A.I.** is the personified conversational interface designed for empathetic patient-clinician interaction.

### Kira vs. The Platform Lattice

| Feature | **AruviAI (Product Lattice)** | **Kira A.I. (Interface Agent)** |
| :--- | :--- | :--- |
| **Logic Type** | Structured ML & Deep Learning | Generative LLM (Conversational) |
| **Primary Goal** | High-precision diagnostic stratification | Empathic Q&A & Appointment orchestration |
| **Output** | SOAP Transcripts, Risk Scores, PDFs | Natural language dialogue, Intent extraction |
| **User Role** | Institutional oversight & Clinical Review | Direct user engagement & First-touch triage |

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
