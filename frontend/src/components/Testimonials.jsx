import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, ChevronLeft, ChevronRight, Star, Building2 } from 'lucide-react';
import { useBreakpoint } from '../hooks/useBreakpoint';

const testimonials = [
  {
    name: 'Dr. Meera Krishnan', title: 'Senior Cardiologist', org: 'Apollo Hospitals, Chennai', avatar: 'MK',
    text: 'AruviAI has transformed how we approach preliminary cardiac risk assessments. The SHAP-based explainability gives me confidence in the predictions, and the SOAP note generation saves us at least 30 minutes per patient encounter.',
  },
  {
    name: 'Dr. Rajesh Gupta', title: 'Head of Neurology', org: 'Fortis Memorial Research Institute', avatar: 'RG',
    text: 'The brain tumor detection module with Grad-CAM visualization is remarkable. Being able to see the heatmap overlay on MRI scans helps me communicate findings to patients effectively.',
  },
  {
    name: 'Dr. Priya Venkatesh', title: 'Endocrinologist', org: 'SVCE Medical Centre', avatar: 'PV',
    text: 'What sets AruviAI apart is the cross-disease intelligence engine. When it flagged a metabolic-neurological stress pattern in one of my diabetic patients, we caught a stroke risk we might have missed.',
  },
  {
    name: 'Dr. Arun Nair', title: 'General Physician', org: 'Narayana Health, Bangalore', avatar: 'AN',
    text: 'As a GP handling 40+ patients daily, the multi-disease screening in a single session is a game-changer. The dual reports save enormous documentation time and improve patient communication.',
  },
];

const sideStats = [
  { num: '98.4%', label: 'Satisfaction', desc: 'Among pilot program participants' },
  { num: '6', label: 'Disease Models', desc: 'Heart, Brain, Diabetes, Stroke, Kidney, Liver' },
  { num: '<2s', label: 'Inference Time', desc: 'From data entry to risk stratification' },
];

export function Testimonials() {
  const [active, setActive] = useState(0);
  const { isMobile } = useBreakpoint();

  useEffect(() => {
    const timer = setInterval(() => setActive(p => (p + 1) % testimonials.length), 6000);
    return () => clearInterval(timer);
  }, []);

  const next = () => setActive(p => (p + 1) % testimonials.length);
  const prev = () => setActive(p => (p - 1 + testimonials.length) % testimonials.length);
  const t = testimonials[active];

  return (
    <section style={{ padding: isMobile ? '60px 0' : '96px 0', background: 'white' }}>
      <div className="section-container">
        {/* Section header — always centered */}
        <div className="text-center mb-14">
          <p className="text-[0.68rem] uppercase tracking-[0.12em] text-[#0fd68c] font-bold mb-3 font-[Syne]">
            CLINICAL VALIDATION
          </p>
          <h2 className="font-[Syne] font-black text-[#0a0a0f] tracking-[-0.03em] leading-[1.05] mb-4 section-title">
            Trusted by <span className="text-[#0fd68c]">leading clinicians.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10 lg:gap-20 items-center">
          {/* Left: Quote Card */}
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="bg-[#f7f9f8] rounded-3xl p-8 md:p-14 relative border border-[#e8ede9]"
              >
                <Quote className="absolute top-6 right-6 md:top-10 md:right-10 w-8 h-8 md:w-12 md:h-12 text-[#0fd68c]/10" />
                
                <div className="flex gap-1 mb-6 md:mb-8">
                  {[1,2,3,4,5].map(i => <Star key={i} size={14} className="fill-amber-400 text-amber-400" />)}
                </div>

                <p className="text-xl md:text-3xl font-[Syne] font-medium text-[#0a0a0f] leading-[1.4] mb-8 md:mb-12 tracking-tight">
                  "{t.text}"
                </p>

                <div className="flex items-center gap-4 md:gap-5">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-[#0a0a0f] rounded-2xl flex items-center justify-center text-[#0fd68c] font-black font-[Syne] text-base md:text-lg">
                    {t.avatar}
                  </div>
                  <div>
                    <h4 className="font-black font-[Syne] text-[#0a0a0f] text-base md:text-lg leading-tight">{t.name}</h4>
                    <p className="text-[#0a0a0f]/40 text-[10px] md:text-sm font-[DM_Sans] mt-1">{t.title} • {t.org}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center justify-between mt-8 md:mt-10 px-4">
              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <button key={i} onClick={() => setActive(i)}
                    className={`h-1.5 rounded-full transition-all duration-500 border-none cursor-pointer ${i === active ? 'w-10 bg-[#0fd68c]' : 'w-2 bg-[#0fd68c]/20'}`}
                  />
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={prev} className="w-10 h-10 md:w-12 md:h-12 rounded-xl border border-[#e8ede9] flex items-center justify-center text-[#0a0a0f]/40 hover:border-[#0fd68c] hover:text-[#0fd68c] transition-all bg-white cursor-pointer">
                  <ChevronLeft size={20} />
                </button>
                <button onClick={next} className="w-10 h-10 md:w-12 md:h-12 rounded-xl border border-[#e8ede9] flex items-center justify-center text-[#0a0a0f]/40 hover:border-[#0fd68c] hover:text-[#0fd68c] transition-all bg-white cursor-pointer">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Right: Stats stack */}
          {!isMobile && (
            <div className="space-y-8 bg-[#f7f9f8] p-8 rounded-3xl border border-[#e8ede9]">
              {sideStats.map((stat, i) => (
                <div key={stat.label} className={i < sideStats.length - 1 ? "pb-8 border-b border-[#e8ede9]" : ""}>
                  <p className="text-4xl font-black font-[Syne] text-[#0a0a0f] tracking-tighter mb-1">{stat.num}</p>
                  <p className="text-[0.65rem] font-black font-[Syne] text-[#0fd68c] uppercase tracking-widest mb-2">{stat.label}</p>
                  <p className="text-xs text-[#0a0a0f]/40 font-[DM_Sans] leading-relaxed">{stat.desc}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
