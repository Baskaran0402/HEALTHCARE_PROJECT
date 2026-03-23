import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Cpu, BarChart3, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useBreakpoint } from '../hooks/useBreakpoint';

const steps = [
  { step: '01', title: 'Enter Patient Data', desc: 'Clinician enters biometrics, lab values, and medical history through the secure diagnostic form.', icon: FileText },
  { step: '02', title: 'AI Inference', desc: '6 specialized ML models process data in parallel — heart, brain, diabetes, stroke, kidney, and liver.', icon: Cpu },
  { step: '03', title: 'Explainable Report', desc: 'SHAP-powered explanations and Grad-CAM heatmaps show the "why" behind every prediction.', icon: BarChart3 },
];

export function HowItWorks() {
  const { isMobile } = useBreakpoint();

  return (
    <section className={`bg-[#060d0a] ${isMobile ? 'py-[60px]' : 'py-[96px]'}`}>
      <div className="section-container">
        {/* Section header — always centered */}
        <div className="text-center mb-16">
          <p className="text-[0.68rem] uppercase tracking-[0.12em] text-[#0fd68c] font-bold mb-3 font-syne">
            HOW IT WORKS
          </p>
          <h2 className="font-syne font-black text-white tracking-[-0.03em] leading-[1.05] mb-4 section-title">
            Three steps to <span className="text-[#0fd68c]">smarter diagnostics.</span>
          </h2>
        </div>

        {/* 3 Columns */}
        <div className={`grid ${isMobile ? 'grid-cols-1 gap-8' : 'grid-cols-3 gap-0'}`}>
          {steps.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className={`relative text-center p-10 md:p-14 ${i < steps.length - 1 && !isMobile ? 'md:border-r border-white/5' : ''}`}
            >
              <div className="relative inline-block mb-10">
                <span className="text-6xl font-black font-syne text-white/5 block">{s.step}</span>
                <div className="absolute inset-0 flex items-center justify-center">
                   <s.icon className="w-10 h-10 text-[#0fd68c]" />
                </div>
              </div>

              <h3 className="font-syne font-bold text-xl text-white mb-4">
                {s.title}
              </h3>
              <p className="text-sm text-white/30 leading-relaxed font-dm max-w-xs mx-auto">
                {s.desc}
              </p>

              {i < steps.length - 1 && !isMobile && (
                <div className="absolute top-1/2 -right-4 -translate-y-1/2 hidden lg:block opacity-20">
                  <ArrowRight size={24} className="text-[#0fd68c]" />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link to="/consultation"
            className="inline-flex items-center gap-3 px-10 py-4 rounded-xl font-syne font-bold text-sm tracking-wide bg-[#0fd68c] text-[#060d0a] hover:bg-[#0ab876] transition-all border-none cursor-pointer no-underline"
          >
            Launch System
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
