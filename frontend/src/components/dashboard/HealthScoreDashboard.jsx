import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ShieldAlert, CheckCircle2, Info, ChevronRight, Dna, ArrowUpRight } from 'lucide-react';

export function HealthScoreDashboard() {
  const diseases = [
    { disease: "Cardio", risk: 72, icon: "❤️", color: "#000DB5", factors: ["BP", "Cholesterol"] },
    { disease: "Glycemic", risk: 45, icon: "🩸", color: "#805AD5", factors: ["Hba1c", "Fasting"] },
    { disease: "Neural", risk: 38, icon: "🧠", color: "#553C9A", factors: ["Sleep", "Stress"] },
    { disease: "Renal", risk: 52, icon: "🫘", color: "#38A169", factors: ["GFR", "Urea"] },
    { disease: "Hepatic", risk: 41, icon: "🫀", color: "#DD6B20", factors: ["ALT", "AST"] }
  ];

  return (
    <div className="bg-white rounded-[2.5rem] border border-[#E1EBF9] p-10 lg:p-14 shadow-sm relative overflow-hidden group font-dm">
      {/* Structural Pattern */}
      <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-110 transition-transform duration-1000">
         <Dna size={320} className="text-[#000DB5]" />
      </div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 mb-16">
           <div>
              <div className="header-badge mb-4 font-syne">Diagnostic Oversight • Protocol Level 4</div>
              <h2 className="text-3xl font-normal text-[#000650] font-syne tracking-tight flex items-center gap-4 leading-none">
                 <Activity className="text-[#000DB5]" size={32} />
                 Clinical Risk Matrix
              </h2>
           </div>
           
           <div className="flex items-center gap-6">
              <div className="flex flex-col items-end">
                 <p className="text-[10px] font-bold text-[#718096] uppercase tracking-[0.2em] mb-1">Local Node Cache</p>
                 <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#000DB5] animate-pulse" />
                    <span className="text-xs font-bold text-[#000650] uppercase tracking-wider font-mono">12:04:02 UTC</span>
                 </div>
              </div>
           </div>
        </div>

        <div className="flex flex-col xl:flex-row items-center gap-20">
          {/* Central Radial Score */}
          <div className="relative flex-shrink-0 group/radial w-64 h-64 md:w-80 md:h-80">
            <svg className="w-full h-full transform -rotate-90 relative z-10" viewBox="0 0 320 320">
               {/* Background Track */}
               <circle
                 cx="160"
                 cy="160"
                 r="140"
                 stroke="#F0F6FE"
                 strokeWidth="12"
                 fill="none"
               />
               {/* Animated Progress */}
               <motion.circle
                 cx="160"
                 cy="160"
                 r="140"
                 stroke="#000DB5"
                 strokeWidth="12"
                 fill="none"
                 strokeLinecap="round"
                 initial={{ strokeDasharray: "0 880" }}
                 animate={{ strokeDasharray: "660 880" }} // 75%
                 transition={{ duration: 2.5, ease: [0.34, 1.56, 0.64, 1] }}
               />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
                className="text-9xl font-normal text-[#000650] tracking-tighter leading-none font-syne"
              >
                75
              </motion.div>
              <div className="text-slate-400 font-black uppercase tracking-[0.4em] text-[10px] mb-6 font-syne">Core Aggregate</div>
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="flex items-center gap-2 px-6 py-2 rounded-xl bg-red-50 border border-red-100 shadow-sm"
              >
                 <ShieldAlert className="text-red-600" size={16} />
                 <span className="text-red-600 text-[10px] font-black uppercase tracking-widest">Elevated Risk</span>
              </motion.div>
            </div>
          </div>

          {/* Disease Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 gap-8 w-full">
            {diseases.slice(0, 4).map((item, idx) => (
              <DiseaseRow key={idx} {...item} delay={idx * 0.1} />
            ))}
          </div>
        </div>
        
        {/* Footer Insight */}
        <div className="mt-20 pt-10 border-t border-[#F0F6FE] flex flex-col md:flex-row md:items-center justify-between gap-8">
           <div className="flex items-center gap-6">
              <div className="w-12 h-12 rounded-xl bg-[#F0F6FE] border border-[#E1EBF9] flex items-center justify-center text-[#000DB5] shadow-sm">
                 <Info size={24} />
              </div>
              <p className="text-[#4A5568] text-sm font-medium leading-relaxed max-w-xl">
                 Synthesis optimized across <span className="text-[#000DB5] font-bold">24 independent diagnostic parameters</span>. 
                 Substantial variance detected in cardiovascular sequence — priority threshold exceeded.
              </p>
           </div>
           <button className="btn-pill btn-pill-primary py-4 px-8 text-xs flex items-center gap-3">
              Generate Detailed Report <ArrowUpRight size={18} />
           </button>
        </div>
      </div>
    </div>
  );
}

function DiseaseRow({ disease, risk, icon, color, delay, factors }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: delay + 0.5 }}
      className="group flex flex-col p-8 rounded-3xl bg-white border border-[#E1EBF9] hover:bg-[#F0F6FE]/50 hover:border-[#000DB5] transition-all cursor-pointer shadow-sm"
    >
      <div className="flex items-center justify-between mb-6">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#F0F6FE] border border-[#E1EBF9] flex items-center justify-center text-3xl group-hover:bg-white transition-colors">
               {icon}
            </div>
            <div>
               <h4 className="text-lg font-bold text-[#000650] leading-none mb-1">{disease}</h4>
               <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-[#718096] uppercase tracking-widest leading-none italic">{factors.join(' • ')}</span>
               </div>
            </div>
         </div>
         <div className="text-right">
            <div className="text-2xl font-normal text-[#000650] font-syne leading-none mb-1">{risk}%</div>
            <p className="text-[9px] font-bold text-[#718096] uppercase tracking-widest font-dm">Confidence: 98%</p>
         </div>
      </div>
      
      <div className="h-1.5 w-full bg-[#F0F6FE] rounded-full overflow-hidden border border-[#E1EBF9]">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${risk}%` }}
          transition={{ delay: delay + 1, duration: 1.5 }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </motion.div>
  );
}
