import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion as Motion } from 'framer-motion'
import { 
  Brain, 
  Heart, 
  Shield, 
  Activity, 
  AlertCircle, 
  Video, 
  ChevronRight, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Lock
} from 'lucide-react'
import './HomePage.css'
import Navbar from '../components/Navbar'

const HomePage = () => {
  const navigate = useNavigate()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div className="home-wrapper">
      <Navbar />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <Motion.div 
            className="hero-content"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="badge-new">
              <span className="badge-tag">NEW</span>
              <span className="badge-text">Multimodal Brain MRI Analysis (Alpha)</span>
            </div>
            <h1 className="hero-title">
              Precision Health <br />
              <span className="gradient-text">Orchestrated by AI.</span>
            </h1>
            <p className="hero-subtitle">
              The industry's first Multi-Agent Healthcare OS. Integrating predictive diagnostics, 
              telemedicine, and emergency response into one seamless clinical ecosystem.
            </p>
            <div className="hero-actions">
              <button onClick={() => navigate('/register')} className="btn-hero-primary">
                Deploy CarePortal <ArrowRight size={18} />
              </button>
              <button onClick={() => navigate('/demo')} className="btn-hero-secondary">
                Request Demo
              </button>
            </div>
            <div className="hero-trust">
              <div className="trust-icons">
                <ShieldCheck size={16} /> <Lock size={16} /> <Zap size={16} />
              </div>
              <span>HIPAA Compliant & SOC2 Type II Certified</span>
            </div>
          </Motion.div>

          {/* Hero Visual */}
          <Motion.div 
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          >
            <div className="visual-card glass">
               <div className="card-header">
                  <Activity className="text-primary" size={20} />
                  <span>Real-time Patient Monitoring</span>
               </div>
               <div className="visual-graph">
                  <div className="bar" style={{height: '40%'}}></div>
                  <div className="bar active" style={{height: '70%'}}></div>
                  <div className="bar" style={{height: '50%'}}></div>
                  <div className="bar" style={{height: '90%'}}></div>
               </div>
               <div className="card-status">
                  <span className="status-dot"></span> Active Session
               </div>
            </div>
            <div className="visual-floating-card glass">
               <Heart className="text-danger" size={24} />
               <div className="vfc-text">
                  <p>Risk Score</p>
                  <h3>0.04 Low</h3>
               </div>
            </div>
          </Motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="services-section">
        <div className="section-header">
          <h2 className="section-title">Integrated Care Ecosystem</h2>
          <p className="section-subtitle">A unified platform for patients, doctors, and institutions.</p>
        </div>

        <Motion.div 
          className="services-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Predictive AI */}
          <Motion.div variants={itemVariants} className="service-card-premium" onClick={() => navigate('/consultation')}>
            <div className="sc-icon blue">
              <Brain size={24} />
            </div>
            <h3>Predictive Diagnostics</h3>
            <p>5-Core ML agents analyzing Heart, Stroke, Diabetes, Kidney, and Liver risks with 98% accuracy.</p>
            <div className="sc-footer">
               <span>Launch Assessment</span> <ChevronRight size={16} />
            </div>
          </Motion.div>

          {/* Telemedicine */}
          <Motion.div variants={itemVariants} className="service-card-premium" onClick={() => navigate('/patient/dashboard')}>
            <div className="sc-icon indigo">
              <Video size={24} />
            </div>
            <h3>Telemedicine Portal</h3>
            <p>End-to-end virtual care with HD video, digital prescriptions, and insurance integration.</p>
            <div className="sc-footer">
               <span>Open Portal</span> <ChevronRight size={16} />
            </div>
          </Motion.div>

          {/* Emergency SOS */}
          <Motion.div variants={itemVariants} className="service-card-premium critical">
            <div className="sc-icon red">
              <AlertCircle size={24} />
            </div>
            <h3>Emergency SOS</h3>
            <p>Location-aware panic response. Instant ambulance routing and nearest hospital discovery.</p>
            <div className="sc-footer">
               <span>Panic Protocol</span> <ChevronRight size={16} />
            </div>
          </Motion.div>

          {/* Brain MRI */}
          <Motion.div variants={itemVariants} className="service-card-premium" onClick={() => navigate('/brain-tumor')}>
            <div className="sc-icon purple">
              <Brain size={24} />
            </div>
            <h3>Radiology Intelligence</h3>
            <p>Deep learning for Brain MRI analysis. Automated tumor detection and semantic segmentation.</p>
            <div className="sc-footer">
               <span>Open Radiology</span> <ChevronRight size={16} />
            </div>
          </Motion.div>
        </Motion.div>
      </section>

      {/* Trust & Safety Section */}
      <section className="safety-section">
         <div className="glass-safety p-10 rounded-[3rem] border border-white/20 flex items-center justify-between gap-10">
            <div className="safety-text">
               <div className="flex items-center gap-2 mb-4">
                  <Shield size={24} className="text-secondary" />
                  <span className="font-bold text-slate-400">CLINICAL SAFETY FIRST</span>
               </div>
               <h2 className="text-4xl font-black mb-4">Results interpreted by experts.</h2>
               <p className="text-slate-500 max-w-xl">
                 Our AI acts as a Second Opinion and Clinical Decision Support tool. All findings must be reviewed by board-certified physicians before treatment initiation.
               </p>
            </div>
            <div className="safety-badges grid grid-cols-2 gap-4">
               <div className="badge glass">98% Accuracy</div>
               <div className="badge glass">Real-time Response</div>
               <div className="badge glass">Full Privacy</div>
               <div className="badge glass">Org Verified</div>
            </div>
         </div>
      </section>

      <footer className="enterprise-footer">
         <div className="footer-container">
            <p>© 2026 AI CarePortal Enterprise. All rights reserved.</p>
            <div className="footer-links">
               <span>Privacy Policy</span>
               <span>Terms of Service</span>
               <span>Clinical Guidelines</span>
            </div>
         </div>
      </footer>
    </div>
  )
}

export default HomePage
