import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, FileText, Activity, AlertCircle, CheckCircle, Home, Loader2, Brain } from 'lucide-react'
import axios from 'axios'
import './BrainTumorPage.css'

const BrainTumorPage = () => {
  const navigate = useNavigate()
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [patientData, setPatientData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    email: ''
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
      setPreview(URL.createObjectURL(selectedFile))
      setResult(null)
      setError(null)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setPatientData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) {
      setError("Please upload an MRI image first.")
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('patient_name', patientData.name)
    formData.append('age', patientData.age)
    formData.append('gender', patientData.gender)
    if (patientData.email) formData.append('email', patientData.email)

    try {
      const response = await axios.post('http://localhost:8000/api/analyze/brain-tumor', formData, {
        params: {
          patient_name: patientData.name,
          age: patientData.age,
          gender: patientData.gender,
          email: patientData.email
        },
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      // The result is in assessment.individual_risks
      const brainTumorRisk = response.data.assessment.individual_risks.find(r => r.disease.includes('Brain Tumor'))
      setResult({
        ...brainTumorRisk,
        full_response: response.data
      })
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.detail || "An error occurred during analysis. Please check if the backend is running.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="brain-tumor-page">
      <div className="content-overlay">
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="header"
          >
            <div className="title-area">
              <Brain size={40} className="header-icon" />
              <h1>Brain Tumor Detection</h1>
              <p>AI-Powered MRI Analysis Trial</p>
            </div>
            <button className="back-home" onClick={() => navigate('/')}>
              <Home size={18} />
              <span>Dashboard</span>
            </button>
          </motion.div>

          <div className="main-grid">
            {/* Input Form */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="medical-card input-card"
            >
              <h2 className="section-title"><Activity size={20} /> Patient Information</h2>
              <form onSubmit={handleSubmit} className="patient-form">
                <div className="form-group">
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={patientData.name} 
                    onChange={handleInputChange} 
                    required 
                    placeholder="Enter patient name"
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Age</label>
                    <input 
                      type="number" 
                      name="age" 
                      value={patientData.age} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Gender</label>
                    <select name="gender" value={patientData.gender} onChange={handleInputChange}>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Email (Optional)</label>
                  <input 
                    type="email" 
                    name="email" 
                    value={patientData.email} 
                    onChange={handleInputChange} 
                    placeholder="patient@example.com"
                  />
                </div>

                <div className="upload-area">
                  <label className="upload-label">
                    <input type="file" accept="image/*" onChange={handleFileChange} hidden />
                    {preview ? (
                      <div className="preview-container">
                        <img src={preview} alt="MRI Preview" className="mri-preview" />
                        <div className="change-hint">Change Image</div>
                      </div>
                    ) : (
                      <div className="upload-placeholder">
                        <Upload size={32} />
                        <p>Click to upload Brain MRI (T1/T2/Flair)</p>
                      </div>
                    )}
                  </label>
                </div>

                <button 
                  type="submit" 
                  className="analyze-button" 
                  disabled={loading || !file}
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="spin" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Activity size={18} />
                      <span>Run Diagnostic Report</span>
                    </>
                  )}
                </button>
              </form>
            </motion.div>

            {/* Results Display */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="medical-card results-card"
            >
              <h2 className="section-title"><FileText size={20} /> Diagnostic Analysis</h2>
              
              <AnimatePresence mode="wait">
                {!result && !error && !loading && (
                  <motion.div 
                    key="waiting"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="waiting-state"
                  >
                    <div className="status-dot-idle"></div>
                    <p>Enter patient data and upload MRI to generate report</p>
                  </motion.div>
                )}

                {loading && (
                  <motion.div 
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="loading-state"
                  >
                    <div className="scanning-bars">
                      <div className="bar"></div>
                      <div className="bar"></div>
                      <div className="bar"></div>
                    </div>
                    <p>Processing Neural Network Analysis...</p>
                  </motion.div>
                )}

                {error && (
                  <motion.div 
                    key="error"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="error-state"
                  >
                    <AlertCircle size={48} color="#ef4444" />
                    <h3>Analysis Failed</h3>
                    <p>{error}</p>
                  </motion.div>
                )}

                {result && (
                  <motion.div 
                    key="result"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="result-report"
                  >
                    <div className={`risk-banner ${result.risk_level.toLowerCase()}`}>
                      <div className="risk-header">
                        <span className="risk-label">Diagnostic Status</span>
                        <span className="risk-value">{result.prediction}</span>
                      </div>
                      <div className="risk-details">
                        <div className="detail">
                          <span className="label">Tumor Probability</span>
                          <span className="val">{result.risk_score.toFixed(1)}%</span>
                        </div>
                        <div className="detail">
                          <span className="label">AI Confidence</span>
                          <span className="val">{(result.confidence * 100).toFixed(1)}%</span>
                        </div>
                        <div className="detail">
                          <span className="label">Risk Level</span>
                          <span className="val">{result.risk_level}</span>
                        </div>
                      </div>
                    </div>

                    <div className="report-content">
                      <div className="report-section">
                        <h3><Activity size={16} /> Clinical Impression</h3>
                        <p>{result.clinical_impression}</p>
                      </div>

                      <div className="report-section">
                        <h3><AlertCircle size={16} /> Key Observations</h3>
                        <ul>
                          {result.why.map((note, i) => (
                            <li key={i}>{note}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="report-section">
                        <h3><CheckCircle size={16} /> Recommended Guidelines</h3>
                        <ul>
                          {result.guidelines.map((guide, i) => (
                            <li key={i}>{guide}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="report-footer">
                      <button className="view-full-btn" onClick={() => navigate('/results', { state: { data: result.full_response } })}>
                        View Integrated Report
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BrainTumorPage
