import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { healthAPI } from '../services/api'
import './ConsultationPage.css'

const ConsultationPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const role = location.state?.role || 'Patient'

  const [formData, setFormData] = useState({
    // Patient Identification
    patient_name: '',
    medical_record_number: '',
    
    // Demographics
    age: '',
    gender: 'Male',
    height: '',
    weight: '',
    bmi: '',
    
    // Vitals & Labs
    blood_pressure: '',
    blood_glucose: '',
    hba1c: '',
    cholesterol: '',
    creatinine: '',
    
    // Medical History
    hypertension: false,
    diabetes: false,
    heart_disease: false,
    smoking_status: 'never',
    
    // Symptoms
    chest_pain: false,
    breathlessness: false,
    fatigue: false,
    edema: false,
  })

  const [loading, setLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('')

  // BMI Calculation Effect
  useEffect(() => {
    if (formData.height && formData.weight) {
      const heightInMeters = parseFloat(formData.height) / 100
      const weightInKg = parseFloat(formData.weight)
      if (heightInMeters > 0) {
        const bmiValue = (weightInKg / (heightInMeters * heightInMeters)).toFixed(1)
        setFormData(prev => ({ ...prev, bmi: bmiValue }))
      }
    }
  }, [formData.height, formData.weight])

  const getBMICategory = (bmi) => {
    if (!bmi) return ''
    const val = parseFloat(bmi)
    if (val < 18.5) return 'Underweight'
    if (val < 25) return 'Normal weight'
    if (val < 30) return 'Overweight'
    return 'Obese'
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Field Validation
    if (!formData.patient_name || !formData.patient_name.trim()) {
      alert('Patient Name is required for generating the report.')
      return
    }
    
    if (!formData.age || !formData.gender) {
      alert('Clinical demographics (Age, Gender) are required for analysis.')
      return
    }

    setLoading(true)
    setLoadingMessage('Analyzing clinical indicators...')

    try {
      const requestData = {
        patient_data: {
          name: formData.patient_name.trim(),
          medical_record_number: formData.medical_record_number || `MRN-${Date.now()}`,
          age: parseInt(formData.age),
          gender: formData.gender,
        },
        medical_data: {
          bmi: parseFloat(formData.bmi) || null,
          blood_pressure: parseInt(formData.blood_pressure) || null,
          blood_glucose: parseFloat(formData.blood_glucose) || null,
          hba1c: parseFloat(formData.hba1c) || null,
          cholesterol: parseFloat(formData.cholesterol) || null,
          creatinine: parseFloat(formData.creatinine) || null,
          hypertension: formData.hypertension,
          diabetes: formData.diabetes,
          heart_disease: formData.heart_disease,
          smoking_status: formData.smoking_status,
          chest_pain: formData.chest_pain,
          breathlessness: formData.breathlessness,
          fatigue: formData.fatigue,
          edema: formData.edema,
        },
        conversation_history: [],
        role: role,
      }

      const result = await healthAPI.analyzeHealth(requestData)
      navigate('/results', { state: { result, role } })
    } catch (error) {
      console.error('Error analyzing health:', error)
      if (error.code === 'ERR_NETWORK') {
        alert('Cannot connect to the medical analysis server. Please ensure the backend is running at http://127.0.0.1:8000')
      } else {
        alert(`Error analyzing health data: ${error.message || 'Please try again.'}`)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  return (
    <div className="consultation-page">

      <div className="content-overlay">
        <div className="consultation-container">
          <motion.div
            className="glass-card"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="professional-title-small">Clinical Indicator Assessment</h1>
            <p className="clinical-subtitle">Automated Decision Support for Physicians</p>

            <form onSubmit={handleSubmit} className="medical-form">
              {/* Patient Identification */}
              <div className="form-section">
                <h3 className="section-title">Patient Identification</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Patient Name *</label>
                    <input
                      type="text"
                      name="patient_name"
                      value={formData.patient_name}
                      onChange={handleChange}
                      className="cyber-input"
                      required
                      placeholder="Enter patient's full name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Medical Record Number (Optional)</label>
                    <input
                      type="text"
                      name="medical_record_number"
                      value={formData.medical_record_number}
                      onChange={handleChange}
                      className="cyber-input"
                      placeholder="Auto-generated if not provided"
                    />
                  </div>
                </div>
              </div>

              {/* Demographics */}
              <div className="form-section">
                <h3 className="section-title">Demographics</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Age *</label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      className="cyber-input"
                      required
                      min="0"
                      max="120"
                    />
                  </div>
                  <div className="form-group">
                    <label>Gender *</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="cyber-input"
                      required
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Height (cm) *</label>
                    <input
                      type="number"
                      name="height"
                      value={formData.height}
                      onChange={handleChange}
                      className="cyber-input"
                      required
                      placeholder="e.g. 175"
                    />
                  </div>
                  <div className="form-group">
                    <label>Weight (kg) *</label>
                    <input
                      type="number"
                      name="weight"
                      value={formData.weight}
                      onChange={handleChange}
                      className="cyber-input"
                      required
                      placeholder="e.g. 70"
                    />
                  </div>
                  <div className="form-group">
                    <label>Calculated BMI (Auto)</label>
                    <div className="bmi-display">
                      <input
                        type="text"
                        name="bmi"
                        value={formData.bmi}
                        className="cyber-input readonly"
                        readOnly
                        placeholder="N/A"
                      />
                      {formData.bmi && (
                        <span className={`bmi-category ${getBMICategory(formData.bmi).toLowerCase().split(' ')[0]}`}>
                          {getBMICategory(formData.bmi)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Vitals & Labs */}
              <div className="form-section">
                <h3 className="section-title">Vital Signs & Lab Values</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Blood Pressure (mmHg)</label>
                    <input
                      type="number"
                      name="blood_pressure"
                      value={formData.blood_pressure}
                      onChange={handleChange}
                      className="cyber-input"
                      min="60"
                      max="250"
                    />
                  </div>
                  <div className="form-group">
                    <label>Blood Glucose (mg/dL)</label>
                    <input
                      type="number"
                      name="blood_glucose"
                      value={formData.blood_glucose}
                      onChange={handleChange}
                      className="cyber-input"
                      step="0.1"
                      min="50"
                      max="500"
                    />
                  </div>
                  <div className="form-group">
                    <label>HbA1c (%)</label>
                    <input
                      type="number"
                      name="hba1c"
                      value={formData.hba1c}
                      onChange={handleChange}
                      className="cyber-input"
                      step="0.1"
                      min="3"
                      max="15"
                    />
                  </div>
                  <div className="form-group">
                    <label>Cholesterol (mg/dL)</label>
                    <input
                      type="number"
                      name="cholesterol"
                      value={formData.cholesterol}
                      onChange={handleChange}
                      className="cyber-input"
                      min="100"
                      max="400"
                    />
                  </div>
                  <div className="form-group">
                    <label>Creatinine (mg/dL)</label>
                    <input
                      type="number"
                      name="creatinine"
                      value={formData.creatinine}
                      onChange={handleChange}
                      className="cyber-input"
                      step="0.1"
                      min="0.1"
                      max="10"
                    />
                  </div>
                </div>
              </div>

              {/* Medical History */}
              <div className="form-section">
                <h3 className="section-title">Medical History</h3>
                <div className="checkbox-grid">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="hypertension"
                      checked={formData.hypertension}
                      onChange={handleChange}
                    />
                    <span>Hypertension</span>
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="diabetes"
                      checked={formData.diabetes}
                      onChange={handleChange}
                    />
                    <span>Diabetes</span>
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="heart_disease"
                      checked={formData.heart_disease}
                      onChange={handleChange}
                    />
                    <span>Heart Disease</span>
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="chest_pain"
                      checked={formData.chest_pain}
                      onChange={handleChange}
                    />
                    <span>Chest Pain</span>
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="breathlessness"
                      checked={formData.breathlessness}
                      onChange={handleChange}
                    />
                    <span>Breathlessness</span>
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="fatigue"
                      checked={formData.fatigue}
                      onChange={handleChange}
                    />
                    <span>Fatigue</span>
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="edema"
                      checked={formData.edema}
                      onChange={handleChange}
                    />
                    <span>Swelling (Edema)</span>
                  </label>
                </div>
              </div>

              {/* Lifestyle */}
              <div className="form-section">
                <h3 className="section-title">Lifestyle Factors</h3>
                <div className="form-group">
                  <label>Smoking History</label>
                  <select
                    name="smoking_status"
                    value={formData.smoking_status}
                    onChange={handleChange}
                    className="cyber-input"
                  >
                    <option value="never">Never</option>
                    <option value="former">Former</option>
                    <option value="current">Current</option>
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                className="neon-button submit-button"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.05 }}
                whileTap={{ scale: loading ? 1 : 0.95 }}
              >
                {loading ? loadingMessage : 'Analyze Clinical Indicators'}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default ConsultationPage
