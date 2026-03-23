import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PhoneCall, 
  FileText, 
  Pill, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight, 
  Zap,
  Activity,
  History,
  ShieldCheck,
  ChevronRight,
  MoreVertical,
  Layers
} from 'lucide-react';

export function QuickStats() {
  const stats = [
    { icon: <PhoneCall size={20} />, value: '24', label: 'Consultations', trend: '+12.5%', color: 'blue' },
    { icon: <FileText size={20} />, value: '18', label: 'Medical Records', trend: '+3 New', color: 'purple' },
    { icon: <Pill size={20} />, value: '05', label: 'Active Protocols', trend: 'Nominal', color: 'emerald' },
    { icon: <Calendar size={20} />, value: '02', label: 'Schedule Node', trend: 'Stable', color: 'orange' }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, i) => (
        <motion.div
           key={i}
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: i * 0.1 }}
           whileHover={{ y: -5 }}
           className="relative group h-full"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-transparent rounded-[2rem] blur-[20px] opacity-0 group-hover:opacity-100 transition-all duration-500" />
          
          <div className="relative group border border-[#E1EBF9] bg-white rounded-[2rem] overflow-hidden h-full flex flex-col justify-between p-6 shadow-sm hover:shadow-xl transition-all duration-300">
            <div className={`absolute -right-8 -top-8 w-32 h-32 bg-${stat.color}-500/10 blur-[40px] z-0 group-hover:bg-${stat.color}-500/20 transition-all duration-700 pointer-events-none`} />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                 <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-50 border border-${stat.color}-100 flex items-center justify-center text-${stat.color}-500 shadow-sm group-hover:scale-110 transition-transform duration-500`}>
                    {stat.icon}
                 </div>
                 <div className="flex flex-col items-end">
                    <span className={`text-[9px] font-black uppercase tracking-widest ${stat.trend.includes('+') ? 'text-emerald-500' : 'text-slate-400'}`}>
                       {stat.trend}
                    </span>
                    <div className="w-10 h-1 bg-slate-100 rounded-full mt-1 overflow-hidden border border-slate-200">
                       <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: '70%' }}
                          className={`h-full bg-${stat.color}-400`}
                       />
                    </div>
                 </div>
              </div>
              
              <div className="flex flex-col">
                 <div className="text-4xl font-black text-[#000650] tracking-tighter mb-1 tabular-nums group-hover:text-blue-600 transition-colors">{stat.value}</div>
                 <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 truncate">{stat.label}</p>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export function ActivityFeed() {
  const activities = [
    { type: 'Consultation', title: 'Session Completed', time: '2h ago', doctor: 'Dr. Arjun Reddy', status: 'optimal', icon: <PhoneCall size={14} /> },
    { type: 'Laboratory', title: 'MRI Results Uploaded', time: '4h ago', doctor: 'Neuro-Scan Lab', status: 'secure', icon: <Activity size={14} /> },
    { type: 'Prescription', title: 'New RX Received', time: 'Yesterday', doctor: 'Dr. Emily Chen', status: 'active', icon: <Pill size={14} /> },
    { type: 'Security', title: 'Access Signature Sync', time: 'Yesterday', doctor: 'Auth-Node', status: 'verified', icon: <ShieldCheck size={14} /> },
    { type: 'Diagnostic', title: 'Kidney Profile Updated', time: '2 days ago', doctor: 'Lab-Bio 4', status: 'updated', icon: <Layers size={14} /> }
  ];

  return (
    <div className="h-full bg-white relative overflow-hidden flex flex-col group min-h-[500px] p-8 rounded-[2.5rem]">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-transparent z-0 pointer-events-none" />
      <div className="absolute bottom-0 right-0 p-12 opacity-[0.03] pointer-events-none">
         <History size={200} className="text-blue-900" />
      </div>
      
      <div className="relative z-10 flex flex-col h-full">
         <div className="flex items-center justify-between mb-10">
            <div>
               <h2 className="text-2xl font-black text-[#000650] uppercase tracking-tighter flex items-center gap-3">
                  <History className="text-blue-500" size={24} />
                  Registry Audit
               </h2>
               <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mt-1">Immutable Event Ledger</p>
            </div>
            <button className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-800 transition-all cursor-pointer shadow-sm hover:shadow">
               <MoreVertical size={18} />
            </button>
         </div>

         <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {activities.map((act, i) => (
               <motion.div 
                 key={i}
                 initial={{ opacity: 0, x: -20 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ delay: i * 0.05 }}
                 className="flex gap-5 group/item cursor-pointer p-4 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all"
               >
                  <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex flex-shrink-0 items-center justify-center text-blue-500 group-hover/item:border-blue-200 group-hover/item:bg-white group-hover/item:scale-110 transition-all duration-500 shadow-sm group-hover/item:shadow-md">
                     {act.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                     <div className="flex items-start justify-between mb-1">
                        <div className="min-w-0">
                           <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight mb-1 truncate leading-none group-hover/item:text-blue-600 transition-colors">{act.title}</h4>
                           <div className="flex items-center gap-2">
                              <span className="text-[9px] text-slate-400 uppercase font-black tracking-widest truncate">{act.doctor}</span>
                              <span className="text-slate-300">•</span>
                              <span className="text-[9px] text-blue-500/80 uppercase font-black tracking-widest">{act.type}</span>
                           </div>
                        </div>
                        <div className="flex flex-col items-end shrink-0">
                           <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-2 tabular-nums">{act.time}</span>
                           <div className="px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-100 text-[8px] font-black text-emerald-600 uppercase tracking-widest shadow-sm">
                              {act.status}
                           </div>
                        </div>
                     </div>
                  </div>
               </motion.div>
            ))}
         </div>

         <div className="mt-10 pt-6 border-t border-slate-100">
            <button className="flex items-center justify-center gap-3 w-full py-4 rounded-3xl bg-slate-50 border border-slate-200 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-white hover:bg-[#000650] hover:border-[#000650] shadow-sm hover:shadow-lg transition-all group cursor-pointer">
               Access Full Audit Path
               <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
         </div>
      </div>
    </div>
  );
}
