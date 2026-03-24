import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useBreakpoint } from '../hooks/useBreakpoint';

// Pre-calculated random offsets moved outside component to maintain purity
const particles = [...Array(20)].map((_, i) => ({
  id: i,
  x: Math.random() * 100 - 50,
  y: Math.random() * 100 - 50,
  duration: 5 + Math.random() * 5,
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  width: `${Math.random() * 4 + 1}px`,
  height: `${Math.random() * 4 + 1}px`
}));

export function CTASection() {
  const { isMobile } = useBreakpoint();

  return (
    <section className={`relative overflow-hidden ${isMobile ? 'min-h-[500px]' : 'min-h-[600px]'} bg-[#060d0a] flex items-center justify-center`}>
      {/* Atmospheric radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(15,214,140,0.08),transparent_70%)] pointer-events-none" />
      
      {/* Dynamic particles background illusion */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0.1, scale: 0.5 }}
            animate={{ 
              opacity: [0.1, 0.3, 0.1], 
              scale: [0.5, 1, 0.5],
              x: p.x,
              y: p.y
            }}
            transition={{ 
              duration: p.duration, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            style={{
              position: 'absolute',
              left: p.left,
              top: p.top,
              width: p.width,
              height: p.height,
              background: '#0fd68c',
              borderRadius: '50%',
              filter: 'blur(1px)'
            }}
          />
        ))}
      </div>

      <div className={`text-center relative z-[1] ${isMobile ? 'py-20 px-6' : 'py-[100px] px-12'} max-w-[1000px] w-full`}>
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
            <p className="text-[#0fd68c] text-[0.72rem] font-extrabold tracking-[0.2em] uppercase mb-6 font-syne">
                ✦ Get Started — Free
            </p>
            <h2 className={`text-white font-syne font-black ${isMobile ? 'text-[2.5rem]' : 'text-[clamp(2.8rem,6.5vw,5rem)]'} tracking-[-0.04em] leading-[0.9] mb-6`}>
                Your next patient<br />deserves <span className="text-[#0fd68c]">better diagnostics.</span>
            </h2>
            <p className={`text-white/45 ${isMobile ? 'text-base' : 'text-[1.15rem]'} max-w-[520px] mx-auto mb-12 leading-[1.6] font-dm`}>
                Screen 6 major diseases in one clinical session. Explainable AI. Structural reports in seconds, not hours.
            </p>

            <div className={`flex gap-4 justify-center flex-wrap ${isMobile ? 'flex-col' : 'flex-row'}`}>
                <Link to="/consultation" className={`bg-[#0fd68c] text-[#060d0a] font-syne font-extrabold ${isMobile ? 'px-8 py-[18px]' : 'px-[44px] py-5'} rounded-full no-underline text-base flex items-center justify-center gap-[10px] shadow-[0_20px_40px_rgba(15,214,140,0.2)] transition-transform duration-300`}>
                    Start Full Assessment <ArrowRight size={20} />
                </Link>
                <Link to="/demo" className={`border border-white/15 text-white/70 font-syne font-bold ${isMobile ? 'px-8 py-[18px]' : 'px-[44px] py-5'} rounded-full no-underline text-base transition-all duration-300 flex items-center justify-center gap-[10px]`}>
                    <Play size={18} fill="rgba(255,255,255,0.7)" /> Watch Demo
                </Link>
            </div>

            <div className={`flex flex-wrap items-center justify-center ${isMobile ? 'gap-5' : 'gap-10'} mt-16 opacity-30`}>
                {[
                    { label: 'HIPAA COMPLIANT', icon: '☑' },
                    { label: 'END-TO-END ENCRYPTED', icon: '🔒' },
                    { label: 'OPEN SYSTEM', icon: '⚙' },
                    { label: 'CLINICAL AID ONLY', icon: '⚠' }
                ].map(t => (
                    <div key={t.label} className="flex items-center gap-2">
                        <span className="text-[10px] text-white">{t.icon}</span>
                        <span className="text-white text-[0.68rem] font-extrabold tracking-[0.15em] font-dm">{t.label}</span>
                    </div>
                ))}
            </div>
        </motion.div>
      </div>

      {/* Decorative lines */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
    </section>
  );
}
