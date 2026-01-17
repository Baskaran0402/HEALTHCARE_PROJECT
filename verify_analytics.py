
import time
import uuid

import requests

BASE_URL = "http://localhost:8000"


def verify_analytics():
    print("--- Verifying Analytics Endpoint ---")

    # 1. Create a patient to attach tests to
    patient_data = {
        "name": f"History Test User {uuid.uuid4().hex[:4]}",
        "age": 45,
        "gender": "Female",
        "medical_record_number": f"TEST-HIST-{uuid.uuid4().hex[:6]}"
    }

    print("\n1. Creating Patient...")
    # This happens implicitly in /api/analyze if not exists, but let's try to just run analyze

    print("2. Running Multiple Analyses to generate history...")

    # Run 1: High Risk
    payload1 = {
        "patient_data": patient_data,
        "medical_data": {
            "bmi": 30, "blood_pressure": 150, "diabetes": 1, "creatinine": 1.5
        },
        "role": "Doctor"
    }
    r1 = requests.post(f"{BASE_URL}/api/analyze", json=payload1)
    if r1.status_code != 200:
        print(f"❌ Analysis 1 Failed: {r1.text}")
        return

    patient_id = r1.json()["patient"]["id"]
    print(f"✅ Analysis 1 Complete. Patient ID: {patient_id}")

    time.sleep(1)  # Ensure timestamp diff

    # Run 2: Moderate Risk (Improvement)
    payload2 = {
        "patient_data": patient_data,
        "medical_data": {
            "bmi": 28, "blood_pressure": 130, "diabetes": 1, "creatinine": 1.1
        },
        "role": "Doctor"
    }
    r2 = requests.post(f"{BASE_URL}/api/analyze", json=payload2)
    if r2.status_code == 200:
        print("✅ Analysis 2 Complete")

    # 3. Fetch History
    print(f"\n3. Fetching History for {patient_id}...")
    try:
        r_hist = requests.get(f"{BASE_URL}/api/analytics/patients/{patient_id}/history")
        if r_hist.status_code == 200:
            history = r_hist.json()
            print(f"✅ Success! Found {len(history)} records.")
            for i, record in enumerate(history):
                print(f"   Record {i+1}: Date={record['date']}, Overall Score={record['overall_score']}")

            if len(history) >= 2:
                print("✅ History tracking verified correctly.")
            else:
                print("⚠️ Warning: Expected 2 records, found less.")
        else:
            print(f"❌ Failed to fetch history ({r_hist.status_code}): {r_hist.text}")

    except Exception as e:
        print(f"❌ Exception fetching history: {e}")


if __name__ == "__main__":
    verify_analytics()
