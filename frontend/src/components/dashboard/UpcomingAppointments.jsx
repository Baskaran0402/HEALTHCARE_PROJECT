import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Video, MapPin, Clock, ChevronRight, User, MoreHorizontal, ShieldCheck } from 'lucide-react';

export function UpcomingAppointments() {
  const appointments = [
    {
      id: 'apt-1',
      doctor_name: 'Dr. Arjun Reddy',
      specialization: 'Cardiologist',
      time: 'Today, 2:30 PM',
      type: 'video',
      status: 'Ready',
      meeting_link: 'https://meet.jit.si/AIDoc-ArjunReddy',
      avatar: 'AR',
      color: 'blue'
    },
    {
      id: 'apt-2',
      doctor_name: 'Dr. Sarah Williams',
      specialization: 'Neurologist',
      time: 'Tomorrow, 10:00 AM',
      type: 'in-person',
      status: 'Scheduled',
      avatar: 'SW',
      color: 'purple'
    },
    {
      id: 'apt-3',
      doctor_name: 'Dr. Emily Chen',
      specialization: 'Psychiatrist',
      time: 'Wed, 3:00 PM',
      type: 'video',
      status: 'Scheduled',
      avatar: 'EC',
      color: 'teal'
    }
  ];

  return (
    <div className="h-full bg-white border border-[#E1EBF9] rounded-[2.5rem] p-8 lg:p-12 relative overflow-hidden group shadow-sm flex flex-col">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/20 via-transparent to-transparent z-0 pointer-events-none" />
      <div className="absolute bottom-0 right-0 p-8 opacity-[0.03] pointer-events-none">
         <Calendar size={120} className="text-blue-900" />
      </div>
      
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center justify-between mb-10">
           <div>
              <h2 className="text-xl font-black text-[#000650] uppercase tracking-tighter flex items-center gap-3">
                 <Calendar className="text-blue-500" size={20} />
                 Clinical Schedule
              </h2>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mt-1">Managed Session Queue</p>
           </div>
           <button className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-[#000650] transition-all cursor-pointer">
              <MoreHorizontal size={18} />
           </button>
        </div>

        <div className="space-y-6 flex-1">
          {appointments.map((apt, i) => (
            <motion.div
              key={apt.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="relative group/item"
            >
              <div className="flex items-start gap-5">
                 {/* Timeline Node */}
                 <div className="flex flex-col items-center">
                    <div className={`w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center font-black text-slate-400 text-sm group-hover/item:border-blue-300 group-hover/item:text-blue-600 group-hover/item:bg-white transition-all duration-500 relative shadow-sm`}>
                       {apt.avatar}
                       {apt.status === 'Ready' && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white animate-pulse" />
                       )}
                    </div>
                    {i < appointments.length - 1 && <div className="w-px h-full min-h-[50px] bg-gradient-to-b from-slate-200 via-slate-100 to-transparent my-1" />}
                 </div>

                 {/* Content */}
                 <div className="flex-1 pb-6">
                    <div className="flex items-start justify-between mb-3">
                       <div>
                          <h3 className="font-black text-[#000650] uppercase tracking-tight text-lg leading-none group-hover/item:text-blue-600 transition-colors">{apt.doctor_name}</h3>
                          <div className="flex items-center gap-2 mt-2">
                             <span className="text-[10px] text-blue-600 uppercase font-black tracking-widest leading-none">{apt.specialization}</span>
                             <span className="text-slate-200 text-[10px]">•</span>
                             <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-50 border border-slate-100 text-[9px] font-black uppercase tracking-widest text-slate-400">
                                <Clock size={10} />
                                {apt.time.split(',')[0]}
                             </div>
                          </div>
                       </div>
                       
                       <div className={`px-3 py-1.5 rounded-xl border ${apt.status === 'Ready' ? 'bg-emerald-50 border-emerald-100 text-emerald-600 font-bold' : 'bg-slate-50 border-slate-100 text-slate-400'} text-[9px] font-black uppercase tracking-widest shadow-sm`}>
                          {apt.status}
                       </div>
                    </div>
                    
                    <div className="flex items-center gap-4 py-3 px-4 rounded-2xl bg-slate-50/50 border border-slate-100 mb-6 group-hover/item:bg-white transition-all shadow-sm">
                       <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600 tracking-tight uppercase">
                          {apt.type === 'video' ? <Video size={12} className="text-blue-500" /> : <MapPin size={12} className="text-purple-500" />}
                          {apt.type === 'video' ? 'Secure Neural-Link' : 'Clinical Facility Node'}
                       </div>
                       <span className="text-slate-200 px-2">|</span>
                       <span className="text-[10px] font-black text-[#000650] uppercase tracking-widest">{apt.time.split(',')[1]}</span>
                    </div>

                    {apt.status === 'Ready' ? (
                       <button className="flex items-center justify-center gap-3 w-full py-3 bg-[#000650] text-white rounded-xl font-bold text-[11px] uppercase tracking-widest shadow-lg hover:shadow-[#000650]/40 transition-all cursor-pointer">
                          Establish Encryption <ChevronRight size={14} />
                       </button>
                    ) : (
                       <button className="flex items-center justify-center gap-3 w-full py-3 bg-white text-slate-400 border border-slate-200 rounded-xl font-bold text-[11px] uppercase tracking-widest hover:text-slate-800 hover:border-slate-800 transition-all cursor-pointer">
                          Review Clinical Protocol
                       </button>
                    )}
                 </div>
              </div>
            </motion.div>
          ))}
        </div>

        <button className="mt-8 flex items-center justify-center gap-3 w-full py-4 rounded-3xl bg-slate-50 border border-slate-100 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-[#000650] hover:bg-white transition-all group cursor-pointer shadow-sm">
           Global Calendar Integration
           <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
