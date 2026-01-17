import os
import pickle

model_paths = {
    "Heart": "models/heart_disease_model/heart_disease_prediction.pkl",
    "Kidney": "models/kidneyDiseasePrediction/kidney_disease_prediction_model.pkl",
    "Liver": "models/liverdiseasepredictionmodel/liverdiseasepredictionmodel.pkl",
    "Stroke": "models/strokePrediction/strokeprediction.pkl",
    "Diabetes": "models/diabetes_hypertension_model/diabetes_and_hypertension_prediction_model.pkl",
}

print("--- MODEL FEATURE NAMES ---")
for name, path in model_paths.items():
    print(f"\n[{name}]")
    if not os.path.exists(path):
        print(f"File not found: {path}")
        continue

    try:
        with open(path, "rb") as f:
            model = pickle.load(f)

        if hasattr(model, "feature_names_in_"):
            print(list(model.feature_names_in_))
        else:
            print("No feature_names_in_ attribute. Trying to inspect internal trees or steps...")
            # Some older sklearn versions or pipelines might store it differently
            try:
                # If it's a pipeline, check the last step
                if hasattr(model, "steps"):
                    print(f"Pipeline detected. Last step features: {model.steps[-1][1].feature_names_in_}")
            except Exception:
                print("Could not retrieve feature names.")

    except Exception as e:
        print(f"Error loading model: {e}")
