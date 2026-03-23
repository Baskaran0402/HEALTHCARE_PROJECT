import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  Users, Search, UserPlus, Filter, 
  MoreVertical, ChevronRight, Activity, 
  Calendar, MapPin, Hash, ArrowUpRight,
  Database, ShieldCheck, Mail, Phone
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import patientService from '../services/patientService';
import { 
  ClinicalCard, 
  ClinicalBadge, 
  ClinicalInput, 
  StatCard, 
  SectionHeader 
} from '../components/ClinicalComponents';
import { AruviAILayout } from '../components/ui/AruviAILayout';
import { TableSkeleton } from '../components/ui/SkeletonLoader';
import { useBreakpoint } from '../hooks/useBreakpoint';

const PatientRow = ({ patient, idx, isMobile }) => {
  const navigate = useNavigate();
  return (
    <motion.tr 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.05 }}
      className="group hover:bg-slate-50/80 transition-all cursor-pointer"
      onClick={() => navigate(`/records/${patient.id}`)}
    >
      <td className="py-4 md:py-6 pl-4 md:pl-10 pr-4">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="w-10 h-10 md:w-11 md:h-11 rounded-2xl bg-teal-50 border border-teal-100/50 flex items-center justify-center text-teal-600 font-black text-[10px] md:text-xs shadow-constrained group-hover:scale-110 transition-transform shrink-0">
            {patient.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-black text-slate-800 leading-none mb-1 md:mb-1.5 truncate">{patient.name}</p>
            <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] truncate">{patient.medical_record_number || patient.id}</p>
          </div>
        </div>
      </td>
      <td className="py-4 md:py-6 px-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Calendar size={12} className="text-slate-300" />
            <span className="text-xs font-bold text-slate-500 whitespace-nowrap">{patient.age}y / {patient.gender}</span>
          </div>
        </div>
      </td>
      {!isMobile && (
        <td className="py-6 px-4">
          <div className="flex items-center gap-2.5">
             <MapPin size={12} className="text-slate-300" />
             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{patient.organization?.name || 'Central Lab'}</span>
          </div>
        </td>
      )}
      <td className="py-4 md:py-6 px-4">
        <ClinicalBadge variant={patient.is_active ? 'success' : 'neutral'} className="text-[9px]">
          {patient.is_active ? 'Active' : 'Inactive'}
        </ClinicalBadge>
      </td>
      <td className="py-4 md:py-6 px-4 text-right pr-4 md:pr-10">
        <button className="w-8 h-8 flex items-center justify-center text-slate-300 group-hover:text-teal-600 group-hover:bg-teal-50 rounded-xl transition-all cursor-pointer bg-transparent border-none">
          <ChevronRight size={18} />
        </button>
      </td>
    </motion.tr>
  );
};

