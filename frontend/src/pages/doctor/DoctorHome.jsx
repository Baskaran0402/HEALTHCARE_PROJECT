import React, { useState } from 'react'
import useAuthStore from '../../store/authStore'
import { ActionCard, SmallCard } from '../../components/shared/DashboardCards'
import { useBreakpoint } from '../../hooks/useBreakpoint'

export default function DoctorHome() {
  const { user } = useAuthStore()
  const { isMobile, isTablet } = useBreakpoint()
  // Fetch today's queue count, pending reports count from API
  const [stats, setStats] = useState({ queue: 0, pending: 0, highRisk: 0 })

  return (
    <div className={`w-full max-w-7xl mx-auto ${isMobile ? 'px-4' : 'px-8'} py-10 md:py-12`}>

      <div className="text-center md:text-left mb-10">
        <p className="text-[11px] md:text-[0.68rem] font-bold uppercase tracking-[0.15em] text-[#3b82f6] mb-2 font-[Syne]">CLINICAL WORKSPACE</p>
        <h1 className="font-[Syne] font-black text-2xl md:text-4xl text-[#0a0a0f] tracking-[-0.03em] leading-tight mb-2 uppercase">
          Dr. {user?.name?.split(' ').slice(-1)[0] || 'Doctor'} — <span className="text-[#3b82f6]">Today's Overview</span>
        </h1>
        <p className="text-[#0a0a0f]/40 text-sm font-bold font-[DM_Sans]">
          {new Date().toLocaleDateString('en-IN', {weekday:'long',year:'numeric',month:'long',day:'numeric'})}
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 md:mb-10">
        {[
          {label:'Patients in Queue',   value: stats.queue,   color:'text-blue-500', sub:'Today'},
          {label:'Pending Reports',     value: stats.pending, color:'text-amber-500', sub:'Awaiting review'},
          {label:'High Risk Patients',  value: stats.highRisk,color:'text-red-500', sub:'Needs attention'},
        ].map(s => (
          <div key={s.label} className="bg-white rounded-[2rem] border border-[#e8ede9] p-6 md:p-8 shadow-subtle hover:shadow-premium transition-shadow text-center md:text-left">
            <p className={`font-[Syne] font-black text-4xl md:text-5xl ${s.color} mb-3 leading-none`}>{s.value}</p>
            <p className="font-[Syne] font-black text-[13px] md:text-sm text-[#0a0a0f] mb-1 uppercase tracking-tight">{s.label}</p>
            <p className="text-[10px] md:text-xs font-bold text-[#0a0a0f]/40 uppercase tracking-widest">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Primary tools */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">
        <ActionCard title="Patient Queue" desc="View today's scheduled appointments and walk-ins" badge="Live" badgeColor="#3b82f6" path="/queue" accent="#3b82f6" icon="👥"/>
        <ActionCard title="Video Consultation" desc="Start or join a patient video call session" badge="WebRTC" badgeColor="#8b5cf6" path="/consult" accent="#8b5cf6" icon="📹"/>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        <SmallCard title="Patient Records" desc="Full history + risk timeline" path="/records" icon="📁"/>
        <SmallCard title="Risk Dashboard" desc="Population risk overview" path="/risk-dashboard" icon="📊"/>
        <SmallCard title="My Schedule" desc="Manage availability" path="/schedule" icon="🗓"/>
      </div>
    </div>
  )
}
