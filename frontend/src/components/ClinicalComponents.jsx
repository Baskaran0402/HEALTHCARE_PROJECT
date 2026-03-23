import React from 'react';

// ─── ClinicalCard ─────────────────────────────────────────────────────────────
export const ClinicalCard = ({ title, subtitle, extra, children, className = '', ...props }) => (
  <div
    className={`bg-white rounded-2xl p-8 transition-shadow duration-300 ${className}`}
    style={{ border: '1px solid #e8ede9' }}
    {...props}
  >
    {(title || subtitle || extra) && (
      <div className="mb-6 flex justify-between items-start gap-4">
        <div>
          {title && (
            <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1.125rem', color: '#0a0a0f' }}>
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-xs mt-1"
              style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 400, color: 'rgba(10,10,15,0.35)' }}>
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
  primary: { background: 'rgba(15,214,140,0.08)', color: '#0fd68c', border: '1px solid rgba(15,214,140,0.15)' },
  success: { background: 'rgba(16,185,129,0.08)', color: '#10b981', border: '1px solid rgba(16,185,129,0.15)' },
  warning: { background: 'rgba(245,158,11,0.08)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.15)' },
  error: { background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.15)' },
  info: { background: 'rgba(14,165,233,0.08)', color: '#0ea5e9', border: '1px solid rgba(14,165,233,0.15)' },
  neutral: { background: 'rgba(10,10,15,0.04)', color: 'rgba(10,10,15,0.4)', border: '1px solid rgba(10,10,15,0.06)' },
};

export const ClinicalBadge = ({ variant = 'primary', children, className = '' }) => (
  <span
    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-widest ${className}`}
    style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, ...(badgeStyles[variant] || badgeStyles.primary) }}
  >
    {children}
  </span>
);

// ─── ClinicalInput ────────────────────────────────────────────────────────────
export const ClinicalInput = ({ label, className = '', ...props }) => (
  <div className="space-y-2">
    {label && (
      <label className="text-[10px] uppercase tracking-widest block"
        style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, color: 'rgba(10,10,15,0.3)' }}>
        {label}
      </label>
    )}
    <input
      className={`w-full text-sm outline-none transition-all duration-200 ${className}`}
      style={{
        fontFamily: "'DM Sans', sans-serif",
        border: '1.5px solid #dde8e3',
        borderRadius: '10px',
        padding: '14px 16px',
        color: '#0a0a0f',
      }}
      onFocus={e => { e.target.style.borderColor = '#0fd68c'; e.target.style.boxShadow = '0 0 0 3px rgba(15,214,140,0.15)'; }}
      onBlur={e => { e.target.style.borderColor = '#dde8e3'; e.target.style.boxShadow = 'none'; }}
      {...props}
    />
  </div>
);

// ─── ClinicalTextArea ─────────────────────────────────────────────────────────
export const ClinicalTextArea = ({ label, className = '', ...props }) => (
  <div className="space-y-2">
    {label && (
      <label className="text-[10px] uppercase tracking-widest block"
        style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, color: 'rgba(10,10,15,0.3)' }}>
        {label}
      </label>
    )}
    <textarea
      className={`w-full min-h-[120px] text-sm outline-none transition-all duration-200 resize-y ${className}`}
      style={{
        fontFamily: "'DM Sans', sans-serif",
        border: '1.5px solid #dde8e3',
        borderRadius: '10px',
        padding: '14px 16px',
        color: '#0a0a0f',
      }}
      onFocus={e => { e.target.style.borderColor = '#0fd68c'; e.target.style.boxShadow = '0 0 0 3px rgba(15,214,140,0.15)'; }}
      onBlur={e => { e.target.style.borderColor = '#dde8e3'; e.target.style.boxShadow = 'none'; }}
      {...props}
    />
  </div>
);

// ─── ClinicalSelect ───────────────────────────────────────────────────────────
export const ClinicalSelect = ({ label, children, className = '', ...props }) => (
  <div className="space-y-2">
    {label && (
      <label className="text-[10px] uppercase tracking-widest block"
        style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, color: 'rgba(10,10,15,0.3)' }}>
        {label}
      </label>
    )}
    <select
      className={`w-full text-sm outline-none transition-all duration-200 appearance-none cursor-pointer ${className}`}
      style={{
        fontFamily: "'DM Sans', sans-serif",
        border: '1.5px solid #dde8e3',
        borderRadius: '10px',
        padding: '14px 16px',
        color: '#0a0a0f',
      }}
      onFocus={e => { e.target.style.borderColor = '#0fd68c'; e.target.style.boxShadow = '0 0 0 3px rgba(15,214,140,0.15)'; }}
      onBlur={e => { e.target.style.borderColor = '#dde8e3'; e.target.style.boxShadow = 'none'; }}
      {...props}
    >
      {children}
    </select>
  </div>
);

// ─── StatCard ─────────────────────────────────────────────────────────────────
export const StatCard = ({ icon, label, value, trend, alert }) => (
  <div className="rounded-2xl p-6 bg-white transition-all duration-300 group relative overflow-hidden"
    style={{ border: '1px solid #e8ede9' }}>
    <div className="relative z-10">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
        style={{ background: '#f7f9f8' }}>
        <span style={{ color: '#0fd68c' }}>{icon}</span>
      </div>
      <p className="text-[10px] uppercase tracking-widest mb-2"
        style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, color: 'rgba(10,10,15,0.3)' }}>
        {label}
      </p>
      <div className="flex items-end gap-2">
        <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '1.75rem', color: '#0a0a0f', lineHeight: 1 }}>
          {value}
        </span>
        {trend && (
          <span className="text-[10px] px-2 py-0.5 rounded-md mb-1"
            style={{
              fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
              background: trend.startsWith('+') ? 'rgba(15,214,140,0.08)' : trend.startsWith('-') ? 'rgba(239,68,68,0.08)' : 'rgba(10,10,15,0.04)',
              color: trend.startsWith('+') ? '#0fd68c' : trend.startsWith('-') ? '#ef4444' : 'rgba(10,10,15,0.4)',
            }}>
            {trend}
          </span>
        )}
        {alert && (
          <span className="text-[10px] px-2 py-0.5 rounded-md animate-pulse mb-1"
            style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, background: 'rgba(239,68,68,0.08)', color: '#ef4444' }}>
            Action
          </span>
        )}
      </div>
    </div>
  </div>
);

// ─── SectionHeader ────────────────────────────────────────────────────────────
export const SectionHeader = ({ badge, title, subtitle, actions }) => (
  <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 pb-8 mb-8"
    style={{ borderBottom: '1px solid #e8ede9' }}>
    <div className="space-y-3">
      {badge && <ClinicalBadge variant="primary">{badge}</ClinicalBadge>}
      <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '2.5rem', letterSpacing: '-0.04em', color: '#0a0a0f', lineHeight: 1.1 }}>
        {title}
      </h1>
      {subtitle && (
        <p className="text-lg max-w-2xl"
          style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, color: 'rgba(10,10,15,0.5)' }}>
          {subtitle}
        </p>
      )}
    </div>
    {actions && <div className="flex items-center gap-4">{actions}</div>}
  </div>
);

// ─── DarkPanel ────────────────────────────────────────────────────────────────
export const DarkPanel = ({ children, className = '' }) => (
  <div className={`rounded-2xl p-12 relative overflow-hidden ${className}`}
    style={{ background: '#060d0a' }}>
    <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.08 }}>
      <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full blur-[120px]"
        style={{ background: '#0fd68c' }} />
    </div>
    <div className="relative z-10 text-white">{children}</div>
  </div>
);
