import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, TrendingUp, Activity, 
  Download, Globe, ShieldCheck, Zap, PieChart
} from 'lucide-react';
import { AruviAILayout } from '@/components/AruviAILayout';
import { ClinicalCard, ClinicalBadge } from '@/components/ClinicalComponents';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const AnalyticsPage = () => {
  return (
    <AruviAILayout activeTab="Analytics">
      <motion.div variants={container} initial="hidden" animate="show" className="max-w-[1400px] mx-auto space-y-12 pb-20">
        
        {/* Header */}
        <motion.div variants={item} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-border pb-8">
          <div className="space-y-4">
            <ClinicalBadge variant="primary">Aggregated Matrix Telemetry</ClinicalBadge>
            <h1 className="text-5xl font-bold tracking-tight text-foreground font-display leading-tight">System Analytics</h1>
            <p className="text-lg text-muted-foreground max-w-2xl font-medium">
              Real-time visualization of clinical throughput, anomaly distribution, and node performance.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button className="px-6 py-2.5 bg-secondary text-muted-foreground rounded-xl text-xs font-bold hover:bg-secondary/80 transition-all uppercase tracking-widest flex items-center gap-2 shadow-subtle">
              <Download size={16} /> JSON Export
            </button>
            <button className="px-6 py-2.5 gradient-brand text-primary-foreground rounded-xl text-xs font-bold hover:opacity-90 transition-all uppercase tracking-widest shadow-glow flex items-center gap-3">
              <BarChart3 size={16} /> Matrix Report
            </button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Throughput', value: '412', trend: '+12%', icon: Activity },
            { label: 'Anomalies', value: '08', trend: '-2%', icon: BarChart3 },
            { label: 'Node Uptime', value: '99.9%', trend: '+0.1%', icon: Globe },
            { label: 'Audit Success', value: '100%', trend: '0%', icon: ShieldCheck },
          ].map((stat, i) => (
            <ClinicalCard key={i} className="relative overflow-hidden group hover:border-primary/30 transition-all">
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-primary group-hover:rotate-6 transition-transform">
                    <stat.icon size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-lg text-[10px] font-bold ${stat.trend.startsWith('+') ? 'bg-emerald-50 text-clinical-success' : stat.trend.startsWith('-') ? 'bg-amber-50 text-clinical-warning' : 'bg-secondary text-muted-foreground'}`}>
                  {stat.trend}
                </div>
              </div>
            </ClinicalCard>
          ))}
        </motion.div>

        {/* Charts area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <motion.div variants={item} className="lg:col-span-8">
            <ClinicalCard title="Clinical Volume Trajectory" className="h-[450px] flex flex-col items-center justify-center relative group hover:border-primary/30 transition-all">
              <div className="absolute top-6 right-8">
                <ClinicalBadge variant="primary">Real-time Matrix</ClinicalBadge>
              </div>
              <BarChart3 className="text-border mb-6 group-hover:scale-110 transition-transform" size={120} />
              <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">Awaiting Matrix Feed Stream</p>
              <p className="text-muted-foreground/50 text-xs mt-2">Connect backend to visualize live data</p>
            </ClinicalCard>
          </motion.div>
          
          <motion.div variants={item} className="lg:col-span-4">
            <ClinicalCard title="Diagnostic Distribution" className="h-[450px] flex flex-col">
              <div className="flex-1 flex flex-col items-center justify-center p-4 text-center group">
                <PieChart className="text-border mb-8 group-hover:rotate-12 transition-transform" size={80} />
                <div className="space-y-6 w-full">
                  {[
                    { label: 'Cardiology', percent: 45, color: 'bg-primary' },
                    { label: 'Neurology', percent: 32, color: 'bg-clinical-blue' },
                    { label: 'Oncology', percent: 23, color: 'bg-clinical-warning' },
                  ].map((link, i) => (
                    <div key={i} className="flex flex-col gap-2">
                      <div className="flex justify-between items-center px-1">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{link.label}</span>
                        <span className="text-xs font-bold text-foreground">{link.percent}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden border border-border">
                        <motion.div initial={{width:0}} animate={{width:`${link.percent}%`}} transition={{duration:1, delay:0.5}} className={`h-full ${link.color} rounded-full`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ClinicalCard>
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div variants={item} className="bg-foreground rounded-3xl p-12 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-[120px]" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-primary">
                <Zap size={24} />
                <span className="text-xs font-bold uppercase tracking-[0.4em] text-primary-foreground/60">Matrix Intelligence</span>
              </div>
              <h2 className="text-4xl font-bold font-display leading-tight text-primary-foreground">Advanced Custom Metrics.</h2>
              <p className="text-primary-foreground/40 font-medium max-w-md leading-relaxed">
                Deploy customized telemetry listeners to track specific pathological biomarkers or institutional efficiency goals.
              </p>
            </div>
            <button className="px-8 py-3 bg-card text-foreground rounded-xl font-bold hover:bg-secondary transition-all shadow-xl flex items-center gap-3">
              <TrendingUp size={18} className="text-primary" />
              <span>Configure Visuals</span>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AruviAILayout>
  );
};

export default AnalyticsPage;
