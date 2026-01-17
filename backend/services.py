from sqlalchemy.orm import Session
from backend import models, schemas, crud
from src.coordinator.patient_state import PatientState
from src.coordinator.executor import run_selected_agents
from src.core.llm_client import GeminiClient
from src.agents.doctor_agent import DoctorAgent


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
            
            if request.patient_data.medical_record_number and patient.medical_record_number != request.patient_data.medical_record_number:
                 patient.medical_record_number = request.patient_data.medical_record_number
                 should_update = True
                 
            if should_update:
                self.db.commit()
                self.db.refresh(patient)

        # 2. Create medical record
        medical_record_data = schemas.MedicalRecordCreate(
            patient_id=patient.id,
            **request.medical_data.model_dump()
        )
        medical_record = crud.create_medical_record(self.db, medical_record_data)

        # 3. Create consultation
        consultation_data = schemas.ConsultationCreate(
            patient_id=patient.id,
            role=request.role
        )
        consultation = crud.create_consultation(self.db, consultation_data)

        # Update consultation with conversation history
        if request.conversation_history:
            crud.update_consultation(
                self.db,
                consultation.id,
                schemas.ConsultationUpdate(
                    conversation_history=request.conversation_history,
                    stage="medical_form"
                )
            )

        # 4. Convert to PatientState for ML pipeline
        patient_state = self._convert_to_patient_state(request)

        # 5. Run ML risk assessment
        ml_report = run_selected_agents(patient_state)

        # 6. Generate comprehensive reports with enhanced explainability
        from src.agents.enhanced_report_generator import (
            generate_comprehensive_patient_report,
            generate_comprehensive_doctor_report
        )
        
        patient_name = request.patient_data.name
        
        try:
            # Generate patient-friendly report
            patient_report = generate_comprehensive_patient_report(
                ml_report=ml_report,
                patient_name=patient_name
            )
            
            # Generate doctor-facing clinical report
            doctor_report = generate_comprehensive_doctor_report(
                ml_report=ml_report,
                patient_name=patient_name
            )
        except Exception as e:
            # Fallback if LLM fails (prevent crash)
            print(f"Error generating LLM reports: {e}")
            patient_report = "Report generation currently unavailable. Please review the numerical risk scores above."
            doctor_report = "Clinical report generation unavailable. Risk stratification scores are valid."

        llm_reports = {
            "patient_report": patient_report,
            "doctor_report": doctor_report
        }

        # Generate SOAP note (keep existing logic)
        conversation_summary = ""
        if request.conversation_history:
            conversation_summary = self.doctor_agent.summarize_case(
                request.conversation_history
            )
        
        soap_json = self.doctor_agent.generate_soap_json(
            ml_report=ml_report,
            conversation_summary=conversation_summary
        )

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
            conversation_summary=conversation_summary
        )
        assessment = crud.create_health_assessment(self.db, assessment_data)

        # 8. Mark consultation as completed
        crud.update_consultation(
            self.db,
            consultation.id,
            schemas.ConsultationUpdate(stage="report")
        )

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
                    "overall_risk_level": assessment.overall_risk_level
                }
            )
        )

        # 10. Refresh and return
        self.db.refresh(patient)
        self.db.refresh(medical_record)
        self.db.refresh(consultation)
        self.db.refresh(assessment)

        return schemas.AnalyzeHealthResponse(
            patient=patient,
            medical_record=medical_record,
            consultation=consultation,
            assessment=assessment
        )

    def _convert_to_patient_state(self, request: schemas.AnalyzeHealthRequest) -> PatientState:
        """Convert API request to PatientState for ML pipeline"""
        patient_state = PatientState()

        # Demographics
        patient_state.age = request.patient_data.age
        patient_state.gender = 1 if request.patient_data.gender == "Male" else 0

        # Vitals
        patient_state.bmi = request.medical_data.bmi
        patient_state.blood_pressure = request.medical_data.blood_pressure

        # Labs
        patient_state.blood_glucose = request.medical_data.blood_glucose
        patient_state.hba1c = request.medical_data.hba1c
        patient_state.cholesterol = request.medical_data.cholesterol
        patient_state.creatinine = request.medical_data.creatinine
        patient_state.urea = request.medical_data.urea
        patient_state.bilirubin_total = request.medical_data.bilirubin_total
        patient_state.alt = request.medical_data.alt
        patient_state.ast = request.medical_data.ast

        # Medical History
        patient_state.hypertension = int(request.medical_data.hypertension)
        patient_state.diabetes = int(request.medical_data.diabetes)
        patient_state.heart_disease = int(request.medical_data.heart_disease)

        # Lifestyle
        patient_state.smoking_raw = request.medical_data.smoking_status

        # Symptoms
        patient_state.chest_pain = request.medical_data.chest_pain
        patient_state.breathlessness = request.medical_data.breathlessness
        patient_state.fatigue = request.medical_data.fatigue
        patient_state.edema = request.medical_data.edema

        return patient_state
