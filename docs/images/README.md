# SHAP Visualizations

This directory contains SHAP (SHapley Additive exPlanations) visualizations for model interpretability.

## Generate Visualizations

Run the following command to generate SHAP plots:

```bash
python scripts/generate_shap_plots.py
```

## Available Plots

- `shap_heart_disease.png` - Heart disease model feature importance
- `shap_diabetes.png` - Diabetes model feature importance
- `shap_stroke.png` - Stroke model feature importance
- `shap_kidney_disease.png` - Kidney disease model feature importance
- `shap_liver_disease.png` - Liver disease model feature importance

Each model has both summary plots and bar charts showing which patient factors most influence predictions.
