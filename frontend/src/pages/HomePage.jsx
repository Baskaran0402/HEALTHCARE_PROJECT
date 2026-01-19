import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion' // eslint-disable-line no-unused-vars
import { Brain, Heart, Shield } from 'lucide-react'
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
                  className="medical-button demo-button"
                  onClick={() => navigate('/demo')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View Demo
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
