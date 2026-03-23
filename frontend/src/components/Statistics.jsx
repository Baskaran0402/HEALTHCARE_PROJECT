import React from 'react';
import { motion } from 'framer-motion';
import { useBreakpoint } from '../hooks/useBreakpoint';

const stats = [
  { number: '99.2%', label: 'Accuracy' },
  { number: '6', label: 'Disease Models' },
  { number: '50K+', label: 'Scans' },
  { number: '<2s', label: 'Inference' },
];

export function Statistics() {
  const { isMobile } = useBreakpoint();

  return (
    <section className={`bg-[#0a0a0f] ${isMobile ? 'py-[60px]' : 'py-[96px]'}`}>
      <div className="section-container">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-12">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={`text-center py-4 ${i < stats.length - 1 && !isMobile ? 'lg:border-r border-white/5' : ''}`}
            >
              <p className="text-4xl md:text-5xl font-black font-syne text-[#0fd68c] leading-none mb-3">
                {stat.number}
              </p>
              <p className="text-[0.65rem] font-bold text-white/30 uppercase tracking-[0.2em] font-dm">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
