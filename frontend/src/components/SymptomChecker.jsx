import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Brain, Activity, Droplets, Wind, Eye, Thermometer, AlertCircle, ArrowRight, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useBreakpoint } from '../hooks/useBreakpoint';

const symptoms = [
  { id: 'chest_pain', label: 'Chest Pain', icon: Heart, category: 'Cardiac' },
  { id: 'headache', label: 'Severe Headache', icon: Brain, category: 'Neurological' },
  { id: 'breathlessness', label: 'Breathlessness', icon: Wind, category: 'Respiratory' },
  { id: 'fatigue', label: 'Chronic Fatigue', icon: Activity, category: 'General' },
  { id: 'edema', label: 'Swelling / Edema', icon: Droplets, category: 'Circulatory' },
  { id: 'vision_change', label: 'Vision Changes', icon: Eye, category: 'Neurological' },
  { id: 'high_fever', label: 'High Fever', icon: Thermometer, category: 'Infectious' },
  { id: 'dizziness', label: 'Dizziness / Vertigo', icon: AlertCircle, category: 'Neurological' },
];

export function SymptomChecker() {
  const [selected, setSelected] = useState([]);
  const navigate = useNavigate();
  const { isMobile } = useBreakpoint();

  const toggle = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const handleProceed = () => {
    const prefilledState = {};
    selected.forEach(id => {
      if (id === 'chest_pain') prefilledState.chest_pain = true;
      if (id === 'breathlessness') prefilledState.breathlessness = true;
      if (id === 'fatigue') prefilledState.fatigue = true;
      if (id === 'edema') prefilledState.edema = true;
    });
    navigate('/consultation', { state: { prefilled: prefilledState } });
  };

  return (
    <section className={`bg-[#f7f9f8] ${isMobile ? 'py-[60px]' : 'py-[96px]'}`}>
      <div className="section-container">
        {/* Section header — always centered */}
        <div className="text-center mb-14">
          <p className="text-[0.68rem] uppercase tracking-[0.12em] text-[#0fd68c] font-bold mb-3 font-syne">
            QUICK ASSESSMENT
          </p>
          <h2 className="font-syne font-black text-[#0a0a0f] tracking-[-0.03em] leading-[1.05] mb-4 section-title">
            What are you <span className="text-[#0fd68c]">experiencing?</span>
          </h2>
          <p className="text-[#0a0a0f]/45 text-base max-w-lg mx-auto leading-relaxed font-dm">
            Select your symptoms for a preliminary risk assessment.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* 4×2 Symptom Grid */}
          <div className={`grid ${isMobile ? 'grid-cols-2 gap-3' : 'grid-cols-4 gap-4'} mb-8`}>
            {symptoms.map(symptom => {
              const isActive = selected.includes(symptom.id);
              return (
                <motion.button
                  key={symptom.id}
                  onClick={() => toggle(symptom.id)}
                  whileTap={{ scale: 0.96 }}
                  className={`text-left p-6 rounded-2xl border transition-all duration-300 cursor-pointer ${
                    isActive ? 'border-[#0fd68c] bg-[#f0fdf8] shadow-[0_12px_24px_rgba(15,214,140,0.1)]' : 'border-[#e8ede9] bg-white'
                  }`}
                >
                  <symptom.icon
                    size={24}
                    className={`mb-3 ${isActive ? 'text-[#0fd68c]' : 'text-[#0a0a0f]/20'}`}
                  />
                  <p className="text-sm font-bold text-[#0a0a0f] font-syne mb-1">
                    {symptom.label}
                  </p>
                  <p className="text-[0.6rem] uppercase tracking-widest font-bold text-[#0a0a0f]/25 font-dm">
                    {symptom.category}
                  </p>
                </motion.button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={selected.length}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 mb-8 border border-[#e8ede9] flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                 <div className={`w-2.5 h-2.5 rounded-full ${selected.length > 0 ? 'bg-[#0fd68c]' : 'bg-[#e8ede9]'}`} />
                 <div>
                    <p className="text-[0.65rem] font-black uppercase tracking-widest text-[#0a0a0f]/30 mb-0.5 font-syne">Assessment Pipeline</p>
                    <p className="text-sm text-[#0a0a0f]/60 font-dm">
                       {selected.length === 0 ? 'Select symptoms to begin triage.' : `${selected.length} symptoms detected for neural routing.`}
                    </p>
                 </div>
              </div>
              {!isMobile && (
                <div className="text-2xl font-black text-[#0fd68c] font-syne opacity-20">
                   {selected.length}/8
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <motion.button
              onClick={handleProceed}
              disabled={selected.length === 0}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full h-14 bg-[#0fd68c] text-[#060d0a] rounded-xl font-syne font-bold text-sm tracking-wide flex items-center justify-center gap-3 disabled:opacity-30 disabled:cursor-not-allowed transition-all border-none cursor-pointer"
            >
              Start Diagnostic Link <ArrowRight size={18} />
            </motion.button>
            {selected.length > 0 && (
              <button
                onClick={() => setSelected([])}
                className="w-full sm:w-auto px-8 h-14 border border-[#e8ede9] rounded-xl font-syne font-bold text-sm text-[#0a0a0f]/40 hover:bg-[#0a0a0f]/5 transition-all cursor-pointer bg-white"
              >
                Reset
              </button>
            )}
          </div>

          <p className="text-center text-[0.6rem] font-bold uppercase tracking-widest text-[#0a0a0f]/15 mt-10 font-dm">
            AruviAI is a diagnostic aid. Consult licensed practitioners for final medical clearance.
          </p>
        </div>
      </div>
    </section>
  );
}