export default function Patients() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("ALL");
  const { isMobile } = useBreakpoint();

  const { data: patients = [], isLoading } = useQuery({
    queryKey: ['patients'],
    queryFn: () => patientService.listPatients(),
  });

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (p.medical_record_number && p.medical_record_number.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <AruviAILayout activeTab="Patients">
      <div className={`w-full max-w-7xl mx-auto ${isMobile ? 'px-4' : 'px-8'}`}>
        <div className="space-y-8 md:space-y-12 pb-20 pt-6 md:pt-10">
          
          {/* Header */}
          <SectionHeader 
            badge="Institutional Database"
            title={<>Patient <span className="text-teal-600">Records.</span></>}
            subtitle="Manage clinical histories across authorized institutional nodes with zero-trust security."
            actions={
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <button className="flex-1 sm:flex-none px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-[10px] md:text-xs font-black text-slate-500 hover:text-slate-900 hover:border-teal-500/30 transition-all uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer">
                  <Database size={15} /> Export
                </button>
                <button className="flex-1 sm:flex-none px-5 py-2.5 bg-slate-900 text-teal-400 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest hover:bg-teal-600 hover:text-white transition-all flex items-center justify-center gap-2 shadow-premium border-none cursor-pointer">
                  <UserPlus size={15} /> New Entry
                </button>
              </div>
            }
          />

          {/* Global Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              icon={<Users size={20} />} 
              label="Total Subjects" 
              value={patients.length} 
              trend="+4.2%"
            />
            <StatCard 
              icon={<Activity size={20} />} 
              label="Active Stratifications" 
              value={patients.filter(p => p.is_active).length} 
              trend="+12%"
            />
            <StatCard 
              icon={<MapPin size={20} />} 
              label="Regional Nodes" 
              value="04" 
            />
            <StatCard 
              icon={<ShieldCheck size={20} />} 
              label="Compliance Score" 
              value="100%" 
              alert={true}
            />
          </div>

          {/* Table Controls */}
          <div className="flex flex-col lg:flex-row gap-6 items-stretch lg:items-center justify-between p-6 md:p-8 bg-white rounded-2xl md:rounded-[2rem] border border-slate-100 shadow-subtle">
            <div className="w-full lg:w-96">
              <ClinicalInput 
                label="Registry Search"
                placeholder="Search subject ID or name..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap items-center gap-2 md:gap-3 w-full lg:w-auto mt-4 lg:mt-0 pt-4 lg:pt-0 border-t lg:border-none border-slate-50">
              {['ALL', 'ACTIVE', 'ARCHIVED'].map((t) => (
                <button 
                  key={t}
                  onClick={() => setFilter(t)}
                  className={`flex-1 md:flex-none px-4 md:px-6 py-2.5 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer border-none ${
                    filter === t ? 'bg-teal-600 text-white shadow-glow' : 'text-slate-400 hover:bg-slate-50'
                  }`}
                >
                  {t}
                </button>
              ))}
              <div className="hidden sm:block w-px h-6 bg-slate-100 mx-1 md:mx-2" />
              <button className="p-2 text-slate-400 hover:text-teal-600 transition-colors bg-white border-none cursor-pointer">
                <Filter size={20} />
              </button>
            </div>
          </div>

          {/* Patients Table */}
          <ClinicalCard className="p-0 overflow-hidden rounded-2xl md:rounded-[2rem]">
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left border-separate border-spacing-0">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="py-4 md:py-5 pl-4 md:pl-10 pr-4 text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Subject Matrix</th>
                    <th className="py-4 md:py-5 px-4 text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Biometric Index</th>
                    {!isMobile && (
                      <th className="py-4 md:py-5 px-4 text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Assigned Node</th>
                    )}
                    <th className="py-4 md:py-5 px-4 text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Telemetry State</th>
                    <th className="py-4 md:py-5 px-4 text-right pr-4 md:pr-10 text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {isLoading ? (
                    <tr>
                      <td colSpan={isMobile ? "4" : "5"} className="p-0">
                        <TableSkeleton rows={8} />
                      </td>
                    </tr>
                  ) : filteredPatients.length === 0 ? (
                    <tr>
                      <td colSpan={isMobile ? "4" : "5"} className="py-16 md:py-24 text-center text-slate-400 text-sm font-medium italic">
                        No subjects found matching "{searchTerm}".
                      </td>
                    </tr>
                  ) : (
                    filteredPatients.map((p, i) => (
                      <PatientRow key={p.id} patient={p} idx={i} isMobile={isMobile} />
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="p-6 md:p-8 bg-slate-50/50 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest text-center md:text-left">
                Showing {filteredPatients.length} of {patients.length} institutional entries
              </div>
              <div className="flex items-center gap-1.5 md:gap-2">
                <button className="px-3 md:px-4 py-2 rounded-xl border border-slate-200 text-slate-400 hover:bg-white transition-all text-[9px] md:text-[10px] font-black uppercase tracking-widest bg-transparent cursor-pointer">Prev</button>
                <button className="px-3 md:px-4 py-2 rounded-xl bg-teal-600 text-white shadow-glow text-[9px] md:text-[10px] font-black border-none cursor-pointer">01</button>
                <button className="px-3 md:px-4 py-2 rounded-xl border border-slate-200 text-slate-400 hover:bg-white transition-all text-[9px] md:text-[10px] font-black bg-white">02</button>
                <button className="px-3 md:px-4 py-2 rounded-xl border border-slate-200 text-slate-400 hover:bg-white transition-all text-[9px] md:text-[10px] font-black uppercase tracking-widest bg-transparent cursor-pointer">Next</button>
              </div>
            </div>
          </ClinicalCard>

        </div>
      </div>
    </AruviAILayout>
  );
}
