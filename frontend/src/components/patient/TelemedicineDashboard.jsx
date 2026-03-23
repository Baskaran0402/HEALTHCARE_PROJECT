import React from 'react';
import { WelcomeBanner } from '../dashboard/WelcomeBanner';
import { HealthScoreDashboard } from '../dashboard/HealthScoreDashboard';
import { UpcomingAppointments } from '../dashboard/UpcomingAppointments';
import { HealthMetricsChart } from '../dashboard/HealthMetricsChart';
import { MedicationTracker } from '../dashboard/MedicationTracker';
import { QuickStats, ActivityFeed } from '../dashboard/ActivityLog';
import { motion } from 'framer-motion';
import { AlertTriangle, Zap, ChevronRight, Activity, Globe, Info, ClipboardCheck } from 'lucide-react';

const TelemedicineDashboard = ({ user }) => {
  return (
    <div className="font-inter">
      {/* Platform Header Context */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <div className="header-badge mb-6">Subject Telemetry • Active Connection</div>
        <WelcomeBanner user={user} />
      </motion.div>

      {/* Main Orchestration Matrix */}
      <div className="grid grid-cols-12 gap-8 lg:gap-12">
        {/* Real-time Telemetry Bar */}
        <div className="col-span-12">
           <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-6">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-xl bg-[#F0F6FE] border border-[#E1EBF9] flex items-center justify-center text-[#000DB5]">
                    <Activity size={24} />
                 </div>
                 <div>
                    <h3 className="text-xl font-bold font-outfit text-[#000650] tracking-tight">Current Biometric State</h3>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-[#718096] mt-1 italic">Real-time Stream Propagation</p>
                 </div>
              </div>
              <div className="flex items-center gap-4">
                 <div className="px-5 py-2 rounded-xl bg-[#F0FFF4] border border-[#C6F6D5] text-[#38A169] text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#38A169] animate-pulse" />
                    Uplink Active
                 </div>
                 <button className="btn-pill btn-pill-secondary py-2.5 px-6 text-[10px] flex items-center gap-2">
                    Configure Sensors <Info size={14} />
                 </button>
              </div>
           </div>
           <QuickStats />
        </div>

        {/* Primary Analytical Data Context */}
        <div className="col-span-12 lg:col-span-8 space-y-12">
          <div className="space-y-6">
             <div className="flex items-center gap-3 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#718096]">A.I. Diagnostic Context</span>
                <span className="flex-1 h-px bg-[#E1EBF9]" />
             </div>
             <div className="bg-white rounded-[2.5rem] border border-[#E1EBF9] shadow-sm p-4">
               <HealthScoreDashboard />
             </div>
          </div>
          
          <div className="space-y-6">
             <div className="flex items-center gap-3 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#718096]">Longitudinal Biometrics</span>
                <span className="flex-1 h-px bg-[#E1EBF9]" />
             </div>
             <div className="bg-white rounded-[2.5rem] border border-[#E1EBF9] shadow-sm p-8">
               <HealthMetricsChart />
             </div>
          </div>
        </div>

        {/* Side Protocol Panel */}
        <div className="col-span-12 lg:col-span-4 space-y-12">
          <div className="space-y-6">
             <div className="flex items-center gap-3 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#718096]">Temporal Schedule</span>
                <span className="flex-1 h-px bg-[#E1EBF9]" />
             </div>
             <div className="bg-white rounded-[2.5rem] border border-[#E1EBF9] shadow-sm p-2">
               <UpcomingAppointments />
             </div>
          </div>

          <div className="space-y-6">
             <div className="flex items-center gap-3 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#718096]">Activity Ledger</span>
                <span className="flex-1 h-px bg-[#E1EBF9]" />
             </div>
             <div className="bg-white rounded-[2.5rem] border border-[#E1EBF9] shadow-sm">
               <ActivityFeed />
             </div>
          </div>
        </div>

        {/* Medication Protocol Context */}
        <div className="col-span-12 mt-8">
          <div className="flex items-center gap-3 mb-8">
             <span className="text-[11px] font-bold uppercase tracking-widest text-[#718096]">Pharmacological Protocol Entry</span>
             <span className="flex-1 h-px bg-[#E1EBF9]" />
          </div>
          <div className="bg-white rounded-[2.5rem] border border-[#E1EBF9] shadow-sm p-8">
             <MedicationTracker />
          </div>
        </div>
      </div>

      {/* Emergency Distress Logic */}
      <div className="fixed bottom-12 right-12 z-[100] group">
         <motion.button
           whileHover={{ scale: 1.1 }}
           whileTap={{ scale: 0.9 }}
           className="w-16 h-16 rounded-full bg-[#E53E3E] text-white shadow-[0_0_30px_rgba(229,62,62,0.3)] border-4 border-white flex items-center justify-center relative group"
         >
            <AlertTriangle size={24} />
         </motion.button>
         
         <div className="absolute bottom-full right-0 mb-6 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0 pointer-events-none">
            <div className="bg-[#000650] px-6 py-3 rounded-2xl border border-white/10 text-white font-bold uppercase tracking-widest text-[10px] shadow-2xl flex items-center gap-3 whitespace-nowrap">
               <Zap size={14} className="text-[#E53E3E] animate-pulse" />
               Trigger Emergency SOS
            </div>
         </div>
      </div>
    </div>
  );
};

export default TelemedicineDashboard;
