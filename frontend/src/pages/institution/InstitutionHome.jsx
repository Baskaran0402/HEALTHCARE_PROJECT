import React from 'react'
import { ActionCard, SmallCard } from '../../components/shared/DashboardCards'
import { useBreakpoint } from '../../hooks/useBreakpoint'

export default function InstitutionHome() {
  const { isMobile, isTablet } = useBreakpoint()

  return (
    <div className={`w-full max-w-7xl mx-auto ${isMobile ? 'px-4' : 'px-8'} py-10 md:py-12`}>

      <div className="text-center md:text-left mb-10">
        <p className="text-[11px] md:text-[0.68rem] font-bold uppercase tracking-[0.15em] text-[#f59e0b] mb-2 font-[Syne]">INSTITUTION CONTROL</p>
        <h1 className="font-[Syne] font-black text-2xl md:text-4xl text-[#0a0a0f] tracking-[-0.03em] leading-tight mb-2 uppercase">
          Facility <span className="text-[#f59e0b]">Overview</span>
        </h1>
        <p className="text-[#0a0a0f]/40 text-sm font-bold font-[DM_Sans] italic">
          Real-time population health intelligence across your institution.
        </p>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[1px] bg-[#e8ede9] rounded-[2rem] overflow-hidden mb-8 md:mb-10 border border-[#e8ede9] shadow-subtle">
        {[
          {label:'Total Patients',    value:'1,247', delta:'+12 this week',  color:'text-slate-900'},
          {label:'Pending Consultations', value:'14', delta:'Waiting for approval', color:'text-amber-600'},
          {label:'High Risk Flags',   value:'89',    delta:'↑ 8 from last week',color:'text-red-500'},
          {label:'Assessments Today', value:'156',   delta:'23% above average',color:'text-emerald-500'},
        ].map(k => (
          <div key={k.label} className="bg-white p-6 md:p-8 text-center md:text-left hover:bg-slate-50 transition-colors">
            <p className={`font-[Syne] font-black text-3xl md:text-4xl ${k.color} mb-3 leading-none`}>{k.value}</p>
            <p className="font-[Syne] font-black text-[11px] md:text-xs text-[#0a0a0f] mb-1 uppercase tracking-tight">{k.label}</p>
            <p className="text-[9px] md:text-[10px] font-bold text-[#0a0a0f]/40 uppercase tracking-widest leading-none">{k.delta}</p>
          </div>
        ))}
      </div>

      {/* Management tools */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-8">
        <ActionCard title="Doctor Registry" desc="Verify credentials, manage access, view performance" badge="Admin" badgeColor="#f59e0b" path="/doctors" accent="#f59e0b" icon="👨‍⚕️"/>
        <ActionCard title="Risk Analytics" desc="Disease prevalence trends across patient population" badge="Live Data" badgeColor="#ef4444" path="/analytics" accent="#ef4444" icon="📈"/>
        <ActionCard title="Compliance Reports" desc="DPDP Act 2023 audit logs and data export" badge="DPDP" badgeColor="#8b5cf6" path="/compliance" accent="#8b5cf6" icon="🛡"/>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        <SmallCard title="Patient Registry" desc="All patients across facility" path="/patients" icon="👤"/>
        <SmallCard title="Access Control" desc="Role assignment + audit" path="/access" icon="🔐"/>
        <SmallCard title="System Health" desc="API + model uptime" path="/system" icon="⚡"/>
      </div>
    </div>
  )
}
