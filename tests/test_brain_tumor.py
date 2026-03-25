import pytest
import os
import torch
import numpy as np
from PIL import Image
from src.agents.brain_tumor_agent import BrainTumorAgent


def test_brain_tumor_agent_initialization():
    agent = BrainTumorAgent()
    assert agent.classes == ["Brain Tumor", "Healthy"]
    assert agent.model is not None


def test_brain_tumor_prediction_no_file():
    agent = BrainTumorAgent()
    result = agent.predict("non_existent_file.jpg")
    assert "error" in result


def test_brain_tumor_prediction_dummy_image(tmp_path):
    # Create a dummy RGB image
    img_path = tmp_path / "test_mri.jpg"
    img = Image.fromarray(np.uint8(np.random.rand(224, 224, 3) * 255))
    img.save(img_path)

    agent = BrainTumorAgent()
    result = agent.predict(str(img_path))

    assert "disease" in result
    assert result["disease"] == "Brain Tumor Detection"
    assert "prediction" in result
    assert "confidence" in result
    assert "risk_level" in result
    assert result["prediction"] in ["Brain Tumor", "Healthy"]
