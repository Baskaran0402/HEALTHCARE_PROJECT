import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Brain, Activity, Zap, Droplets, Pill, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useBreakpoint } from '../hooks/useBreakpoint';

const diseases = [
  { name: 'Heart Disease', desc: 'Cardiovascular risk assessment using Framingham-validated ML models with SHAP explainability.', icon: Heart, accuracy: '87.3%', iconColor: '#ef4444' },
  { name: 'Brain Tumor', desc: 'MRI-based detection using EfficientNet-B0 with Grad-CAM visual explainability and lobe localization.', icon: Brain, accuracy: '99.7%', iconColor: '#8b5cf6' },
  { name: 'Diabetes', desc: 'Metabolic risk screening with HbA1c analysis, glucose monitoring, and cross-disease correlation.', icon: Activity, accuracy: '89.1%', iconColor: '#f59e0b' },
  { name: 'Stroke', desc: 'Cerebrovascular risk prediction with hypertension integration and vascular neuro-risk analysis.', icon: Zap, accuracy: '85.7%', iconColor: '#0ea5e9' },
  { name: 'Kidney Disease', desc: 'Renal function assessment using creatinine and urea markers with cardio-renal syndrome detection.', icon: Droplets, accuracy: '86.5%', iconColor: '#10b981' },
  { name: 'Liver Disease', desc: 'Hepatic function screening via ALT/AST/bilirubin analysis with drug interaction warnings.', icon: Pill, accuracy: '84.2%', iconColor: '#14b8a6' },
];

export function HealthRiskCards() {
  const { isMobile } = useBreakpoint();

  return (
    <section className={`bg-[#f7f9f8] ${isMobile ? 'py-[60px]' : 'py-[96px]'}`}>
      <div className="section-container">
        {/* Section header — always centered */}
        <div className="text-center mb-14">
          <p className="text-[0.68rem] uppercase tracking-[0.12em] text-[#0fd68c] font-bold mb-3 font-syne">
            DISEASE MODELS
          </p>
          <h2 className="font-syne font-black text-[#0a0a0f] tracking-[-0.03em] leading-[1.05] mb-4 section-title">
            6 specialized <span className="text-[#0fd68c]">AI models.</span>
          </h2>
          <p className="text-[#0a0a0f]/45 text-base max-w-lg mx-auto leading-relaxed font-dm">
            Each model is independently trained and validated. Our unified assessment runs all tabular models simultaneously.
          </p>
        </div>

        {/* Grid purely for display of models */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {diseases.map((d, i) => (
            <motion.div
              key={d.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="bg-white rounded-2xl border border-[#e8ede9] p-8 hover:border-[#0fd68c]/20 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#060d0a] flex items-center justify-center mb-6">
                <d.icon size={22} style={{ color: d.iconColor }} />
              </div>
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-syne font-bold text-xl text-[#0a0a0f]">{d.name}</h3>
                <span className="text-[0.65rem] font-bold text-[#0fd68c] uppercase tracking-widest">{d.accuracy}</span>
              </div>
              <p className="text-sm text-[#0a0a0f]/50 leading-relaxed font-dm">
                {d.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Unified CTA */}
        <div className="mt-16 text-center">
            <p className="text-[#0a0a0f]/40 text-sm mb-8 font-dm">
                All 6 models run simultaneously in a single Health Assessment session.
            </p>
            <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 ${isMobile ? 'px-4' : ''}`}>
                <Link to="/consultation"
                className="w-full sm:w-auto h-14 px-10 rounded-full bg-[#060d0a] text-[#0fd68c] font-syne font-bold text-sm tracking-wide flex items-center justify-center gap-3 hover:bg-[#0a1a12] transition-all group shadow-xl shadow-black/5 no-underline"
                >
                Start Health Assessment <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/brain-tumor"
                className="w-full sm:w-auto h-14 px-10 rounded-full border border-[#e8ede9] text-[#0a0a0f] font-syne font-bold text-sm tracking-wide flex items-center justify-center hover:border-[#0fd68c] hover:text-[#0fd68c] transition-all no-underline"
                >
                Brain MRI Detection
                </Link>
            </div>
        </div>
      </div>
    </section>
  );
}
