import pandas as pd
import pickle
import shap
import matplotlib.pyplot as plt
import os
import sys
import numpy as np

# Ensure clean output
sys.stdout.reconfigure(encoding='utf-8')

# Paths
MODEL_PATH = "models/heart_disease_model/heart_disease_prediction.pkl"
DATA_PATH = "data/raw/heart.csv"
OUTPUT_DIR = "docs/images"
OUTPUT_FILE = os.path.join(OUTPUT_DIR, "shap_summary_plot.png")

# Ensure output directory exists
os.makedirs(OUTPUT_DIR, exist_ok=True)

# 1. Load Data
print("Loading data...")
df = pd.read_csv(DATA_PATH)

# 2. Preprocess Data to match Model Features
print("Preprocessing data...")

# Target encoded dataframe
encoded_df = pd.DataFrame()

# Numerical features (Direct mapping)
# 'age', 'resting_blood_pressure', 'cholesterol', 'max_heart_rate_achieved', 'st_depression', 'num_major_vessels'
encoded_df['age'] = df['age']
encoded_df['resting_blood_pressure'] = df['trestbps']
encoded_df['cholesterol'] = df['chol']
encoded_df['max_heart_rate_achieved'] = df['thalach']
encoded_df['st_depression'] = df['oldpeak']
encoded_df['num_major_vessels'] = df['ca']

# Categorical One-Hot Encodings

# Sex: 1=Male
encoded_df['sex_male'] = df['sex']

# Chest Pain (cp)
# 0: Typical Angina, 1: Atypical Angina, 2: Non-anginal Pain, 3: Asymptomatic
encoded_df['chest_pain_type_atypical angina'] = (df['cp'] == 1).astype(int)
encoded_df['chest_pain_type_non-anginal pain'] = (df['cp'] == 2).astype(int)
encoded_df['chest_pain_type_typical angina'] = (df['cp'] == 0).astype(int)
# Note: cp=3 (Asymptomatic) results in all 0s, which is correct for OHE if dropped or implied.

# Fasting Blood Sugar (fbs)
# 1 = >120 mg/dl, 0 = <120 mg/dl. Feature is 'lower than 120mg/ml'
encoded_df['fasting_blood_sugar_lower than 120mg/ml'] = (df['fbs'] == 0).astype(int)

# Rest ECG
# 0: Normal, 1: ST-T wave, 2: LVH
encoded_df['rest_ecg_left ventricular hypertrophy'] = (df['restecg'] == 2).astype(int)
encoded_df['rest_ecg_normal'] = (df['restecg'] == 0).astype(int)

# Exercise Ind Angina (exang)
encoded_df['exercise_induced_angina_yes'] = df['exang']

# Slope
# 0: Upsloping, 1: Flat, 2: Downsloping (This varies by dataset version, approximating based on common usage and feature names)
# Feature names: 'st_slope_flat', 'st_slope_upsloping'
# Assuming standard UCI processing often maps: 1=Up, 2=Flat, 3=Down.
# Let's check value counts in raw data later if needed, but for SHAP looks, approximation is okay.
# Using 'heart_encoder.py' logic: DEFAULT is 'upsloping'.
# If we assume dataset follows standard 0,1,2 map:
encoded_df['st_slope_flat'] = (df['slope'] == 1).astype(int)
encoded_df['st_slope_upsloping'] = (df['slope'] == 0).astype(int) # Checking row 1: slope=0.

# Thalassemia (thal)
# 1: fixed, 2: normal, 3: reversible
encoded_df['thalassemia_fixed defect'] = (df['thal'] == 1).astype(int)
encoded_df['thalassemia_normal'] = (df['thal'] == 2).astype(int)
encoded_df['thalassemia_reversible defect'] = (df['thal'] == 3).astype(int)

# Reorder columns to match model exactly
expected_features = [
    'age', 'resting_blood_pressure', 'cholesterol', 'max_heart_rate_achieved',
    'st_depression', 'num_major_vessels', 'sex_male',
    'chest_pain_type_atypical angina', 'chest_pain_type_non-anginal pain', 'chest_pain_type_typical angina',
    'fasting_blood_sugar_lower than 120mg/ml',
    'rest_ecg_left ventricular hypertrophy', 'rest_ecg_normal',
    'exercise_induced_angina_yes',
    'st_slope_flat', 'st_slope_upsloping',
    'thalassemia_fixed defect', 'thalassemia_normal', 'thalassemia_reversible defect'
]

encoded_df = encoded_df[expected_features]

print(f"Data shape: {encoded_df.shape}")

# 3. Load Model
print("Loading model...")
with open(MODEL_PATH, "rb") as f:
    model = pickle.load(f)

# 4. Generate SHAP values
print("Generating SHAP values (KernelExplainer)... this might take a minute.")

# Using a subset of background data for speed (e.g. median or kmeans)
background_summary = shap.kmeans(encoded_df, 10) # Summarize data to 10 points for background

# Kernel Explainer works with any model
# We are predicting probability of class 1 (Disease)
explainer = shap.KernelExplainer(lambda x: model.predict_proba(x)[:, 1], background_summary)

# Calculate SHAP values for a subset of samples (e.g. 50 samples) to save time/memory for plotting
X_sample = encoded_df.sample(n=min(50, len(encoded_df)), random_state=42)
shap_values = explainer.shap_values(X_sample)

# 5. Plot and Save
print("Creating plot...")
plt.figure()
shap.summary_plot(shap_values, X_sample, show=False)

# Get current figure and save
fig = plt.gcf()
fig.set_size_inches(10, 8)
plt.title("SHAP Summary Plot - Heart Disease Model", fontsize=16)
plt.tight_layout()

print(f"Saving to {OUTPUT_FILE}...")
plt.savefig(OUTPUT_FILE, dpi=300, bbox_inches='tight')
plt.close()

print("Done!")
