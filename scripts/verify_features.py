import requests
import json
import base64

BASE_URL = "http://127.0.0.1:8000"

def test_shap_endpoint():
    print("\n--- Testing SHAP Endpoint ---")
    data = {"age": 60, "sex": 1, "cp": 0, "trestbps": 140, "chol": 260, "fbs": 0, "restecg": 1, "thalach": 140, "exang": 1, "oldpeak": 1.5, "slope": 1, "ca": 0, "thal": 2} # valid data
    
    # Note: The endpoint expects dict, not Pydantic model wrapping it?
    # backend: def explain_heart_risk(patient_data: dict):
    try:
        response = requests.post(f"{BASE_URL}/api/explain/heart", json=data)
        if response.status_code == 200:
            print("✅ SHAP Endpoint Success")
            # Verify it's base64
            # print(response.text[:20] + "...") 
        else:
            print(f"❌ SHAP Endpoint Failed: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ Connection Error: {e}")

def test_pdf_endpoint():
    print("\n--- Testing PDF Endpoint ---")
    # Mock a AnalyzeHealthResponse structure
    data = {
        "patient": {
            "name": "Test Patient", "age": 45, "gender": "Male", "medical_record_number": "MRN123", "email": "test@example.com", "phone": "123", "id": "1", "created_at": "2023-01-01T00:00:00"
        },
        "medical_record": {
            "bmi": 25.0, "hypertension": False, "diabetes": False, "heart_disease": False, "chest_pain": True, "breathlessness": False, "fatigue": False, "edema": False, "id": "1", "patient_id": "1", "recorded_at": "2023-01-01T00:00:00"
        },
        "consultation": {
            "role": "Doctor", "id": "1", "patient_id": "1", "stage": "completed", "confidence": 0.9, "conversation_history": [], "started_at": "2023-01-01T00:00:00"
        },
        "assessment": {
            "consultation_id": "1", "overall_risk_score": 15.0, "overall_risk_level": "Low", "primary_concerns": ["Chest pain"], "individual_risks": [], "doctor_report": "Patient is healthy.", "id": "1", "assessed_at": "2023-01-01T00:00:00"
        }
    }
    
    try:
        response = requests.post(f"{BASE_URL}/api/generate-pdf", json=data)
        if response.status_code == 200:
            content_type = response.headers.get("Content-Type")
            if "application/pdf" in content_type:
               print("✅ PDF Endpoint Success (received PDF)")
            else:
               print(f"❌ PDF Endpoint Returned Wrong Type: {content_type}")
        else:
            print(f"❌ PDF Endpoint Failed: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ Connection Error: {e}")

if __name__ == "__main__":
    test_shap_endpoint()
    test_pdf_endpoint()
