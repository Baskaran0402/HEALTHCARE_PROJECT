import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, Download, Share2, Search, 
  Calendar, FileSignature, ExternalLink, 
  Trash2, Filter, CheckCircle2, AlertTriangle,
  Zap, Database, ShieldCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  ClinicalCard, 
  ClinicalBadge, 
  ClinicalInput, 
  SectionHeader,
  DarkPanel
} from '../components/ClinicalComponents';
import { AruviAILayout } from '../components/ui/AruviAILayout';
import { useToast } from '../components/ui/Toast';
import { useBreakpoint } from '../hooks/useBreakpoint';

const ReportCard = ({ report, idx, isMobile }) => {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleOpenReport = () => {
    const mockResult = {
      assessment: {
        overall_risk_level: report.type === 'MRI' ? 'Stable' : 'Moderate',
        overall_risk_score: report.type === 'MRI' ? 12 : 35,
        individual_risks: report.tags.map(tag => ({
          risk_name: tag,
          risk_level: 'Stable',
          risk_score: 10
        })),
        primary_concerns: [report.summary]
      },
      clinical_summary: `### Institutional Report Analysis\n\n**Subject Identification:** DX-NODE-${Math.random().toString(36).substr(2, 5).toUpperCase()}\n**Protocol Date:** ${report.date}\n\n${report.summary}\n\nNeural stratification confirms zero pathological resonance. Monitoring recommended in current active cycle.`
    };

    navigate('/results', { 
      state: { 
        result: mockResult,
        patientData: { name: "Audit Subject" },
        medicalData: {}
      } 
    });
  };

  const handleDownloadStub = () => {
    addToast(`Initializing download for ${report.title}...`, "info");
    setTimeout(() => {
      addToast("Export failed: Historical archive restricted to read-only access in demo mode.", "warning");
    }, 1500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.05 }}
      className="group h-full"
    >
      <ClinicalCard className="h-full flex flex-col hover:-translate-y-2 transition-all duration-300">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600 transition-transform group-hover:scale-110 shadow-subtle shrink-0">
                <FileText size={22} />
             </div>
             <div>
                <h3 className="text-lg font-black text-slate-800 group-hover:text-teal-700 transition-colors font-syne leading-tight">{report.title}</h3>
                <div className="flex items-center gap-2 mt-1.5">
                   <Calendar size={12} className="text-slate-300" />
                   <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{report.date}</span>
                </div>
             </div>
          </div>
          <ClinicalBadge variant={report.type === 'MRI' ? 'primary' : 'info'} className="text-[9px]">{report.type}</ClinicalBadge>
        </div>

        <div className="p-4 md:p-5 bg-slate-50/50 rounded-2xl mb-6 border border-slate-100 italic text-xs font-medium text-slate-500 leading-relaxed">
          "{report.summary}"
        </div>

        <div className="flex flex-wrap gap-2 mb-8 mt-auto">
           {report.tags.map((tag, i) => (
              <span key={i} className="px-2.5 py-1 bg-white border border-slate-100 rounded-lg text-[9px] font-black text-slate-400 uppercase tracking-widest">{tag}</span>
           ))}
        </div>

        <div className="flex items-center gap-3 pt-6 border-t border-slate-100">
           <button 
             onClick={handleOpenReport}
             className="flex-1 px-4 py-3 bg-teal-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-teal-700 transition-all flex items-center justify-center gap-2 shadow-glow border-none cursor-pointer"
           >
              <ExternalLink size={14} /> Open
           </button>
           <button
             onClick={handleDownloadStub}
             className="w-11 h-11 flex items-center justify-center text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-all border border-slate-100 cursor-pointer bg-white"
           >
              <Download size={18} />
           </button>
        </div>
      </ClinicalCard>
    </motion.div>
  );
};

