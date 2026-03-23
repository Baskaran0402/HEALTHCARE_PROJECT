import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Cloud, Sun, Calendar, Activity, ChevronRight, Dna } from 'lucide-react';

export function WelcomeBanner({ user }) {
  const [currentTime, setCurrentTime] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="relative overflow-hidden rounded-[2.5rem] bg-[#000650] p-10 lg:p-14 text-white shadow-xl">
      {/* Structural Decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
         <Dna className="absolute -right-20 -top-20 w-[400px] h-[400px] rotate-45" />
      </div>
      
      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
           <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-4 mb-8">
                 <motion.div 
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   className="px-4 py-1.5 rounded-xl bg-white/10 border border-white/20 text-white text-[10px] font-bold uppercase tracking-widest flex items-center gap-2"
                 >
                    <div className="w-1.5 h-1.5 rounded-full bg-[#38A169] shadow-[0_0_8px_#38A169]" />
                    Protocol Synced
                 </motion.div>
                 <div className="flex items-center gap-2 text-white/50 text-[10px] font-bold uppercase tracking-widest">
                    <Calendar size={14} />
                    {formatDate(currentTime)}
                 </div>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-normal tracking-tight font-outfit mb-8 leading-tight">
                Welcome back, <br />
                <span className="text-white font-light italic">{user?.name?.split(' ')[0] || 'Subject'}</span>.
              </h1>
              
              <div className="flex flex-wrap items-center gap-6">
                 <p className="text-white/70 max-w-sm font-medium text-base leading-relaxed">
                   Next multimodal analysis in <span className="text-white font-bold border-b border-white/30">14 days</span>. 
                   Baseline clinical metrics are currently stable.
                 </p>
                 <button className="flex items-center gap-2 text-sm font-bold bg-white/10 hover:bg-white/20 px-6 py-2.5 rounded-xl transition-all border border-white/10">
                    Review Sequence <ChevronRight size={18} />
                 </button>
              </div>
           </div>

           <div className="flex flex-col items-start lg:items-end text-left lg:text-right">
              <div className="flex items-center gap-3 mb-2 text-[#718096]">
                 <Clock size={20} className="text-white/40" />
                 <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">Local Chrono</span>
              </div>
              <div className="text-6xl font-normal tracking-tighter leading-none tabular-nums font-outfit mb-8">
                 {formatTime(currentTime)}
              </div>
              
              <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white border border-[#E1EBF9] shadow-lg group cursor-pointer transition-transform hover:scale-105">
                 <Sun size={20} className="text-[#D69E2E]" />
                 <div className="text-left">
                    <p className="text-[9px] font-bold text-[#718096] uppercase tracking-widest leading-none mb-1">Environmental</p>
                    <p className="text-sm font-bold text-[#000650] leading-none">22°C • Mostly Clear</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
