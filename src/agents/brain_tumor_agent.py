import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image
import os
import numpy as np
import cv2
import base64
import io

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

        # For Grad-CAM
        self.gradients = None
        self.activations = None

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

    def _save_gradients(self, grad):
        self.gradients = grad

    def _save_activations(self, layer_output):
        self.activations = layer_output

    def generate_gradcam(self, image_tensor, target_class_idx):
        """
        Generates a Grad-CAM heatmap for the last convolutional layer.
        """
        # EfficientNet-B0 last conv layer is model.features[8]
        last_conv_layer = self.model.features[8]
        
        # Register hooks
        handle_act = last_conv_layer.register_forward_hook(lambda m, i, o: self._save_activations(o))
        handle_grad = last_conv_layer.register_full_backward_hook(lambda m, i, o: self._save_gradients(o[0]))

        # Forward pass
        output = self.model(image_tensor)
        
        # Backward pass
        self.model.zero_grad()
        target = output[:, target_class_idx]
        target.backward()

        # Remove hooks
        handle_act.remove()
        handle_grad.remove()

        # Generate heatmap
        gradients = self.gradients.cpu().data.numpy()[0]
        activations = self.activations.cpu().data.numpy()[0]
        
        weights = np.mean(gradients, axis=(1, 2))
        heatmap = np.zeros(activations.shape[1:], dtype=np.float32)

        for i, w in enumerate(weights):
            heatmap += w * activations[i]

        heatmap = np.maximum(heatmap, 0)
        heatmap /= np.max(heatmap) if np.max(heatmap) > 0 else 1
        return heatmap

    def apply_heatmap(self, original_image_path, heatmap):
        """
        Overlays heatmap on original image.
        """
        img = cv2.imread(original_image_path)
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        
        heatmap = cv2.resize(heatmap, (img.shape[1], img.shape[0]))
        heatmap = np.uint8(255 * heatmap)
        heatmap = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)
        heatmap = cv2.cvtColor(heatmap, cv2.COLOR_BGR2RGB)

        # Superimpose
        superimposed_img = heatmap * 0.4 + img * 0.6
        superimposed_img = np.uint8(superimposed_img)
        
        # Convert to base64
        _, buffer = cv2.imencode('.png', cv2.cvtColor(superimposed_img, cv2.COLOR_RGB2BGR))
        img_base64 = base64.b64encode(buffer).decode('utf-8')
        return img_base64

    def predict(self, image_path):
        """
        Predict if a brain MRI image shows a tumor or is healthy.
        Includes Grad-CAM visualization for Explainability.
        """
        if not os.path.exists(image_path):
            return {"error": "Image file not found"}

        try:
            pil_image = Image.open(image_path).convert('RGB')
            image_tensor = self.transform(pil_image).unsqueeze(0).to(self.device).requires_grad_(True)
            
            # 1. Standard Prediction
            self.model.eval()
            outputs = self.model(image_tensor)
            probabilities = torch.nn.functional.softmax(outputs, dim=1)
            confidence, predicted = torch.max(probabilities, 1)
            
            pred_idx = predicted.item()
            pred_label = self.classes[pred_idx]
            
            # 2. Risk Score (0-100)
            risk_score = float(probabilities[0][0].item()) * 100
            
            # 3. Visual Explainability (Grad-CAM)
            heatmap = self.generate_gradcam(image_tensor, pred_idx)
            explainability_image = self.apply_heatmap(image_path, heatmap)
            
            # 4. Lobe Identification (Advanced Localizer)
            # Find the peak of the heatmap (highest intensity region)
            y, x = np.unravel_index(np.argmax(heatmap), heatmap.shape)
            
            # Map normalized coordinates to brain lobes (Heuristic)
            # EfficientNet-B0 exports 7x7 spatial grit usually for Grad-CAM
            lobe = "Central"
            if y < 3:
                lobe = "Frontal"
            elif y > 4:
                lobe = "Occipital/Temporal"
            else:
                lobe = "Parietal"
                
            if x < 2:
                lobe += " (Left Lateral)"
            elif x > 4:
                lobe += " (Right Lateral)"

            result = {
                "disease": "Brain Tumor Detection",
                "prediction": pred_label,
                "confidence": float(confidence.item()),
                "risk_score": float(round(risk_score, 2)),
                "risk_level": self._get_risk_level(pred_label, confidence.item()),
                "visual_explanation": explainability_image,
                "lobe_location": lobe,
                "anatomy_mapping": {
                    "lobe": lobe.split(" ")[0],
                    "coordinates": {"x": int(x), "y": int(y)},
                    "functional_risks": self._get_functional_risks(lobe)
                }
            }
            
            return result
        except Exception as e:
            import traceback
            print(f"Prediction Error: {e}")
            print(traceback.format_exc())
            return {"error": f"Prediction failed: {str(e)}"}

    def _get_risk_level(self, prediction, confidence):
        if prediction == "Healthy":
            return "Low"
        if confidence > 0.8:
            return "Critical"
        if confidence > 0.5:
            return "Moderate"
        return "Low"

    def _get_functional_risks(self, lobe):
        risks = {
            "Frontal": ["Motor control impairment", "Executive function loss", "Personality changes"],
            "Parietal": ["Sensory integration issues", "Spatial awareness deficits", "Language processing difficulty"],
            "Occipital": ["Vision loss", "Visual hallucinations", "Color recognition issues"],
            "Temporal": ["Memory impairment", "Auditory processing issues", "Language comprehension (Wernicke's area)"],
            "Central": ["Primary motor/sensory deficits", "Limb weakness"]
        }
        for key, value in risks.items():
            if key in lobe:
                return value
        return ["General intracranial pressure increase", "Neurological deficit"]

def brain_tumor_risk(patient_dict):
    image_path = patient_dict.get("mri_image_path")
    if not image_path:
        return {"error": "No MRI image path provided"}
    agent = BrainTumorAgent()
    return agent.predict(image_path)
