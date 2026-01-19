import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion' // eslint-disable-line no-unused-vars
import { Home, Play, Info } from 'lucide-react'
import './DemoPage.css'

const DemoPage = () => {
  const navigate = useNavigate()

  return (
    <div className="demo-page">
      <div className="content-overlay">
        <div className="demo-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header */}
            <div className="demo-header">
              <h1 className="demo-title">Application Demo</h1>
              <p className="demo-subtitle">
                See the AI Doctor Assistant in action - Complete clinical workflow demonstration
              </p>
            </div>

            {/* Video Player */}
            <div className="medical-card video-card">
              <div className="video-wrapper">
                <video
                  controls
                  className="demo-video"
                  poster="/logo.png"
                >
                  <source src="/demo.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>

            {/* Features Shown */}
            <div className="medical-card features-card">
              <h2 className="section-title">
                <Play size={24} />
                What's Demonstrated
              </h2>
              <div className="features-list">
                <div className="feature-item">
                  <div className="feature-number">1</div>
                  <div className="feature-content">
                    <h3>Professional Medical UI</h3>
                    <p>Clean, hospital-grade interface designed for both patients and healthcare professionals</p>
                  </div>
                </div>

                <div className="feature-item">
                  <div className="feature-number">2</div>
                  <div className="feature-content">
                    <h3>Clinical Data Entry</h3>
                    <p>Comprehensive patient data collection including demographics, vitals, lab values, and medical history</p>
                  </div>
                </div>

                <div className="feature-item">
                  <div className="feature-number">3</div>
                  <div className="feature-content">
                    <h3>Multi-Disease Risk Assessment</h3>
                    <p>Simultaneous evaluation of Heart Disease, Stroke, Diabetes, Kidney Disease, and Liver Disease</p>
                  </div>
                </div>

                <div className="feature-item">
                  <div className="feature-number">4</div>
                  <div className="feature-content">
                    <h3>AI-Powered Analysis</h3>
                    <p>Real-time machine learning predictions with risk scores and stratification levels</p>
                  </div>
                </div>

                <div className="feature-item">
                  <div className="feature-number">5</div>
                  <div className="feature-content">
                    <h3>Clinical SOAP Notes</h3>
                    <p>Structured professional reports with evidence-based recommendations and attention areas</p>
                  </div>
                </div>

                <div className="feature-item">
                  <div className="feature-number">6</div>
                  <div className="feature-content">
                    <h3>Explainable Results</h3>
                    <p>Transparent reasoning showing why each risk was flagged with clinical guidelines</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Technical Details */}
            <div className="medical-card tech-card">
              <h2 className="section-title">
                <Info size={24} />
                Technical Highlights
              </h2>
              <div className="tech-grid">
                <div className="tech-item">
                  <h4>Frontend</h4>
                  <p>React 19 + Vite</p>
                  <p>Framer Motion animations</p>
                  <p>Professional medical UI/UX</p>
                </div>
                <div className="tech-item">
                  <h4>Backend</h4>
                  <p>FastAPI + Python 3.11</p>
                  <p>PostgreSQL database</p>
                  <p>RESTful API architecture</p>
                </div>
                <div className="tech-item">
                  <h4>AI/ML</h4>
                  <p>5 scikit-learn models</p>
                  <p>LLM-powered reports (Groq)</p>
                  <p>Multi-agent orchestration</p>
                </div>
                <div className="tech-item">
                  <h4>Features</h4>
                  <p>Real-time risk assessment</p>
                  <p>SOAP documentation</p>
                  <p>Audit logging & compliance</p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="demo-actions">
              <button className="medical-button" onClick={() => navigate('/')}>
                <Home size={18} />
                <span>Back to Home</span>
              </button>
              <button className="medical-button secondary" onClick={() => navigate('/consultation')}>
                <span>Try It Yourself</span>
              </button>
            </div>

            {/* Disclaimer */}
            <div className="demo-disclaimer">
              <p>
                <strong>⚠️ Important:</strong> This demonstration shows the complete health assessment workflow. 
                The system is accessible to patients and healthcare professionals. All results MUST be 
                interpreted by certified medical professionals before making any health decisions. This is a 
                second opinion tool to assist, not replace, professional medical judgment.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default DemoPage
