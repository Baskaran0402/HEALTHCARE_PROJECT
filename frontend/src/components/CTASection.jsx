import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useBreakpoint } from '../hooks/useBreakpoint';

export function CTASection() {
  const { isMobile } = useBreakpoint();

  return (
    <section style={{ position: 'relative', overflow: 'hidden', minHeight: isMobile ? '500px' : '600px', background: '#060d0a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Atmospheric radial glow */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 50%, rgba(15, 214, 140, 0.08), transparent 70%)', pointerEvents: 'none' }} />
      
      {/* Dynamic particles background illusion */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0.1, scale: 0.5 }}
            animate={{ 
              opacity: [0.1, 0.3, 0.1], 
              scale: [0.5, 1, 0.5],
              x: Math.random() * 100 - 50,
              y: Math.random() * 100 - 50
            }}
            transition={{ 
              duration: 5 + Math.random() * 5, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            style={{
              position: 'absolute',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 1}px`,
              height: `${Math.random() * 4 + 1}px`,
              background: '#0fd68c',
              borderRadius: '50%',
              filter: 'blur(1px)'
            }}
          />
        ))}
      </div>

      <div style={{ textAlign: 'center', position: 'relative', zIndex: 1, padding: isMobile ? '80px 24px' : '100px 48px', maxWidth: '1000px', width: '100%' }}>
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
            <p style={{ color: '#0fd68c', fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '24px', fontFamily: 'Syne' }}>
                ✦ Get Started — Free
            </p>
            <h2 style={{ color: 'white', fontFamily: 'Syne', fontWeight: 900, fontSize: isMobile ? '2.5rem' : 'clamp(2.8rem, 6.5vw, 5rem)', letterSpacing: '-0.04em', lineHeight: 0.9, marginBottom: '24px' }}>
                Your next patient<br />deserves <span style={{ color: '#0fd68c' }}>better diagnostics.</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: isMobile ? '1rem' : '1.15rem', maxWidth: '520px', margin: '0 auto 48px', lineHeight: 1.6, fontFamily: 'DM Sans' }}>
                Screen 6 major diseases in one clinical session. Explainable AI. Structural reports in seconds, not hours.
            </p>
            
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', flexDirection: isMobile ? 'column' : 'row' }}>
                <Link to="/consultation" style={{ background: '#0fd68c', color: '#060d0a', fontFamily: 'Syne', fontWeight: 800, padding: isMobile ? '18px 32px' : '20px 44px', borderRadius: '100px', textDecoration: 'none', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 20px 40px rgba(15,214,140,0.2)', transition: 'transform 0.3s' }}>
                    Start Full Assessment <ArrowRight size={20} />
                </Link>
                <Link to="/demo" style={{ border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.7)', fontFamily: 'Syne', fontWeight: 700, padding: isMobile ? '18px 32px' : '20px 44px', borderRadius: '100px', textDecoration: 'none', fontSize: '1rem', transition: 'all 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                    <Play size={18} fill="rgba(255,255,255,0.7)" /> Watch Demo
                </Link>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: isMobile ? '20px' : '40px', marginTop: '64px', opacity: 0.3 }}>
                {[
                    { label: 'HIPAA COMPLIANT', icon: '☑' },
                    { label: 'END-TO-END ENCRYPTED', icon: '🔒' },
                    { label: 'OPEN SYSTEM', icon: '⚙' },
                    { label: 'CLINICAL AID ONLY', icon: '⚠' }
                ].map(t => (
                    <div key={t.label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '10px', color: 'white' }}>{t.icon}</span>
                        <span style={{ color: 'white', fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.15em', fontFamily: 'DM Sans' }}>{t.label}</span>
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
