"""
Comprehensive Model Analysis for Bias & Overfitting/Underfitting Detection
"""

import os
import sys

os.environ["CUDA_VISIBLE_DEVICES"] = "0"
import warnings

warnings.filterwarnings("ignore")

import numpy as np
import matplotlib

matplotlib.use("Agg")  # Non-interactive backend
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd

from sklearn.metrics import (
    classification_report,
    confusion_matrix,
    roc_auc_score,
    roc_curve,
    auc,
    precision_recall_curve,
    f1_score,
)
from sklearn.model_selection import StratifiedKFold

import torch
from torch.utils.data import DataLoader
from torchvision import datasets, models, transforms

DEVICE = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
DATA_DIR = r"C:\Users\hp\Desktop\HEALTHCARE_PROJECT\notebooks\brain"
SAVE_DIR = r"C:\Users\hp\Desktop\HEALTHCARE_PROJECT\models\brain_tumor_detection"
REPORT_DIR = r"C:\Users\hp\Desktop\HEALTHCARE_PROJECT\models\bias_analysis_reports"
os.makedirs(REPORT_DIR, exist_ok=True)


def load_model(model_path, num_classes=2):
    """Load trained model"""
    model = models.efficientnet_b0(pretrained=False)
    num_ftrs = model.classifier[1].in_features
    model.classifier[1] = torch.nn.Linear(num_ftrs, num_classes)
    model.load_state_dict(torch.load(model_path, map_location=DEVICE))
    model.to(DEVICE)
    model.eval()
    return model


def get_data_loader(batch_size=32, split="val"):
    """Load data with consistent transforms"""
    val_transforms = transforms.Compose(
        [
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
        ]
    )

    data_dir = os.path.join(DATA_DIR, split)
    dataset = datasets.ImageFolder(data_dir, val_transforms)
    loader = DataLoader(dataset, batch_size=batch_size, shuffle=False, num_workers=0)

    return loader, dataset.classes, dataset


def get_predictions_with_confidence(model, dataloader):
    """Get predictions and confidence scores"""
    all_preds = []
    all_labels = []
    all_probs = []

    with torch.no_grad():
        for inputs, labels in dataloader:
            inputs = inputs.to(DEVICE)
            outputs = model(inputs)
            probs = torch.nn.functional.softmax(outputs, dim=1)

            all_preds.extend(torch.argmax(outputs, 1).cpu().numpy())
            all_labels.extend(labels.cpu().numpy())
            all_probs.extend(probs.cpu().numpy())

    return np.array(all_preds), np.array(all_labels), np.array(all_probs)


def analyze_per_class_performance(y_true, y_pred, y_probs, classes):
    """Analyze performance per class to detect bias"""
    print("\n" + "=" * 60)
    print("PER-CLASS PERFORMANCE ANALYSIS (Bias Detection)")
    print("=" * 60)

    per_class_metrics = {}

    for i, class_name in enumerate(classes):
        class_mask = y_true == i
        class_preds = y_pred[class_mask]
        class_labels = y_true[class_mask]
        class_probs = y_probs[class_mask]

        if len(class_labels) == 0:
            continue

        accuracy = np.mean(class_preds == class_labels)

        # Per-class precision, recall, f1
        tp = np.sum((class_preds == i) & (class_labels == i))
        fp = np.sum((class_preds == i) & (class_labels != i))
        fn = np.sum((class_preds != i) & (class_labels == i))

        precision = tp / (tp + fp) if (tp + fp) > 0 else 0
        recall = tp / (tp + fn) if (tp + fn) > 0 else 0
        f1 = 2 * (precision * recall) / (precision + recall) if (precision + recall) > 0 else 0

        per_class_metrics[class_name] = {
            "accuracy": accuracy,
            "precision": precision,
            "recall": recall,
            "f1": f1,
            "samples": len(class_labels),
            "avg_confidence": np.max(class_probs, axis=1).mean(),
        }

    # Print detailed metrics
    df_metrics = pd.DataFrame(per_class_metrics).T
    print("\n" + df_metrics.to_string())

    # Calculate performance gap (potential bias indicator)
    accuracies = [m["accuracy"] for m in per_class_metrics.values()]
    perf_gap = max(accuracies) - min(accuracies)
    print(f"\n⚠️  Performance Gap (Max - Min Accuracy): {perf_gap:.4f}")
    print(f"    Gap > 0.05 suggests POTENTIAL BIAS")

    f1_scores = [m["f1"] for m in per_class_metrics.values()]
    f1_gap = max(f1_scores) - min(f1_scores)
    print(f"\n⚠️  F1-Score Gap: {f1_gap:.4f}")

    # Confidence gap analysis
    conf_scores = [m["avg_confidence"] for m in per_class_metrics.values()]
    conf_gap = max(conf_scores) - min(conf_scores)
    print(f"\n⚠️  Confidence Gap: {conf_gap:.4f}")
    if conf_gap > 0.05:
        print("    Gap > 0.05 suggests MODEL OVER-CONFIDENT in some classes")

    return per_class_metrics, df_metrics


