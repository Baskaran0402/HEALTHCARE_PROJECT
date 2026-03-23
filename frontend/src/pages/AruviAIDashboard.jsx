import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import dashboardService from '../services/dashboardService';
import {
  Users, Activity, Search, Filter, Upload, Brain,
  ShieldCheck, Zap, Heart, MoreHorizontal, FileImage
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from 'recharts';
import { AruviAILayout } from '../components/ui/AruviAILayout';
import { useBreakpoint } from '../hooks/useBreakpoint';

export default function AruviAIDashboard() {
  const [range, setRange] = useState('7D');
  const [mriFile, setMriFile] = useState(null);
  const { isMobile, isTablet } = useBreakpoint();

  const { data: throughput = [] } = useQuery({
    queryKey: ['throughput', range],
    queryFn: () => dashboardService.getNeuralThroughput(range),
  });

  const areaData = throughput.length > 0 ? throughput : [
    { name: '00:00', val: 4000 }, { name: '04:00', val: 3000 }, { name: '08:00', val: 6000 },
    { name: '12:00', val: 5500 }, { name: '16:00', val: 8000 }, { name: '20:00', val: 7000 },
    { name: '23:59', val: 9000 }
  ];

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.09 } } };
  const item = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

  const inputStyle = {
    fontFamily: "'DM Sans', sans-serif",
    border: '1.5px solid #e0e8e4',
    borderRadius: '10px',
    padding: isMobile ? '12px 14px' : '14px 16px',
    fontSize: '0.875rem',
    outline: 'none',
    width: '100%',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  };

  return (
    <AruviAILayout activeTab="Dashboard">
      <div className={`w-full max-w-7xl mx-auto ${isMobile ? 'px-4' : 'px-8'}`}>
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-8 md:space-y-10 pb-20 pt-6 md:pt-10">
 
          {/* Page Header */}
          <motion.div variants={item} className="mb-6 md:mb-10 text-center lg:text-left">
            <p className="text-[11px] md:text-[0.65rem] uppercase tracking-[0.15em] text-[#0fd68c] font-black mb-2 font-[Syne]">
              SYSTEM OVERVIEW
            </p>
            <h1 className="font-[Syne] font-black text-2xl md:text-4xl text-[#0a0a0f] tracking-[-0.04em] leading-tight">
              Clinical <span className="text-[#0fd68c]">Intelligence Center.</span>
            </h1>
            <p className="text-[#0a0a0f]/40 text-sm mt-2 font-[DM_Sans] max-w-2xl mx-auto lg:mx-0">
              Monitoring live diagnostic telemetry and institutional throughput.
            </p>
          </motion.div>


        {/* Stat Cards */}
        <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[
            { icon: Heart, label: 'Total Encounters', value: '1,247', trend: '+12.5%' },
            { icon: Zap, label: 'Pending Diagnostics', value: '03', trend: 'Action Required', alert: true },
            { icon: Users, label: 'Active Patients', value: '89', trend: '+5.2%' },
            { icon: Activity, label: 'System Status', value: 'Stable', trend: 'Nominal' },
          ].map((stat, i) => (
            <div key={stat.label} className="rounded-2xl p-6 bg-white transition-all duration-300 group border border-slate-100 hover:shadow-premium"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 bg-slate-50">
                <stat.icon size={20} className="text-[#0fd68c]" />
              </div>
              <p className="text-[10px] uppercase tracking-widest mb-2 font-[DM_Sans] font-black text-slate-400">
                {stat.label}
              </p>
              <div className="flex items-end gap-2">
                <span className="font-[Syne] font-black text-2xl md:text-[1.75rem] text-slate-900 leading-none">
                  {stat.value}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-md mb-1 font-black font-[DM_Sans] ${
                    stat.alert ? 'bg-red-50 text-red-500' : 'bg-teal-50 text-teal-600'
                  }`}>
                  {stat.trend}
                </span>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Throughput Chart */}
        <motion.div variants={item}>
          <div className="rounded-2xl p-6 md:p-8 bg-white border border-slate-100 shadow-subtle">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              <div>
                <h3 className="font-[Syne] font-black text-lg md:text-xl text-slate-900">
                  Throughput Velocity
                </h3>
                <p className="text-xs mt-1 font-[DM_Sans] font-medium text-slate-400">
                  Live inference throughput
                </p>
              </div>
              <div className="flex gap-1 bg-slate-50 p-1 rounded-xl w-full sm:w-auto overflow-hidden">
                {['24H', '7D', '30D'].map(r => (
                  <button key={r} onClick={() => setRange(r)}
                    className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-[10px] md:text-xs font-black transition-all cursor-pointer border-none ${
                        range === r ? 'bg-slate-900 text-[#0fd68c] shadow-subtle' : 'text-slate-400 hover:text-slate-600'
                      }`}>
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-[250px] md:h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                    <AreaChart data={areaData}>
                      <defs>
                        <linearGradient id="tealGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0fd68c" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#0fd68c" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false}
                        tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }} 
                        dy={10} 
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false}
                        tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }} 
                      />
                      <Tooltip 
                        contentStyle={{
                          borderRadius: '16px', 
                          border: '1px solid #f1f5f9',
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          backdropFilter: 'blur(8px)',
                          boxShadow: '0 12px 32px rgba(0,0,0,0.08)', 
                          padding: '12px 16px',
                          fontFamily: "'DM Sans', sans-serif", 
                          fontSize: '12px',
                          fontWeight: 700
                        }} 
                      />
                      <Area type="monotone" dataKey="val" stroke="#0fd68c" strokeWidth={3}
                        fillOpacity={1} fill="url(#tealGrad)" animationDuration={2000} />
                    </AreaChart>
                  </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        {/* Patient Form + MRI Upload + Result Panel */}
        <motion.div variants={item}>
          <h2 className="mb-6 font-[Syne] font-black text-xl md:text-2xl text-slate-900 tracking-tight text-center lg:text-left">
            New Assessment Protocol
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_320px] gap-6">
            {/* Form Inputs */}
            <div className="rounded-2xl p-6 md:p-8 bg-white space-y-4 border border-slate-100 shadow-subtle">
              <h3 className="text-sm md:text-base font-[Syne] font-black text-slate-900 mb-6">
                Clinical Parameters
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {['Patient Name', 'Age', 'Blood Pressure', 'Cholesterol', 'Glucose (mg/dL)', 'BMI'].map(field => (
                  <div key={field}>
                    <label className="block text-[10px] uppercase font-black tracking-widest mb-2 text-slate-400">
                      {field}
                    </label>
                    <input type="text" placeholder={field}
                      style={inputStyle}
                      className="focus:border-[#0fd68c] focus:ring-4 focus:ring-[#0fd68c]/10"
                    />
                  </div>
                ))}
              </div>
              <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
                className="w-full py-4 rounded-xl text-xs font-black uppercase tracking-widest mt-6 cursor-pointer border-none shadow-glow"
                style={{ background: '#0fd68c', color: '#0a0a0f' }}>
                Run Full Diagnostic
              </motion.button>
            </div>

            {/* MRI Upload */}
            <div className="rounded-2xl p-6 md:p-8 bg-white border border-slate-100 shadow-subtle">
              <h3 className="text-sm md:text-base font-[Syne] font-black text-slate-900 mb-6">
                Imaging Analysis
              </h3>
              <label
                className="flex flex-col items-center justify-center cursor-pointer p-8 md:p-12 rounded-2xl text-center transition-all bg-slate-50/50 border-2 border-dashed border-slate-200 hover:border-[#0fd68c] hover:bg-[#0fd68c]/5"
              >
                <input type="file" accept="image/*" className="hidden"
                  onChange={e => setMriFile(e.target.files[0])} />
                <div className="w-16 h-16 rounded-2xl bg-white shadow-subtle flex items-center justify-center mb-6 text-[#0fd68c]">
                  <Upload size={32} />
                </div>
                <p className="text-sm font-black text-slate-900" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {mriFile ? mriFile.name : 'Drop MRI Scan Here'}
                </p>
                <p className="text-[10px] uppercase font-bold mt-2 text-slate-400 tracking-widest">
                  DICOM, PNG, or JPEG Supported
                </p>
              </label>
              {mriFile && (
                <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
                  className="w-full py-4 rounded-xl text-xs font-black uppercase tracking-widest mt-6 cursor-pointer border-none shadow-premium transition-all"
                  style={{ background: '#0a0a0f', color: '#0fd68c' }}>
                  Analyze Neural Scan
                </motion.button>
              )}
            </div>

            {/* Result Panel */}
            <div className="rounded-2xl p-8 bg-slate-50/30 flex flex-col items-center justify-center min-h-[300px] border border-slate-100 border-dashed">
              <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-6 text-slate-300">
                <FileImage size={40} />
              </div>
              <p className="text-sm font-bold text-slate-400 text-center leading-relaxed max-w-[200px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Results will appear here after neural analysis
              </p>
              <div className="mt-6 px-4 py-1.5 bg-slate-100 rounded-full">
                <p className="text-[9px] uppercase font-black tracking-[0.2em] text-slate-400">No Active Session</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Recent Patients Table */}
        <motion.div variants={item}>
          <div className="rounded-2xl bg-white overflow-hidden border border-slate-100 shadow-subtle">
            <div className="px-6 md:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-6"
              style={{ borderBottom: '1px solid #f1f5f9' }}>
              <div className="text-center sm:text-left">
                <h3 className="font-[Syne] font-black text-lg md:text-xl text-slate-900">
                  Recent Encounters
                </h3>
                <p className="text-xs mt-1 font-[DM_Sans] font-medium text-slate-400">
                  Real-time diagnostic telemetry cluster
                </p>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-none">
                  <input type="text" placeholder="Search records..."
                    className="w-full sm:w-60 h-10 pl-10 pr-4 text-xs font-black rounded-xl outline-none bg-slate-50 transition-all border border-slate-200 focus:border-[#0fd68c] focus:ring-4 focus:ring-[#0fd68c]/5"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  />
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" />
                </div>
                <button className="w-10 h-10 rounded-xl flex items-center justify-center bg-white border border-slate-200 text-slate-400 hover:text-[#0fd68c] hover:border-[#0fd68c] transition-all cursor-pointer">
                  <Filter size={18} />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    {['Patient', 'Protocol', 'Date', 'Status', ''].map(h => (
                      <th key={h} className={`px-6 md:px-8 py-5 text-[9px] md:text-[10px] uppercase font-black tracking-widest text-slate-400 ${h === '' ? 'text-right' : 'text-left'}`}
                        style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {[
                    { name: 'Priya Sharma', id: 'AR993X', protocol: 'Cardiac Assessment', date: '2026-03-10', status: 'PENDING' },
                    { name: 'Raj Patel', id: 'BK412M', protocol: 'Diabetes Screening', date: '2026-03-09', status: 'ACTIVE' },
                    { name: 'Anita Kumar', id: 'CL781Y', protocol: 'Liver Function', date: '2026-03-08', status: 'FINALIZED' },
                    { name: 'Vikram Singh', id: 'DM298K', protocol: 'Stroke Risk', date: '2026-03-07', status: 'FINALIZED' },
                  ].map((row, i) => (
                    <tr key={i} className="transition-all hover:bg-slate-50/80 cursor-pointer">
                      <td className="px-6 md:px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[10px] bg-slate-900 text-[#0fd68c] font-black font-[Syne] shadow-constrained">
                            {row.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-black text-slate-900 truncate" style={{ fontFamily: "'DM Sans', sans-serif" }}>{row.name}</p>
                            <p className="text-[10px] font-black text-slate-300 tracking-widest truncate" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                              {row.id}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 md:px-8 py-5">
                        <span className="text-xs font-bold text-slate-500 whitespace-nowrap" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                          {row.protocol}
                        </span>
                      </td>
                      <td className="px-6 md:px-8 py-5">
                        <span className="text-xs font-black text-slate-900 whitespace-nowrap" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                          {row.date}
                        </span>
                      </td>
                      <td className="px-6 md:px-8 py-5">
                        <span className={`text-[9px] px-2.5 py-1 rounded-lg font-black uppercase tracking-widest whitespace-nowrap ${
                            row.status === 'PENDING' ? 'bg-amber-50 text-amber-500' : 
                            row.status === 'ACTIVE' ? 'bg-teal-50 text-teal-600' : 
                            'bg-slate-50 text-slate-400'
                          }`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="px-6 md:px-8 py-5 text-right">
                        {row.status === 'PENDING' ? (
                          <button className="px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest bg-[#0fd68c] text-[#0a0a0f] shadow-glow hover:shadow-premium transition-all cursor-pointer border-none">
                            Authorize
                          </button>
                        ) : (
                          <button className="p-2 text-slate-300 hover:text-teal-600 transition-all cursor-pointer bg-transparent border-none">
                            <MoreHorizontal size={18} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-6 bg-slate-50/50 border-t border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Aggregated <span className="text-slate-900">4</span> of 582 institutional entries
              </p>
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 text-[10px] font-black uppercase rounded-xl border border-slate-200 text-slate-300 hover:bg-white transition-all cursor-pointer" style={{ border: '1px solid #e2e8f0' }}>
                  Prev
                </button>
                <button className="px-4 py-2 text-[10px] font-black uppercase rounded-xl bg-white border border-slate-200 text-slate-900 shadow-subtle hover:border-[#0fd68c] transition-all cursor-pointer" style={{ border: '1px solid #e2e8f0' }}>
                  Next
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
      </div>
    </AruviAILayout>
  );
}
