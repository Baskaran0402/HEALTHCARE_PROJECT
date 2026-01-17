"""
Unit tests for ML disease prediction agents
"""
import pytest
import numpy as np
from src.agents.diabetes_agent import DiabetesAgent
from src.agents.heart_agent import HeartAgent
from src.agents.stroke_agent import StrokeAgent
from src.agents.kidney_agent import KidneyAgent
from src.agents.liver_agent import LiverAgent


class TestDiabetesAgent:
    """Test cases for Diabetes prediction agent"""
    
    def setup_method(self):
        """Initialize agent before each test"""
        self.agent = DiabetesAgent()
    
    def test_agent_initialization(self):
        """Test that agent loads successfully"""
        assert self.agent is not None
        assert hasattr(self.agent, 'predict')
    
    def test_high_risk_prediction(self):
        """Test prediction for high-risk patient"""
        # High-risk patient data
        patient_data = {
            'age': 65,
            'bmi': 35.5,
            'blood_glucose': 180,
            'hba1c': 8.5,
            'hypertension': True,
            'family_history': True
        }
        
        result = self.agent.predict(patient_data)
        
        assert 'risk_score' in result
        assert 'risk_level' in result
        assert result['risk_score'] > 50  # Should be high risk
        assert result['risk_level'] in ['High', 'Critical']
    
    def test_low_risk_prediction(self):
        """Test prediction for low-risk patient"""
        # Low-risk patient data
        patient_data = {
            'age': 30,
            'bmi': 22.0,
            'blood_glucose': 90,
            'hba1c': 5.2,
            'hypertension': False,
            'family_history': False
        }
        
        result = self.agent.predict(patient_data)
        
        assert result['risk_score'] < 30  # Should be low risk
        assert result['risk_level'] == 'Low'


class TestHeartAgent:
    """Test cases for Heart Disease prediction agent"""
    
    def setup_method(self):
        """Initialize agent before each test"""
        self.agent = HeartAgent()
    
    def test_agent_initialization(self):
        """Test that agent loads successfully"""
        assert self.agent is not None
    
    def test_prediction_output_format(self):
        """Test that prediction returns correct format"""
        patient_data = {
            'age': 55,
            'cholesterol': 240,
            'blood_pressure': 140,
            'chest_pain': True,
            'smoking': True
        }
        
        result = self.agent.predict(patient_data)
        
        # Verify output structure
        assert isinstance(result, dict)
        assert 'risk_score' in result
        assert 'risk_level' in result
        assert 'disease' in result
        assert result['disease'] == 'Heart Disease'
        
        # Verify risk score is valid percentage
        assert 0 <= result['risk_score'] <= 100


class TestStrokeAgent:
    """Test cases for Stroke prediction agent"""
    
    def setup_method(self):
        """Initialize agent before each test"""
        self.agent = StrokeAgent()
    
    def test_missing_data_handling(self):
        """Test agent handles missing data gracefully"""
        # Incomplete patient data
        patient_data = {
            'age': 70,
            'hypertension': True
            # Missing other fields
        }
        
        # Should not raise exception
        result = self.agent.predict(patient_data)
        assert result is not None


class TestKidneyAgent:
    """Test cases for Kidney Disease prediction agent"""
    
    def setup_method(self):
        """Initialize agent before each test"""
        self.agent = KidneyAgent()
    
    def test_creatinine_impact(self):
        """Test that high creatinine increases risk"""
        # Patient with normal creatinine
        normal_patient = {
            'age': 50,
            'creatinine': 1.0,
            'blood_pressure': 120
        }
        
        # Patient with high creatinine
        high_creatinine_patient = {
            'age': 50,
            'creatinine': 3.5,
            'blood_pressure': 120
        }
        
        normal_result = self.agent.predict(normal_patient)
        high_result = self.agent.predict(high_creatinine_patient)
        
        # High creatinine should result in higher risk
        assert high_result['risk_score'] > normal_result['risk_score']


class TestLiverAgent:
    """Test cases for Liver Disease prediction agent"""
    
    def setup_method(self):
        """Initialize agent before each test"""
        self.agent = LiverAgent()
    
    def test_risk_level_classification(self):
        """Test risk level is correctly classified"""
        patient_data = {
            'age': 45,
            'bilirubin': 2.5,
            'albumin': 3.0
        }
        
        result = self.agent.predict(patient_data)
        risk_level = result['risk_level']
        
        # Risk level should be one of the valid categories
        assert risk_level in ['Low', 'Moderate', 'High', 'Critical']


class TestAgentIntegration:
    """Integration tests for multiple agents"""
    
    def test_all_agents_load(self):
        """Test that all agents can be loaded simultaneously"""
        agents = {
            'diabetes': DiabetesAgent(),
            'heart': HeartAgent(),
            'stroke': StrokeAgent(),
            'kidney': KidneyAgent(),
            'liver': LiverAgent()
        }
        
        assert len(agents) == 5
        for name, agent in agents.items():
            assert agent is not None
    
    def test_consistent_output_format(self):
        """Test all agents return consistent output format"""
        patient_data = {
            'age': 55,
            'bmi': 28.0,
            'blood_pressure': 130,
            'cholesterol': 200,
            'blood_glucose': 110,
            'creatinine': 1.2
        }
        
        agents = [
            DiabetesAgent(),
            HeartAgent(),
            StrokeAgent(),
            KidneyAgent(),
            LiverAgent()
        ]
        
        for agent in agents:
            result = agent.predict(patient_data)
            
            # All agents should return these fields
            assert 'risk_score' in result
            assert 'risk_level' in result
            assert 'disease' in result
            
            # Risk score should be valid
            assert isinstance(result['risk_score'], (int, float))
            assert 0 <= result['risk_score'] <= 100


if __name__ == '__main__':
    pytest.main([__file__, '-v'])
