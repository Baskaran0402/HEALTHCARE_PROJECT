"""
Quick Model Validation - Bias & Overfitting Check
Reads metrics from classification reports and evaluates them
"""

import os
import json
import numpy as np

# Key metrics to verify
def interpret_metrics():
    print("="*80)
    print("MODEL VALIDATION CHECKLIST - BIAS & OVERFITTING")
    print("="*80)
    
    # Based on your training output:
    # Best model: efficientnet_b0_lr0.0001_bs16
    # Best val Acc: 0.9967
    
    print("\n1. OVERFITTING/UNDERFITTING CHECK")
    print("-" * 80)
    
    # From training logs:
    train_loss_final = 0.0286
    val_loss_final = 0.0232
    train_acc_final = 0.9927
    val_acc_final = 0.9967
    
    generalization_gap = train_acc_final - val_acc_final
    
    print(f"   Training Accuracy (Epoch 4):   {train_acc_final:.4f}")
    print(f"   Validation Accuracy (Epoch 4): {val_acc_final:.4f}")
    print(f"   Generalization Gap:             {generalization_gap:+.4f}")
    
    if abs(generalization_gap) < 0.02:
        status = "✓ EXCELLENT - No overfitting/underfitting detected"
    elif generalization_gap > 0.1:
        status = "❌ SEVERE OVERFITTING - Model memorized training data"
    elif generalization_gap > 0.05:
        status = "⚠️  MILD OVERFITTING - Consider regularization"
    else:
        status = "✓ GOOD - Acceptable generalization gap"
    
    print(f"   Status: {status}")
    
    # Loss analysis
    print(f"\n   Final Training Loss:   {train_loss_final:.4f}")
    print(f"   Final Validation Loss: {val_loss_final:.4f}")
    print(f"   Loss Ratio (Val/Train): {val_loss_final/train_loss_final:.4f}")
    
    if val_loss_final < train_loss_final:
        print("   Note: Validation loss < Training loss (unusual but acceptable)")
    
    
    print("\n\n2. CLASS BALANCE CHECK")
    print("-" * 80)
    
    # From evaluation output
    brain_tumor_support = 503
    healthy_support = 418
    total_samples = brain_tumor_support + healthy_support
    
    class_ratio = brain_tumor_support / healthy_support
    imbalance_percent = abs(brain_tumor_support - healthy_support) / total_samples * 100
    
    print(f"   Brain Tumor samples: {brain_tumor_support} ({brain_tumor_support/total_samples*100:.1f}%)")
    print(f"   Healthy samples:     {healthy_support} ({healthy_support/total_samples*100:.1f}%)")
    print(f"   Class Ratio (BT:H):  {class_ratio:.2f}:1")
    print(f"   Imbalance Level:     {imbalance_percent:.1f}%")
    
    if imbalance_percent > 30:
        print(f"   ❌ HIGH IMBALANCE - May cause bias toward majority class")
    elif imbalance_percent > 15:
        print(f"   ⚠️  MODERATE IMBALANCE - Monitor class-specific metrics")
    else:
        print(f"   ✓ GOOD BALANCE - Data is well-balanced")
    
    
    print("\n\n3. PER-CLASS PERFORMANCE CHECK")
    print("-" * 80)
    
    # From classification report (best single model):
    metrics = {
        'Brain Tumor': {'precision': 1.00, 'recall': 0.99, 'f1': 1.00},
        'Healthy': {'precision': 0.99, 'recall': 1.00, 'f1': 1.00}
    }
    
    print(f"   {'Class':<15} {'Precision':<12} {'Recall':<12} {'F1-Score':<12}")
    print("   " + "-"*50)
    
    precisions = []
    recalls = []
    f1_scores = []
    
    for class_name, scores in metrics.items():
        print(f"   {class_name:<15} {scores['precision']:<12.4f} {scores['recall']:<12.4f} {scores['f1']:<12.4f}")
        precisions.append(scores['precision'])
        recalls.append(scores['recall'])
        f1_scores.append(scores['f1'])
    
    precision_gap = max(precisions) - min(precisions)
    recall_gap = max(recalls) - min(recalls)
    f1_gap = max(f1_scores) - min(f1_scores)
    
    print(f"\n   Precision Gap: {precision_gap:.4f}")
    print(f"   Recall Gap:    {recall_gap:.4f}")
    print(f"   F1-Score Gap:  {f1_gap:.4f}")
    
    if precision_gap > 0.05 or recall_gap > 0.05:
        print(f"\n   ❌ BIAS DETECTED - Performance gap exceeds 5%")
    elif precision_gap > 0.02 or recall_gap > 0.02:
        print(f"\n   ⚠️  POSSIBLE BIAS - Performance gap between 2-5%")
    else:
        print(f"\n   ✓ LOW BIAS - Model performs consistently across classes")
    
    
    print("\n\n4. ENSEMBLE VS SINGLE MODEL")
    print("-" * 80)
    
    single_model_acc = 0.9967
    ensemble_acc = 0.9957
    ensemble_diff = single_model_acc - ensemble_acc
    
    print(f"   Best Single Model Accuracy: {single_model_acc:.4f}")
    print(f"   Ensemble Accuracy (Top 3):  {ensemble_acc:.4f}")
    print(f"   Difference:                 {ensemble_diff:+.4f}")
    
    if ensemble_diff > 0:
        print(f"\n   ⚠️  Single model outperforms ensemble")
        print(f"      This suggests good model stability (less overfitting)")
    else:
        print(f"\n   ✓ Ensemble slightly outperforms single model")
        print(f"      Indicates diversity in predictions")
    
    
    print("\n\n5. OVERALL BIAS RISK ASSESSMENT")
    print("="*80)
    
    risk_factors = 0
    recommendations = []
    
    # Generalization gap
    if abs(generalization_gap) > 0.05:
        risk_factors += 1
    
    # Class imbalance
    if imbalance_percent > 20:
        risk_factors += 1
        recommendations.append("• Consider using class weights: weight_brain_tumor=0.83, weight_healthy=1.2")
    
    # Performance gap
    if precision_gap > 0.05 or recall_gap > 0.05:
        risk_factors += 2
        recommendations.append("• Audit model predictions for systematic errors")
    elif precision_gap > 0.02 or recall_gap > 0.02:
        risk_factors += 1
    
    print(f"\n📊 BIAS RISK SCORE: {risk_factors}/4")
    
    if risk_factors == 0:
        print("   🟢 VERY LOW RISK - Model appears fair and well-generalized")
    elif risk_factors == 1:
        print("   🟡 LOW RISK - Minor concerns, monitor during deployment")
    elif risk_factors == 2:
        print("   🟠 MODERATE RISK - Address issues before production")
    else:
        print("   🔴 HIGH RISK - Significant bias/fit issues to resolve")
    
    
    print("\n\n6. RECOMMENDATIONS")
    print("="*80)
    
    if not recommendations:
        recommendations = [
            "✓ Model appears ready for validation on held-out test set",
            "✓ Continue monitoring per-class performance in production",
            "✓ Consider collecting more 'edge case' samples for robustness"
        ]
    
    for rec in recommendations:
        print(f"   {rec}")
    
    print("\n\n7. NEXT STEPS FOR VALIDATION")
    print("="*80)
    print("""
   1. TEST SET EVALUATION
      └─ Evaluate on completely held-out test set (not in train/val)
      └─ Verify metrics match validation performance
      
   2. STRATIFIED CROSS-VALIDATION
      └─ Run 5-fold cross-validation with stratification
      └─ Check consistency of metrics across folds
      
   3. DEMOGRAPHIC PARITY CHECK
      └─ If patient metadata available: age, gender, ethnicity
      └─ Verify equal false positive/negative rates across groups
      
   4. ADVERSARIAL ROBUSTNESS
      └─ Test with perturbed inputs (noise, rotation, contrast)
      └─ Verify consistent predictions
      
   5. CONFUSION MATRIX ANALYSIS
      └─ Identify which cases get misclassified
      └─ Check for patterns (e.g., specific tumor types)
      
   6. CALIBRATION CHECK
      └─ Verify confidence scores match actual accuracy
      └─ Plot calibration curve
      
   7. PRODUCTION MONITORING
      └─ Set up metrics dashboard
      └─ Track per-class accuracy over time
      └─ Alert if performance drops by >5%
    """)
    
    print("="*80)
    print("✅ Analysis complete!")
    print("="*80)

if __name__ == "__main__":
    interpret_metrics()
