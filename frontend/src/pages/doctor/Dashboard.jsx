import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import consultationService from '../../services/consultationService';
import doctorService from '../../services/doctorService';
import useAuthStore from '../../store/authStore';
import { 
  User, 
  Users,
  Calendar, 
  MessageSquare, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Activity, 
  ShieldCheck, 
  ChevronRight,
  Plus,
  Filter,
  Stethoscope,
  Database,
  Briefcase,
  Zap,
  MoreHorizontal,
  Mail,
  UserCheck,
  Search,
  Bell,
  RefreshCw,
  ExternalLink,
  ChevronDown,
  Dna,
  Microscope
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBreakpoint } from '../../hooks/useBreakpoint';

import { AruviAILayout } from '../../components/ui/AruviAILayout';

const DoctorDashboard = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const { isMobile } = useBreakpoint();

  // Fetch Doctor Profile
  const { data: doctor, isLoading: isDoctorLoading } = useQuery({
    queryKey: ['doctor', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const drResp = await doctorService.searchDoctors({ user_id: user.id });
      return drResp.length > 0 ? drResp[0] : null;
    },
    enabled: !!user?.id,
  });

  // Fetch Consultations
  const { data: consultations = [], isLoading: isConsultationsLoading } = useQuery({
    queryKey: ['doctorConsultations', doctor?.id],
    queryFn: () => consultationService.listConsultations(), // Ideally we'd have a listDoctorConsultations(doctor.id)
    enabled: !!doctor?.id,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => consultationService.updateConsultation(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctorConsultations'] });
    },
  });

  const handleStatusUpdate = (id, status) => {
    updateStatusMutation.mutate({ id, status });
  };

  const loading = isDoctorLoading || isConsultationsLoading;

  if (loading) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
       <div className="w-12 h-12 border-2 border-[#e8ede9] border-t-[#0fd68c] rounded-full animate-spin mb-6" />
       <p className="text-[#0a0a0f]/40 text-[0.6rem] font-bold uppercase tracking-[0.3em] animate-pulse">Initializing Terminal...</p>
    </div>
  );

  if (!doctor) return (
    <AruviAILayout activeTab="Dashboard">
      <div className={`w-full max-w-7xl mx-auto pb-20 pt-6 md:pt-10 ${isMobile ? 'px-4' : 'px-8'}`}>
        <div className="max-w-2xl mx-auto text-center space-y-8">
           <div className="w-20 h-20 rounded-3xl bg-[#0fd68c]/10 flex items-center justify-center mx-auto text-[#0fd68c] mb-8">
              <Stethoscope size={40} />
           </div>
           <h1 className="font-syne font-black text-3xl md:text-4xl text-[#0a0a0f] tracking-[-0.04em]">
              Practitioner Node <span className="text-[#0fd68c]">Inactive.</span>
           </h1>
           <p className="text-[#0a0a0f]/45 font-dm text-sm md:text-base leading-relaxed">
              Professional verification credentials required to activate clinical terminal protocols.
           </p>
           <button className="h-12 px-8 bg-[#0fd68c] text-[#060d0a] font-black text-[10px] md:text-xs uppercase tracking-widest rounded-xl hover:bg-[#0dbb7a] transition-all flex items-center justify-center gap-2 mx-auto border-none cursor-pointer">
              Finalize Profile <ChevronRight size={16} />
           </button>
        </div>
      </div>
    </AruviAILayout>
  );

  return (
    <AruviAILayout activeTab="Dashboard">
      <div className={`w-full max-w-7xl mx-auto pb-20 pt-6 md:pt-10 ${isMobile ? 'px-4' : 'px-8'}`}>
        <div className="py-12 lg:py-16">
          <header className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-16 gap-10 border-b border-[#e8ede9] pb-12">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0fd68c] animate-pulse" />
                <p className="text-[0.65rem] uppercase tracking-[0.25em] text-[#0fd68c] font-bold font-syne">
                  TERMINAL ACTIVE • v4.0.2
                </p>
              </div>

              <h1 className="font-syne font-black text-5xl lg:text-7xl text-[#0a0a0f] tracking-[-0.05em] leading-[0.95] mb-8">
                Welcome back, <br />
                <span className="text-[#0fd68c]">Dr. {doctor.name.split(' ')[0]}.</span>
              </h1>

              <div className="flex flex-wrap items-center gap-4">
                 <div className="flex items-center gap-2.5 px-5 py-2 rounded-xl bg-white border border-[#e8ede9] shadow-sm">
                    <ShieldCheck size={16} className="text-[#0fd68c]" />
                    <span className="text-[11px] font-black uppercase tracking-tight text-[#0a0a0f]">{doctor.specialization}</span>
                 </div>
                 <div className="flex items-center gap-2.5 px-5 py-2 rounded-xl bg-white border border-[#e8ede9] shadow-sm">
                    <Briefcase size={16} className="text-[#0a0a0f]/40" />
                    <span className="text-[11px] font-bold text-[#0a0a0f]/40 italic">{doctor.hospital_affiliation}</span>
                 </div>
              </div>
            </div>


            <div className="flex flex-col sm:flex-row gap-3">
               <div className="bg-white rounded-2xl border border-[#e8ede9] p-6 shadow-sm flex items-center gap-5 group hover:border-[#0fd68c] transition-all">
                  <div className="w-12 h-12 rounded-xl bg-[#0fd68c]/10 flex items-center justify-center text-[#0fd68c] group-hover:scale-110 transition-transform">
                     <UserCheck size={24} />
                  </div>
                  <div>
                     <p className="text-[0.6rem] font-bold uppercase text-[#0a0a0f]/30 tracking-widest mb-1">License Verified</p>
                     <p className="text-base font-black text-[#0a0a0f] tracking-tight">#{doctor.medical_license_number}</p>
                  </div>
               </div>
               
               <div className="flex flex-col gap-2">
                  <button className="h-11 px-6 bg-[#0fd68c] text-[#060d0a] font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-[#0dbb7a] transition-all flex items-center justify-center gap-2">
                     <Plus size={16} /> Provision Subject
                  </button>
                  <button className="h-9 px-6 bg-white border border-[#e8ede9] text-[#0a0a0f]/40 font-black text-[9px] uppercase tracking-widest rounded-xl hover:border-[#0fd68c] hover:text-[#0fd68c] transition-all">
                     Export Telemetry
                  </button>
               </div>
            </div>
          </header>


        {/* Global Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
          <StatProgress 
            icon={<Stethoscope size={24} />} 
            label="Cumulative Encounters" 
            value={doctor.total_consultations} 
            color="#000DB5"
          />
          <StatProgress 
            icon={<Clock size={24} />} 
            label="Pending Diagnostic Uplinks" 
            value={consultations.filter(c => c.status === 'pending').length} 
            color="#D69E2E"
            alert={consultations.filter(c => c.status === 'pending').length > 0}
          />
          <StatProgress 
            icon={<Users size={24} />} 
            label="Active Clinical Cohort" 
            value={new Set(consultations.map(c => c.patient_id)).size} 
            color="#805AD5"
          />
          <StatProgress 
            icon={<Database size={24} />} 
            label="Logic Node Status" 
            value="NOMINAL" 
            color="#38A169"
            isStatus
          />
        </div>

        {/* Clinical Ledger Context */}
        <div className="space-y-8">
           <div className="flex flex-col sm:flex-row items-center justify-between gap-10">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-xl bg-[#F0F6FE] border border-[#E1EBF9] flex items-center justify-center text-[#000DB5]">
                    <Activity size={24} />
                 </div>
                 <div>
                    <h3 className="text-2xl font-bold font-outfit text-[#000650] tracking-tight">Clinical Inbound Ledger</h3>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-[#718096] mt-1 italic">Real-time Multimodal Inquiry Streams</p>
                 </div>
              </div>
              
              <div className="flex items-center gap-4 w-full sm:w-auto">
                 <div className="relative flex-grow">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#718096]" size={16} />
                    <input className="bg-white border border-[#E1EBF9] rounded-xl py-2.5 pl-12 pr-6 text-sm font-medium text-[#000650] placeholder:text-[#718096]/50 focus:border-[#000DB5] outline-none transition-all shadow-sm w-full md:w-72" placeholder="Scan IDs..." />
                 </div>
                 <button className="p-2.5 bg-white border border-[#E1EBF9] rounded-xl text-[#718096] hover:text-[#000DB5] transition-all"><Filter size={20}/></button>
              </div>
           </div>

           <div className="bg-white rounded-[2.5rem] border border-[#E1EBF9] shadow-sm overflow-hidden">
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                   <thead>
                      <tr className="bg-[#F0F6FE]/50 text-[#718096] border-b border-[#E1EBF9]">
                         <th className="px-10 py-5 text-[10px] font-bold uppercase tracking-[0.2em]">Subject Node / Identity</th>
                         <th className="px-10 py-5 text-[10px] font-bold uppercase tracking-[0.2em]">Clinical Protocol</th>
                         <th className="px-10 py-5 text-center text-[10px] font-bold uppercase tracking-[0.2em]">Commit Hash</th>
                         <th className="px-10 py-5 text-center text-[10px] font-bold uppercase tracking-[0.2em]">Uplink Status</th>
                         <th className="px-10 py-5 text-right text-[10px] font-bold uppercase tracking-[0.2em]">Action</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-[#E1EBF9]">
                      {consultations.length === 0 ? (
                         <tr>
                            <td colSpan="5" className="px-12 py-32 text-center text-[#718096] font-medium italic bg-[#F0F6FE]/10">
                               No incoming diagnostic requests in current active cycle.
                            </td>
                         </tr>
                      ) : (
                         consultations.map((request, i) => (
                            <tr key={request.id} className="hover:bg-[#F0F6FE]/20 transition-all group">
                               <td className="px-10 py-6">
                                  <div className="flex items-center gap-5">
                                     <div className="w-12 h-12 rounded-xl bg-[#F0F6FE] border border-[#E1EBF9] flex items-center justify-center text-[#000650] font-bold text-sm shadow-sm group-hover:border-[#000DB5] transition-colors">
                                        {request.patient_id.substring(0, 2).toUpperCase()}
                                     </div>
                                     <div>
                                        <p className="text-sm font-bold text-[#000650] mb-0.5 group-hover:text-[#000DB5] transition-colors">PX-NODE_{request.patient_id.substring(0, 6).toUpperCase()}</p>
                                        <p className="text-[10px] font-mono font-bold text-[#718096]/50 uppercase">Telemetry Link Secured</p>
                                     </div>
                                  </div>
                               </td>
                               <td className="px-10 py-6">
                                  <span className="text-sm font-semibold text-[#4A5568]">{request.consultation_type?.replace(/_/g, ' ') || 'General'}</span>
                               </td>
                               <td className="px-10 py-6 text-center">
                                  {request.scheduled_for ? (
                                    <>
                                      <p className="text-sm font-black text-teal-600 mb-0.5">
                                        {new Date(request.scheduled_for).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                      </p>
                                      <p className="text-[10px] font-bold text-[#000650] uppercase tracking-widest leading-none mt-1">
                                         {new Date(request.scheduled_for).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                      </p>
                                    </>
                                  ) : (
                                    <>
                                      <p className="text-sm font-bold text-amber-500 mb-0.5 italic">Immediate</p>
                                      <p className="text-[10px] font-bold text-[#718096]/50 uppercase tracking-widest leading-none mt-1">Triage Protocol</p>
                                    </>
                                  )}
                               </td>
                               <td className="px-10 py-6 text-center">
                                  <ClinicalStatus status={request.status} />
                               </td>
                               <td className="px-10 py-6 text-right">
                                  <div className="flex items-center justify-end gap-3">
                                     {request.status === 'pending' ? (
                                        <>
                                           <button onClick={() => handleStatusUpdate(request.id, 'accepted')} className="px-5 py-2 rounded-xl bg-[#000DB5] text-white text-[10px] font-bold uppercase tracking-wider hover:bg-[#000990] transition-colors shadow-md">Authorize</button>
                                           <button onClick={() => handleStatusUpdate(request.id, 'cancelled')} className="p-2.5 rounded-xl border border-[#E1EBF9] text-[#718096] hover:bg-[#FFF5F5] hover:text-[#E53E3E] transition-all"><XCircle size={18}/></button>
                                        </>
                                     ) : request.status === 'accepted' ? (
                                        <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#000DB5] text-white text-[10px] font-bold uppercase tracking-wider hover:bg-[#000990] transition-colors shadow-md">
                                           <MessageSquare size={16} /> Establish Link
                                        </button>
                                     ) : (
                                        <span className="text-[10px] font-bold text-[#718096]/40 uppercase tracking-widest flex items-center gap-2 group-hover:text-[#718096] transition-colors">Session Finalized <ExternalLink size={12}/></span>
                                     )}
                                     <button className="p-2 text-[#718096] hover:text-[#000650] rounded-xl hover:bg-[#F0F6FE] transition-all ml-2"><MoreHorizontal size={20}/></button>
                                  </div>
                               </td>
                            </tr>
                         ))
                      )}
                   </tbody>
                </table>
             </div>
           </div>
        </div>
         </div>
      </div>
    </AruviAILayout>
  );
};

const StatProgress = ({ icon, label, value, color, status, alert }) => (
  <div className="bg-white rounded-[2.5rem] border border-[#E1EBF9] p-10 shadow-sm group hover:border-[#000DB5] transition-all relative overflow-hidden">
    <div className="w-14 h-14 rounded-2xl bg-[#F0F6FE] border border-[#E1EBF9] flex items-center justify-center mb-10 group-hover:scale-110 transition-transform shadow-sm" style={{ color: color }}>
      {icon}
    </div>
    <div>
       <p className="text-[10px] font-bold uppercase text-[#718096] tracking-[0.2em] mb-2">{label}</p>
       <div className="flex items-baseline gap-4">
          <h2 className="text-4xl font-normal text-[#000650] tracking-tighter leading-none font-outfit">{value.toLocaleString()}</h2>
          {alert && (
             <span className="px-2 py-0.5 rounded bg-[#FFF5F5] text-[#E53E3E] text-[8px] font-bold border border-[#FED7D7] uppercase tracking-widest animate-pulse">Critical</span>
          )}
          {status && (
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#38A169] shadow-[0_0_8px_#38A169]" />
                <span className="text-[9px] font-bold text-[#38A169] uppercase tracking-widest">Active</span>
             </div>
          )}
       </div>
    </div>
    <div className="absolute bottom-0 left-0 h-1 transition-all group-hover:h-2 opacity-20 w-full" style={{ backgroundColor: color }} />
  </div>
);

const ClinicalStatus = ({ status }) => {
  const styles = {
    pending: 'bg-[#FFFAF0] text-[#B7791F] border-[#FEEBC8]',
    accepted: 'bg-[#F0F6FE] text-[#000DB5] border-[#E1EBF9]',
    completed: 'bg-[#F0FFF4] text-[#38A169] border-[#C6F6D5]',
    cancelled: 'bg-[#FFF5F5] text-[#E53E3E] border-[#FED7D7]',
  };
  return (
    <span className={`inline-flex items-center justify-center px-4 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border ${styles[status] || 'bg-gray-50 text-gray-500'}`}>
      {status}
    </span>
  );
};

export default DoctorDashboard;
