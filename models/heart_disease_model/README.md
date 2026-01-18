# ♥️ Heart Disease Prediction Model Card

## Model Details

- **Model Type**: Stacking Classifier (Ensemble)
- **Base Estimators**: Logistic Regression, Random Forest, Extra Trees
- **Version**: 1.0.0
- **Date**: 2025-01-18
- **License**: MIT

## 🎯 Intended Use

- **Primary Use**: Screening tool to identify patients at risk of Coronary Artery Disease (CAD).
- **Intended Users**: General Practitioners, Cardiologists, Medical Students.
- **Out of Scope**: Pediatric cardiology, acute heart attack detection (requires ECG/Troponin).

## 📊 Data Source

- **Training Data**: Verified Heart Disease Dataset (combination of Cleveland, Hungary, Switzerland, Long Beach VA).
- **Dataset features**: 13 clinical attributes including Age, Sex, CP, Trestbps, Chol, etc.

## ⚠️ Limitations & Bias

- **Demographic Bias**: The training dataset is predominantly male (~70%). Predictions for females may have slightly lower sensitivity.
- **Age Bias**: Limited data for patients < 30 years old.
- **Feature Dependency**: Highly dependent on accurate _chest pain type_ classification by the clinician.

## 📈 Performance

- **Accuracy**: ~88% (on validation set)
- **Sensitivity**: ~85%
- **Specificity**: ~90%

## 🔎 Interpretability

- This model supports **SHAP (SHapley Additive exPlanations)** to explain individual predictions.
- Key drivers: Chest Pain Type, ST Depression, Thalassemia, Number of Major Vessels.
