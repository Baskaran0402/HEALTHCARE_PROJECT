
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { healthAPI } from '../services/api'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Home, FileText, Activity, AlertCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import './PatientDashboard.css'

const PatientDashboard = () => {
  const { patientId } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [patient, setPatient] = useState(null)
  const [assessments, setAssessments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientData, assessmentsData] = await Promise.all([
          healthAPI.getPatient(patientId),
          healthAPI.getPatientAssessments(patientId)
        ])
        setPatient(patientData)
        setAssessments(assessmentsData)
      } catch (error) {
        console.error("Failed to load dashboard data", error)
      } finally {
        setLoading(false)
      }
    }
    if (patientId) {
      fetchData()
    }
  }, [patientId])

  if (loading) return <div className="loading-screen">Loading Patient Dashboard...</div>
  
  if (!patient) return (
      <div className="dashboard-error">
          <AlertCircle size={48} />
          <h2>Patient Not Found</h2>
          <button className="medical-button" onClick={() => navigate('/')}>Return Home</button>
      </div>
  )

  // Chart Data Preparation
  const chartData = assessments.map(a => ({
      date: new Date(a.assessed_at).toLocaleDateString(),
      risk: a.overall_risk_score,
      level: a.overall_risk_level
  })).reverse()

  return (
    <div className="patient-dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">{t("patient_dashboard", "Patient Health Dashboard")}</h1>
        <div className="patient-meta">
            <span>Name: {patient.name}</span>
            <span>MRN: {patient.medical_record_number}</span>
            <span>Age: {patient.age}</span>
        </div>
      </div>

      <div className="dashboard-grid">
          {/* Risk Trend Chart */}
          <div className="dashboard-card chart-card">
              <h3><Activity size={20} /> Overall Risk Trend</h3>
              <div className="chart-container">
                  <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis dataKey="date" stroke="#64748b" />
                          <YAxis stroke="#64748b" domain={[0, 100]} />
                          <Tooltip 
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                          />
                          <Legend />
                          <Line type="monotone" dataKey="risk" stroke="#3b82f6" strokeWidth={3} activeDot={{ r: 8 }} name="Risk Score (%)" />
                      </LineChart>
                  </ResponsiveContainer>
              </div>
          </div>

          {/* Assessment History */}
          <div className="dashboard-card history-card">
              <h3><FileText size={20} /> Recent Assessments</h3>
              <div className="assessment-list">
                  {assessments.map(a => (
                      <div key={a.id} className="assessment-item">
                          <div className="assessment-date">
                              {new Date(a.assessed_at).toLocaleDateString()}
                          </div>
                          <div className={`assessment-badge risk-${(a.overall_risk_level || 'low').toLowerCase()}`}>
                              {a.overall_risk_level} Risk ({a.overall_risk_score}%)
                          </div>
                          <div className="assessment-concerns">
                              {a.primary_concerns.length > 0 ? a.primary_concerns.join(", ") : "No immediate concerns"}
                          </div>
                      </div>
                  ))}
                  {assessments.length === 0 && <p className="no-data">No assessments found.</p>}
              </div>
          </div>
      </div>
      
      <div className="dashboard-actions">
          <button className="medical-button" onClick={() => navigate('/')}>
              <Home size={18} /> Back to Home
          </button>
          <button className="medical-button secondary" onClick={() => navigate('/consultation')}>
              New Assessment
          </button>
      </div>
    </div>
  )
}

export default PatientDashboard
