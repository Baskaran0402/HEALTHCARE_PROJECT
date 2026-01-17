import warnings

from sklearn.exceptions import DataConversionWarning

from src.coordinator.aggregator import aggregate_risks
from src.coordinator.executor import run_selected_agents
from src.coordinator.explainer import explain_results
from src.coordinator.patient_state import PatientState

warnings.filterwarnings("ignore", category=UserWarning, message="X does not have valid feature names")

warnings.filterwarnings("ignore", category=DataConversionWarning)


def main():
    # 1️⃣ Build patient state (this simulates patient input)
    patient = PatientState()

    # ---- DEMO DATA (you can later replace this with user input / UI) ----
    patient.age = 58
    patient.gender = 1
    patient.bmi = 31.5
    patient.blood_pressure = 150

    patient.blood_glucose = 210
    patient.hba1c = 7.8
    patient.cholesterol = 240

    patient.creatinine = 2.1
    patient.urea = 55

    patient.bilirubin_total = 3.0
    patient.alt = 85
    patient.ast = 90

    patient.hypertension = 1
    patient.diabetes = 1
    patient.heart_disease = 0

    patient.smoking = 1

    patient.chest_pain = True
    patient.breathlessness = True
    patient.fatigue = True
    patient.edema = True
    # --------------------------------------------------------------------

    # 2️⃣ Run disease-specific agents
    agent_results = run_selected_agents(patient)

    # 3️⃣ Aggregate overall health risk
    overall_summary = aggregate_risks(agent_results)

    # 4️⃣ Generate doctor-style explanation
    explanation = explain_results(patient=patient, agent_results=agent_results, overall_summary=overall_summary)

    # 5️⃣ Final output
    print("\n===== AI DOCTOR REPORT =====\n")

    print("Individual Risk Assessments:")
    for result in agent_results.get("individual_risks", []):
        print(f"- {result['disease']}: " f"{result['risk_score']}% ({result['risk_level']})")

    print("\nOverall Health Risk:")
    print(f"- Score: {overall_summary['overall_risk_score']}%" f" | Level: {overall_summary['overall_risk_level']}")

    if overall_summary["primary_concerns"]:
        print("- Primary Concerns:", ", ".join(overall_summary["primary_concerns"]))

    print("\nDoctor's Explanation:")
    print(explanation)

    print("\n============================\n")


if __name__ == "__main__":
    main()
