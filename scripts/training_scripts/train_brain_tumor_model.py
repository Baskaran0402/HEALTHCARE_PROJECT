import os
import time
import copy
import random
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader
from torchvision import datasets, models, transforms
from sklearn.metrics import classification_report, confusion_matrix
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np


# Set seed for reproducibility
def set_seed(seed=42):
    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    if torch.cuda.is_available():
        torch.cuda.manual_seed_all(seed)


set_seed()

# Configuration
DATA_DIR = r"C:\Users\hp\Desktop\HEALTHCARE_PROJECT\notebooks\brain"
SAVE_DIR = r"C:\Users\hp\Desktop\HEALTHCARE_PROJECT\models\brain_tumor_detection"
os.makedirs(SAVE_DIR, exist_ok=True)

DEVICE = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
print(f"Using device: {DEVICE}")

# Hyperparameters to tune
PARAM_GRID = {
    "learning_rate": [0.001, 0.0001],
    "batch_size": [16, 32],
    "num_epochs": [5],  # Reduced for CPU demonstration
}


def get_data_loaders(batch_size):
    # Enhanced Data Augmentation
    train_transforms = transforms.Compose(
        [
            transforms.Resize((224, 224)),
            transforms.RandomHorizontalFlip(),
            transforms.RandomRotation(15),
            transforms.ColorJitter(brightness=0.2, contrast=0.2),
            transforms.ToTensor(),
            transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
        ]
    )

    val_transforms = transforms.Compose(
        [
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
        ]
    )

    train_dir = os.path.join(DATA_DIR, "train")
    val_dir = os.path.join(DATA_DIR, "val")

    train_dataset = datasets.ImageFolder(train_dir, train_transforms)
    val_dataset = datasets.ImageFolder(val_dir, val_transforms)

    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True, num_workers=0)
    val_loader = DataLoader(val_dataset, batch_size=batch_size, shuffle=False, num_workers=0)

    return train_loader, val_loader, train_dataset.classes


def build_model(model_name, num_classes):
    if model_name == "efficientnet_b0":
        model = models.efficientnet_b0(pretrained=True)
        num_ftrs = model.classifier[1].in_features
        model.classifier[1] = nn.Linear(num_ftrs, num_classes)
    else:
        raise ValueError(f"Unknown model name: {model_name}")

    return model.to(DEVICE)


def train_model(model, dataloaders, criterion, optimizer, num_epochs=25):
    since = time.time()

    val_acc_history = []

    best_model_wts = copy.deepcopy(model.state_dict())
    best_acc = 0.0

    for epoch in range(num_epochs):
        print(f"Epoch {epoch}/{num_epochs - 1}")
        print("-" * 10)

        for phase in ["train", "val"]:
            if phase == "train":
                model.train()
            else:
                model.eval()

            running_loss = 0.0
            running_corrects = 0

            for inputs, labels in dataloaders[phase]:
                inputs = inputs.to(DEVICE)
                labels = labels.to(DEVICE)

                optimizer.zero_grad()

                with torch.set_grad_enabled(phase == "train"):
                    outputs = model(inputs)
                    loss = criterion(outputs, labels)
                    _, preds = torch.max(outputs, 1)

                    if phase == "train":
                        loss.backward()
                        optimizer.step()

                running_loss += loss.item() * inputs.size(0)
                running_corrects += torch.sum(preds == labels.data)

            epoch_loss = running_loss / len(dataloaders[phase].dataset)
            epoch_acc = running_corrects.double() / len(dataloaders[phase].dataset)

            print(f"{phase} Loss: {epoch_loss:.4f} Acc: {epoch_acc:.4f}")

            if phase == "val" and epoch_acc > best_acc:
                best_acc = epoch_acc
                best_model_wts = copy.deepcopy(model.state_dict())

            if phase == "val":
                val_acc_history.append(epoch_acc)

        print()

    time_elapsed = time.time() - since
    print(f"Training complete in {time_elapsed // 60:.0f}m {time_elapsed % 60:.0f}s")
    print(f"Best val Acc: {best_acc:4f}")

    model.load_state_dict(best_model_wts)
    return model, best_acc


