import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import analyticsService from '../services/analyticsService';
import { 
  BarChart3, TrendingUp, Activity, 
  Download, Zap, Globe, ShieldCheck
} from 'lucide-react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar, Cell, PieChart as RePieChart, Pie
} from 'recharts';
import { ClinicalCard, StatCard } from '../components/ClinicalComponents';
import { useBreakpoint } from '../hooks/useBreakpoint';

export default function Analytics() {
  const { data: metrics } = useQuery({
    queryKey: ['analyticsMetrics'],
    queryFn: () => analyticsService.getDashboardMetrics(),
  });
  const { isMobile } = useBreakpoint();

  const displayStats = metrics ? [
    { label: 'Throughput', value: metrics.total_throughput || '412', trend: '+12.5%', icon: <Activity size={20} /> },
    { label: 'Latency Map', value: metrics.uptime || '99.9%', trend: 'Stable', icon: <Globe size={20} /> },
    { label: 'Audit Success', value: '100%', trend: 'Verified', icon: <ShieldCheck size={20} /> },
    { label: 'Anomalies', value: metrics.anomaly_count || '08', alert: true, trend: '-2.4%', icon: <BarChart3 size={20} /> },
  ] : [
    { label: 'Throughput', value: '412', trend: '+12.5%', icon: <Activity size={20} /> },
    { label: 'Latency Map', value: '99.9%', trend: 'Stable', icon: <Globe size={20} /> },
    { label: 'Audit Success', value: '100%', trend: 'Verified', icon: <ShieldCheck size={20} /> },
    { label: 'Anomalies', value: '08', alert: true, trend: '-2.4%', icon: <BarChart3 size={20} /> },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <>
      <div className={`w-full max-w-7xl mx-auto ${isMobile ? 'px-4' : 'px-8'}`}>
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-8 md:space-y-12 pb-20 pt-6 md:pt-10">
          
          {/* Header */}
          <motion.div variants={item} className="mb-6 md:mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 text-center md:text-left">
            <div className="w-full md:w-auto">
              <p className="text-[11px] md:text-[0.65rem] uppercase tracking-[0.15em] text-[#0fd68c] font-bold mb-2 font-syne">
                SYSTEM ANALYTICS
              </p>
              <h1 className="font-syne font-black text-2xl md:text-4xl text-[#0a0a0f] tracking-[-0.04em] leading-tight mb-2 uppercase">
                Matrix <span className="text-[#0fd68c]">Telemetry.</span>
              </h1>
              <p className="text-[#0a0a0f]/40 text-xs md:text-sm font-bold font-dm max-w-lg mx-auto md:mx-0">
                 Real-time visualization of clinical throughput and anomaly distribution across the institutional lattice.
              </p>
            </div>

             <div className="flex items-center gap-3 w-full md:w-auto">
                <button className="flex-1 md:flex-none px-6 py-3 bg-white border border-[#e8ede9] rounded-xl text-[10px] md:text-xs font-black text-slate-500 hover:text-slate-900 hover:border-[#0fd68c]/30 transition-all uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer">
                   <Download size={15} /> Export
                </button>
                <button className="flex-1 md:flex-none px-6 py-3 bg-slate-950 text-teal-400 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest hover:bg-teal-600 hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer border-none shadow-premium">
                   <BarChart3 size={15} /> Report
                </button>
             </div>
          </motion.div>


        {/* Global Performance Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
           {displayStats.map((stat, i) => (
              <motion.div key={i} variants={item}>
                 <StatCard {...stat} />
              </motion.div>
           ))}
        </div>

        {/* Main Analytics Visuals */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10">
            <motion.div variants={item} className="lg:col-span-8">
               <ClinicalCard title="Clinical Volume Trajectory" subtitle="Live institutional telemetry stream for predictive workload balancing.">
                   <div className="h-[250px] sm:h-[300px] md:h-[400px] w-full mt-6 md:mt-10">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                      <BarChart data={metrics?.trajectory || [
                        { name: 'Mon', val: 20 }, { name: 'Tue', val: 35 }, { name: 'Wed', val: 60 },
                        { name: 'Thu', val: 40 }, { name: 'Fri', val: 75 }, { name: 'Sat', val: 30 },
                        { name: 'Sun', val: 15 }
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                        <Tooltip 
                          contentStyle={{ 
                            borderRadius: '24px', 
                            border: '1px solid #f1f5f9',
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(8px)',
                            boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)', 
                            padding: '16px 24px' 
                          }}
                          cursor={{fill: 'rgba(13, 148, 136, 0.05)'}}
                        />
                        <Bar 
                          dataKey="val" 
                          fill="#0d9488" 
                          radius={[8, 8, 0, 0]} 
                          barSize={isMobile ? 16 : 40} 
                          animationDuration={1500}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
               </ClinicalCard>
            </motion.div>
           
            <motion.div variants={item} className="lg:col-span-4">
               <ClinicalCard title="Pathology Distribution" subtitle="Risk stratification by clinical segment.">
                  <div className="flex-1 flex flex-col items-center justify-center pt-6 md:pt-8 text-center group">
                     <div className="h-44 sm:h-56 md:h-64 w-full relative">
                         <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                            <RePieChart>
                               <Pie
                                  data={metrics?.distribution || [
                                     { name: 'Cardiology', value: 45 },
                                     { name: 'Neurology', value: 32 },
                                     { name: 'Oncology', value: 23 },
                                  ]}
                                  innerRadius={isMobile ? 45 : 70}
                                  outerRadius={isMobile ? 65 : 95}
                                  paddingAngle={8}
                                  dataKey="value"
                                  stroke="none"
                               >
                                  {[
                                     { color: '#0d9488' },
                                     { color: '#6366f1' },
                                     { color: '#f59e0b' },
                                  ].map((entry, index) => (
                                     <Cell key={`cell-${index}`} fill={entry.color} />
                                  ))}
                               </Pie>
                               <Tooltip 
                                  contentStyle={{ 
                                    borderRadius: '20px', 
                                    border: '1px solid #f1f5f9',
                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                    backdropFilter: 'blur(8px)',
                                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' 
                                  }}
                               />
                            </RePieChart>
                         </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                           <span className="text-xl md:text-2xl font-black text-slate-900 font-display tracking-tight">Core</span>
                           <span className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol</span>
                        </div>
                     </div>
                     <div className="space-y-4 md:space-y-6 w-full mt-8 md:mt-10 text-left">
                        {(metrics?.distribution || [
                               { name: 'Cardiology', value: 45, color: 'teal' },
                               { name: 'Neurology', value: 32, color: 'indigo' },
                               { name: 'Oncology', value: 23, color: 'amber' },
                            ]).map((link, i) => (
                           <div key={i} className="flex flex-col gap-2">
                              <div className="flex justify-between items-center px-1">
                                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{link.name}</span>
                                 <span className="text-xs font-black text-slate-900">{link.value}%</span>
                              </div>
                              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                                 <motion.div 
                                    initial={{width:0}} 
                                    animate={{width:`${link.value}%`}} 
                                    className={`h-full bg-${link.color || (i === 0 ? 'teal' : i === 1 ? 'indigo' : 'amber')}-500 rounded-full`} 
                                 />
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               </ClinicalCard>
            </motion.div>
        </div>

        {/* Action Call for Customization */}
        <motion.div variants={item} className="bg-slate-950 rounded-[2rem] md:rounded-[3rem] p-8 md:p-16 text-white relative overflow-hidden shadow-2xl">
           <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-500 rounded-full blur-[150px]" />
           </div>
           
           <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10 md:gap-16 text-center md:text-left">
              <div className="space-y-4 md:space-y-6">
                 <div className="flex items-center justify-center md:justify-start gap-4 text-teal-400">
                    <Zap size={28} className="animate-pulse" />
                    <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em]">Matrix Intelligence</span>
                 </div>
                 <h2 className="text-2xl md:text-4xl lg:text-5xl font-black font-display leading-tight tracking-tight uppercase">Advanced Custom Metrics.</h2>
                 <p className="text-slate-400 text-sm md:text-lg font-bold max-w-xl leading-relaxed font-dm">
                    Deploy customized telemetry listeners to track specific pathological biomarkers or institutional efficiency goals in real-time.
                 </p>
              </div>
              <button className="w-full md:w-auto px-8 md:px-10 py-5 bg-white text-slate-950 rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest hover:bg-teal-500 hover:text-white transition-all shadow-glow flex items-center justify-center gap-4 group cursor-pointer border-none">
                 <TrendingUp size={22} className="text-teal-600 group-hover:text-white transition-transform group-hover:scale-110" />
                 <span>Configure Visuals</span>
              </button>
           </div>
        </motion.div>

        </motion.div>
      </div>
    </>
  );
}
