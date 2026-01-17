# 🚀 Quick Reference Guide

## Project Structure

```
HEALTHCARE_PROJECT/
├── backend/                    # FastAPI + PostgreSQL Backend
│   ├── __init__.py
│   ├── main.py                # FastAPI app & routes
│   ├── database.py            # DB connection
│   ├── models.py              # SQLAlchemy models
│   ├── schemas.py             # Pydantic schemas
│   ├── crud.py                # Database operations
│   ├── services.py            # Business logic
│   └── init_db.py             # DB initialization
│
├── src/                       # ML Pipeline & Core Logic
│   ├── agents/                # Disease-specific agents
│   ├── coordinator/           # Orchestration & aggregation
│   ├── core/                  # LLM client & utilities
│   └── models/                # Model loading
│
├── models/                    # Trained ML models (.pkl)
├── data/                      # Datasets
├── notebooks/                 # Jupyter notebooks
│
├── streamlit_app.py           # Streamlit UI
├── test_api.py                # API testing script
├── sample_request.json        # Example API request
│
├── .env                       # Environment variables
├── requirements.txt           # Python dependencies
│
├── README.md                  # Main documentation
├── SETUP.md                   # Installation guide
├── DATABASE_SETUP.md          # PostgreSQL setup
├── BACKEND_GUIDE.md           # API documentation
└── PROJECT_SUMMARY.md         # Complete overview
```

## Quick Commands

### Setup

```powershell
# Create virtual environment
python -m venv venv

# Activate (Windows)
.\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Setup database
python -m backend.init_db
```

### Run Applications

```powershell
# Streamlit UI
streamlit run streamlit_app.py

# FastAPI Backend
python -m backend.main

# CLI Version
python -m src.main
```

### Testing

```powershell
# Test LLM Client
python -m src.core.test_gemini

# Test Doctor Agent
python -m src.agents.test_doctor_agent

# Test API
python test_api.py
```

### Access Points

- **Streamlit UI**: http://localhost:8501
- **FastAPI Docs**: http://localhost:8000/api/docs
- **API ReDoc**: http://localhost:8000/api/redoc
- **API Health**: http://localhost:8000/health

## API Endpoints Quick Reference

### Core Endpoints

- `POST /api/analyze` - Complete health analysis (all-in-one)
- `GET /health` - Health check

### Patients

- `POST /api/patients` - Create patient
- `GET /api/patients/{id}` - Get patient
- `GET /api/patients` - List patients

### Medical Records

- `POST /api/medical-records` - Create record
- `GET /api/patients/{id}/medical-records` - Get records

### Consultations

- `POST /api/consultations` - Start consultation
- `GET /api/consultations/{id}` - Get consultation
- `PATCH /api/consultations/{id}` - Update consultation

### Assessments

- `POST /api/assessments` - Create assessment
- `GET /api/consultations/{id}/assessments` - Get assessments

## Database Quick Reference

### Connect to Database

```powershell
psql -U postgres -d healthcare_db
```

### Useful SQL Queries

```sql
-- List all tables
\dt

-- View patients
SELECT * FROM patients;

-- View recent assessments
SELECT
    p.age, p.gender,
    ha.overall_risk_level,
    ha.overall_risk_score,
    ha.assessed_at
FROM patients p
JOIN consultations c ON c.patient_id = p.id
JOIN health_assessments ha ON ha.consultation_id = c.id
ORDER BY ha.assessed_at DESC
LIMIT 10;

-- Count by risk level
SELECT
    overall_risk_level,
    COUNT(*) as count
FROM health_assessments
GROUP BY overall_risk_level;

-- High-risk patients
SELECT DISTINCT
    p.id,
    p.age,
    p.gender,
    ha.primary_concerns
FROM patients p
JOIN consultations c ON c.patient_id = p.id
JOIN health_assessments ha ON ha.consultation_id = c.id
WHERE ha.overall_risk_level IN ('High', 'Critical');
```

## Environment Variables

```env
# Required
GROQ_API_KEY=your_api_key
DATABASE_URL=postgresql://postgres:password@localhost:5432/healthcare_db

# Optional
API_HOST=0.0.0.0
API_PORT=8000
```

## Common Issues & Solutions

### Port Already in Use

```powershell
# Find process
netstat -ano | findstr :8000

# Kill process
taskkill /PID <pid> /F
```

### Database Connection Error

1. Check PostgreSQL is running: `Get-Service postgresql*`
2. Verify DATABASE_URL in .env
3. Ensure database exists: `psql -U postgres -l`

### Import Errors

- Ensure you're in project root
- Activate virtual environment
- Reinstall dependencies: `pip install -r requirements.txt`

### Module Not Found

```powershell
# Add project to Python path (temporary)
$env:PYTHONPATH = "C:\Users\hp\Desktop\HEALTHCARE_PROJECT"
```

## Example API Call (Python)

```python
import requests

# Complete analysis
response = requests.post(
    "http://localhost:8000/api/analyze",
    json={
        "patient_data": {
            "age": 58,
            "gender": "Male",
            "email": "patient@example.com"
        },
        "medical_data": {
            "bmi": 31.5,
            "blood_pressure": 150,
            "blood_glucose": 210.0,
            "hba1c": 7.8,
            "cholesterol": 240.0,
            "creatinine": 2.1,
            "hypertension": True,
            "diabetes": True,
            "smoking_status": "current",
            "chest_pain": True,
            "breathlessness": True
        },
        "conversation_history": [],
        "role": "Patient"
    }
)

result = response.json()
print(f"Risk: {result['assessment']['overall_risk_level']}")
print(f"Score: {result['assessment']['overall_risk_score']}%")
```

## Example API Call (cURL)

```bash
curl -X POST "http://localhost:8000/api/analyze" \
  -H "Content-Type: application/json" \
  -d @sample_request.json
```

## Tech Stack Summary

### Frontend

- Streamlit (UI)
- HTML/CSS (Custom styling)

### Backend

- FastAPI (REST API)
- SQLAlchemy (ORM)
- PostgreSQL (Database)
- Pydantic (Validation)

### ML/AI

- Scikit-learn (ML models)
- Groq API (LLM - Llama 3.3)
- Pandas/NumPy (Data processing)

### Additional

- SpeechRecognition (Voice input)
- Python-dotenv (Environment variables)
- Uvicorn (ASGI server)

## Documentation Files

- **README.md** - Project overview
- **SETUP.md** - Installation guide
- **DATABASE_SETUP.md** - PostgreSQL setup
- **BACKEND_GUIDE.md** - API documentation
- **PROJECT_SUMMARY.md** - Complete summary
- **QUICK_REFERENCE.md** - This file

## Support

For issues or questions:

1. Check documentation files
2. Review error messages carefully
3. Verify environment variables
4. Check database connection
5. Ensure all dependencies installed
