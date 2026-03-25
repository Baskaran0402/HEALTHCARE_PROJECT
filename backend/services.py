from datetime import datetime

from sqlalchemy.orm import Session

from backend import crud, schemas
from backend.risk_calculators import calculate_framingham_risk
from src.agents.doctor_agent import DoctorAgent
from src.coordinator.executor import run_selected_agents
from src.coordinator.patient_state import PatientState
from src.core.llm_client import GeminiClient


class HealthAnalysisService:
    """
    Service layer for complete health analysis workflow.
    Integrates FastAPI backend with existing ML pipeline.
    """

    def __init__(self, db: Session):
        self.db = db
        self.llm = GeminiClient()
        self.doctor_agent = DoctorAgent(self.llm)

    async def analyze_health(self, request: schemas.AnalyzeHealthRequest) -> schemas.AnalyzeHealthResponse:
        """
        Complete health analysis workflow:
        1. Create/get patient
        2. Store medical record
        3. Create consultation
        4. Run ML risk assessment
        5. Generate LLM reports
        6. Store assessment
        7. Return complete results
        """

        # 1. Create or Get patient
        patient = None
        if request.patient_data.email:
            patient = crud.get_patient_by_email(self.db, request.patient_data.email)

        if not patient:
            patient = crud.create_patient(self.db, request.patient_data)
        else:
            # Update patient name/mrn if provided and currently missing or different
            should_update = False
            if request.patient_data.name and patient.name != request.patient_data.name:
                patient.name = request.patient_data.name
                should_update = True

            if (
                request.patient_data.medical_record_number
                and patient.medical_record_number != request.patient_data.medical_record_number
            ):
                patient.medical_record_number = request.patient_data.medical_record_number
                should_update = True

            if should_update:
                self.db.commit()
                self.db.refresh(patient)

        # 2. Create medical record
        medical_record_data = schemas.MedicalRecordCreate(patient_id=patient.id, **request.medical_data.model_dump())
        medical_record = crud.create_medical_record(self.db, medical_record_data)

        # 3. Create consultation
        consultation_data = schemas.ConsultationCreate(patient_id=patient.id, role=request.role)
        consultation = crud.create_consultation(self.db, consultation_data)

        # Update consultation with conversation history
        if request.conversation_history:
            crud.update_consultation(
                self.db,
                consultation.id,
                schemas.ConsultationUpdate(
                    conversation_history=request.conversation_history,
                    stage="medical_form",
                ),
            )

        # 4. Convert to PatientState for ML pipeline
        patient_state = self._convert_to_patient_state(request)

        # 5. Run ML risk assessment
        ml_report = run_selected_agents(patient_state)

        # 5.1 Calculate Clinical Benchmarks (Framingham)
        framingham_result = calculate_framingham_risk(
            gender=request.patient_data.gender,
            age=request.patient_data.age,
            total_cholesterol=request.medical_data.cholesterol or 200,
            hdl_cholesterol=request.medical_data.hdl_cholesterol or 50,
            systolic_bp=request.medical_data.blood_pressure or 120,
            smoker=request.medical_data.smoking_status == "current",
            diabetes=request.medical_data.diabetes,
            on_hypertension_treatment=request.medical_data.hypertension,  # Proxy using diagnosis
        )

        # Add to ml_report for LLM context
        ml_report["clinical_benchmarks"] = {"framingham_risk_score": framingham_result}

        # Add to individual risks for frontend display
        ml_report["individual_risks"].append(
            {
                "disease": "Framingham CHD Risk",
                "risk_score": framingham_result["score"],
                "risk_level": framingham_result["risk_category"],
                "why": [f"10-Year Heart Disease Risk Estimate: {framingham_result['risk_percent']}"],
                "clinical_impression": (
                    f"Patient has a {framingham_result['risk_category']} 10-year risk of Coronary Heart Disease"
                    f" based on Framingham Point Score ({framingham_result['score']})."
                ),
                "guidelines": [
                    (
                        "Initiate lifestyle modifications"
                        if framingham_result["risk_category"] != "Low"
                        else "Maintain healthy lifestyle"
                    )
                ],
            }
        )

        # 6. Generate comprehensive reports with enhanced explainability
        from src.agents.enhanced_report_generator import (
            generate_comprehensive_doctor_report,
            generate_comprehensive_patient_report,
        )

        patient_name = request.patient_data.name

        try:
            # Generate patient-friendly report
            patient_report = generate_comprehensive_patient_report(ml_report=ml_report, patient_name=patient_name)

            # Generate doctor-facing clinical report
            doctor_report = generate_comprehensive_doctor_report(ml_report=ml_report, patient_name=patient_name)
        except Exception as e:
            # Fallback if LLM fails (prevent crash)
            print(f"Error generating LLM reports: {e}")
            patient_report = "Report generation currently unavailable. Please review the numerical risk scores above."
            doctor_report = "Clinical report generation unavailable. Risk stratification scores are valid."

        llm_reports = {"patient_report": patient_report, "doctor_report": doctor_report}

        # Generate SOAP note (keep existing logic)
        conversation_summary = ""
        if request.conversation_history:
            conversation_summary = self.doctor_agent.summarize_case(request.conversation_history)

        soap_json = self.doctor_agent.generate_soap_json(ml_report=ml_report, conversation_summary=conversation_summary)

        # New: Generate Medical Billing Codes
        billing_codes = self.doctor_agent.generate_medical_codes(ml_report=ml_report)

        # 7. Create health assessment
        assessment_data = schemas.HealthAssessmentCreate(
            consultation_id=consultation.id,
            overall_risk_score=ml_report["overall_risk"]["score"],
            overall_risk_level=ml_report["overall_risk"]["level"],
            primary_concerns=ml_report["overall_risk"]["primary_concerns"],
            individual_risks=ml_report["individual_risks"],
            patient_report=llm_reports.get("patient_report"),
            doctor_report=llm_reports.get("doctor_report"),
            soap_json=soap_json,
            conversation_summary=conversation_summary,
            cross_intelligence_insights=ml_report.get("cross_intelligence_insights", []),
            billing_codes=billing_codes,
        )
        assessment = crud.create_health_assessment(self.db, assessment_data)

        # 8. Mark consultation as completed
        crud.update_consultation(self.db, consultation.id, schemas.ConsultationUpdate(stage="report"))

        # 9. Create audit log
        crud.create_audit_log(
            self.db,
            schemas.AuditLogCreate(
                event_type="health_analysis_completed",
                entity_type="assessment",
                entity_id=assessment.id,
                user_role=request.role,
                event_data={
                    "patient_id": patient.id,
                    "consultation_id": consultation.id,
                    "overall_risk_level": assessment.overall_risk_level,
                },
            ),
        )

        # 10. REAL-TIME ALERT: Broadcast "Critical Risk" to Doctor/Admin Nodes
        if assessment.overall_risk_level in ["Critical", "High"]:
            import json

            from backend.websocket_manager import manager

            alert_payload = {
                "type": "CRITICAL_RISK_ALERT",
                "patient_name": patient.name,
                "risk_level": assessment.overall_risk_level,
                "score": assessment.overall_risk_score,
                "concerns": assessment.primary_concerns,
                "timestamp": datetime.utcnow().isoformat(),
                "assessment_id": assessment.id,
                "patient_id": patient.id,
            }

            # Broadcast to a global alerts room for staff
            import asyncio

            asyncio.create_task(manager.broadcast(json.dumps(alert_payload), "institutional_alerts"))

        # 10. Refresh and return
        self.db.refresh(patient)
        self.db.refresh(medical_record)
        self.db.refresh(consultation)
        self.db.refresh(assessment)

        return schemas.AnalyzeHealthResponse(
            patient=patient,
            medical_record=medical_record,
            consultation=consultation,
            assessment=assessment,
        )

    def _convert_to_patient_state(self, request: schemas.AnalyzeHealthRequest) -> PatientState:
        """
        Convert API request to PatientState for ML pipeline.
        Applies safe fallback defaults ONLY for the ML model's requirement if values are missing,
        ensuring the diagnostic pipeline continues functioning even with sparse data.
        """
        patient_state = PatientState()

        # Demographics
        patient_state.age = request.patient_data.age
        patient_state.gender = 1 if request.patient_data.gender == "Male" else 0

        # Vitals (Safe fallback defaults for ML agents)
        patient_state.bmi = request.medical_data.bmi or 22.5
        patient_state.blood_pressure = request.medical_data.blood_pressure or 120

        # Labs (Safe fallback defaults for ML agents)
        patient_state.blood_glucose = request.medical_data.blood_glucose or 100.0
        patient_state.hba1c = request.medical_data.hba1c or 5.4
        patient_state.cholesterol = request.medical_data.cholesterol or 190.0
        patient_state.creatinine = request.medical_data.creatinine or 1.0
        patient_state.urea = request.medical_data.urea or 30.0
        patient_state.bilirubin_total = request.medical_data.bilirubin_total or 0.8
        patient_state.alt = request.medical_data.alt or 25.0
        patient_state.ast = request.medical_data.ast or 25.0

        # Medical History (Default to False/0 if missing)
        patient_state.hypertension = (
            int(request.medical_data.hypertension) if request.medical_data.hypertension is not None else 0
        )
        patient_state.diabetes = int(request.medical_data.diabetes) if request.medical_data.diabetes is not None else 0
        patient_state.heart_disease = (
            int(request.medical_data.heart_disease) if request.medical_data.heart_disease is not None else 0
        )

        # Lifestyle
        patient_state.smoking_raw = request.medical_data.smoking_status or "never"

        # Symptoms
        patient_state.chest_pain = request.medical_data.chest_pain
        patient_state.breathlessness = request.medical_data.breathlessness
        patient_state.fatigue = request.medical_data.fatigue
        patient_state.edema = request.medical_data.edema

        # Imaging
        patient_state.mri_image_path = request.medical_data.mri_image_path

        return patient_state
