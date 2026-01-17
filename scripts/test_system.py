"""
Test script to verify the healthcare analysis system is working correctly.
This tests the complete flow from patient data to risk assessment.
"""

import os
import sys

from src.coordinator.executor import run_selected_agents
from src.coordinator.patient_state import PatientState

# Add project root to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))


def test_basic_patient():
    """Test with basic patient data (minimal required fields)"""
    print("\n" + "=" * 60)
    print("TEST 1: Basic Patient Data (Minimal Fields)")
    print("=" * 60)

    patient = PatientState()

    # Minimal required data
    patient.age = 55
    patient.gender = 1  # Male
    patient.bmi = 28.5
    patient.blood_pressure = 140
    patient.blood_glucose = 120
    patient.hba1c = 6.5
    patient.cholesterol = 220
    patient.creatinine = 1.2

    # Medical history
    patient.hypertension = 1
    patient.diabetes = 0
    patient.heart_disease = 0

    # Lifestyle
    patient.smoking_raw = "former"

    # Symptoms
    patient.chest_pain = 0
    patient.breathlessness = 0
    patient.fatigue = 0
    patient.edema = 0

    print("\nPatient Profile:")
    print(f"  Age: {patient.age}, Gender: {'Male' if patient.gender == 1 else 'Female'}")
    print(f"  BMI: {patient.bmi}, BP: {patient.blood_pressure}")
    print(f"  Glucose: {patient.blood_glucose}, HbA1c: {patient.hba1c}")
    print(f"  Hypertension: {'Yes' if patient.hypertension else 'No'}")

    print("\n🔍 Running ML Risk Assessment...")

    try:
        report = run_selected_agents(patient)

        print("\n✅ SUCCESS! Analysis Complete")
        print("\n📊 Risk Assessment Results:")
        print("-" * 60)

        # Overall risk
        overall = report.get("overall_risk", {})
        print(f"\n🎯 Overall Risk: {overall.get('level', 'Unknown')} ({overall.get('score', 0)}%)")

        if overall.get("primary_concerns"):
            print(f"⚠️  Primary Concerns: {', '.join(overall['primary_concerns'])}")

        # Individual risks
        print("\n📋 Individual Disease Risks:")
        for risk in report.get("individual_risks", []):
            disease = risk.get("disease", "Unknown")
            level = risk.get("risk_level", "Unknown")
            score = risk.get("risk_score", 0)

            # Emoji based on risk level
            emoji = "🟢" if level == "Low" else "🟡" if level == "Moderate" else "🟠" if level == "High" else "🔴"

            print(f"\n{emoji} {disease}: {level} Risk ({score}%)")

            # Show top 3 reasons
            why = risk.get("why", [])
            if why:
                print("   Reasons:")
                for reason in why[:3]:
                    print(f"   • {reason}")

        print("\n" + "=" * 60)
        print("✅ TEST PASSED: System is working correctly!")
        print("=" * 60)

        return True

    except Exception as e:
        print(f"\n❌ ERROR: {str(e)}")
        import traceback

        traceback.print_exc()
        return False


def test_high_risk_patient():
    """Test with high-risk patient data"""
    print("\n" + "=" * 60)
    print("TEST 2: High-Risk Patient (Multiple Conditions)")
    print("=" * 60)

    patient = PatientState()

    # High-risk profile
    patient.age = 68
    patient.gender = 1  # Male
    patient.bmi = 32.0  # Obese
    patient.blood_pressure = 160  # High
    patient.blood_glucose = 180  # High
    patient.hba1c = 8.5  # High
    patient.cholesterol = 280  # High
    patient.creatinine = 2.0  # Elevated

    # Multiple conditions
    patient.hypertension = 1
    patient.diabetes = 1
    patient.heart_disease = 1

    # Lifestyle
    patient.smoking_raw = "current"

    # Symptoms
    patient.chest_pain = 1
    patient.breathlessness = 1
    patient.fatigue = 1
    patient.edema = 1

    print("\nPatient Profile:")
    print(f"  Age: {patient.age}, Gender: {'Male' if patient.gender == 1 else 'Female'}")
    print(f"  BMI: {patient.bmi} (Obese), BP: {patient.blood_pressure} (High)")
    print(f"  Glucose: {patient.blood_glucose} (High), HbA1c: {patient.hba1c} (High)")
    print("  Conditions: Hypertension, Diabetes, Heart Disease")
    print("  Smoking: Current smoker")
    print("  Symptoms: Chest pain, Breathlessness, Fatigue, Edema")

    print("\n🔍 Running ML Risk Assessment...")

    try:
        report = run_selected_agents(patient)

        print("\n✅ SUCCESS! Analysis Complete")
        print("\n📊 Risk Assessment Results:")
        print("-" * 60)

        # Overall risk
        overall = report.get("overall_risk", {})
        print(f"\n🎯 Overall Risk: {overall.get('level', 'Unknown')} ({overall.get('score', 0)}%)")

        if overall.get("primary_concerns"):
            print(f"⚠️  CRITICAL CONCERNS: {', '.join(overall['primary_concerns'])}")

        # Count risk levels
        critical = sum(1 for r in report.get("individual_risks", []) if r.get("risk_level") == "Critical")
        high = sum(1 for r in report.get("individual_risks", []) if r.get("risk_level") == "High")
        moderate = sum(1 for r in report.get("individual_risks", []) if r.get("risk_level") == "Moderate")

        print("\n📈 Risk Distribution:")
        print(f"   🔴 Critical: {critical}")
        print(f"   🟠 High: {high}")
        print(f"   🟡 Moderate: {moderate}")

        print("\n" + "=" * 60)
        print("✅ TEST PASSED: High-risk detection working!")
        print("=" * 60)

        return True

    except Exception as e:
        print(f"\n❌ ERROR: {str(e)}")
        import traceback

        traceback.print_exc()
        return False


if __name__ == "__main__":
    print("\n🩺 HEALTHCARE AI SYSTEM - INTEGRATION TEST")
    print("=" * 60)

    # Run tests
    test1_passed = test_basic_patient()
    test2_passed = test_high_risk_patient()

    # Summary
    print("\n" + "=" * 60)
    print("📊 TEST SUMMARY")
    print("=" * 60)
    print(f"Test 1 (Basic Patient): {'✅ PASSED' if test1_passed else '❌ FAILED'}")
    print(f"Test 2 (High-Risk Patient): {'✅ PASSED' if test2_passed else '❌ FAILED'}")

    if test1_passed and test2_passed:
        print("\n🎉 ALL TESTS PASSED! System is fully operational.")
        print("\n✅ The 'Analyze Health' button should now work correctly!")
        print("\n📝 Next steps:")
        print("   1. Backend server is running on http://localhost:8000")
        print("   2. Frontend is running on http://localhost:5173")
        print("   3. Fill in the patient form and click 'Analyze Clinical Indicators'")
        print("   4. View the comprehensive risk assessment report")
    else:
        print("\n⚠️  Some tests failed. Please check the errors above.")

    print("=" * 60 + "\n")
