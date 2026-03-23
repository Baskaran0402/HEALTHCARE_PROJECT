import React from 'react'
import DoctorDashboard from './Dashboard'
import { useBreakpoint } from '../../hooks/useBreakpoint'

export default function PatientQueuePage() {
  const { isMobile } = useBreakpoint()

  return (
    <div className={`w-full max-w-7xl mx-auto pb-20 pt-6 md:pt-10 ${isMobile ? 'px-4' : 'px-8'}`}>
      <h1 className="font-[Syne] font-black text-2xl md:text-3xl text-slate-900 mb-4 md:mb-6 leading-tight">Patient Queue</h1>
      <p className="text-sm md:text-base text-slate-500 mb-8 md:mb-10 font-bold max-w-2xl leading-relaxed">Manage today's clinical encounters and waitlist.</p>
      
      {/* Reusing the table from DoctorDashboard or just showing it here */}
      <DoctorDashboard />
    </div>
  )
}
