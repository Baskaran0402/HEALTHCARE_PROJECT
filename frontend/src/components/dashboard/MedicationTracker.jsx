import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pill, Activity, CheckCircle2, ChevronRight, AlertCircle, Info, RefreshCw, Plus, ShieldCheck } from 'lucide-react';

export function MedicationTracker() {
  const medications = [
    { name: 'Atorvastatin', dosage: '20mg', frequency: 'Once daily (Night)', progress: 70, color: 'blue' },
    { name: 'Aspirin', dosage: '75mg', frequency: 'After breakfast', progress: 45, color: 'purple' },
    { name: 'Metformin', dosage: '500mg', frequency: 'With meals', progress: 90, color: 'emerald' },
    { name: 'Lisinopril', dosage: '10mg', frequency: 'Morning', progress: 30, color: 'orange' }
  ];

  return (
    <div className="h-full bg-white border border-[#E1EBF9] rounded-[2.5rem] p-8 lg:p-12 relative overflow-hidden group shadow-sm">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/30 via-transparent to-transparent z-0 pointer-events-none" />
      <div className="absolute top-0 right-0 p-12 opacity-[0.03] scale-150 pointer-events-none">
         <Pill size={120} className="text-blue-900 rotate-45" />
      </div>
      
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
           <div>
              <h3 className="text-2xl font-black text-[#000650] uppercase tracking-tighter flex items-center gap-3">
                 <Pill className="text-purple-500" size={24} />
                 Active Pharmaceutical Protocol
              </h3>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mt-1">Real-time Compliance Tracking</p>
           </div>
           
           <div className="flex items-center gap-4">
              <div className="px-5 py-2.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-4 group/protocol shadow-sm">
                 <div className="flex flex-col">
                    <span className="text-[9px] font-black uppercase text-slate-300 tracking-widest">Protocol ID</span>
                    <span className="text-[10px] font-black text-[#000650] uppercase tracking-widest">RX-GL-992-B</span>
                 </div>
                 <div className="w-8 h-8 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-500 group-hover/protocol:scale-110 transition-transform shadow-sm">
                    <ShieldCheck size={16} />
                 </div>
              </div>
              <button className="w-12 h-12 rounded-2xl bg-[#000650] flex items-center justify-center text-white shadow-lg hover:shadow-[#000650]/40 transition-all active:scale-95 cursor-pointer">
                 <Plus size={20} />
              </button>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {medications.map((med, i) => (
            <MedicationCard key={i} med={med} index={i} />
          ))}
        </div>

        {/* Global Compliance Summary */}
        <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-8">
           <div className="flex items-center gap-6">
              <div className="flex flex-col">
                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Global Compliance</span>
                 <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-[#000650] tracking-tighter">84.2%</span>
                    <span className="text-xs font-black text-emerald-600 uppercase tracking-widest">+2.4% Optimal</span>
                 </div>
              </div>
              <div className="h-10 w-px bg-slate-100 hidden md:block" />
              <div className="flex -space-x-4">
                 {[1,2,3].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full bg-slate-50 border-2 border-white flex items-center justify-center text-[10px] font-black text-slate-400 shadow-sm overflow-hidden group/avatar cursor-pointer">
                       <span className="group-hover/avatar:scale-110 transition-transform">💊</span>
                    </div>
                 ))}
                 <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-black text-slate-400">
                    +4
                 </div>
              </div>
           </div>

           <div className="flex items-center gap-4">
              <button className="flex items-center gap-3 px-8 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-[#000650] hover:bg-white transition-all group cursor-pointer shadow-sm">
                 <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-700" />
                 Synchronize Rx Database
              </button>
              <button className="flex items-center gap-3 px-8 py-3.5 rounded-2xl bg-purple-50 border border-purple-100 text-[10px] font-black uppercase tracking-widest text-purple-600 hover:text-white hover:bg-purple-600 transition-all hover:scale-105 group cursor-pointer shadow-sm">
                 Pharmacist Consultation
                 <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}

function MedicationCard({ med, index }) {
   const colorMap = {
      blue: "text-blue-600 bg-blue-50 border-blue-100",
      purple: "text-purple-600 bg-purple-50 border-purple-100",
      emerald: "text-emerald-600 bg-emerald-50 border-emerald-100",
      orange: "text-orange-600 bg-orange-50 border-orange-100"
   };

   const iconMap = {
      blue: "💊",
      purple: "🧬",
      emerald: "🧪",
      orange: "💉"
   };

   return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ y: -5 }}
        className="relative group/med h-full"
      >
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-100 to-transparent blur-[20px] opacity-0 group-hover/med:opacity-100 transition-all pointer-events-none" />
        
        <div className="h-full border border-slate-100 bg-white rounded-[2rem] p-8 group-hover/med:border-blue-200 group-hover/med:shadow-xl transition-all relative overflow-hidden flex flex-col">
           {/* Progress Ring Background */}
           <div className="absolute top-[-20%] right-[-20%] w-48 h-48 bg-slate-50 blur-[40px] rounded-full pointer-events-none group-hover/med:bg-blue-50 transition-all duration-500" />
           
           <div className="flex items-center justify-between mb-8 relative z-10">
              <div className={`w-14 h-14 rounded-2xl ${colorMap[med.color]} flex items-center justify-center text-3xl shadow-sm group-hover/med:scale-110 transition-transform duration-500`}>
                 {iconMap[med.color]}
              </div>
              <div className="flex flex-col items-end">
                 <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-100 text-[9px] font-black uppercase tracking-widest text-emerald-600 mb-2 shadow-sm">
                    <Activity size={10} className="text-emerald-500" />
                    Optimal
                 </div>
                 <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{med.frequency.split(' ')[0]}</span>
              </div>
           </div>

           <div className="mb-10 relative z-10 flex-1">
              <h4 className="text-xl font-black text-[#000650] uppercase tracking-tighter mb-2 leading-none group-hover/med:text-blue-600 transition-colors">{med.name}</h4>
              <p className="text-[10px] text-slate-400 uppercase font-black tracking-[0.2em] mb-4">Strength: <span className="text-slate-600">{med.dosage}</span></p>
              
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                 <p className="text-[11px] font-bold text-slate-600 leading-relaxed uppercase tracking-tight">
                    <span className="text-[9px] font-black text-slate-300 block mb-1">Instruction:</span>
                    {med.frequency}
                 </p>
              </div>
           </div>

           <div className="space-y-4 pt-6 border-t border-slate-50 relative z-10">
              <div className="flex items-center justify-between text-[10px] uppercase font-black tracking-widest">
                 <span className="text-slate-300">Protocol Compliance</span>
                 <span className="text-[#000650] font-bold">{med.progress}%</span>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                 <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: `${med.progress}%` }}
                   transition={{ duration: 1.5, delay: index * 0.2 }}
                   className={`h-full bg-${med.color}-400 shadow-sm`}
                 />
              </div>
           </div>

           <div className="flex items-center justify-between mt-8 relative z-10 pt-2">
              <label className="flex items-center gap-3 cursor-pointer group/check">
                 <div className="relative">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-10 h-6 bg-slate-100 rounded-full border border-slate-200 peer-checked:bg-emerald-500 transition-all" />
                    <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:left-5 shadow-sm" />
                 </div>
                 <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 group-hover/check:text-slate-800 transition-colors">Log Dose</span>
              </label>
              
              <button className="text-slate-200 hover:text-red-500 transition-colors cursor-pointer">
                 <AlertCircle size={16} />
              </button>
           </div>
        </div>
      </motion.div>
   );
}
