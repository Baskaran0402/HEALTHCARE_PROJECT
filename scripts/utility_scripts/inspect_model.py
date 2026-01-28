import pickle
import sys
import os

# Add project root to path
sys.path.append(os.getcwd())

model_path = "models/heart_disease_model/heart_disease_prediction.pkl"

try:
    with open(model_path, "rb") as f:
        model = pickle.load(f)
    
    print("Model loaded successfully.")
    
    if hasattr(model, "feature_names_in_"):
        print("Feature names found:")
        for name in model.feature_names_in_:
            print(f"- {name}")
    else:
        print("Model does not have 'feature_names_in_' attribute.")
        
    print(f"Model type: {type(model)}")

except Exception as e:
    print(f"Error: {e}")
