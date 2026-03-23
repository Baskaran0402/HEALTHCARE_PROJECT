import React from 'react'
import TelemedicineDashboard from '../../components/patient/TelemedicineDashboard'
import useAuthStore from '../../store/authStore'
import { useBreakpoint } from '../../hooks/useBreakpoint'

export default function SchedulePage() {
  const { user } = useAuthStore()
  const { isMobile } = useBreakpoint()

  return (
    <div className={`w-full max-w-7xl mx-auto pb-20 pt-6 md:pt-10 ${isMobile ? 'px-4' : 'px-8'}`}>
      <h1 className="font-syne font-black text-2xl md:text-3xl text-slate-900 mb-4 md:mb-6 leading-tight">My Schedule</h1>
      <p className="text-sm md:text-base text-slate-500 mb-8 md:mb-10 font-bold max-w-2xl leading-relaxed">Manage your availability and upcoming appointments.</p>
      
      <TelemedicineDashboard user={user} />
    </div>
  )
}
