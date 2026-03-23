import React from 'react';

// ─── ClinicalCard ─────────────────────────────────────────────────────────────
export const ClinicalCard = ({ title, subtitle, extra, children, className = '', ...props }) => (
  <div
    className={`bg-white rounded-2xl p-8 transition-shadow duration-300 border border-[#e8ede9] ${className}`}
    {...props}
  >
    {(title || subtitle || extra) && (
      <div className="mb-6 flex justify-between items-start gap-4">
        <div>
          {title && (
            <h3 className="font-syne font-bold text-lg text-[#0a0a0f]">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-xs mt-1 font-dm font-normal text-[#0a0a0f]/35">
              {subtitle}
            </p>
          )}
        </div>
        {extra && <div className="flex-shrink-0">{extra}</div>}
      </div>
    )}
    {children}
  </div>
);

// ─── ClinicalBadge ────────────────────────────────────────────────────────────
const badgeStyles = {
  primary: 'bg-[#0fd68c]/10 text-[#0fd68c] border border-[#0fd68c]/15',
  success: 'bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/15',
  warning: 'bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/15',
  error: 'bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/15',
  info: 'bg-[#0ea5e9]/10 text-[#0ea5e9] border border-[#0ea5e9]/15',
  neutral: 'bg-[#0a0a0f]/5 text-[#0a0a0f]/40 border border-[#0a0a0f]/10',
};

export const ClinicalBadge = ({ variant = 'primary', children, className = '' }) => (
  <span
    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-widest font-dm font-semibold ${badgeStyles[variant] || badgeStyles.primary} ${className}`}
  >
    {children}
  </span>
);

// ─── ClinicalInput ────────────────────────────────────────────────────────────
export const ClinicalInput = ({ label, className = '', ...props }) => (
  <div className="space-y-2">
    {label && (
      <label className="text-[10px] uppercase tracking-widest block font-dm font-medium text-[#0a0a0f]/30">
        {label}
      </label>
    )}
    <input
      className={`w-full text-sm outline-none transition-all duration-200 font-dm border-[1.5px] border-[#dde8e4] rounded-[10px] px-4 py-[14px] text-[#0a0a0f] focus:border-[#0fd68c] focus:ring-4 focus:ring-[#0fd68c]/15 ${className}`}
      {...props}
    />
  </div>
);

// ─── ClinicalTextArea ─────────────────────────────────────────────────────────
export const ClinicalTextArea = ({ label, className = '', ...props }) => (
  <div className="space-y-2">
    {label && (
      <label className="text-[10px] uppercase tracking-widest block font-dm font-medium text-[#0a0a0f]/30">
        {label}
      </label>
    )}
    <textarea
      className={`w-full min-h-[120px] text-sm outline-none transition-all duration-200 resize-y font-dm border-[1.5px] border-[#dde8e4] rounded-[10px] px-4 py-[14px] text-[#0a0a0f] focus:border-[#0fd68c] focus:ring-4 focus:ring-[#0fd68c]/15 ${className}`}
      {...props}
    />
  </div>
);

// ─── ClinicalSelect ───────────────────────────────────────────────────────────
export const ClinicalSelect = ({ label, children, className = '', ...props }) => (
  <div className="space-y-2">
    {label && (
      <label className="text-[10px] uppercase tracking-widest block font-dm font-medium text-[#0a0a0f]/30">
        {label}
      </label>
    )}
    <select
      className={`w-full text-sm outline-none transition-all duration-200 appearance-none cursor-pointer font-dm border-[1.5px] border-[#dde8e4] rounded-[10px] px-4 py-[14px] text-[#0a0a0f] focus:border-[#0fd68c] focus:ring-4 focus:ring-[#0fd68c]/15 ${className}`}
      {...props}
    >
      {children}
    </select>
  </div>
);

// ─── StatCard ─────────────────────────────────────────────────────────────────
export const StatCard = ({ icon, label, value, trend, alert }) => (
  <div className="rounded-2xl p-6 bg-white transition-all duration-300 group relative overflow-hidden border border-[#e8ede9]">
    <div className="relative z-10">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 bg-[#f7f9f8]">
        <span className="text-[#0fd68c]">{icon}</span>
      </div>
      <p className="text-[10px] uppercase tracking-widest mb-2 font-dm font-medium text-[#0a0a0f]/30">
        {label}
      </p>
      <div className="flex items-end gap-2">
        <span className="font-syne font-extrabold text-[1.75rem] text-[#0a0a0f] leading-none">
          {value}
        </span>
        {trend && (
          <span className={`text-[10px] px-2 py-0.5 rounded-md mb-1 font-dm font-semibold ${
              trend.startsWith('+') ? 'bg-[#0fd68c]/10 text-[#0fd68c]' :
              trend.startsWith('-') ? 'bg-[#ef4444]/10 text-[#ef4444]' :
              'bg-[#0a0a0f]/5 text-[#0a0a0f]/40'
            }`}>
            {trend}
          </span>
        )}
        {alert && (
          <span className="text-[10px] px-2 py-0.5 rounded-md animate-pulse mb-1 font-dm font-semibold bg-[#ef4444]/10 text-[#ef4444]">
            Action
          </span>
        )}
      </div>
    </div>
  </div>
);

// ─── SectionHeader ────────────────────────────────────────────────────────────
export const SectionHeader = ({ badge, title, subtitle, actions }) => (
  <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 pb-8 mb-8 border-b border-[#e8ede9]">
    <div className="space-y-3">
      {badge && <ClinicalBadge variant="primary">{badge}</ClinicalBadge>}
      <h1 className="font-syne font-bold text-[2.5rem] tracking-[-0.04em] text-[#0a0a0f] leading-[1.1]">
        {title}
      </h1>
      {subtitle && (
        <p className="text-lg max-w-2xl font-dm font-light text-[#0a0a0f]/50">
          {subtitle}
        </p>
      )}
    </div>
    {actions && <div className="flex items-center gap-4">{actions}</div>}
  </div>
);

// ─── DarkPanel ────────────────────────────────────────────────────────────────
export const DarkPanel = ({ children, className = '' }) => (
  <div className={`rounded-2xl p-12 relative overflow-hidden bg-[#060d0a] ${className}`}>
    <div className="absolute inset-0 pointer-events-none opacity-[0.08]">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full blur-[120px] bg-[#0fd68c]" />
    </div>
    <div className="relative z-10 text-white font-dm">{children}</div>
  </div>
);
