import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image
import os

class BrainTumorAgent:
    def __init__(self, model_path=None):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.classes = ["Brain Tumor", "Healthy"]
        
        # Default model path if none provided
        if model_path is None:
            model_path = os.path.join(
                os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 
                "models", "brain_tumor_detection", "efficientnet_b0_lr0.0001_bs16.pth"
            )
        
        self.model = self._load_model(model_path)
        
        self.transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
        ])

    def _load_model(self, model_path):
        # Build the same architecture as used in training
        model = models.efficientnet_b0(weights=None)
        num_ftrs = model.classifier[1].in_features
        model.classifier[1] = nn.Linear(num_ftrs, len(self.classes))
        
        if os.path.exists(model_path):
            model.load_state_dict(torch.load(model_path, map_location=self.device))
        else:
            print(f"Warning: Model file not found at {model_path}. Agent will not be functional.")
        
        model.to(self.device)
        model.eval()
        return model

    def predict(self, image_path):
        """
        Predict if a brain MRI image shows a tumor or is healthy.
        """
        if not os.path.exists(image_path):
            return {"error": "Image file not found"}

        try:
            image = Image.open(image_path).convert('RGB')
            image = self.transform(image).unsqueeze(0).to(self.device)
            
            with torch.no_grad():
                outputs = self.model(image)
                probabilities = torch.nn.functional.softmax(outputs, dim=1)
                confidence, predicted = torch.max(probabilities, 1)
            
            risk_score = float(probabilities[0][0].item()) * 100
            
            result = {
                "disease": "Brain Tumor Detection",
                "prediction": self.classes[predicted.item()],
                "confidence": float(confidence.item()),
                "risk_score": float(round(risk_score, 2)),
                "risk_level": self._get_risk_level(self.classes[predicted.item()], confidence.item())
            }
            
            return result
        except Exception as e:
            return {"error": f"Prediction failed: {str(e)}"}

    def _get_risk_level(self, prediction, confidence):
        if prediction == "Healthy":
            return "Low"
        if confidence > 0.8:
            return "Critical"
        if confidence > 0.5:
            return "Moderate"
        return "Low"

def brain_tumor_risk(patient_dict):
    image_path = patient_dict.get("mri_image_path")
    if not image_path:
        return {"error": "No MRI image path provided"}
    agent = BrainTumorAgent()
    return agent.predict(image_path)
