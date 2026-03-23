import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  Upload, Brain, Activity, AlertCircle, FileText, 
  RefreshCcw, ShieldCheck, Zap, ArrowRight, Microscope, 
  Dna, Loader2, Target, Download, Cpu
} from "lucide-react";
import consultationService from "../services/consultationService";
import Anatomy3DViewer from "../components/Anatomy3DViewer";
import { AruviAILayout } from '../components/ui/AruviAILayout';
import { useToast } from '../components/ui/Toast';
import { useBreakpoint } from "../hooks/useBreakpoint";

const BrainTumorPage = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loadingPdf, setLoadingPdf] = useState(false);
  const { addToast } = useToast();
  const navigate = useNavigate();
  const { isMobile, isTablet } = useBreakpoint();
  
  const [patientData, setPatientData] = useState({
    name: "",
    age: "",
    gender: "Male"
  });

  const assessment = result?.assessment;
  const tumorResult = assessment?.individual_risks?.find(r => r.disease === "Brain Tumor Detection") || assessment?.individual_risks?.[0];

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

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

    const ageInt = parseInt(patientData.age);
    if (isNaN(ageInt)) {
      setError("Validation Error: Age must be a valid number.");
      return;
    }

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const queryParams = `?patient_name=${encodeURIComponent(patientData.name)}&age=${patientData.age}&gender=${patientData.gender}`;
      const data = await consultationService.analyzeBrainTumor(formData, queryParams);
      setResult(data); 
      setFile(null); 
    } catch (err) {
      console.error(err);
      setError(err.message || "Prediction system encountered an error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!result) return;
    setLoadingPdf(true);
    try {
      const response = await consultationService.generatePDF(result);
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `AruviAI_MRI_Report_${patientData.name}.pdf`);
      document.body.appendChild(link);
      link.click();
      addToast("MRI diagnostic transcript exported successfully.", "success");
    } catch (error) {
      addToast("Export Failed: Could not generate PDF document.", "error");
    } finally {
      setLoadingPdf(false);
    }
  };

  return (
    <AruviAILayout activeTab="Brain Tumor">
      <div className={`w-full max-w-7xl mx-auto ${isMobile ? 'px-4' : 'px-8'}`}>
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-8 md:space-y-12 pb-20 pt-6 md:pt-10">
          
          <motion.div variants={item} className="text-center mb-10 md:mb-16">
            <p className="text-[11px] md:text-[0.68rem] uppercase tracking-[0.12em] text-[#0fd68c] font-black mb-3 font-[Syne]">
              NEURAL DIAGNOSTIC
            </p>
            <h1 className="font-[Syne] font-black text-2xl md:text-[2.6rem] text-[#0a0a0f] tracking-[-0.03em] leading-[1.05] mb-4">
              Brain Tumor <span className="text-[#0fd68c]">Stratification.</span>
            </h1>
            <p className="text-[#0a0a0f]/45 text-sm md:text-base max-w-lg mx-auto leading-relaxed font-[DM_Sans]">
              EfficientNet-B0 optimized for sub-millimeter anatomical feature extraction and lobal localization.
            </p>
          </motion.div>


          {/* Two panel grid */}
          <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8 md:gap-10 items-start">

            {/* LEFT: Form panel */}
            <motion.div variants={item} className="bg-white rounded-2xl border border-[#e8ede9] p-6 shadow-sm">
              <h3 className="font-[Syne] font-black text-sm mb-6 text-[#0a0a0f] uppercase tracking-wider">Subject Profile</h3>
              <div className="space-y-5">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-[#0a0a0f]/30 block mb-2 font-black">Clinician / Subject Name</label>
                  <input 
                    name="name"
                    value={patientData.name}
                    onChange={handleInputChange}
                    className="w-full border border-[#e8ede9] rounded-xl px-4 py-3.5 text-sm font-bold focus:border-[#0fd68c] focus:ring-4 focus:ring-[#0fd68c]/5 outline-none transition-all placeholder:text-slate-300" 
                    placeholder="Alexander Galloway"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-[#0a0a0f]/30 block mb-2 font-black">Age</label>
                    <input 
                      name="age"
                      type="number"
                      value={patientData.age}
                      onChange={handleInputChange}
                      className="w-full border border-[#e8ede9] rounded-xl px-4 py-3.5 text-sm font-bold focus:border-[#0fd68c] focus:ring-4 focus:ring-[#0fd68c]/5 outline-none transition-all placeholder:text-slate-300" 
                      placeholder="45"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-[#0a0a0f]/30 block mb-2 font-black">Gender</label>
                    <select 
                      name="gender"
                      value={patientData.gender}
                      onChange={handleInputChange}
                      className="w-full border border-[#e8ede9] rounded-xl px-4 py-3.5 text-sm font-bold focus:border-[#0fd68c] focus:ring-4 focus:ring-[#0fd68c]/5 outline-none transition-all bg-white cursor-pointer"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-[#0a0a0f]/30 block mb-2 font-black">MRI Scan Upload</label>
                  <label className="block border-2 border-dashed border-[#0fd68c]/20 rounded-xl p-6 md:p-8 text-center hover:bg-[#f0fdf4] hover:border-[#0fd68c] transition-all cursor-pointer group">
                    <input type="file" onChange={onFileChange} accept="image/*" className="hidden" />
                    {preview ? (
                      <div className="relative group/preview">
                        <img src={preview} alt="Preview" className="h-32 md:h-40 mx-auto rounded-lg object-contain" />
                        <div className="text-[10px] text-[#0fd68c] font-black mt-3 uppercase tracking-widest bg-[#f0fdf4] py-1 rounded-full">Scan Uplinked</div>
                      </div>
                    ) : (
                      <div className="py-4 md:py-6">
                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                          <Upload size={24} className="text-slate-300 group-hover:text-[#0fd68c] transition-colors" />
                        </div>
                        <p className="text-[10px] font-black text-[#0a0a0f]/40 uppercase tracking-widest">Select Institutional Scan</p>
                        <p className="text-[9px] text-[#0a0a0f]/20 mt-1 uppercase">DICOM · PNG · JPEG</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>
              
              {error && <p className="text-red-500 text-[9px] mt-4 font-black uppercase tracking-widest px-2 py-2 bg-red-50 rounded-lg">{error}</p>}
              
              <button 
                onClick={runAnalysis}
                disabled={loading}
                className="w-full bg-[#0fd68c] text-[#060d0a] font-[Syne] font-black py-4 rounded-xl text-xs uppercase tracking-widest mt-6 hover:bg-[#0ab876] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale shadow-glow cursor-pointer border-none"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : null}
                {loading ? "Establishing Analysis Link..." : "Establish Analysis Link →"}
              </button>
            </motion.div>

            {/* RIGHT: Result panel */}
            <motion.div variants={item} className="w-full overflow-hidden">
              <AnimatePresence mode="wait">
                {!result && !loading && (
                  <motion.div 
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="bg-white rounded-2xl border border-[#e8ede9] min-h-[400px] md:min-h-[500px] flex flex-col items-center justify-center p-8 text-center"
                  >
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mb-8">
                      <Brain size={48} className="text-slate-200" />
                    </div>
                    <h3 className="font-[Syne] font-black text-xl md:text-2xl text-[#0a0a0f] tracking-tight text-slate-800">Awaiting Signal Matrix</h3>
                    <p className="text-sm text-[#0a0a0f]/40 mt-3 max-w-xs mx-auto font-bold font-[DM_Sans] leading-relaxed">
                      Please initiate subject profile and scan uplink to begin neural stratification.
                    </p>
                  </motion.div>
                )}

                {loading && (
                  <motion.div 
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white rounded-2xl border border-[#e8ede9] min-h-[400px] md:min-h-[500px] flex flex-col items-center justify-center p-8 border-none shadow-premium bg-slate-50/50"
                  >
                    <div className="relative">
                      <div className="w-16 h-16 md:w-20 md:h-20 border-4 border-[#0fd68c]/10 border-t-[#0fd68c] rounded-full animate-spin" />
                    </div>
                    <p className="font-[Syne] font-black text-lg md:text-xl text-[#0a0a0f] mt-8 tracking-tight">Analyzing Neural Patterns</p>
                    <p className="text-xs md:text-sm text-[#0a0a0f]/40 mt-2 font-black uppercase tracking-widest">Running EfficientNet-B0 inference...</p>
                  </motion.div>
                )}

                {result && !loading && tumorResult && (
                  <motion.div 
                    key="results"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-6 md:space-y-8"
                  >
                    <div className="bg-white rounded-2xl border border-[#e8ede9] p-6 md:p-8 shadow-subtle overflow-hidden">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-6 sm:gap-4 mb-10">
                        <div>
                          <span className={`text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest ${tumorResult.risk_level === 'High' || tumorResult.risk_level === 'Critical' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-[#f0fdf4] text-[#0fd68c] border border-[#0fd68c]/20'}`}>
                            {tumorResult.risk_level} Risk Level Active
                          </span>
                          <h2 className="font-[Syne] font-black text-2xl md:text-[2rem] text-[#0a0a0f] mt-4 tracking-tighter leading-tight">Artificial Intelligence Transcript</h2>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <button 
                            onClick={handleDownload}
                            disabled={loadingPdf}
                            className="p-4 rounded-xl border border-[#e8ede9] text-[#0a0a0f]/40 hover:text-[#0fd68c] hover:border-[#0fd68c]/30 transition-all disabled:opacity-50 cursor-pointer bg-white"
                          >
                            {loadingPdf ? <Loader2 size={18} className="animate-spin" /> : <Download size={22}/>}
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        <div className={`p-6 rounded-2xl border-l-[6px] shadow-sm flex flex-col justify-center ${tumorResult.prediction === 'Brain Tumor' ? 'bg-red-50/30 border-red-500' : 'bg-emerald-50/30 border-emerald-500'}`}>
                           <p className="text-[10px] font-black text-[#0a0a0f]/30 uppercase tracking-widest mb-3">Diagnostic Classifier Output</p>
                           <h3 className="font-[Syne] font-black text-2xl md:text-3xl text-slate-900 leading-tight">{tumorResult.prediction || "Analysis Finalized"}</h3>
                           <p className="text-xs md:text-sm text-slate-600 mt-6 leading-relaxed font-bold font-[DM_Sans] italic opacity-80">"{tumorResult.clinical_impression}"</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="bg-slate-50/50 p-6 rounded-2xl border border-[#e8ede9] flex flex-col justify-center">
                            <p className="text-[9px] font-black text-[#0a0a0f]/30 uppercase tracking-widest mb-2">Internal Confidence</p>
                            <p className="font-[Syne] font-black text-2xl md:text-3xl text-[#0fd68c]">
                              {tumorResult.confidence ? (tumorResult.confidence * 100).toFixed(1) : (tumorResult.risk_score || 0).toFixed(1)}%
                            </p>
                          </div>
                          <div className="bg-slate-50/50 p-6 rounded-2xl border border-[#e8ede9] flex flex-col justify-center">
                            <p className="text-[9px] font-black text-[#0a0a0f]/30 uppercase tracking-widest mb-2">Relative Risk Velocity</p>
                            <p className={`font-[Syne] font-black text-2xl md:text-3xl ${tumorResult.risk_score > 70 ? 'text-red-500' : 'text-[#0fd68c]'}`}>{(tumorResult.risk_score || 0).toFixed(1)}%</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                       <div className="bg-white rounded-2xl border border-[#e8ede9] p-6 shadow-subtle">
                          <h4 className="font-[Syne] font-black text-[10px] uppercase tracking-[0.2em] text-[#0a0a0f]/40 mb-6 border-b border-slate-50 pb-3">Neural Attention Mapping (Grad-CAM)</h4>
                          <div className="aspect-square bg-slate-950 rounded-xl overflow-hidden relative border border-slate-900 shadow-inner group transition-all hover:border-[#0fd68c]/30">
                             {tumorResult.visual_explanation ? (
                                <img src={`data:image/png;base64,${tumorResult.visual_explanation}`} alt="Grad-CAM" className="w-full h-full object-contain" />
                             ) : (
                                <div className="w-full h-full flex items-center justify-center uppercase text-[10px] text-slate-700 font-black tracking-widest">Generating saliency map...</div>
                             )}
                          </div>
                       </div>
                       <div className="bg-white rounded-2xl border border-[#e8ede9] p-6 shadow-subtle">
                          <h4 className="font-[Syne] font-black text-[10px] uppercase tracking-[0.2em] text-[#0a0a0f]/40 mb-6 border-b border-slate-50 pb-3 text-right md:text-left">3D Anatomical Localization Matrix</h4>
                          <div className="aspect-square bg-slate-50 rounded-xl overflow-hidden relative border border-[#e8ede9] shadow-inner group transition-all hover:border-[#0fd68c]/30">
                             {tumorResult.anatomy_mapping ? (
                                <Anatomy3DViewer highlightLobe={tumorResult.anatomy_mapping.lobe} />
                             ) : (
                                <div className="w-full h-full flex items-center justify-center uppercase text-[10px] text-slate-300 font-black tracking-widest text-center px-8 leading-relaxed">Synthesizing 3D projection...</div>
                             )}
                             <div className="absolute bottom-4 left-4 right-4">
                                <div className="bg-white/90 backdrop-blur-md px-5 py-3 rounded-xl border border-slate-200 text-[10px] font-black uppercase tracking-[0.1em] text-[#0fd68c] shadow-premium flex items-center justify-between">
                                  <span>Cluster Location:</span>
                                  <span className="text-slate-900">{tumorResult.anatomy_mapping?.lobe || 'Global Scanning'}</span>
                                </div>
                             </div>
                          </div>
                       </div>
                    </div>
                    
                    <motion.div 
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="bg-slate-950 rounded-[2rem] md:rounded-[3rem] p-8 md:p-14 text-white relative overflow-hidden shadow-glow-teal mt-8"
                    >
                      <div className="absolute inset-0 opacity-15 pointer-events-none">
                        <div className="absolute -top-32 -right-32 w-[30rem] h-[30rem] bg-[#0fd68c] rounded-full blur-[140px]" />
                        <div className="absolute -bottom-32 -left-32 w-[30rem] h-[30rem] bg-indigo-600 rounded-full blur-[140px] opacity-30" />
                      </div>
                      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16">
                        <div className="space-y-6 text-center lg:text-left">
                           <div className="flex items-center justify-center lg:justify-start gap-4 text-[#0fd68c]">
                              <Cpu size={26} className="animate-pulse" />
                              <p className="text-[11px] font-black uppercase tracking-[0.4em] font-[Syne]">Institutional Nodal Linkage Active</p>
                           </div>
                           <h4 className="text-3xl md:text-5xl font-black font-[Syne] tracking-tight leading-[0.95]">Clinical Escalation Protocol.</h4>
                           <p className="text-sm md:text-lg text-slate-400 font-bold font-[DM_Sans] max-w-xl leading-relaxed opacity-80">
                              Neural analysis is predictive. Radiological verification requires human-in-the-loop validation according to institutional standards. Connect with <strong className="text-white border-b-2 border-[#0fd68c]">Neurology Specialist Nodes</strong> for final clearance.
                           </p>
                        </div>
                        <button 
                          onClick={() => navigate('/find-doctor', { state: { filter: 'Neurology' } })}
                          className="w-full lg:w-auto whitespace-nowrap px-12 py-6 bg-[#0fd68c] text-[#060d0a] rounded-2xl font-black text-xs md:text-sm uppercase tracking-[0.2em] hover:bg-white hover:scale-105 transition-all shadow-glow cursor-pointer border-none"
                        >
                          Establish Specialist Bridge
                        </button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

          </div>
        </motion.div>
      </div>
    </AruviAILayout>
  );
};

export default BrainTumorPage;