def analyze_overfitting_underfitting(model_path):
    """Analyze training vs validation to detect overfitting"""
    print("\n" + "=" * 60)
    print("OVERFITTING/UNDERFITTING ANALYSIS")
    print("=" * 60)

    model = load_model(model_path)

    # Load both train and val datasets
    train_loader, classes, _ = get_data_loader(split="train")
    val_loader, _, _ = get_data_loader(split="val")

    train_preds, train_labels, train_probs = get_predictions_with_confidence(model, train_loader)
    val_preds, val_labels, val_probs = get_predictions_with_confidence(model, val_loader)

    train_acc = np.mean(train_preds == train_labels)
    val_acc = np.mean(val_preds == val_labels)

    print(f"\nTraining Accuracy: {train_acc:.4f}")
    print(f"Validation Accuracy: {val_acc:.4f}")
    print(f"Generalization Gap: {train_acc - val_acc:.4f}")

    if train_acc - val_acc > 0.10:
        print("⚠️  POTENTIAL OVERFITTING (Gap > 0.10)")
    elif train_acc - val_acc < -0.05:
        print("⚠️  POTENTIAL UNDERFITTING (Validation better than training)")
    else:
        print("✓ Good generalization (gap < 0.10)")

    # Per-class gap analysis
    print("\n--- Per-Class Generalization Gap ---")
    for i, class_name in enumerate(classes):
        train_class_acc = np.mean(train_preds[train_labels == i] == train_labels[train_labels == i])
        val_class_acc = np.mean(val_preds[val_labels == i] == val_labels[val_labels == i])
        gap = train_class_acc - val_class_acc
        print(f"{class_name:15} | Train: {train_class_acc:.4f} | Val: {val_class_acc:.4f} | Gap: {gap:+.4f}")

    return {
        "train_acc": train_acc,
        "val_acc": val_acc,
        "gap": train_acc - val_acc,
        "train_preds": train_preds,
        "train_labels": train_labels,
        "val_preds": val_preds,
        "val_labels": val_labels,
    }


def confidence_calibration_analysis(y_true, y_probs, classes):
    """Check if model confidence correlates with correctness (calibration)"""
    print("\n" + "=" * 60)
    print("CONFIDENCE CALIBRATION ANALYSIS")
    print("=" * 60)

    max_probs = np.max(y_probs, axis=1)
    correct = (np.argmax(y_probs, axis=1) == y_true).astype(int)

    # Bin predictions by confidence
    bins = np.array([0.0, 0.6, 0.7, 0.8, 0.9, 0.95, 1.0])
    bin_centers = (bins[:-1] + bins[1:]) / 2
    bin_acc = []
    bin_conf = []
    bin_counts = []

    for i in range(len(bins) - 1):
        mask = (max_probs >= bins[i]) & (max_probs < bins[i + 1])
        if np.sum(mask) > 0:
            bin_acc.append(np.mean(correct[mask]))
            bin_conf.append(bin_centers[i])
            bin_counts.append(np.sum(mask))

    bin_acc = np.array(bin_acc)
    bin_conf = np.array(bin_conf)
    bin_counts = np.array(bin_counts)

    # Plot calibration curve
    plt.figure(figsize=(10, 6))
    plt.plot([0, 1], [0, 1], "k--", label="Perfect Calibration")
    plt.scatter(bin_conf, bin_acc, s=bin_counts * 2, alpha=0.6, label="Model")
    plt.xlabel("Average Confidence")
    plt.ylabel("Accuracy in Bin")
    plt.title("Calibration Curve (bubble size = sample count)")
    plt.legend()
    plt.grid(True, alpha=0.3)
    plt.savefig(os.path.join(REPORT_DIR, "calibration_curve.png"), dpi=100)
    plt.close()

    # Calculate Expected Calibration Error (ECE)
    ece = np.sum(np.abs(bin_conf - bin_acc) * (bin_counts / np.sum(bin_counts)))
    print(f"\nExpected Calibration Error (ECE): {ece:.4f}")
    if ece > 0.1:
        print("⚠️  Model confidence is NOT well-calibrated (ECE > 0.1)")
    else:
        print("✓ Model confidence is well-calibrated (ECE < 0.1)")

    print("Calibration plot saved to:", os.path.join(REPORT_DIR, "calibration_curve.png"))