def evaluate_model(model, dataloader, classes):
    model.eval()
    y_true = []
    y_pred = []

    with torch.no_grad():
        for inputs, labels in dataloader:
            inputs = inputs.to(DEVICE)
            outputs = model(inputs)
            _, preds = torch.max(outputs, 1)

            y_true.extend(labels.cpu().numpy())
            y_pred.extend(preds.cpu().numpy())

    print(classification_report(y_true, y_pred, target_names=classes))
    return y_true, y_pred


def run_hyperparameter_tuning():
    results = []

    # We will try both ResNet50 and EfficientNet_B0
    model_names = ["efficientnet_b0"]

    for model_name in model_names:
        for lr in PARAM_GRID["learning_rate"]:
            for batch_size in PARAM_GRID["batch_size"]:
                # Epochs fixed for grid search speed, can be increased final train
                epochs = PARAM_GRID["num_epochs"][0]

                print(f"Training {model_name} with LR={lr}, Batch={batch_size}")

                train_loader, val_loader, classes = get_data_loaders(batch_size)
                dataloaders = {"train": train_loader, "val": val_loader}

                model = build_model(model_name, len(classes))
                criterion = nn.CrossEntropyLoss()
                optimizer = optim.Adam(model.parameters(), lr=lr)

                trained_model, best_acc = train_model(model, dataloaders, criterion, optimizer, num_epochs=epochs)

                result = {
                    "model_name": model_name,
                    "lr": lr,
                    "batch_size": batch_size,
                    "best_acc": best_acc.item(),
                    "model": trained_model,
                    "classes": classes,
                    "val_loader": val_loader,
                }
                results.append(result)

                # Save checkpoint
                save_path = os.path.join(SAVE_DIR, f"{model_name}_lr{lr}_bs{batch_size}.pth")
                torch.save(trained_model.state_dict(), save_path)
                print(f"Model saved to {save_path}")
                print("-" * 20)

    return results


def ensemble_predict(models_list, dataloader):
    # Simple averaging ensemble
    all_preds_probs = []
    true_labels = []

    # Get predictions from all models
    for model_dict in models_list:
        model = model_dict["model"]
        model.eval()
        model_probs = []
        model_labels = []

        with torch.no_grad():
            for inputs, labels in dataloader:
                inputs = inputs.to(DEVICE)
                outputs = model(inputs)
                probs = torch.nn.functional.softmax(outputs, dim=1)
                model_probs.append(probs.cpu().numpy())
                if len(all_preds_probs) == 0:  # Only need labels once
                    model_labels.extend(labels.numpy())

        all_preds_probs.append(np.concatenate(model_probs))
        if len(true_labels) == 0:
            true_labels = model_labels

    # Average probabilities
    avg_probs = np.mean(all_preds_probs, axis=0)
    final_preds = np.argmax(avg_probs, axis=1)

    return true_labels, final_preds


if __name__ == "__main__":
    print("Starting Hyperparameter Tuning & Model Training...")
    results = run_hyperparameter_tuning()

    # Sort results by accuracy
    results.sort(key=lambda x: x["best_acc"], reverse=True)

    print("\nTop 3 Models:")
    for i, res in enumerate(results[:3]):
        print(f"{i+1}. {res['model_name']} | LR: {res['lr']} | Batch: {res['batch_size']} | Acc: {res['best_acc']:.4f}")

    best_result = results[0]
    classes = best_result["classes"]
    val_loader = best_result["val_loader"]  # Note: batch size might differ but dataset is same for eval

    print("\nVisualizing Best Single Model Performance:")
    y_true, y_pred = evaluate_model(best_result["model"], val_loader, classes)

    # Ensemble top 3 models
    if len(results) >= 3:
        print("\nEnsemble Performance (Top 3 Models):")
        top_3_models = results[:3]
        # Need a common val_loader (batch size doesn't affect val set content order if shuffle=False)
        # We reused val_dataset logic so order is preserved.

        # Re-create loader to ensure consistency if needed, but above we saved loaders.
        # We can just use the loader from the best model.

        ens_true, ens_pred = ensemble_predict(top_3_models, val_loader)
        print(classification_report(ens_true, ens_pred, target_names=classes))

        # Compare
        single_acc = np.mean(np.array(y_true) == np.array(y_pred))
        ens_acc = np.mean(np.array(ens_true) == np.array(ens_pred))
        print(f"Best Single Model Acc: {single_acc:.4f}")
        print(f"Ensemble Acc: {ens_acc:.4f}")

    print("\nDone.")
