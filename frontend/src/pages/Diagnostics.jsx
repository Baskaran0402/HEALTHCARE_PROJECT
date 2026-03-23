import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Stethoscope, ChevronRight, Zap, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AruviAILayout } from '../components/ui/AruviAILayout';
import { ClinicalCard, ClinicalBadge } from '../components/ClinicalComponents';
import { useBreakpoint } from '../hooks/useBreakpoint';

const DiagnosticModule = ({ icon: Icon, title, description, path, color, badge, isMobile }) => {
  const navigate = useNavigate();
  return (
    <ClinicalCard 
      onClick={() => navigate(path)}
      className="group cursor-pointer hover:border-teal-500 transition-all duration-300 relative overflow-hidden h-full flex flex-col"
    >
      <div className="flex flex-col h-full relative z-10 px-2 py-1">
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600 shadow-sm group-hover:scale-110 transition-transform duration-500">
            <Icon size={isMobile ? 24 : 32} />
          </div>
          {badge && <ClinicalBadge variant="primary" className="text-[9px] md:text-[10px]">{badge}</ClinicalBadge>}
        </div>
        
        <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-3 md:mb-4 font-syne tracking-tight">{title}</h3>
        <p className="text-slate-500 text-sm md:text-base font-medium mb-8 md:mb-10 leading-relaxed line-clamp-3 font-dm">
          {description}
        </p>
        
        <div className="mt-auto flex items-center text-teal-600 font-black text-[10px] md:text-xs uppercase tracking-widest gap-2 group-hover:gap-4 transition-all">
          <span>Initialize Protocol</span>
          <ChevronRight size={16} />
        </div>
      </div>
    </ClinicalCard>
  );
};

export default function Diagnostics() {
  const { isMobile } = useBreakpoint();
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <AruviAILayout activeTab="Diagnostics">
      <div className={`w-full max-w-7xl mx-auto ${isMobile ? 'px-4' : 'px-8'}`}>
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-12 md:space-y-16 pb-20 pt-6 md:pt-10"
        >
          <motion.div variants={item} className="mb-6 md:mb-10 text-center lg:text-left">
             <p className="text-[11px] md:text-[0.65rem] uppercase tracking-[0.15em] text-[#0fd68c] font-black mb-2 font-syne">
               PLATFORM INTELLIGENCE
             </p>
             <h1 className="font-syne font-black text-2xl md:text-4xl text-[#0a0a0f] tracking-[-0.04em] leading-tight mb-3">
               Diagnostic <span className="text-[#0fd68c]">Modules.</span>
             </h1>
             <p className="text-[#0a0a0f]/45 text-sm md:text-base font-dm max-w-2xl leading-relaxed lg:mx-0 mx-auto">
                Select an advanced AI diagnostic protocol to begin clinical assessment. Our engines are optimized for high-precision anatomical mapping and multi-disease stratification.
             </p>
          </motion.div>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
          <motion.div variants={item}>
            <DiagnosticModule 
              icon={Stethoscope}
              title="Clinical Consultation"
              description="Comprehensive multi-risk assessment covering cardiovascular, renal, hepatic, and metabolic pathologies using expert hybrid reasoning and SHAP explanations."
              path="/consultation"
              color="teal"
              badge="v4.0.2 Stable"
              isMobile={isMobile}
            />
          </motion.div>
          
          <motion.div variants={item}>
            <DiagnosticModule 
              icon={Brain}
              title="MRI Neuro-Imaging"
              description="Sub-millimeter anatomical feature extraction for brain tumor detection and lobal localization using EfficientNet-B0 architectures and Grad-CAM visualization."
              path="/brain-tumor"
              color="teal"
              badge="Neural-OS"
              isMobile={isMobile}
            />
          </motion.div>
        </div>

        <motion.div variants={item} className="bg-slate-900 rounded-3xl md:rounded-[3rem] p-8 md:p-16 text-white relative overflow-hidden shadow-2xl">
           <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-500 rounded-full blur-[120px]" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500 rounded-full blur-[100px]" />
           </div>
           
           <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center">
              <div>
                 <div className="flex items-center justify-center lg:justify-start gap-4 mb-6 md:mb-8 text-teal-400">
                    <Zap size={24} className="animate-pulse" />
                    <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] font-syne">Institutional Grade Layer</span>
                 </div>
                 <h2 className="text-2xl md:text-5xl font-black mb-6 md:mb-8 font-syne leading-[1.1] tracking-tight text-center lg:text-left">Secure Multi-Disease Cross-Intelligence.</h2>
                 <p className="text-slate-400 text-sm md:text-xl font-medium leading-relaxed max-w-xl text-center lg:text-left mx-auto lg:mx-0 font-dm">
                    Our platform simultaneously stratifies risk across 6+ clinical dimensions while maintaining strict HIPAA-compliant E2EE silos for all patient datasets.
                 </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 md:gap-6">
                 {[
                    { label: 'E2EE Encryption', active: true },
                    { label: 'HIPAA Shield', active: true },
                    { label: 'Explainable AI', active: true },
                    { label: 'ISO 27001', active: true },
                 ].map((stat, i) => (
                    <div key={i} className="p-6 md:p-8 bg-white/5 border border-white/10 rounded-2xl md:rounded-3xl backdrop-blur-2xl hover:bg-white/10 transition-colors group">
                       <ShieldCheck className="text-teal-400 mb-3 md:mb-4 group-hover:scale-110 transition-transform" size={isMobile ? 24 : 32} />
                       <p className="text-[10px] md:text-sm font-black uppercase tracking-widest text-slate-100">{stat.label}</p>
                    </div>
                 ))}
              </div>
           </div>
        </motion.div>
      </motion.div>
      </div>
    </AruviAILayout>
  );
}
