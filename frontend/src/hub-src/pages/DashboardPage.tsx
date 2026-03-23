import React from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, Stethoscope, Users, Database, Clock,
  ShieldCheck, Briefcase, Plus, UserCheck, Search,
  Filter, ChevronRight, MessageSquare, XCircle, ExternalLink, MoreHorizontal
} from 'lucide-react';
import { AruviAILayout } from '@/components/AruviAILayout';
import { StatCard, ClinicalBadge } from '@/components/ClinicalComponents';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

// Mock data
const mockConsultations = [
  { id: '1', patient_id: 'AR993X', patient_name: 'Priya Sharma', type: 'Cardiac Assessment', date: '2026-03-10', status: 'pending' as const },
  { id: '2', patient_id: 'BK412M', patient_name: 'Raj Patel', type: 'Diabetes Screening', date: '2026-03-09', status: 'accepted' as const },
  { id: '3', patient_id: 'CL781Y', patient_name: 'Anita Kumar', type: 'Liver Function', date: '2026-03-08', status: 'completed' as const },
  { id: '4', patient_id: 'DM290K', patient_name: 'Vikram Singh', type: 'Stroke Risk', date: '2026-03-07', status: 'completed' as const },
];

const statusStyles: Record<string, string> = {
  pending: 'bg-amber-50 text-clinical-warning border-amber-200',
  accepted: 'bg-teal-50 text-primary border-teal-200',
  completed: 'bg-emerald-50 text-clinical-success border-emerald-200',
  cancelled: 'bg-red-50 text-clinical-error border-red-200',
};

const DashboardPage = () => {
  return (
    <AruviAILayout activeTab="Dashboard">
      <motion.div variants={container} initial="hidden" animate="show" className="max-w-[1400px] mx-auto space-y-12 pb-20">
        
        {/* Header */}
        <motion.div variants={item} className="space-y-4">
          <ClinicalBadge variant="primary">Terminal Protocol v4.0.2 • Active Stream</ClinicalBadge>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground font-display leading-tight">
            System ready,<br />
            <span className="text-primary italic font-light">Dr. Wright.</span>
          </h1>
          <div className="flex flex-wrap items-center gap-4 mt-4">
            <div className="flex items-center gap-3 px-5 py-2 rounded-2xl bg-card border border-border shadow-subtle">
              <ShieldCheck size={18} className="text-primary" />
              <span className="text-sm font-bold text-muted-foreground">Cardiology</span>
            </div>
            <div className="flex items-center gap-3 px-5 py-2 rounded-2xl bg-card border border-border shadow-subtle">
              <Briefcase size={18} className="text-muted-foreground" />
              <span className="text-sm font-bold text-muted-foreground italic">Chennai Medical Center</span>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard icon={<Stethoscope size={24} />} label="Total Encounters" value="1,247" trend="+12%" />
          <StatCard icon={<Clock size={24} />} label="Pending Diagnostics" value="3" trend="+1" alert />
          <StatCard icon={<Users size={24} />} label="Active Patients" value="89" trend="+5%" />
          <StatCard icon={<Database size={24} />} label="System Status" value="NOMINAL" />
        </motion.div>

        {/* Clinical Ledger */}
        <motion.div variants={item} className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-primary">
                <Activity size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-bold font-display text-foreground tracking-tight">Clinical Inbound Ledger</h3>
                <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mt-1 italic">Real-time Diagnostic Streams</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-grow">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <input className="bg-card border border-border rounded-xl py-2.5 pl-12 pr-6 text-sm font-medium text-foreground placeholder:text-muted-foreground/50 focus:border-primary outline-none transition-all shadow-subtle w-full md:w-72" placeholder="Search patients..." />
              </div>
              <button className="p-2.5 bg-card border border-border rounded-xl text-muted-foreground hover:text-primary transition-all">
                <Filter size={20} />
              </button>
            </div>
          </div>

          <div className="bg-card rounded-3xl border border-border shadow-subtle overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-secondary/50 text-muted-foreground border-b border-border">
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em]">Patient</th>
                    <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em]">Protocol</th>
                    <th className="px-8 py-5 text-center text-[10px] font-bold uppercase tracking-[0.2em]">Date</th>
                    <th className="px-8 py-5 text-center text-[10px] font-bold uppercase tracking-[0.2em]">Status</th>
                    <th className="px-8 py-5 text-right text-[10px] font-bold uppercase tracking-[0.2em]">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {mockConsultations.map((req) => (
                    <tr key={req.id} className="hover:bg-secondary/30 transition-all group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-11 h-11 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-foreground font-bold text-sm group-hover:border-primary transition-colors">
                            {req.patient_id.substring(0, 2)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{req.patient_name}</p>
                            <p className="text-[10px] font-mono font-bold text-muted-foreground/50 uppercase">ID: {req.patient_id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-sm font-semibold text-muted-foreground">{req.type}</span>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <p className="text-sm font-bold text-foreground">{req.date}</p>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span className={`inline-flex items-center justify-center px-4 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border ${statusStyles[req.status]}`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {req.status === 'pending' ? (
                            <>
                              <button className="px-4 py-2 rounded-xl gradient-brand text-primary-foreground text-[10px] font-bold uppercase tracking-wider shadow-glow hover:opacity-90 transition-all">Authorize</button>
                              <button className="p-2 rounded-xl border border-border text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all"><XCircle size={16}/></button>
                            </>
                          ) : req.status === 'accepted' ? (
                            <button className="flex items-center gap-2 px-4 py-2 rounded-xl gradient-brand text-primary-foreground text-[10px] font-bold uppercase tracking-wider shadow-glow">
                              <MessageSquare size={14} /> Start Session
                            </button>
                          ) : (
                            <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest flex items-center gap-1">Finalized <ExternalLink size={12}/></span>
                          )}
                          <button className="p-2 text-muted-foreground hover:text-foreground rounded-xl hover:bg-secondary transition-all"><MoreHorizontal size={18}/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AruviAILayout>
  );
};

export default DashboardPage;