def generate_confusion_matrices(y_true, y_pred, classes):
    """Generate confusion matrices"""
    print("\n" + "=" * 60)
    print("CONFUSION MATRICES")
    print("=" * 60)

    cm = confusion_matrix(y_true, y_pred)

    # Normalized confusion matrix
    cm_norm = cm.astype("float") / cm.sum(axis=1)[:, np.newaxis]

    fig, axes = plt.subplots(1, 2, figsize=(12, 5))

    # Absolute counts
    sns.heatmap(cm, annot=True, fmt="d", cmap="Blues", ax=axes[0], xticklabels=classes, yticklabels=classes)
    axes[0].set_title("Confusion Matrix (Counts)")
    axes[0].set_ylabel("True Label")
    axes[0].set_xlabel("Predicted Label")

    # Normalized
    sns.heatmap(cm_norm, annot=True, fmt=".2%", cmap="Blues", ax=axes[1], xticklabels=classes, yticklabels=classes)
    axes[1].set_title("Confusion Matrix (Normalized)")
    axes[1].set_ylabel("True Label")
    axes[1].set_xlabel("Predicted Label")

    plt.tight_layout()
    plt.savefig(os.path.join(REPORT_DIR, "confusion_matrices.png"), dpi=100)
    plt.close()

    print("\nConfusion matrices saved to:", os.path.join(REPORT_DIR, "confusion_matrices.png"))


def roc_analysis(y_true, y_probs, classes):
    """Generate ROC curves per class"""
    print("\n" + "=" * 60)
    print("ROC CURVE ANALYSIS")
    print("=" * 60)

    if len(classes) == 2:
        # Binary classification
        fpr, tpr, _ = roc_curve(y_true, y_probs[:, 1])
        roc_auc = auc(fpr, tpr)

        plt.figure(figsize=(8, 6))
        plt.plot(fpr, tpr, color="darkorange", lw=2, label=f"ROC curve (AUC = {roc_auc:.4f})")
        plt.plot([0, 1], [0, 1], color="navy", lw=2, linestyle="--", label="Random Classifier")
        plt.xlim([0.0, 1.0])
        plt.ylim([0.0, 1.05])
        plt.xlabel("False Positive Rate")
        plt.ylabel("True Positive Rate")
        plt.title("ROC Curve")
        plt.legend(loc="lower right")
        plt.grid(True, alpha=0.3)
        plt.savefig(os.path.join(REPORT_DIR, "roc_curve.png"), dpi=100)
        plt.close()

        print(f"AUC Score: {roc_auc:.4f}")
        if roc_auc < 0.85:
            print("⚠️  AUC < 0.85 - Model performance could be improved")


