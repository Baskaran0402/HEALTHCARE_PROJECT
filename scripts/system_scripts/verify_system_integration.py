import time

import requests

BASE_URL = "http://localhost:8000"


def test_health_check():
    print(f"Testing Health Check ({BASE_URL}/health)...", end=" ")
    try:
        r = requests.get(f"{BASE_URL}/health")
        if r.status_code == 200:
            print("✅ OK")
            return True
        else:
            print(f"❌ Failed ({r.status_code})")
            return False
    except Exception as e:
        print(f"❌ Connection Failed: {e}")
        return False


def test_full_analysis():
    print("\nTesting Full Analysis API (/api/analyze)...")

    payload = {
        "patient_data": {
            "name": "Integration Test User",
            "age": 55,
            "gender": "Male",
            "medical_record_number": "TEST-101",
        },
        "medical_data": {
            "bmi": 28.5,
            "blood_pressure": 145,  # High BP
            "blood_glucose": 130,
            "hba1c": 6.2,
            "cholesterol": 240,  # High Cholesterol
            "creatinine": 1.1,
            "urea": 40,
            "bilirubin_total": 0.9,
            "alt": 35,
            "ast": 40,
            "hypertension": 1,
            "diabetes": 0,
            "heart_disease": 0,
            "smoking_status": "former",
            "chest_pain": 1,  # Trigger Heart Model
            "breathlessness": 0,
            "fatigue": 1,
            "edema": 0,
        },
        "role": "Doctor",  # Capitalized
    }

    try:
        start_time = time.time()
        r = requests.post(f"{BASE_URL}/api/analyze", json=payload)
        duration = time.time() - start_time

        if r.status_code == 200:
            data = r.json()
            assessment = data.get("assessment", {})

            print(f"✅ Success (Time: {duration:.2f}s)")
            print(f"  - Overall Risk Level: {assessment.get('overall_risk_level')}")
            print(f"  - Overall Score: {assessment.get('overall_risk_score')}")

            risks = assessment.get("individual_risks", [])
            print(f"  - Individual Risks Found: {len(risks)}")
            for risk in risks:
                print(f"    * {risk.get('disease')}: {risk.get('risk_level')} ({risk.get('risk_score')}%)")

            report_preview = assessment.get("doctor_report", "")[:100]
            print(f"  - Report Generated? {'✅ Yes' if len(report_preview) > 20 else '❌ No'}")
            if "unavailable" in report_preview.lower():
                print("    (Fallback message detected - LLM might be down or key invalid, but Safe Mode worked)")

            return True
        else:
            print(f"❌ Failed ({r.status_code})")
            print(f"Response: {r.text}")
            return False

    except Exception as e:
        print(f"❌ Exception: {e}")
        return False


if __name__ == "__main__":
    print("--- MANUAL SYSTEM VERIFICATION ---")
    if test_health_check():
        test_full_analysis()
