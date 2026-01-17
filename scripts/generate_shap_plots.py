"""
Generate SHAP (SHapley Additive exPlanations) visualizations for model interpretability
"""
import pickle
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import shap
from pathlib import Path

# Create output directory
output_dir = Path("docs/images")
output_dir.mkdir(parents=True, exist_ok=True)


def load_model(model_path):
    """Load a trained model from pickle file"""
    with open(model_path, 'rb') as f:
        return pickle.load(f)


def generate_shap_plots(model_name, model_path, sample_data, feature_names):
    """
    Generate SHAP summary and feature importance plots
    
    Args:
        model_name: Name of the disease model
        model_path: Path to the .pkl model file
        sample_data: Sample patient data for SHAP analysis
        feature_names: List of feature names
    """
    print(f"\n{'='*60}")
    print(f"Generating SHAP plots for {model_name}")
    print(f"{'='*60}")
    
    # Load model
    model = load_model(model_path)
    
    # Create SHAP explainer
    explainer = shap.TreeExplainer(model)
    
    # Calculate SHAP values
    shap_values = explainer.shap_values(sample_data)
    
    # Summary plot
    plt.figure(figsize=(10, 6))
    shap.summary_plot(shap_values, sample_data, feature_names=feature_names, show=False)
    plt.title(f"{model_name} - Feature Importance (SHAP)", fontsize=14, fontweight='bold')
    plt.tight_layout()
    plt.savefig(output_dir / f"shap_{model_name.lower().replace(' ', '_')}.png", dpi=300, bbox_inches='tight')
    plt.close()
    
    # Feature importance bar plot
    plt.figure(figsize=(10, 6))
    shap.summary_plot(shap_values, sample_data, feature_names=feature_names, plot_type="bar", show=False)
    plt.title(f"{model_name} - Feature Importance Bar Chart", fontsize=14, fontweight='bold')
    plt.tight_layout()
    plt.savefig(output_dir / f"shap_bar_{model_name.lower().replace(' ', '_')}.png", dpi=300, bbox_inches='tight')
    plt.close()
    
    print(f"✅ Saved SHAP plots to {output_dir}")
    
    # Print top features
    feature_importance = np.abs(shap_values).mean(axis=0)
    importance_df = pd.DataFrame({
        'Feature': feature_names,
        'Importance': feature_importance
    }).sort_values('Importance', ascending=False)
    
    print(f"\nTop 5 Most Important Features for {model_name}:")
    print(importance_df.head().to_string(index=False))


def main():
    """Generate SHAP plots for all disease models"""
    
    # Sample patient data (you should replace with actual test data)
    # This is just a placeholder structure
    
    # Heart Disease Model
    heart_features = ['age', 'sex', 'cp', 'trestbps', 'chol', 'fbs', 'restecg', 
                     'thalach', 'exang', 'oldpeak', 'slope', 'ca', 'thal']
    heart_sample = np.random.rand(100, len(heart_features))  # Replace with real data
    
    try:
        generate_shap_plots(
            "Heart Disease",
            "models/heart_model.pkl",
            heart_sample,
            heart_features
        )
    except Exception as e:
        print(f"❌ Error generating Heart Disease SHAP plots: {e}")
    
    # Diabetes Model
    diabetes_features = ['Pregnancies', 'Glucose', 'BloodPressure', 'SkinThickness',
                        'Insulin', 'BMI', 'DiabetesPedigreeFunction', 'Age']
    diabetes_sample = np.random.rand(100, len(diabetes_features))  # Replace with real data
    
    try:
        generate_shap_plots(
            "Diabetes",
            "models/diabetes_model.pkl",
            diabetes_sample,
            diabetes_features
        )
    except Exception as e:
        print(f"❌ Error generating Diabetes SHAP plots: {e}")
    
    # Stroke Model
    stroke_features = ['age', 'hypertension', 'heart_disease', 'avg_glucose_level',
                      'bmi', 'gender', 'smoking_status']
    stroke_sample = np.random.rand(100, len(stroke_features))  # Replace with real data
    
    try:
        generate_shap_plots(
            "Stroke",
            "models/stroke_model.pkl",
            stroke_sample,
            stroke_features
        )
    except Exception as e:
        print(f"❌ Error generating Stroke SHAP plots: {e}")
    
    print(f"\n{'='*60}")
    print("✅ SHAP visualization generation complete!")
    print(f"📁 All plots saved to: {output_dir.absolute()}")
    print(f"{'='*60}\n")


if __name__ == "__main__":
    main()
