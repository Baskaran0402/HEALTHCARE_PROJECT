import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Heart, Activity, Brain, Droplets } from 'lucide-react';
import { useBreakpoint } from '../hooks/useBreakpoint';

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export const HeroSection = ({ onTryAssessment, onGetStarted }) => {
  const { isMobile, isTablet } = useBreakpoint();

  return (
    <section style={{ 
      minHeight: '100vh', 
      background: '#f7f9f8', 
      display: 'flex', 
      alignItems: 'center', 
      paddingTop: isMobile ? '80px' : '100px', 
      paddingBottom: isMobile ? '48px' : '80px' 
    }}>
      <div className="section-container">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr' : '1.1fr 0.9fr',
            gap: isMobile ? '40px' : isTablet ? '48px' : '80px',
            alignItems: 'center',
            width: '100%'
          }}
        >
          {/* LEFT — primary messaging */}
          <div className="flex flex-col relative z-10" style={{ textAlign: isMobile ? 'center' : 'left', alignItems: isMobile ? 'center' : 'flex-start' }}>
            <motion.div variants={fadeUp} className="flex items-center gap-2 mb-10">
              <span className="w-2 h-2 rounded-full bg-[#0fd68c] animate-pulse shadow-[0_0_10px_rgba(15,214,140,0.5)]" />
              <p className="text-[0.68rem] uppercase tracking-[0.15em] text-[#0fd68c] font-black font-[Syne]">
                Institutional Intelligence v4.3 — LIVE
              </p>
            </motion.div>

            {/* Heading — refined size and spacing */}
            <motion.h1 
              variants={fadeUp}
              className="font-[Syne] font-black text-[#0a0a0f] tracking-[-0.045em] leading-[1] mb-10 hero-title"
            >
              Smarter <span style={{ color: '#0fd68c' }}>Diagnostics</span> <span className={isMobile ? "inline" : "lg:block"}>for everyone.</span>
            </motion.h1>

            <motion.p variants={fadeUp} className="text-[#0a0a0f]/45 text-xl max-w-lg mb-12 leading-relaxed font-[DM_Sans]">
              Screen for 6 diseases in one session. Explainable AI 
              gives you the <span className="text-[#0a0a0f] font-bold">why</span>, not just the score. Built for clinicians. 
              Accessible to all.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center sm:items-start gap-4 pt-4">
              <motion.button
                onClick={onGetStarted}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="group px-10 py-5 rounded-full flex items-center gap-3 text-sm shadow-xl shadow-[#0fd68c]/15 btn-primary"
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 800,
                  background: '#0fd68c',
                  color: '#060d0a',
                }}
              >
                Start Free Assessment
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>

              <motion.button
                onClick={onTryAssessment}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="group px-10 py-5 rounded-full flex items-center gap-3 text-sm btn-primary"
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 700,
                  background: 'white',
                  border: '1px solid #e8ede9',
                  color: '#0a0a0f',
                }}
              >
                <Play size={16} fill="#0fd68c" style={{ color: '#0fd68c' }} />
                Watch Demo
              </motion.button>
            </motion.div>

            {/* Trust row */}
            <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-5 mt-16 pt-8 border-t border-[#0a0a0f]/5" style={{ justifyContent: isMobile ? 'center' : 'flex-start' }}>
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-gray-100 flex items-center justify-center text-[10px] font-bold shadow-sm"
                  >
                    <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="avatar" />
                  </div>
                ))}
              </div>
              <div style={{ textAlign: isMobile ? 'center' : 'left' }}>
                <p className="text-sm" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, color: '#0a0a0f' }}>
                  Trusted by 150+ clinicians
                </p>
                <p className="text-[0.7rem] uppercase tracking-wider font-bold" style={{ color: '#0fd68c' }}>
                  Across 12 major institutions
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right: Diagnostic Card Interface — hide on mobile to keep hero clean */}
          {!isMobile && (
            <div className="w-full relative flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="bg-white rounded-3xl border border-[#0fd68c]/20 shadow-[0_40px_100px_rgba(0,0,0,0.06)] p-8 w-full max-w-[440px] overflow-hidden"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#e8ede9]">
                  <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-[#060d0a] flex items-center justify-center">
                          <span className="text-[#0fd68c] text-[10px] font-black">A</span>
                      </div>
                      <span className="text-[10px] font-bold text-[#0a0a0f]/40 uppercase tracking-widest font-[Syne]">System_Active</span>
                  </div>
                  <div className="text-[10px] font-black text-[#0fd68c] uppercase tracking-widest px-2 py-1 bg-[#0fd68c]/10 rounded">LOW_RISK_DETECTED</div>
                </div>

                {/* Risk Score */}
                <div className="mb-10">
                  <div className="flex items-center justify-between mb-3 text-[11px] font-bold text-[#0a0a0f]/30 uppercase tracking-[0.15em] font-[DM_Sans]">
                    <span>Aggregate Risk Lattice</span>
                    <span className="text-[#0fd68c]">24.8% Nominal</span>
                  </div>
                  <div className="h-4 w-full rounded-full overflow-hidden p-0.5 border border-[#e8ede9]" style={{ background: 'white' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '24.8%' }}
                      transition={{ duration: 2.5, delay: 1, ease: [0.22, 1, 0.36, 1] }}
                      className="h-full rounded-full"
                      style={{ background: '#0fd68c', boxShadow: '0 0 10px rgba(15,214,140,0.4)' }}
                    />
                  </div>
                </div>

                {/* 4 Disease Chips */}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: Heart, label: 'Cardiac', score: '12%', color: '#ef4444', bg: '#fff5f5' },
                    { icon: Activity, label: 'Metabolic', score: '8%', color: '#f59e0b', bg: '#fffbf0' },
                    { icon: Brain, label: 'Neural', score: '2%', color: '#8b5cf6', bg: '#f8f5ff' },
                    { icon: Droplets, label: 'Renal', score: '5%', color: '#0ea5e9', bg: '#f0f9ff' },
                  ].map((item, i) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.2 + i * 0.1, duration: 0.5 }}
                      className="p-5 rounded-2xl border border-transparent hover:border-[#e8ede9] transition-all"
                      style={{ background: item.bg }}
                    >
                      <item.icon size={20} style={{ color: item.color }} strokeWidth={3} />
                      <p className="text-[10px] mt-3 uppercase tracking-widest font-black" style={{ fontFamily: "'DM Sans', sans-serif", color: 'rgba(10,10,15,0.25)' }}>
                        {item.label}
                      </p>
                      <p className="text-2xl tracking-tighter" style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, color: '#0a0a0f' }}>
                        {item.score}
                      </p>
                    </motion.div>
                  ))}
                </div>

                {/* Bottom status */}
                <div className="flex items-center justify-between pt-8 mt-6"
                  style={{ borderTop: '1px solid #e8ede9' }}>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <span className="block w-2.5 h-2.5 rounded-full" style={{ background: '#0fd68c' }} />
                      <span className="absolute inset-0 w-2.5 h-2.5 rounded-full animate-ping" style={{ background: '#0fd68c' }} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#0a0a0f]/40 font-[Syne]">
                      6 Neural Models Online
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-[#0a0a0f]/20 font-mono tracking-tighter">
                    IFR_420_X
                  </span>
                </div>
              </motion.div>
              
              {/* Background decorative elements */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#0fd68c]/5 rounded-full blur-3xl -z-10" />
              <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-blue-500/5 rounded-full blur-3xl -z-10" />
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};
