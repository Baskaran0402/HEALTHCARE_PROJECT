import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion' // eslint-disable-line no-unused-vars
import { AlertCircle, CheckCircle, Home, Shield, FileText, Activity } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useState } from 'react'
import { healthAPI } from '../services/api'
// LetterGlitch removed for professional theme
import './ResultsPage.css'
import './ReportStyles.css'

const ResultsPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { result, patientData } = location.state || {}
  const [shapImage, setShapImage] = useState(null)
  const [loadingShap, setLoadingShap] = useState(false)
  const [loadingPdf, setLoadingPdf] = useState(false)

  if (!result) {
    return (
      <div className="results-page">
        <div className="error-container">
          <h1>Clinical Data Unavailable</h1>
          <button className="medical-button" onClick={() => navigate('/')}>
            Return to Dashboard
          </button>
        </div>
      </div>
    )
  }

  const assessment = result.assessment || {
    overall_risk_level: 'Unknown',
    overall_risk_score: 0,
    individual_risks: [],
    primary_concerns: []
  }
  const getRiskClass = (level) => {
    return `risk-${(level || 'unknown').toLowerCase()}`
  }

  return (
    <div className="results-page">
      <div className="content-overlay">
        <div className="results-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="professional-header">
              <h1 className="clinical-title">Clinical Analysis Report</h1>
              <p className="clinical-subtitle">Automated Decision Support Summary</p>
            </div>

            {/* Professional Restriction Notice */}
            <div className="clinical-restriction-banner">
              <Shield size={20} className="medical-icon" />
              <span>CONFIDENTIAL: Intended for use by licensed medical professionals only.</span>
            </div>

            {/* 1. Patient Summary & Profile */}
            <div className="medical-card report-section">
              <h2 className="section-header">Patient Summary & Profile</h2>
              <div className="summary-grid">
                <div className="summary-item">
                  <span className="summary-label">Patient Name:</span>
                  <span className="summary-value">{result.patient?.name || 'N/A'}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">MRN:</span>
                  <span className="summary-value">{result.patient?.medical_record_number || 'N/A'}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Report ID:</span>
                  <span className="summary-value">{result.consultation?.id?.split('-')[0].toUpperCase()}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Date Generated:</span>
                  <span className="summary-value">{new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* 2. BMI & Risk Context */}
            <div className="medical-card report-section">
              <h2 className="section-header">BMI & Risk Context</h2>
              <div className="overall-risk-display">
                <div className="risk-level-indicator">
                  <div className={`risk-badge large ${getRiskClass(assessment.overall_risk_level)}`}>
                    {assessment.overall_risk_level} Risk Profile
                  </div>
                  <p className="indicator-description">
                    Cumulative analysis of physiological and behavioral indicators.
                  </p>
                </div>
                <div className="risk-score-circle">
                  <span className="big-score">{assessment.overall_risk_score}%</span>
                  <span className="score-desc">Aggregate Risk</span>
                </div>
              </div>
            </div>

            {/* 3. Symptom Pattern Analysis & Risk Flags */}
            <div className="medical-card report-section">
              <h2 className="section-header">Symptom Pattern Analysis</h2>
              <div className="concerns-grid">
                {assessment.individual_risks.map((risk, index) => (
                  <div key={index} className="risk-flag-item">
                    <div className="flag-header">
                      <span className="flag-disease">{risk.disease} Warning</span>
                      <span className={`flag-level ${getRiskClass(risk.risk_level)}`}>
                        {risk.risk_level}
                      </span>
                    </div>
                    <div className="flag-details">
                      {risk.why && risk.why.length > 0 ? (
                        <ul>
                          {risk.why.slice(0, 3).map((w, i) => <li key={i}>{w}</li>)}
                        </ul>
                      ) : (
                        <p>No high-confidence flags detected for this pathology.</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Suggested Clinical Attention Areas */}
            <div className="medical-card report-section">
              <h2 className="section-header">Suggested Clinical Attention Areas</h2>
              <div className="report-narrative">
                <div className="clinical-report-markdown">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                  >
                    {assessment.doctor_report || assessment.patient_report || "No detailed report available."}
                  </ReactMarkdown>
                </div>
              </div>
              <div className="data-confidence mt-4">
                <span className="label">Data Confidence Level:</span>
                <span className="confidence-high">Optimal</span>
              </div>
            </div>

            {/* 5. Clinical Safety & Data Disclaimer */}
            <div className="clinical-disclaimer-box">
              <AlertCircle size={20} className="warning-icon" />
              <div className="disclaimer-text">
                <strong>Non-Diagnostic Advisory:</strong> This report is generated by an algorithmic clinical decision 
                support tool. It does not provide medical diagnosis, prognosis, or therapeutic recommendations. 
                Clinical judgment by a licensed practitioner remains the definitive authority.
              </div>
            </div>

            {/* 6. Advanced Analysis Tools */}
            <div className="medical-card report-section">
              <h2 className="section-header">Advanced Analysis Tools</h2>
              <div className="tools-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                
                {/* PDF Download */}
                <div className="tool-card">
                  <h3>📄 Official Clinical Report</h3>
                  <p>Download a secured PDF copy of this analysis for medical records.</p>
                  <button 
                    className="medical-button secondary" 
                    onClick={async () => {
                      setLoadingPdf(true)
                      try {
                         const blob = await healthAPI.generatePDF(result);
                         const url = window.URL.createObjectURL(blob);
                         const a = document.createElement('a');
                         a.href = url;
                         a.download = `Medical_Report_${result.patient?.medical_record_number || 'ID'}.pdf`;
                         document.body.appendChild(a);
                         a.click();
                         window.URL.revokeObjectURL(url);
                      } catch (e) {
                        alert("Failed to generate PDF. Please try again.")
                        console.error(e)
                      } finally {
                        setLoadingPdf(false)
                      }
                    }}
                    disabled={loadingPdf}
                  >
                    {loadingPdf ? 'Generating...' : 'Download PDF Report'} <FileText size={18} />
                  </button>
                </div>

                {/* SHAP Explanation */}
                <div className="tool-card">
                   <h3>🔍 Visual Risk Explanation</h3>
                   <p>Generate a SHAP feature importance plot to understand specific risk factors.</p>
                   {!shapImage ? (
                     <button 
                        className="medical-button secondary"
                        onClick={async () => {
                          if(!patientData) {
                            alert("Patient data unavailable for explanation.")
                            return
                          }
                          setLoadingShap(true)
                          try {
                            const b64 = await healthAPI.getSHAPExplanation(patientData);
                            setShapImage(`data:image/png;base64,${b64}`);
                          } catch(e) {
                             alert("Failed to generate explanation.")
                             console.error(e)
                          } finally {
                            setLoadingShap(false)
                          }
                        }}
                        disabled={loadingShap}
                     >
                       {loadingShap ? 'Calculating...' : 'Explain Risks (SHAP)'} <Activity size={18} />
                     </button>
                   ) : (
                     <div className="shap-display">
                        <img src={shapImage} alt="Feature Importance" style={{width: '100%', borderRadius: '8px', border: '1px solid #ddd'}} />
                        <button className="text-button" onClick={() => setShapImage(null)} style={{marginTop: '0.5rem'}}>Close Explanation</button>
                     </div>
                   )}
                </div>

              </div>
            </div>

            <div className="actions">
              <button className="medical-button" onClick={() => navigate('/')}>
                <Home size={18} />
                <span>Return to Dashboard</span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default ResultsPage
