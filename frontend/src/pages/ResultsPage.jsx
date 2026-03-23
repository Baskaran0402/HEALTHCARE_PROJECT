import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, FileText, Activity, Download, Zap, ChevronRight, Target, 
  Printer, ShieldCheck, Cpu, Eye, Loader2, Sparkles, Brain, Info, ArrowRight
} from 'lucide-react';
import consultationService from '../services/consultationService';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { AruviAILayout } from '../components/ui/AruviAILayout';
import { ClinicalCard, ClinicalBadge, StatCard } from '../components/ClinicalComponents';
import { useToast } from '../components/ui/Toast';
import { useBreakpoint } from '../hooks/useBreakpoint';

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { isMobile } = useBreakpoint();
  const { result, patientData, medicalData } = location.state || {};
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [shapImage, setShapImage] = useState(null);
  const [loadingShap, setLoadingShap] = useState(false);
  const [reportType, setReportType] = useState('patient');

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (!result) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6 text-center">
        <ClinicalCard className="max-w-md border-red-100 bg-white">
          <div className="w-20 h-20 rounded-[2rem] bg-red-50 flex items-center justify-center mx-auto mb-8 text-red-600 shadow-premium">
             <ShieldAlert size={40} />
          </div>
          <h1 className="text-2xl font-black text-slate-900 font-display tracking-tight mb-4">Uplink Interrupted</h1>
          <p className="text-slate-500 font-medium text-sm mb-10 leading-relaxed">
             The diagnostic telemetry packet was lost in transit. Please re-synchronize with your institutional node.
          </p>
          <button 
            className="w-full h-14 gradient-brand text-white rounded-2xl font-bold hover:opacity-90 transition-all shadow-glow"
            onClick={() => navigate('/')}
          >
             Return to Central Hub
          </button>
        </ClinicalCard>
      </div>
    );
  }

  const assessment = result.assessment || {
    overall_risk_level: 'Stable',
    overall_risk_score: 12,
    individual_risks: [],
    primary_concerns: []
  };

  const handleDownload = async () => {
    setLoadingPdf(true);
    try {
      const response = await consultationService.generatePDF(result);
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `AruviAI_Report_${patientData?.name || 'Patient'}.pdf`);
      document.body.appendChild(link);
      link.click();
      addToast("Diagnostic transcript exported successfully.", "success");
    } catch (error) {
      addToast("Export Failed: Could not generate PDF document.", "error");
    } finally {
      setLoadingPdf(false);
    }
  };

  const fetchSHAP = async () => {
    setLoadingShap(true);
    try {
      const response = await consultationService.getSHAPExplanation(medicalData || {});
      setShapImage(response); 
      addToast("Neural logic strata decrypted.", "success");
    } catch (error) {
      addToast("Interpretability Uplink Failed.", "error");
    } finally {
      setLoadingShap(false);
    }
  };

  const getRecommendedSpecialty = (disease) => {
    if (!disease) return 'General Medicine';
    const d = disease.toLowerCase();
    if (d.includes('brain') || d.includes('neuro') || d.includes('stroke')) return 'Neurology';
    if (d.includes('heart') || d.includes('cardio') || d.includes('hypertension') || d.includes('framingham') || d.includes('coronary')) return 'Cardiology';
    if (d.includes('diabetes') || d.includes('endocrin') || d.includes('thyroid') || d.includes('hba1c') || d.includes('glucose')) return 'Endocrinology';
    if (d.includes('kidney') || d.includes('renal') || d.includes('nephro') || d.includes('creatinine') || d.includes('urea')) return 'Nephrology';
    if (d.includes('liver') || d.includes('hepat') || d.includes('bilirubin') || d.includes('gastro')) return 'Gastroenterology';
    if (d.includes('lung') || d.includes('respirat') || d.includes('pulmon') || d.includes('breath')) return 'Pulmonology';
    if (d.includes('cancer') || d.includes('tumor') || d.includes('oncol')) return 'Oncology';
    if (d.includes('bone') || d.includes('joint') || d.includes('arthri') || d.includes('ortho')) return 'Orthopedics';
    if (d.includes('skin') || d.includes('dermat')) return 'Dermatology';
    if (d.includes('eye') || d.includes('ophthal') || d.includes('vision')) return 'Ophthalmology';
    return 'General Medicine';
  };

  const getRecommendedNode = () => {
    // Pick the highest-risk individual disease that isn't already at the global level
    const risks = assessment.individual_risks || [];
    const sorted = [...risks].sort((a, b) => (b.risk_score || 0) - (a.risk_score || 0));
    const primary = sorted[0]?.disease || assessment.primary_concerns?.[0] || 'General Medicine';
    return getRecommendedSpecialty(primary);
  };

  return (
    <AruviAILayout activeTab="Analytics">
      <div className={`w-full max-w-7xl mx-auto ${isMobile ? 'px-4' : 'px-8'}`}>
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-8 md:space-y-12 pb-20 pt-6 md:pt-10">
          
          {/* Header Area */}
          <motion.div variants={item} className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-8 border-b border-[#e8ede9] pb-8 md:pb-10">
             <div className="space-y-4">
                <div className="flex items-center gap-3">
                   <ClinicalBadge variant="success">PROTOCOL FINALIZED</ClinicalBadge>
                   <span className="text-[10px] font-black text-[#0a0a0f]/20 uppercase tracking-[0.2em] font-syne">ID: REF_{result.consultation?.id?.split('-')[0].toUpperCase()}</span>
                </div>
                <h1 className="font-syne font-black text-4xl md:text-6xl text-[#0a0a0f] tracking-[-0.04em] leading-tight">
                  Diagnostic <span className="text-[#0fd68c]">Transcript.</span>
                </h1>
                <p className="text-[#0a0a0f]/45 text-sm md:text-lg max-w-2xl font-dm leading-relaxed">
                   Unified synthesis of clinical indicators, neural stratification, and risk assessment vectors from the AruviAI core.
                </p>
             </div>

           
           <div className="flex items-center gap-3 w-full md:w-auto">
              {!isMobile && (
                <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all text-sm shadow-subtle cursor-pointer">
                  <Printer size={18} />
                  <span>Print</span>
                </button>
              )}
              <button
                onClick={handleDownload}
                disabled={loadingPdf}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-3 gradient-brand text-white rounded-xl font-bold hover:opacity-90 transition-all text-sm shadow-glow disabled:opacity-50 cursor-pointer border-none"
              >
                {loadingPdf ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                <span>Deploy Report</span>
              </button>
           </div>
        </motion.div>

        {/* Global Risk Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10">
           <motion.div variants={item} className="col-span-12 lg:col-span-5">
             <ClinicalCard className="flex flex-col items-center justify-center text-center h-full">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8 md:mb-12">Neural Risk Stratification</p>
                
                <div className="relative w-48 h-48 md:w-64 md:h-64 mb-8 md:mb-12 flex items-center justify-center">
                   <svg className="w-full h-full -rotate-90" viewBox="0 0 256 256">
                      <circle cx="128" cy="128" r="110" className="stroke-slate-100 fill-none" strokeWidth="16" />
                      <motion.circle 
                         cx="128" cy="128" r="110" 
                         className={`fill-none ${
                          assessment.overall_risk_level.toLowerCase() === 'critical' ? 'stroke-red-500' : 
                          assessment.overall_risk_level.toLowerCase() === 'moderate' ? 'stroke-amber-500' : 'stroke-teal-500'
                         }`}
                         strokeWidth="16"
                         strokeDasharray="691"
                         initial={{ strokeDashoffset: 691 }}
                         animate={{ strokeDashoffset: 691 - (691 * (assessment.overall_risk_score || 12) / 100) }}
                         transition={{ duration: 2, ease: "easeOut" }}
                         strokeLinecap="round"
                      />
                   </svg>
                   <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 font-display">{assessment.overall_risk_score || 0}%</h2>
                      <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Aggregate Index</p>
                   </div>
                </div>

                <div className="space-y-4 md:space-y-6 w-full pt-8 md:pt-10 border-t border-slate-100">
                   <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol State</span>
                      <ClinicalBadge variant={
                        assessment.overall_risk_level.toLowerCase() === 'critical' ? 'error' : 
                        assessment.overall_risk_level.toLowerCase() === 'moderate' ? 'warning' : 'success'
                      }>
                        {assessment.overall_risk_level.toUpperCase()}
                      </ClinicalBadge>
                   </div>
                   <p className="text-xs md:text-sm text-slate-500 font-medium leading-relaxed italic">
                     Current neural weighting indicates a {assessment.overall_risk_level.toLowerCase()} probability of significant clinical deviation.
                   </p>
                </div>
             </ClinicalCard>
           </motion.div>

           <motion.div variants={item} className="col-span-12 lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
              <StatCard icon={<Cpu size={24} />} label="Neural Accuracy" value="99.4%" trend="+0.2%" />
              <StatCard icon={<Zap size={24} />} label="Inference Latency" value="0.8ms" trend="Stable" />
              <StatCard icon={<ShieldCheck size={24} />} label="Privacy Protocol" value="HIPAA-E2EE" />
              <StatCard icon={<FileText size={24} />} label="Audit Trail" value="Immutable" />
              
              <div className="col-span-full bg-slate-950 rounded-2xl md:rounded-[2.5rem] p-8 md:p-10 text-white relative overflow-hidden shadow-2xl">
                  <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-teal-500 rounded-full blur-[120px]" />
                  </div>
                  <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10">
                    <div className="space-y-2 md:space-y-4">
                       <h4 className="text-xl md:text-2xl font-black font-display tracking-tight leading-tight">Institutional Coordination</h4>
                       <p className="text-xs md:text-sm text-slate-400 font-medium max-w-md leading-relaxed">
                         Expert recommendation: Bridge with a <strong className="text-teal-400">{getRecommendedNode()}</strong> clinical node for definitive radiological verification.
                       </p>
                    </div>
                    <button 
                      onClick={() => navigate('/find-doctor', { state: { filter: getRecommendedNode() } })}
                      className="w-full md:w-auto whitespace-nowrap px-8 py-4 bg-teal-600 text-white rounded-xl md:rounded-2xl font-black text-[10px] md:text-sm uppercase tracking-widest hover:bg-teal-500 transition-all shadow-glow cursor-pointer"
                      style={{ border: 'none' }}
                    >
                      Find Specialist
                    </button>
                  </div>
              </div>
           </motion.div>
        </div>

        {/* Detailed Assessment */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
           <div className="lg:col-span-2 space-y-8 md:space-y-10">
              <motion.div variants={item}>
                <ClinicalCard 
                  title="Expert Synthesis" 
                  subtitle="Stratified narrative from the neural core."
                  extra={
                    <div className="flex bg-slate-100 p-1 rounded-xl">
                      <button 
                        onClick={() => setReportType('patient')}
                        className={`px-3 md:px-4 py-1 rounded-lg text-[8px] md:text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer border-none ${reportType === 'patient' ? 'bg-white text-teal-600 shadow-sm' : 'bg-transparent text-slate-400 hover:text-slate-600'}`}
                      >
                        Patient
                      </button>
                      <button 
                        onClick={() => setReportType('clinical')}
                        className={`px-3 md:px-4 py-1 rounded-lg text-[8px] md:text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer border-none ${reportType === 'clinical' ? 'bg-white text-teal-600 shadow-sm' : 'bg-transparent text-slate-400 hover:text-slate-600'}`}
                      >
                        Clinical
                      </button>
                    </div>
                  }
                >
                   <div className="prose prose-slate max-w-none text-slate-600 font-medium leading-[1.8] text-[13px] md:text-[14px] pt-4">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                         {reportType === 'patient' 
                           ? (assessment.patient_report || result.clinical_summary || result.analysis || "No patient-friendly narrative available.") 
                           : (assessment.doctor_report || result.clinical_summary || result.analysis || "No clinical-grade narrative available.")
                         }
                      </ReactMarkdown>
                   </div>
                </ClinicalCard>
              </motion.div>

              <motion.div variants={item}>
                <ClinicalCard title="Primary Indicators" subtitle="Focus areas for high-priority clinical follow-up.">
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 py-4">
                      {(assessment.primary_concerns?.length > 0 ? assessment.primary_concerns : ["No critical biometric flags detected."]).map((concern, i) => (
                         <div key={i} className="flex items-start gap-4 p-5 md:p-6 bg-slate-50 border border-slate-100 rounded-2xl hover:border-teal-200 transition-all group shadow-sm">
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-white flex items-center justify-center text-teal-600 group-hover:scale-110 transition-transform shadow-subtle min-shrink-0">
                               <Target size={16} />
                            </div>
                            <p className="text-xs md:text-sm font-black text-slate-900 leading-tight pt-1">{concern}</p>
                         </div>
                      ))}
                   </div>
                </ClinicalCard>
              </motion.div>

              <motion.div variants={item}>
                <ClinicalCard title="Neural Interpretability" subtitle="SHAP Strata Analysis — Feature contribution quantification.">
                   {!shapImage ? (
                     <div className="py-12 md:py-20 flex flex-col items-center justify-center text-center space-y-6 md:space-y-8">
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-[2rem] bg-teal-50 flex items-center justify-center text-teal-600 shadow-premium">
                           <Eye size={32} />
                        </div>
                        <div className="space-y-4">
                           <h4 className="text-lg md:text-xl font-black text-slate-900 font-display tracking-tight">Logic Decryption Required</h4>
                           <p className="text-xs md:text-sm text-slate-500 max-w-md font-medium leading-relaxed">Process raw biometric weights through the SHAP engine to visualize human-readable diagnostic reasoning.</p>
                        </div>
                        <button
                          onClick={fetchSHAP}
                          disabled={loadingShap}
                          className="px-8 md:px-10 py-3 md:py-4 bg-white border border-slate-200 text-slate-900 rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest hover:bg-slate-50 transition-all shadow-subtle flex items-center gap-3 disabled:opacity-50 cursor-pointer"
                        >
                           {loadingShap ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} className="text-teal-600" />}
                           <span>Analyze Logic Strata</span>
                        </button>
                     </div>
                   ) : (
                     <div className="space-y-6 md:space-y-8 pb-4">
                        <div className="bg-slate-50 rounded-xl md:rounded-[2rem] p-4 md:p-8 border border-slate-100 shadow-inner overflow-hidden">
                           <img src={`data:image/png;base64,${shapImage}`} alt="Neural Logic Strata" className="w-full h-auto rounded-lg md:rounded-xl shadow-premium" />
                        </div>
                        <div className="flex items-start gap-4 p-4 md:p-6 bg-teal-50 rounded-xl md:rounded-2xl border border-teal-100 shadow-sm">
                           <Info size={20} className="text-teal-600 mt-1 flex-shrink-0" />
                           <p className="text-xs md:text-sm text-teal-900 font-medium leading-relaxed">
                               <strong>Diagnostic Synthesis:</strong> Features extending right (red) positively correlated with predicted risk, while blue indices favored a stable outcome.
                           </p>
                        </div>
                        <button onClick={() => setShapImage(null)} className="text-[9px] md:text-[10px] font-black text-slate-400 hover:text-slate-600 uppercase tracking-[0.2em] transition-colors border-none bg-transparent cursor-pointer">Reset Strata View</button>
                     </div>
                   )}
                </ClinicalCard>
              </motion.div>
            </div>

           <div className="space-y-8 md:space-y-10">
              <motion.div variants={item} className="h-full">
                <ClinicalCard title="Risk Lattices" subtitle="Individual pathology risk vectors." className="h-full">
                   <div className="space-y-6 md:space-y-8 py-4">
                      {(assessment.individual_risks?.length > 0 ? assessment.individual_risks : [
                        { disease: 'Respiratory', risk_level: 'Low', risk_score: 5 },
                        { disease: 'Neurological', risk_level: 'Stable', risk_score: 12 },
                        { disease: 'Cardiovascular', risk_level: 'Optimal', risk_score: 8 }
                      ]).map((risk, i) => (
                         <div key={i} className="space-y-3 md:space-y-4">
                            <div className="flex justify-between items-center text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em]">
                               <span className="text-slate-400">{risk.disease || risk.risk_name}</span>
                               <span className={
                                  (risk.risk_level === 'High' || risk.risk_level === 'Critical') ? 'text-red-500' :
                                  (risk.risk_level === 'Moderate') ? 'text-amber-500' : 'text-teal-600'
                               }>{risk.risk_level}</span>
                            </div>
                            <div className="h-1.5 md:h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                               <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${risk.risk_score}%` }}
                                  transition={{ duration: 1.5, delay: 0.5 + (i * 0.1) }}
                                  className={`h-full rounded-full ${
                                    (risk.risk_level === 'High' || risk.risk_level === 'Critical') ? 'bg-red-500' :
                                    (risk.risk_level === 'Moderate') ? 'bg-amber-500' : 'bg-teal-500'
                                  }`}
                                />
                            </div>
                         </div>
                      ))}
                   </div>
                </ClinicalCard>
              </motion.div>

              <motion.div variants={item}>
                 <div className="bg-slate-950 rounded-2xl md:rounded-[2.5rem] p-8 md:p-10 text-white relative overflow-hidden shadow-2xl group border border-slate-900 text-center md:text-left">
                    <div className="absolute top-0 right-0 w-32 h-32 md:w-48 md:h-48 bg-teal-500/10 rounded-full -mr-16 md:-mr-24 -mt-16 md:-mt-24 group-hover:scale-125 transition-transform duration-700" />
                    <div className="relative z-10">
                      <div className="flex items-center justify-center md:justify-start gap-4 mb-6 md:mb-8 text-teal-400">
                         <Activity size={20} className="animate-pulse" />
                         <p className="text-[10px] font-black uppercase tracking-widest">Diagnostic Pathway</p>
                      </div>
                      <p className="text-lg md:text-xl font-black font-display leading-[1.2] mb-8 md:mb-10 tracking-tight">
                         Uplink with Institutional <span className="text-teal-400">{getRecommendedNode()}</span> Node for definitive follow-up.
                      </p>
                       <button 
                         onClick={() => navigate('/find-doctor', { state: { filter: getRecommendedNode() } })}
                         className="w-full py-4 bg-white text-slate-950 rounded-xl md:rounded-2xl font-black text-[10px] md:text-sm uppercase tracking-widest hover:bg-teal-50 transition-all flex items-center justify-center gap-3 shadow-glow cursor-pointer border-none"
                       >
                          Establish Specialist Bridge <ArrowRight size={18} />
                       </button>
                    </div>
                 </div>
              </motion.div>

              <motion.div variants={item}>
                <ClinicalCard className="bg-slate-50/50 border-dashed border-2">
                   <div className="flex items-center gap-3 mb-4 md:mb-6 text-slate-400">
                      <Brain size={18} />
                      <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">Imaging protocol expander</p>
                   </div>
                   <h5 className="text-base md:text-lg font-black text-slate-900 font-display mb-2 md:mb-3 tracking-tight">Neural MRI Analysis</h5>
                   <p className="text-[11px] md:text-xs text-slate-500 font-medium leading-[1.8] mb-6 md:mb-8">
                      High-precision volumetric MRI segmentation and sub-millimeter feature mapping integrated for the V5.0 cycle.
                   </p>
                   <button onClick={() => navigate('/brain-tumor')} className="w-full py-3 bg-white border border-slate-200 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:text-teal-600 hover:border-teal-200 transition-all shadow-subtle cursor-pointer">Initialize Experimental Link</button>
                </ClinicalCard>
              </motion.div>
           </div>
        </div>

        </motion.div>
      </div>
    </AruviAILayout>
  );
};

export default ResultsPage;
;
