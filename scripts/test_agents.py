import os

import sys


from src.agents.heart_agent import heart_risk
from src.agents.kidney_agent import kidney_risk
from src.agents.liver_agent import liver_risk

# Add project root to path
sys.path.append(os.getcwd())


# Mock Patient Data
patient = {
    "age": 55,
    "blood_pressure": 130,
    "gender": "Male",
    "bmi": 28.5,
    "smoking_status": "former",
    # Kidney specific
    "specific_gravity": 1.015,
    "albumin": 0,
    "sugar": 0,
    # Heart specific
    "chest_pain_type": "typical angina",
    # Liver specific
    "bilirubin_total": 0.8,
}

print("Testing Kidney Agent...")
try:
    print(kidney_risk(patient))
    print("✅ Kidney Agent OK")
except Exception as e:
    print(f"❌ Kidney Agent Failed: {e}")

print("\nTesting Heart Agent...")
try:
    print(heart_risk(patient))
    print("✅ Heart Agent OK")
except Exception as e:
    print(f"❌ Heart Agent Failed: {e}")

print("\nTesting Liver Agent...")
try:
    print(liver_risk(patient))
    print("✅ Liver Agent OK")
except Exception as e:
    print(f"❌ Liver Agent Failed: {e}")
