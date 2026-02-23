import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion' // eslint-disable-line no-unused-vars
import { Brain, Heart, Shield, Activity, AlertCircle } from 'lucide-react'
import './HomePage.css'

const HomePage = () => {
  const navigate = useNavigate()

  const handleStart = () => {
    navigate('/consultation')
  }

  return (
    <div className="home-page">

      {/* Content Overlay */}
      <div className="content-overlay">
        <div className="home-container">
          {/* Header */}
          <motion.div
            className="home-header"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="logo">
              <img src="/logo.png" alt="AI Doctor Logo" className="logo-img" style={{ width: '64px', height: '64px', objectFit: 'contain' }} />
              <h1 className="professional-title">AI Doctor Assistant</h1>
            </div>
            <p className="subtitle">AI-Powered Health Screening & Clinical Decision Support</p>
            <div className="professional-notice">
              <Shield size={20} />
              <span>Results must be interpreted by certified medical professionals</span>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            className="main-content"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="medical-card main-card">
              <h2 className="card-title">Welcome to Your AI Health Assistant</h2>
              <p className="card-description">
                Experience advanced AI-powered health risk assessment designed for patients and
                healthcare professionals. Get intelligent health insights and clinical decision support
                to assist your healthcare journey.
              </p>

              {/* Features Grid */}
              <div className="features-grid">
                <motion.div
                  className="feature-card"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Brain className="feature-icon text-primary" size={32} />
                  <h3>AI-Powered Analysis</h3>
                  <p>Advanced machine learning models analyze your health data comprehensively</p>
                </motion.div>

                <motion.div
                  className="feature-card"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Heart className="feature-icon text-primary" size={32} />
                  <h3>Risk Assessment</h3>
                  <p>Multi-disease risk evaluation with actionable insights</p>
                </motion.div>

                <motion.div
                  className="feature-card"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Shield className="feature-icon text-primary" size={32} />
                  <h3>Clinical Support</h3>
                  <p>Evidence-based recommendations and SOAP documentation</p>
                </motion.div>
              </div>

              {/* Action Buttons */}
              <div className="action-buttons">
                <motion.button
                  className="medical-button start-button"
                  onClick={handleStart}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Begin Health Assessment
                </motion.button>

                <motion.button
                  className="medical-button login-button"
                  onClick={() => navigate('/login')}
                  style={{ background: '#1e40af', border: 'none', color: 'white' }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Doctor / Patient Login
                </motion.button>
              </div>

              {/* Advanced Services Grid */}
              <div className="advanced-services-grid" style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                <div 
                  className="service-card" 
                  onClick={() => navigate('/patient/dashboard')}
                  style={{ padding: '2rem', background: 'white', borderRadius: '1.5rem', border: '1px solid #f1f5f9', cursor: 'pointer', transition: 'all 0.3s' }}
                >
                  <div style={{ background: '#eff6ff', width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyCenter: 'center', marginBottom: '1rem', color: '#2563eb' }}>
                    <Activity size={20} />
                  </div>
                  <h4 style={{ fontWeight: '900', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.1em', color: '#94a3b8', marginBottom: '0.5rem' }}>Telemedicine</h4>
                  <p style={{ fontWeight: '900', fontSize: '14px', textTransform: 'uppercase' }}>Patient Care Portal</p>
                </div>

                <div 
                  className="service-card" 
                  onClick={() => navigate('/brain-tumor')}
                  style={{ padding: '2rem', background: 'white', borderRadius: '1.5rem', border: '1px solid #f1f5f9', cursor: 'pointer' }}
                >
                  <div style={{ background: '#f5f3ff', width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyCenter: 'center', marginBottom: '1rem', color: '#7c3aed' }}>
                    <Brain size={20} />
                  </div>
                  <h4 style={{ fontWeight: '900', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.1em', color: '#94a3b8', marginBottom: '0.5rem' }}>Radiology AI</h4>
                  <p style={{ fontWeight: '900', fontSize: '14px', textTransform: 'uppercase' }}>Brain Tumor MRI Analysis</p>
                </div>

                <div 
                  className="service-card" 
                  style={{ padding: '2rem', background: '#fef2f2', borderRadius: '1.5rem', border: '1px solid #fee2e2', cursor: 'pointer' }}
                >
                   <div style={{ background: '#fee2e2', width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyCenter: 'center', marginBottom: '1rem', color: '#dc2626' }}>
                    <AlertCircle size={20} />
                  </div>
                  <h4 style={{ fontWeight: '900', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.1em', color: '#b91c1c', marginBottom: '0.5rem' }}>Emergency</h4>
                  <p style={{ fontWeight: '900', fontSize: '14px', textTransform: 'uppercase', color: '#b91c1c' }}>SOS Active Response</p>
                </div>
              </div>

              {/* Connectivity Buttons */}
              <div className="action-buttons" style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #f1f5f9' }}>
                <motion.button
                  className="medical-button search-button"
                  onClick={() => navigate('/find-doctors')}
                  style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#475569' }}
                  whileHover={{ scale: 1.05 }}
                >
                  Browse Specialists
                </motion.button>
                <motion.button
                  className="medical-button demo-button"
                  onClick={() => navigate('/demo')}
                  style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#475569' }}
                  whileHover={{ scale: 1.05 }}
                >
                  Platform Walkthrough
                </motion.button>
              </div>

              <div className="disclaimer">
                <h4>⚠️ Medical Disclaimer</h4>
                <ul>
                  <li>This system provides AI-powered health screening for patients and clinical decision support for healthcare professionals</li>
                  <li><strong>Results MUST be interpreted by certified medical professionals</strong> before making any health decisions</li>
                  <li>This is a <strong>second opinion tool</strong> designed to assist and support, NOT replace doctors</li>
                  <li>Does NOT provide medical diagnoses, prescriptions, or treatment recommendations</li>
                  <li>All outputs are advisory and educational only - never a substitute for professional medical judgment</li>
                  <li>Can boost clinical experience and assist in risk stratification, but final decisions remain with your physician</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div
            className="home-footer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <p>Powered by Advanced AI & Machine Learning</p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
