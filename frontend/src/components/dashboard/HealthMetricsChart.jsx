import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  Legend
} from 'recharts';
import { Activity, Zap, Droplets, Heart, ArrowUpRight, ArrowDownRight, RefreshCw, Filter, ShieldAlert } from 'lucide-react';

const data = [
  { name: '00:00', bpm: 68, bp: 118, sugar: 92 },
  { name: '04:00', bpm: 65, bp: 115, sugar: 94 },
  { name: '08:00', bpm: 82, bp: 122, sugar: 98 },
  { name: '12:00', bpm: 75, bp: 120, sugar: 105 },
  { name: '16:00', bpm: 78, bp: 121, sugar: 97 },
  { name: '20:00', bpm: 72, bp: 117, sugar: 94 },
  { name: '23:59', bpm: 70, bp: 119, sugar: 91 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="backdrop-blur-2xl bg-white/90 border border-slate-200 p-5 rounded-3xl shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
           <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
           <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px]">Matrix Cluster {label}</p>
        </div>
        <div className="space-y-4">
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between gap-8 group">
              <div className="flex items-center gap-2">
                 <div className="w-4 h-4 rounded-md" style={{ backgroundColor: `${entry.color}22`, border: `1px solid ${entry.color}44` }} />
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-tight">{entry.name}</span>
              </div>
              <span className="text-sm font-black text-slate-900" style={{ color: entry.color }}>{entry.value} <span className="text-[8px] opacity-40 ml-0.5">{entry.name === 'Glucose' ? 'mg/dL' : entry.name === 'Heart Rate' ? 'BPM' : 'sys'}</span></span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export function HealthMetricsChart() {
  const [metric, setMetric] = useState('all');
  const [range, setRange] = useState('24h');

  const metrics = [
    { id: 'bpm', label: 'BPM', icon: <Heart size={14} />, color: '#ef4444' },
    { id: 'bp', label: 'SYS', icon: <Activity size={14} />, color: '#3b82f6' },
    { id: 'sugar', label: 'GLU', icon: <Droplets size={14} />, color: '#10b981' },
    { id: 'all', label: 'ALL', icon: <Filter size={14} />, color: '#64748b' }
  ];

  return (
    <div className="h-[500px] bg-white border border-[#E1EBF9] rounded-[2.5rem] flex flex-col relative overflow-hidden group shadow-sm p-8 lg:p-12">
      {/* Dynamic Background Glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-50/50 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-50/50 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="relative z-10 h-full flex flex-col">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
           <div>
              <div className="flex items-center gap-3 mb-2">
                 <div className="px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-[9px] font-black uppercase tracking-widest text-blue-600 shadow-sm">
                    Neural Surveillance
                 </div>
                 <span className="text-slate-200 font-bold">•</span>
                 <span className="text-slate-400 text-[9px] font-black uppercase tracking-widest">SysID: TMS-ALPHA-9</span>
              </div>
              <h2 className="text-3xl font-black text-[#000650] uppercase tracking-tighter leading-none">Biometric <span className="text-slate-300">Uplink</span></h2>
           </div>
           
           <div className="flex items-center gap-4">
              <div className="flex p-1 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm">
                 {metrics.map(m => (
                    <button 
                      key={m.id}
                      onClick={() => setMetric(m.id)}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer ${metric === m.id ? 'bg-white text-blue-600 shadow-md border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                       {m.icon}
                       <span className="hidden sm:inline">{m.label}</span>
                    </button>
                 ))}
              </div>
              
              <button className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-blue-500 hover:border-blue-200 transition-all cursor-pointer shadow-sm">
                 <RefreshCw size={18} />
              </button>
           </div>
        </div>

        {/* Chart Primary Display */}
        <div className="flex-1 w-full min-h-0 relative">
           {/* Chart Legend Overlay */}
           <div className="absolute top-0 right-0 z-10 hidden lg:flex flex-col gap-4">
               <LegendItem label="Stability" value="98.2%" icon={<Zap size={10} />} color="emerald" />
               <LegendItem label="Anomalies" value="Zero" icon={<ShieldAlert size={10} />} color="blue" />
           </div>

          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
            <AreaChart data={data} margin={{ top: 20, right: 30, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorBpm" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorBp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorSugar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="10 10" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 900 }} 
                dy={15}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 900 }} 
              />
              <Tooltip 
                content={<CustomTooltip />} 
                cursor={{ stroke: 'rgba(0,0,0,0.05)', strokeWidth: 2 }}
              />
              
              {(metric === 'all' || metric === 'bpm') && (
                <Area 
                  type="monotone" 
                  dataKey="bpm" 
                  name="Heart Rate"
                  stroke="#ef4444" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorBpm)" 
                  animationDuration={2500}
                />
              )}
              
              {(metric === 'all' || metric === 'bp') && (
                <Area 
                  type="monotone" 
                  dataKey="bp" 
                  name="Blood Pressure"
                  stroke="#3b82f6" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorBp)" 
                  animationDuration={2500}
                />
              )}

              {(metric === 'all' || metric === 'sugar') && (
                <Area 
                  type="monotone" 
                  dataKey="sugar" 
                  name="Glucose"
                  stroke="#10b981" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorSugar)" 
                  animationDuration={2500}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Stats Footer */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 py-6 border-t border-slate-100">
           <QuickSummary label="Heart Rate" value="72.4" unit="BPM" trend="down" color="red" />
           <QuickSummary label="Blood Pressure" value="119/78" unit="sys/dia" trend="stable" color="blue" />
           <QuickSummary label="Blood Glucose" value="94.2" unit="mg/dL" trend="up" color="emerald" />
           <QuickSummary label="Spo2 Saturation" value="98.5" unit="%" trend="stable" color="purple" />
        </div>
      </div>
    </div>
  );
}

function LegendItem({ label, value, icon, color }) {
   const colorMap = {
      emerald: "text-emerald-700 bg-emerald-50 border-emerald-100",
      blue: "text-blue-700 bg-blue-50 border-blue-100"
   };
   
   return (
      <div className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl border ${colorMap[color]} shadow-sm`}>
         {icon}
         <span className="text-[10px] font-black uppercase tracking-widest leading-none">{label}: <span className="text-[#000650] ml-1">{value}</span></span>
      </div>
   );
}

function QuickSummary({ label, value, unit, trend, color }) {
   const colorMap = {
      red: "text-red-500",
      blue: "text-blue-500",
      emerald: "text-emerald-500",
      purple: "text-purple-500"
   };

   return (
      <div className="group">
         <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1 group-hover:text-blue-600 transition-colors">{label}</p>
         <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#000650] tracking-tighter leading-none">{value}</span>
            <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">{unit}</span>
         </div>
         <div className="flex items-center gap-1.5 mt-2">
            {trend === 'up' ? <ArrowUpRight size={10} className="text-emerald-500" /> : trend === 'down' ? <ArrowDownRight size={10} className="text-red-500" /> : <RefreshCw size={10} className="text-blue-500" />}
            <span className={`text-[8px] font-black uppercase tracking-widest ${trend === 'up' ? 'text-emerald-500' : trend === 'down' ? 'text-red-500' : 'text-blue-500'}`}>{trend}</span>
         </div>
      </div>
   );
}
