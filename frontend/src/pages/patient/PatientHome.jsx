import React from 'react'
import useAuthStore from '../../store/authStore'
import { ActionCard, SmallCard, timeOfDay } from '../../components/shared/DashboardCards'
import { useBreakpoint } from '../../hooks/useBreakpoint'
import { Lightbulb } from 'lucide-react'

export default function PatientHome() {
  const { user } = useAuthStore()
  const { isMobile, isTablet } = useBreakpoint()

  return (
    <div className={`w-full max-w-7xl mx-auto ${isMobile ? 'px-4' : 'px-8'} py-10 md:py-12`}>

      {/* Greeting */}
      <div className="text-center md:text-left mb-10 md:mb-12">
        <p className="text-[11px] md:text-[0.68rem] font-black uppercase tracking-[0.15em] text-[#0fd68c] mb-3 font-syne">
          PATIENT PORTAL
        </p>
        <h1 className="font-syne font-black text-2xl md:text-4xl text-[#0a0a0f] tracking-[-0.04em] leading-tight mb-3 uppercase">
          Good {timeOfDay()}, <span className="text-[#0fd68c]">{user?.name?.split(' ')[0] || 'there'}.</span>
        </h1>
        <p className="text-[#0a0a0f]/45 text-sm md:text-base font-bold font-dm max-w-lg mx-auto md:mx-0">
          What would you like to check today? Explore your clinical nodes below.
        </p>
      </div>

      {/* 2 primary action cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-10">
        <ActionCard
          title="Health Assessment"
          desc="Screen for Heart, Diabetes, Stroke, Kidney, and Liver disease simultaneously"
          badge="6 Models · <2s"
          badgeColor="#0fd68c"
          path="/assessment"
          accent="#0fd68c"
          icon="⚕"
        />
        <ActionCard
          title="Brain MRI Analysis"
          desc="Upload your MRI scan for AI-powered tumor detection with Grad-CAM visualization"
          badge="EfficientNet-B0"
          badgeColor="#8b5cf6"
          path="/brain-tumor"
          accent="#8b5cf6"
          icon="🧠"
        />
      </div>

      {/* Secondary actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-10 md:mb-12">
        <SmallCard title="Find a Doctor" desc="Match specialist by condition" path="/find-doctor" icon="🔍"/>
        <SmallCard title="My Reports" desc="View past assessments" path="/my-reports" icon="📋"/>
        <SmallCard title="Appointments" desc="Upcoming consultations" path="/appointments" icon="📅"/>
      </div>

      {/* Health tip strip */}
      <div className="bg-white rounded-[2rem] border border-[#e8ede9] p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 md:gap-8 shadow-premium group hover:bg-slate-50 transition-colors">
        <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center flex-shrink-0 text-emerald-500 group-hover:scale-110 transition-transform shadow-subtle border border-emerald-100">
          <Lightbulb size={28} />
        </div>
        <div className="text-center md:text-left">
          <p className="font-syne font-black text-lg md:text-xl text-[#0a0a0f] mb-2 uppercase tracking-tight">Regular screening saves lives</p>
          <p className="text-sm font-bold text-[#0a0a0f]/45 leading-relaxed font-dm">
            AruviAI is a second-opinion AI tool. Always consult a licensed clinician for medical decisions.
          </p>
        </div>
      </div>
    </div>
  )
}