export default function Reports() {
  const [activeTab, setActiveTab] = useState("ALL");
  const { isMobile } = useBreakpoint();

  const archivedReports = [
    { title: "Neuroaxial Scan Analysis", date: "Mar 12, 2026", type: "MRI", tags: ["Brain", "Frontal Lobe", "High Risk"], summary: "Localized hyperintensity in the subcortical tissue consistent with low-grade gliosis." },
    { title: "Metabolic Risk Matrix", date: "Mar 10, 2026", type: "CONSULT", tags: ["Cardiac", "Renal", "Diabetes"], summary: "Multi-parameter stratification indicates stable markers but elevated urea index." },
    { title: "Cardiovascular Telemetry", date: "Mar 05, 2026", type: "CONSULT", tags: ["Heart", "Vitals"], summary: "Optimal systemic throughput with synchronized ventricular waveforms." },
    { title: "Neural Expansion Protocol", date: "Feb 28, 2026", type: "MRI", tags: ["Brain", "Temporal"], summary: "Normal anatomical variation noted with zero pathological markers identified." },
  ];

  return (
    <AruviAILayout activeTab="Reports">
      <div className={`w-full max-w-7xl mx-auto ${isMobile ? 'px-4' : 'px-8'}`}>
        <div className="space-y-8 md:space-y-12 pb-20 pt-6 md:pt-10">
          
          {/* Header */}
          <SectionHeader 
            badge="Radiological Archive"
            title={<>Clinical <span className="text-teal-600">Reports.</span></>}
            subtitle="Securely access and distribute verified diagnostic transcripts across the institutional lattice."
            actions={
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <button className="flex-1 sm:flex-none px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-[10px] md:text-xs font-black text-slate-500 hover:text-slate-900 hover:border-teal-500/30 transition-all uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer">
                   <Database size={15} /> Data Cluster
                </button>
                <button className="flex-1 sm:flex-none px-5 py-2.5 bg-slate-900 text-teal-400 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest hover:bg-teal-600 hover:text-white transition-all flex items-center justify-center gap-2 shadow-premium border-none cursor-pointer">
                   <FileSignature size={15} /> Batch Certify
                </button>
              </div>
            }
          />


        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-6 items-stretch lg:items-center justify-between p-6 md:p-8 bg-white rounded-2xl md:rounded-[2rem] border border-slate-100 shadow-subtle relative overflow-hidden">
           <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
              {['ALL', 'MRI', 'CONSULTATION', 'AI_AUDIT'].map((t) => (
                 <button 
                   key={t}
                   onClick={() => setActiveTab(t)}
                   className={`whitespace-nowrap px-4 md:px-5 py-2.5 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer border-none ${
                     activeTab === t ? 'bg-teal-600 text-white shadow-glow' : 'text-slate-400 hover:bg-slate-50'
                   }`}
                 >
                    {t}
                 </button>
              ))}
           </div>
           
           <div className="w-full lg:w-80">
              <ClinicalInput 
                label="Transcript Lookup"
                placeholder="Search transcripts..." 
              />
           </div>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
           {archivedReports.map((report, idx) => (
              <ReportCard key={idx} report={report} idx={idx} isMobile={isMobile} />
           ))}
        </div>

        {/* Governance Footer */}
        <DarkPanel className="rounded-2xl md:rounded-[3rem] p-8 md:p-16">
           <div className="flex flex-col lg:flex-row items-center justify-between gap-10 md:gap-12 text-center lg:text-left">
              <div className="space-y-4">
                 <div className="flex items-center justify-center lg:justify-start gap-4 text-teal-400">
                    <ShieldCheck size={28} />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em]">Governance Chain</span>
                 </div>
                 <h2 className="text-2xl md:text-4xl font-black font-syne tracking-tight text-white leading-tight">Cryptographic Verification.</h2>
                 <p className="text-slate-400 text-sm md:text-base font-medium max-w-md leading-relaxed mx-auto lg:mx-0">
                    All reports are hashed and signed using institutional private keys, ensuring immutable provenance within the eBpages Professional lattice.
                 </p>
              </div>
              <button className="w-full lg:w-auto px-10 py-4 bg-white text-slate-900 rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest hover:bg-slate-100 transition-all shadow-xl flex items-center justify-center gap-3 border-none cursor-pointer">
                 <Zap size={18} className="text-teal-600" />
                 <span>Verify Integrity</span>
              </button>
           </div>
        </DarkPanel>

      </div>
      </div>
    </AruviAILayout>
  );
}
