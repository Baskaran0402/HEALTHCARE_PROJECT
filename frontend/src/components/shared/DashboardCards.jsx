/* eslint-disable react-refresh/only-export-components */
import React from 'react'
import { useNavigate } from 'react-router-dom'

// ActionCard.jsx — large primary feature card
export function ActionCard({ title, desc, badge, badgeColor, path, accent, icon }) {
  const navigate = useNavigate()
  return (
    <div
      onClick={() => navigate(path)}
      className="bg-white rounded-2xl border border-[#e8ede9] p-6 cursor-pointer transition-all duration-200 relative overflow-hidden group hover:-translate-y-0.5 hover:shadow-xl"
      style={{
        boxShadow: 'none', // Reset for group hover logic if needed, but Tailwind is cleaner
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center text-xl"
          style={{ background: `${accent}10` }}
        >
          {icon}
        </div>
        <span
          className="text-[0.65rem] font-bold font-syne px-2.5 py-1 rounded-full tracking-[0.06em] border"
          style={{
            color: badgeColor,
            background: `${badgeColor}10`,
            borderColor: `${badgeColor}25`
          }}
        >
          {badge}
        </span>
      </div>
      <h3 className="font-syne font-bold text-base text-[#0a0a0f] m-0 mb-2">{title}</h3>
      <p className="text-xs text-[#0a0a0f]/45 m-0 mb-4 leading-relaxed font-dm">{desc}</p>
      <span
        className="text-xs font-bold font-syne flex items-center gap-1 group-hover:translate-x-1 transition-transform"
        style={{ color: accent }}
      >
        Open <span>→</span>
      </span>
    </div>
  )
}

// SmallCard.jsx — compact secondary navigation card
export function SmallCard({ title, desc, path, icon }) {
  const navigate = useNavigate()
  return (
    <div
      onClick={() => navigate(path)}
      className="bg-white rounded-xl border border-[#e8ede9] p-4 cursor-pointer transition-all duration-150 flex items-center gap-3.5 hover:bg-[#f9fffc] hover:border-[#0fd68c]/40"
    >
      <span className="text-xl shrink-0">{icon}</span>
      <div>
        <p className="font-syne font-bold text-sm text-[#0a0a0f] m-0">{title}</p>
        <p className="text-[0.72rem] text-[#0a0a0f]/40 m-0 mt-0.5 font-dm">{desc}</p>
      </div>
    </div>
  )
}

// timeOfDay helper:
export function timeOfDay() {
  const h = new Date().getHours()
  return h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening'
}
