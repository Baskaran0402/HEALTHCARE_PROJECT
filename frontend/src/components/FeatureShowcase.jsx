import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Shield, Globe, Cpu, ArrowRight } from 'lucide-react';
import { useBreakpoint } from '../hooks/useBreakpoint';

const features = [
  { title: 'Precision Analysis', desc: 'Six specialized ML models process patient data in parallel, delivering multi-disease risk stratification in under 2 seconds.', icon: Zap },
  { title: 'HIPAA Compliance', desc: 'End-to-end encryption with Fernet, JWT auth, role-based access, and audit logging built into every transaction.', icon: Shield },
  { title: 'Cross-Disease Intelligence', desc: 'Detects co-morbidity patterns like Cardio-Renal Syndrome and Vascular Neuro-Risk that siloed models miss.', icon: Globe },
  { title: 'Explainable AI', desc: 'SHAP values for tabular predictions and Grad-CAM heatmaps for brain MRI give clinicians the "why" behind every score.', icon: Cpu },
];

export const FeatureShowcase = () => {
  const { isMobile } = useBreakpoint();

  return (
    <section style={{ padding: isMobile ? '60px 0' : '96px 0', background: 'white' }}>
      <div className="section-container">
        {/* Section header — always centered */}
        <div className="text-center mb-14">
          <p className="text-[0.68rem] uppercase tracking-[0.12em] text-[#0fd68c] font-bold mb-3 font-[Syne]">
            CORE CAPABILITIES
          </p>
          <h2 className="font-[Syne] font-black text-[#0a0a0f] tracking-[-0.03em] leading-[1.05] mb-4 section-title">
            Engineered for <span className="text-[#0fd68c]">clinical precision.</span>
          </h2>
          <p className="text-[#0a0a0f]/45 text-base max-w-lg mx-auto leading-relaxed font-[DM_Sans]">
            Purpose-built infrastructure for institutional healthcare — powerful enough for research, intuitive enough for daily practice.
          </p>
        </div>

        {/* 4-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.09, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="bg-[#f7f9f8] p-10 rounded-2xl border border-[#e8ede9] transition-all duration-300 group hover:bg-white hover:shadow-[0_16px_40px_rgba(0,0,0,0.04)] hover:border-[#0fd68c]/20"
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 bg-[#0a0a0f]">
                <f.icon size={22} className="text-[#0fd68c]" />
              </div>

              <h3 className="font-[Syne] font-bold text-lg text-[#0a0a0f] mb-3">
                {f.title}
              </h3>

              <p className="text-sm text-[#0a0a0f]/50 leading-relaxed font-[DM_Sans]">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
