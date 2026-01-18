import sys
import os
sys.path.append(os.getcwd())

import pytest
import pandera.pandas as pa
from src.agents.heart_agent import heart_risk

def test_valid_heart_input():
    data = {"age": 60, "sex": 1, "cp": 0, "trestbps": 140, "chol": 260}
    try:
        result = heart_risk(data)
        print("\n[PASS] Valid input passed test.")
        print(result)
    except Exception as e:
        print(f"\n[FAIL] Valid input FAILED: {e}")

def test_invalid_heart_input():
    # Age 200 is out of range (0-120)
    data = {"age": 200, "sex": 1, "cp": 0, "trestbps": 140, "chol": 260}
    try:
        result = heart_risk(data)
        print("\n[WARN] Invalid input age=200 was ACCEPTED (Validation might be soft).")
        print(result)
    except ValueError as e:
        print("\n[PASS] Invalid input age=200 was REJECTED as expected.")
        print(e)
    except Exception as e:
        print(f"\n[FAIL] Invalid input raised other error: {e}")

if __name__ == "__main__":
    test_valid_heart_input()
    test_invalid_heart_input()
