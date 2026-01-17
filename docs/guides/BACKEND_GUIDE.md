# 🚀 FastAPI Backend Guide

## Overview

The FastAPI backend provides a RESTful API for the healthcare system with PostgreSQL database integration.

## Architecture

```
backend/
├── __init__.py          # Package initialization
├── main.py              # FastAPI application & routes
├── database.py          # Database connection & session
├── models.py            # SQLAlchemy ORM models
├── schemas.py           # Pydantic request/response schemas
├── crud.py              # Database CRUD operations
├── services.py          # Business logic layer
└── init_db.py           # Database initialization script
```

## Installation

1. **Install Dependencies**:

   ```powershell
   pip install -r requirements.txt
   ```

2. **Setup PostgreSQL** (see `DATABASE_SETUP.md`)

3. **Configure Environment**:
   Update `.env` with database URL:

   ```env
   DATABASE_URL=postgresql://postgres:password@localhost:5432/healthcare_db
   ```

4. **Initialize Database**:
   ```powershell
   python -m backend.init_db
   ```

## Running the API

### Development Mode

```powershell
python -m backend.main
```

Or using uvicorn directly:

```powershell
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:

- **API**: http://localhost:8000
- **Interactive Docs**: http://localhost:8000/api/docs
- **ReDoc**: http://localhost:8000/api/redoc

## API Endpoints

### Health Check

- `GET /` - Root endpoint
- `GET /health` - Health check

### Patients

- `POST /api/patients` - Create patient
- `GET /api/patients/{patient_id}` - Get patient by ID
- `GET /api/patients` - List all patients

### Medical Records

- `POST /api/medical-records` - Create medical record
- `GET /api/patients/{patient_id}/medical-records` - Get patient's medical records

### Consultations

- `POST /api/consultations` - Start consultation
- `GET /api/consultations/{consultation_id}` - Get consultation
- `PATCH /api/consultations/{consultation_id}` - Update consultation

### Health Assessments

- `POST /api/assessments` - Create assessment
- `GET /api/consultations/{consultation_id}/assessments` - Get consultation assessments

### Complete Analysis (All-in-One)

- `POST /api/analyze` - Complete health analysis workflow

## Example Usage

### 1. Complete Health Analysis

This endpoint handles the entire workflow in one request:

```python
import requests

url = "http://localhost:8000/api/analyze"

data = {
    "patient_data": {
        "age": 58,
        "gender": "Male",
        "email": "patient@example.com",
        "phone": "+1234567890"
    },
    "medical_data": {
        "bmi": 31.5,
        "blood_pressure": 150,
        "blood_glucose": 210.0,
        "hba1c": 7.8,
        "cholesterol": 240.0,
        "creatinine": 2.1,
        "urea": 55.0,
        "bilirubin_total": 3.0,
        "alt": 85.0,
        "ast": 90.0,
        "hypertension": True,
        "diabetes": True,
        "heart_disease": False,
        "smoking_status": "current",
        "chest_pain": True,
        "breathlessness": True,
        "fatigue": True,
        "edema": True
    },
    "conversation_history": [
        {"role": "doctor", "content": "What brings you in today?"},
        {"role": "patient", "content": "I've been feeling tired and having chest pain."}
    ],
    "role": "Patient"
}

response = requests.post(url, json=data)
result = response.json()

print(f"Patient ID: {result['patient']['id']}")
print(f"Overall Risk: {result['assessment']['overall_risk_level']}")
print(f"Risk Score: {result['assessment']['overall_risk_score']}%")
```

### 2. Step-by-Step Workflow

```python
import requests

base_url = "http://localhost:8000/api"

# Step 1: Create patient
patient_data = {
    "age": 45,
    "gender": "Female",
    "email": "jane@example.com"
}
patient = requests.post(f"{base_url}/patients", json=patient_data).json()
patient_id = patient["id"]

# Step 2: Create medical record
medical_data = {
    "patient_id": patient_id,
    "bmi": 28.5,
    "blood_pressure": 130,
    "blood_glucose": 110.0,
    "hba1c": 5.8,
    "cholesterol": 200.0,
    "hypertension": False,
    "diabetes": False,
    "smoking_status": "never"
}
record = requests.post(f"{base_url}/medical-records", json=medical_data).json()

# Step 3: Start consultation
consultation_data = {
    "patient_id": patient_id,
    "role": "Patient"
}
consultation = requests.post(f"{base_url}/consultations", json=consultation_data).json()
consultation_id = consultation["id"]

# Step 4: Get patient's medical records
records = requests.get(f"{base_url}/patients/{patient_id}/medical-records").json()
print(f"Total records: {len(records)}")
```

## Testing with cURL

### Create Patient

```bash
curl -X POST "http://localhost:8000/api/patients" \
  -H "Content-Type: application/json" \
  -d '{
    "age": 50,
    "gender": "Male",
    "email": "test@example.com"
  }'
```

### Complete Analysis

```bash
curl -X POST "http://localhost:8000/api/analyze" \
  -H "Content-Type: application/json" \
  -d @sample_request.json
```

## Database Queries

You can query the database directly:

```sql
-- Get all patients
SELECT * FROM patients;

-- Get consultations with risk levels
SELECT
    c.id,
    c.started_at,
    ha.overall_risk_level,
    ha.overall_risk_score
FROM consultations c
JOIN health_assessments ha ON ha.consultation_id = c.id
ORDER BY c.started_at DESC;

-- Get high-risk patients
SELECT DISTINCT
    p.id,
    p.age,
    p.gender,
    ha.overall_risk_level,
    ha.primary_concerns
FROM patients p
JOIN consultations c ON c.patient_id = p.id
JOIN health_assessments ha ON ha.consultation_id = c.id
WHERE ha.overall_risk_level IN ('High', 'Critical')
ORDER BY ha.assessed_at DESC;
```

## Integration with Streamlit

You can modify the Streamlit app to use the API instead of direct ML calls:

```python
import requests

# In streamlit_app.py, replace the ML execution with API call
response = requests.post(
    "http://localhost:8000/api/analyze",
    json={
        "patient_data": {...},
        "medical_data": {...},
        "conversation_history": st.session_state.conversation,
        "role": st.session_state.role
    }
)

result = response.json()
st.session_state.ml_report = result["assessment"]
```

## Production Deployment

For production:

1. **Use environment variables** for sensitive data
2. **Enable HTTPS** with SSL certificates
3. **Configure CORS** properly (restrict origins)
4. **Add authentication** (JWT tokens, OAuth2)
5. **Use connection pooling** for database
6. **Add rate limiting** to prevent abuse
7. **Set up monitoring** (logging, metrics)

## Troubleshooting

### Port Already in Use

```powershell
# Find process using port 8000
netstat -ano | findstr :8000

# Kill the process
taskkill /PID <process_id> /F
```

### Database Connection Error

- Verify PostgreSQL is running
- Check `DATABASE_URL` in `.env`
- Ensure database exists

### Import Errors

- Make sure you're in the project root directory
- Verify all dependencies are installed
