import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Activity, Brain, Heart, Shield } from 'lucide-react'
import './HomePage.css'

const HomePage = () => {
  const navigate = useNavigate()
  const [selectedRole, setSelectedRole] = useState(null)

  const handleStart = () => {
    if (selectedRole) {
      navigate('/consultation', { state: { role: selectedRole } })
    }
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
              <Activity className="logo-icon" size={48} />
              <h1 className="professional-title">AI Doctor Assistant</h1>
            </div>
            <p className="subtitle">Clinical Decision Support System for Healthcare Professionals</p>
            <div className="professional-notice">
              <Shield size={20} />
              <span>This system is intended to assist licensed medical professionals only</span>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            className="main-content"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="glass-card main-card">
              <h2 className="card-title">Welcome to Your AI Health Assistant</h2>
              <p className="card-description">
                Experience advanced AI-powered clinical decision support designed to assist
                healthcare professionals and empower patients with intelligent health insights.
              </p>

              {/* Features Grid */}
              <div className="features-grid">
                <motion.div
                  className="feature-card"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Brain className="feature-icon neon-text" size={32} />
                  <h3>AI-Powered Analysis</h3>
                  <p>Advanced machine learning models analyze your health data comprehensively</p>
                </motion.div>

                <motion.div
                  className="feature-card"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Heart className="feature-icon neon-text-blue" size={32} />
                  <h3>Risk Assessment</h3>
                  <p>Multi-disease risk evaluation with actionable insights</p>
                </motion.div>

                <motion.div
                  className="feature-card"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Shield className="feature-icon neon-text-pink" size={32} />
                  <h3>Clinical Support</h3>
                  <p>Evidence-based recommendations and SOAP documentation</p>
                </motion.div>
              </div>

              {/* Role Selection */}
              <div className="role-selection">
                <h3 className="section-title">Confirm Your Role</h3>
                <div className="role-buttons">
                  <motion.button
                    className={`role-button ${selectedRole === 'Doctor' ? 'selected' : ''}`}
                    onClick={() => setSelectedRole('Doctor')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Shield size={24} />
                    <span>Healthcare Professional</span>
                    <small>Licensed medical practitioner</small>
                  </motion.button>
                </div>
                <p className="role-notice">
                  By proceeding, you confirm that you are a licensed healthcare professional 
                  using this system for clinical decision support purposes only.
                </p>
              </div>

              {/* Start Button */}
              <motion.button
                className="neon-button start-button"
                onClick={handleStart}
                disabled={!selectedRole}
                whileHover={{ scale: selectedRole ? 1.05 : 1 }}
                whileTap={{ scale: selectedRole ? 0.95 : 1 }}
              >
                Begin Consultation
              </motion.button>

              {/* Disclaimer */}
              <div className="disclaimer">
                <h4>⚠️ Clinical Use Disclaimer</h4>
                <ul>
                  <li>This system provides AI-assisted clinical decision support for healthcare professionals</li>
                  <li>Does NOT provide medical diagnoses, prescriptions, or treatment recommendations</li>
                  <li>All outputs must be reviewed and validated by a licensed physician before clinical use</li>
                  <li>Intended to assist in early symptom detection and risk stratification only</li>
                  <li>Not a substitute for professional medical judgment and clinical examination</li>
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
