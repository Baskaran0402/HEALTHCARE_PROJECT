import React, { useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { 
  Upload, 
  Brain, 
  Activity, 
  AlertCircle, 
  CheckCircle2, 
  FileText, 
  ChevronRight, 
  RefreshCcw,
  ShieldCheck,
  Zap,
  Eye
} from "lucide-react";
import apiClient from "../lib/api/client";
import Anatomy3DViewer from "../components/Anatomy3DViewer";
import Navbar from "../components/Navbar";
import "./BrainTumorPage.css";

const BrainTumorPage = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  
  const [patientData, setPatientData] = useState({
    name: "",
    age: "",
    gender: "Male"
  });

  const onFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResult(null);
      setError(null);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPatientData(prev => ({ ...prev, [name]: value }));
  };

  const runAnalysis = async () => {
    if (!file) {
      setError("Please upload an MRI image first.");
      return;
    }
    if (!patientData.name || !patientData.age) {
      setError("Please fill in patient name and age.");
      return;
    }

    setLoading(true);
    setResult(null);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    
    try {
      // Step 1: Upload and Analyze
      const response = await apiClient.post(
        `/api/analyze/brain-tumor?patient_name=${encodeURIComponent(patientData.name)}&age=${patientData.age}&gender=${patientData.gender}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      
      setResult(response.data.assessment);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Prediction system encountered an error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="brain-tumor-container">
      <Navbar />
      <header className="page-header">
        <div className="header-badge">Experimental Alpha</div>
        <h1>Advanced Neural Diagnostic Trial</h1>
        <p className="subtitle">
          Next-Generation Brain MRI Analysis powered by EfficientNet-B0 and Hybrid AI Reasoning
        </p>
      </header>

      <div className="trial-grid">
        <section className="input-panel">
          <div className="panel-card">
            <div className="card-header">
              <Activity className="icon text-primary" />
              <h2>Patient Information</h2>
            </div>
            
            <div className="form-group full">
              <label>Full Name</label>
              <input 
                type="text" 
                name="name"
                value={patientData.name}
                onChange={handleInputChange}
                placeholder="Enter patient full name" 
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
                  placeholder="87" 
                />
              </div>
              <div className="form-group">
                <label>Gender</label>
                <select name="gender" value={patientData.gender} onChange={handleInputChange}>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            <div className="upload-section">
              <label className="image-dropzone">
                <input type="file" onChange={onFileChange} accept="image/*" hidden />
                {preview ? (
                  <div className="preview-container">
                    <img src={preview} alt="MRI Preview" className="mri-preview" />
                    <div className="preview-overlay">
                      <RefreshCcw size={20} />
                      <span>Change Image</span>
                    </div>
                  </div>
                ) : (
                  <div className="dropzone-content">
                    <Upload className="upload-icon" />
                    <p>Click to upload or drag MRI slice</p>
                    <span className="file-hint">Supports DICOM-derived PNG/JPG images</span>
                  </div>
                )}
              </label>
            </div>

            <button 
              className={`analyze-btn ${loading ? 'loading' : ''}`}
              onClick={runAnalysis}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="spinner"></div>
                  <span>Running AI Inference...</span>
                </>
              ) : (
                <>
                  <Zap size={20} />
                  <span>Run Diagnostic Report</span>
                </>
              )}
            </button>
          </div>
        </section>

        <section className="results-panel">
          <AnimatePresence mode="wait">
            {!result && !loading && !error && (
              <Motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="empty-state"
              >
                <div className="empty-visual">
                  <div className="pulse-circle"></div>
                  <Brain size={64} className="brain-bg" />
                </div>
                <h3>System Ready</h3>
                <p>Upload MRI scan to generate hybrid diagnostic report</p>
              </Motion.div>
            )}

            {error && (
              <Motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="error-state"
              >
                <AlertCircle className="text-danger" size={40} />
                <h3>Analysis Failed</h3>
                <p>{error}</p>
                <button onClick={() => setError(null)} className="retry-btn">Clear Error</button>
              </Motion.div>
            )}

            {result && (
              <Motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="diagnosis-report"
              >
                <div className="report-header">
                  <div className="status-badge" data-level={result.individual_risks[0].risk_level}>
                    {result.individual_risks[0].risk_level} Risk
                  </div>
                  <h2>Assessment Summary</h2>
                </div>

                {/* 1. Core Neural Finding */}
                <div className={`diagnostic-card ${result.individual_risks[0].prediction === 'Brain Tumor' ? 'critical' : 'healthy'}`}>
                  <div className="card-top">
                    <div className="main-stat">
                       <span className="label">Diagnostic Outcome</span>
                       <span className="value">{result.individual_risks[0].prediction}</span>
                    </div>
                    <div className="sub-stat">
                       <div className="stat-box">
                         <span className="label">Tumor Probability</span>
                         <span className="value">{result.individual_risks[0].risk_score.toFixed(1)}%</span>
                       </div>
                       <div className="stat-box">
                         <span className="label">AI Confidence</span>
                         <span className="value">{(result.individual_risks[0].confidence * 100).toFixed(1)}%</span>
                       </div>
                    </div>
                  </div>
                  
                  <div className="clinical-impression">
                    <FileText size={18} className="impression-icon" />
                    <p>{result.individual_risks[0].clinical_impression}</p>
                  </div>
                </div>

                {/* 2. Visual Explainability (Grad-CAM) */}
                {result.individual_risks[0].visual_explanation && (
                  <div className="explainability-section">
                    <div className="section-title">
                      <Eye size={18} />
                      <h3>AI Vision (Grad-CAM Heatmap)</h3>
                    </div>
                    
                    <div className="heatmap-comparison">
                      <div className="heatmap-box">
                         <img src={`data:image/png;base64,${result.individual_risks[0].visual_explanation}`} alt="Grad-CAM" />
                         <span>Neural Attention Region</span>
                      </div>
                      <div className="explain-text">
                        <p>The heatmap highlights regions contributing most to the AI's classification. 
                        <strong> Jet-red areas</strong> indicate localized structural features that match the learned tumor patterns.</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2b. 3D Anatomy Mapping (New) */}
                {result.individual_risks[0].anatomy_mapping && (
                  <div className="anatomy-3d-section" style={{ marginTop: '40px', paddingTop: '30px', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <div className="section-title">
                      <Activity size={18} />
                      <h3>3D Anatomy Mapping</h3>
                    </div>
                    <Anatomy3DViewer highlightLobe={result.individual_risks[0].anatomy_mapping.lobe} />
                    
                    <div className="functional-risks-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginTop: '20px' }}>
                       {result.individual_risks[0].anatomy_mapping.functional_risks.map((risk, idx) => (
                         <div key={idx} className="functional-risk-tag" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa', padding: '10px 15px', borderRadius: '10px', fontSize: '0.85rem', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                           <AlertCircle size={14} style={{ marginRight: '8px' }} />
                           {risk}
                         </div>
                       ))}
                    </div>
                  </div>
                )}

                {/* 3. Cross-Intelligence Insights (Hybrid AI) */}
                {result.cross_intelligence_insights && result.cross_intelligence_insights.length > 0 && (
                  <div className="hybrid-intelligence">
                    <div className="section-title">
                      <Zap size={18} />
                      <h3>Cross-Disease Intelligence Findings</h3>
                    </div>
                    {result.cross_intelligence_insights.map((insight, idx) => (
                      <div key={idx} className={`insight-card ${insight.severity.toLowerCase()}`}>
                        <div className="insight-header">
                          <ShieldCheck size={18} />
                          <h4>{insight.title}</h4>
                        </div>
                        <p className="finding-text"><strong>Finding:</strong> {insight.finding}</p>
                        <p className="interpretation"><strong>Hybrid Reasoning:</strong> {insight.interpretation}</p>
                        <div className="recommendations-list">
                          {insight.recommendations.map((rec, i) => (
                            <div key={i} className="rec-item">
                               <ChevronRight size={14} />
                               <span>{rec}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 4. Individual Agent Reasoning */}
                <div className="observations-section">
                   <h3>Evidence-Based Observations</h3>
                   <ul className="observations-list">
                     {result.individual_risks[0].why.map((reason, i) => (
                       <li key={i}>{reason}</li>
                     ))}
                   </ul>
                </div>
                
                <footer className="disclaimer">
                   <p>Disclaimer: This is an experimental clinical decision support tool. All findings must be reviewed by a board-certified radiologist or neurologist.</p>
                </footer>
              </Motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
    </div>
  );
};

export default BrainTumorPage;