def final_bias_risk_assessment(per_class_metrics, fit_analysis):
    """Generate final bias risk assessment"""
    print("\n" + "=" * 80)
    print("FINAL BIAS RISK ASSESSMENT & RECOMMENDATIONS")
    print("=" * 80)

    metrics_df = pd.DataFrame(per_class_metrics).T

    # Risk scoring
    risk_score = 0
    findings = []

    # Check performance gap
    acc_values = metrics_df["accuracy"].values
    acc_gap = max(acc_values) - min(acc_values)
    if acc_gap > 0.05:
        risk_score += 2
        findings.append(f"❌ HIGH BIAS RISK: Accuracy gap {acc_gap:.4f} > 0.05")
    elif acc_gap > 0.02:
        risk_score += 1
        findings.append(f"⚠️  MEDIUM BIAS RISK: Accuracy gap {acc_gap:.4f}")
    else:
        findings.append(f"✓ LOW BIAS RISK: Accuracy gap {acc_gap:.4f} < 0.02")

    # Check F1 gap
    f1_values = metrics_df["f1"].values
    f1_gap = max(f1_values) - min(f1_values)
    if f1_gap > 0.05:
        risk_score += 2
        findings.append(f"❌ HIGH BIAS RISK: F1-score gap {f1_gap:.4f} > 0.05")

    # Check overfitting
    fit_gap = fit_analysis["gap"]
    if fit_gap > 0.15:
        risk_score += 2
        findings.append(f"❌ SEVERE OVERFITTING: Train-Val gap {fit_gap:.4f} > 0.15")
    elif fit_gap > 0.10:
        risk_score += 1
        findings.append(f"⚠️  MODERATE OVERFITTING: Train-Val gap {fit_gap:.4f}")
    else:
        findings.append(f"✓ GOOD GENERALIZATION: Train-Val gap {fit_gap:.4f}")

    # Check sample distribution
    sample_counts = metrics_df["samples"].values
    count_ratio = max(sample_counts) / min(sample_counts)
    if count_ratio > 3:
        risk_score += 1
        findings.append(f"⚠️  IMBALANCED DATA: Class ratio {count_ratio:.2f}x (may cause bias)")

    # Print findings
    print("\nFINDINGS:")
    for finding in findings:
        print(f"  {finding}")

    print(f"\n📊 OVERALL BIAS RISK SCORE: {risk_score}/6")
    if risk_score >= 5:
        print("    🔴 CRITICAL RISK - Model has significant bias issues")
    elif risk_score >= 3:
        print("    🟠 MODERATE RISK - Model has some bias concerns")
    else:
        print("    🟢 LOW RISK - Model appears to have acceptable fairness")

    print("\nRECOMMENDATIONS:")
    if acc_gap > 0.05:
        print("  • Collect more balanced training data")
        print("  • Apply class weighting in loss function")
        print("  • Use data augmentation for underrepresented classes")
    if fit_gap > 0.10:
        print("  • Apply regularization (dropout, L2)")
        print("  • Reduce model complexity")
        print("  • Increase training data")
    if sample_counts.max() / sample_counts.min() > 2:
        print("  • Use weighted sampling or SMOTE for balancing")
        print("  • Consider stratified k-fold validation")

    print("\n" + "=" * 80)


if __name__ == "__main__":
    # Find the best model
    best_model_path = os.path.join(SAVE_DIR, "efficientnet_b0_lr0.0001_bs16.pth")

    if not os.path.exists(best_model_path):
        print(f"Model not found at {best_model_path}")
        exit(1)

    print("=" * 80)
    print("COMPREHENSIVE MODEL BIAS & FIT ANALYSIS")
    print("=" * 80)
    print(f"Model: {best_model_path}")
    print("=" * 80)

    # Load model and data
    model = load_model(best_model_path)
    val_loader, classes, _ = get_data_loader(split="val")

    # Get predictions
    y_pred, y_true, y_probs = get_predictions_with_confidence(model, val_loader)

    # Analyses
    per_class_metrics, df_metrics = analyze_per_class_performance(y_true, y_pred, y_probs, classes)
    fit_analysis = analyze_overfitting_underfitting(best_model_path)
    confidence_calibration_analysis(y_true, y_probs, classes)
    generate_confusion_matrices(y_true, y_pred, classes)
    roc_analysis(y_true, y_probs, classes)
    final_bias_risk_assessment(per_class_metrics, fit_analysis)

    # Save detailed report
    report_path = os.path.join(REPORT_DIR, "bias_analysis_report.txt")
    with open(report_path, "w") as f:
        f.write("=" * 80 + "\n")
        f.write("COMPREHENSIVE MODEL BIAS & FIT ANALYSIS REPORT\n")
        f.write("=" * 80 + "\n\n")
        f.write(f"Model: {best_model_path}\n")
        f.write(f"Train Accuracy: {fit_analysis['train_acc']:.4f}\n")
        f.write(f"Validation Accuracy: {fit_analysis['val_acc']:.4f}\n")
        f.write(f"Generalization Gap: {fit_analysis['gap']:.4f}\n\n")
        f.write("PER-CLASS METRICS:\n")
        f.write(df_metrics.to_string())

    print(f"\n✅ Analysis complete! Reports saved to: {REPORT_DIR}")
