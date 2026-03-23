import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Shield, Bell, Database, Globe, 
  Key, Mail, Trash2, Save, ArrowRight,
  ShieldCheck, Smartphone, Eye, EyeOff, ShieldAlert
} from 'lucide-react';
import { AruviAILayout } from '../components/ui/AruviAILayout';
import { Card, Badge } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { useToast } from '../components/ui/Toast';
import { useBreakpoint } from '../hooks/useBreakpoint';

export default function Settings() {
  const [showPassword, setShowPassword] = useState(false);
  const [isDecommissionModalOpen, setIsDecommissionModalOpen] = useState(false);
  const { addToast } = useToast();
  const { isMobile, isTablet } = useBreakpoint();

  const handleSave = () => {
    addToast("Configuration synchronized successfully across institutional lattice.", "success");
  };

  const handleDecommission = () => {
    addToast("Node successfully decommissioned. All local data purged.", "error");
    setIsDecommissionModalOpen(false);
  };

  return (
    <AruviAILayout activeTab="Settings">
      <div className={`w-full max-w-5xl mx-auto ${isMobile ? 'px-4' : 'px-8'}`}>
        <div className="space-y-10 md:space-y-12 pb-20 pt-6 md:pt-10">
          
          {/* Header */}
          <div className="mb-8 md:mb-10 text-center lg:text-left">
             <p className="text-[11px] md:text-[0.65rem] uppercase tracking-[0.15em] text-[#0fd68c] font-black mb-2 font-[Syne]">
               NODE CONFIGURATION
             </p>
             <h1 className="font-[Syne] font-black text-2xl md:text-4xl text-[#0a0a0f] tracking-[-0.04em] leading-tight mb-3">
               System <span className="text-[#0fd68c]">Settings.</span>
             </h1>
             <p className="text-[#0a0a0f]/45 text-sm md:text-base font-[DM_Sans] max-w-lg leading-relaxed lg:mx-0 mx-auto">
                Manage your institutional identity, security protocols, and operational preferences across the lattice.
             </p>
          </div>


        {/* Profile Section */}
        <section className="space-y-6">
           <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
              <User size={20} className="text-teal-600" />
              <h2 className="text-lg md:text-xl font-black text-slate-900 font-display">Identity & Organization</h2>
           </div>
           
           <Card className="border-slate-200 shadow-sm overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-1 md:p-2">
                 <div className="space-y-6">
                    <Input label="Protocol Operator Name" defaultValue="Dr. Alexander Wright" />
                    <Input label="Institutional Email" defaultValue="administrator@svce.ac.in" disabled />
                    <Input label="Bio-Signature Signature" placeholder="Lead Clinical Investigator" />
                 </div>
                 <div className="flex flex-col items-center justify-center p-6 md:p-8 bg-slate-50 rounded-3xl border border-slate-200 border-dashed">
                    <div className="w-20 md:w-24 h-20 md:h-24 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 text-2xl md:text-3xl font-black border-4 border-white shadow-xl mb-4">
                       AW
                    </div>
                    <button className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-subtle cursor-pointer transition-all">Update Avatar</button>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.15em] mt-4 text-center px-4 leading-relaxed">
                       Institutional ID: NODE_ADM_7721-X
                    </p>
                 </div>
              </div>
           </Card>
        </section>

        {/* Security Section */}
        <section className="space-y-6">
           <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
              <Shield size={20} className="text-teal-600" />
              <h2 className="text-lg md:text-xl font-black text-slate-900 font-display">Security Lattice</h2>
           </div>

           <div className="grid grid-cols-1 gap-6">
              <Card title="Authentication Protocol" subtitle="Manage your master passphrase and 2FA settings." className="border-slate-200 shadow-sm">
                 <div className="space-y-8 mt-4">
                    <div className="flex flex-col gap-6">
                       <div className="relative">
                          <Input 
                            label="Current Passphrase" 
                            type={showPassword ? "text" : "password"} 
                            defaultValue="••••••••••••" 
                          />
                          <button 
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-10 text-slate-400 hover:text-slate-900 cursor-pointer border-none bg-transparent"
                          >
                             {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                       </div>
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <Input label="New Passphrase" type="password" placeholder="Min. 12 characters" />
                          <Input label="Confirm Passphrase" type="password" placeholder="Repeat passphrase" />
                       </div>
                    </div>

                    <div className="pt-8 border-t border-slate-100">
                       <div className="flex flex-col sm:flex-row items-center justify-between p-5 md:p-6 bg-teal-50 rounded-2xl border border-teal-100 gap-4">
                          <div className="flex items-center gap-4 text-center sm:text-left">
                             <div className="w-12 h-12 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-lg shadow-teal-500/20 shrink-0 mx-auto sm:mx-0">
                                <Smartphone size={24} />
                             </div>
                             <div>
                                <p className="text-sm font-black text-slate-900 underline decoration-teal-300 underline-offset-4">Two-Factor Authentication</p>
                                <p className="text-xs text-slate-500 font-bold mt-1">Institutional security bypass active.</p>
                             </div>
                          </div>
                          <Badge variant="primary" className="font-black text-[9px] uppercase tracking-widest px-3">Configured</Badge>
                       </div>
                    </div>
                 </div>
              </Card>
           </div>
        </section>

        {/* Preferences */}
        <section className="space-y-6">
           <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
              <Bell size={20} className="text-teal-600" />
              <h2 className="text-lg md:text-xl font-black text-slate-900 font-display">Operational Telemetry</h2>
           </div>

           <Card className="border-slate-200 shadow-sm">
              <div className="space-y-6">
                 {[
                    { label: "Critical Insight Alerts", desc: "Immediate notification on significant diagnostic anomalies.", active: true },
                    { label: "Node State Digest", desc: "Weekly summary of cluster throughput and efficiency.", active: true },
                    { label: "Compliance Heartbeat", desc: "Real-time updates on E2EE state transitions.", active: false },
                 ].map((p, i) => (
                    <div key={i} className="flex items-center justify-between py-2 gap-4">
                       <div className="min-w-0">
                          <p className="text-sm font-black text-slate-900 truncate">{p.label}</p>
                          <p className="text-xs text-slate-500 font-bold mt-1 line-clamp-1">{p.desc}</p>
                       </div>
                       <button 
                         onClick={() => {}} 
                         className={`w-12 h-6 rounded-full transition-all relative shrink-0 cursor-pointer border-none ${p.active ? 'bg-teal-600' : 'bg-slate-200'}`}
                       >
                          <motion.div 
                             animate={{ x: p.active ? 26 : 4 }}
                             className="w-4 h-4 bg-white rounded-full absolute top-1 shadow-sm"
                          />
                       </button>
                    </div>
                 ))}
              </div>
           </Card>
        </section>

        {/* Danger Zone */}
        <section className="space-y-6">
           <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
              <Trash2 size={20} className="text-red-600" />
              <h2 className="text-lg md:text-xl font-black text-red-600 font-display uppercase tracking-widest">Danger Zone</h2>
           </div>
           
           <Card className="border-red-100 bg-red-50/20">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-6 text-center lg:text-left">
                 <div>
                    <p className="text-sm font-black text-slate-900">Decommission Institutional Node</p>
                    <p className="text-xs text-red-600 font-bold mt-1">Permanently erase all diagnostic telemetry and local lattices. This action is irreversible.</p>
                 </div>
                 <button 
                   onClick={() => setIsDecommissionModalOpen(true)}
                   className="w-full lg:w-auto px-6 py-3 bg-red-600 text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-red-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-500/20 cursor-pointer border-none"
                 >
                    <Trash2 size={16} />
                    <span>Decommission Node</span>
                 </button>
              </div>
           </Card>
        </section>

        {/* Footer Actions */}
        <div className="pt-10 flex flex-col sm:flex-row items-center justify-end gap-4 border-t border-slate-100">
           <button className="w-full sm:w-auto px-6 py-3 text-slate-400 font-black hover:text-slate-600 transition-all text-[10px] uppercase tracking-[0.2em] border-none bg-transparent cursor-pointer">Revert Changes</button>
           <button 
             onClick={handleSave}
             className="w-full sm:w-auto px-8 py-4 bg-teal-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-teal-700 hover:shadow-xl hover:shadow-teal-500/20 transition-all shadow-lg flex items-center justify-center gap-2 border-none cursor-pointer"
           >
              <Save size={18} />
              <span>Synchronize All Settings</span>
           </button>
        </div>

        <Modal 
           isOpen={isDecommissionModalOpen} 
           onClose={() => setIsDecommissionModalOpen(false)}
           title="Decommission Node"
           subtitle="Critical Institutional Operation Required"
           size="md"
           footer={
             <div className="flex flex-col sm:flex-row gap-3 w-full">
                <button 
                  onClick={() => setIsDecommissionModalOpen(false)}
                  className="w-full sm:w-auto px-6 py-3 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all cursor-pointer border-none"
                >
                  Cancel Operation
                </button>
                <button 
                  onClick={handleDecommission}
                  className="w-full sm:w-auto px-6 py-3 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all cursor-pointer border-none"
                >
                  Confirm Decommission
                </button>
             </div>
           }
        >
           <div className="space-y-4">
              <div className="p-4 bg-red-50 rounded-2xl border border-red-100 flex gap-4">
                 <ShieldAlert className="text-red-600 shrink-0" size={24} />
                 <p className="text-sm font-black text-red-900 leading-tight">
                    This will permanently disconnect node NODE_ADM_7721-X from the global lattice. All local diagnostics will be erased.
                 </p>
              </div>
              <p className="text-slate-500 text-sm font-bold leading-relaxed">
                 Are you absolutely sure you wish to proceed with this destructive action? Institutional clearance is recommended.
              </p>
           </div>
        </Modal>

      </div>
      </div>
    </AruviAILayout>
  );
}
