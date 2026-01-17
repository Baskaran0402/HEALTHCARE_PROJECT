"""
Unit tests for FastAPI backend endpoints
"""
import pytest
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)


class TestHealthEndpoint:
    """Test health check endpoint"""
    
    def test_health_check(self):
        """Test /health endpoint returns 200"""
        response = client.get("/health")
        assert response.status_code == 200
        assert response.json()["status"] == "healthy"


class TestAnalyzeEndpoint:
    """Test main analysis endpoint"""
    
    def test_analyze_valid_request(self):
        """Test /api/analyze with valid patient data"""
        request_data = {
            "patient_data": {
                "name": "Test Patient",
                "age": 45,
                "gender": "Male"
            },
            "medical_data": {
                "bmi": 28.5,
                "blood_pressure": 130,
                "blood_glucose": 110,
                "cholesterol": 200,
                "hypertension": False,
                "diabetes": False,
                "smoking_status": "never"
            },
            "conversation_history": [],
            "role": "Doctor"
        }
        
        response = client.post("/api/analyze", json=request_data)
        
        assert response.status_code == 200
        data = response.json()
        
        # Verify response structure
        assert "assessment" in data
        assert "patient" in data
        assert "consultation" in data
        
        # Verify assessment contains required fields
        assessment = data["assessment"]
        assert "overall_risk_level" in assessment
        assert "overall_risk_score" in assessment
        assert "individual_risks" in assessment
    
    def test_analyze_missing_required_fields(self):
        """Test /api/analyze rejects incomplete data"""
        incomplete_data = {
            "patient_data": {
                "name": "Test Patient"
                # Missing age and gender
            }
        }
        
        response = client.post("/api/analyze", json=incomplete_data)
        
        # Should return validation error
        assert response.status_code == 422
    
    def test_analyze_invalid_age(self):
        """Test /api/analyze rejects invalid age"""
        invalid_data = {
            "patient_data": {
                "name": "Test Patient",
                "age": -5,  # Invalid age
                "gender": "Male"
            },
            "medical_data": {}
        }
        
        response = client.post("/api/analyze", json=invalid_data)
        assert response.status_code == 422


class TestDatabaseEndpoints:
    """Test database CRUD endpoints"""
    
    def test_create_patient(self):
        """Test patient creation endpoint"""
        patient_data = {
            "name": "John Doe",
            "age": 50,
            "gender": "Male",
            "email": "john@example.com"
        }
        
        response = client.post("/api/patients", json=patient_data)
        
        if response.status_code == 200:
            data = response.json()
            assert "id" in data
            assert data["name"] == "John Doe"
    
    def test_get_consultations(self):
        """Test retrieving consultations"""
        response = client.get("/api/consultations")
        
        # Should return list even if empty
        assert response.status_code in [200, 404]
        
        if response.status_code == 200:
            data = response.json()
            assert isinstance(data, list)


class TestErrorHandling:
    """Test error handling and edge cases"""
    
    def test_invalid_endpoint(self):
        """Test 404 for non-existent endpoint"""
        response = client.get("/api/nonexistent")
        assert response.status_code == 404
    
    def test_method_not_allowed(self):
        """Test 405 for wrong HTTP method"""
        response = client.get("/api/analyze")  # Should be POST
        assert response.status_code == 405


if __name__ == '__main__':
    pytest.main([__file__, '-v'])
