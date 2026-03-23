import React from 'react';
import { cn } from '@/lib/utils';

interface ClinicalCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  children: React.ReactNode;
}

export const ClinicalCard = ({ title, children, className, ...props }: ClinicalCardProps) => (
  <div className={cn("bg-card rounded-3xl border border-border p-8 shadow-subtle", className)} {...props}>
    {title && <h3 className="text-lg font-bold text-foreground font-display mb-6">{title}</h3>}
    {children}
  </div>
);

interface ClinicalBadgeProps {
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
  children: React.ReactNode;
  className?: string;
}

const badgeStyles = {
  primary: 'bg-teal-50 text-primary border-teal-200',
  success: 'bg-emerald-50 text-clinical-success border-emerald-200',
  warning: 'bg-amber-50 text-clinical-warning border-amber-200',
  error: 'bg-red-50 text-clinical-error border-red-200',
  info: 'bg-sky-50 text-clinical-info border-sky-200',
  neutral: 'bg-secondary text-muted-foreground border-border',
};

export const ClinicalBadge = ({ variant = 'primary', children, className }: ClinicalBadgeProps) => (
  <span className={cn(
    "inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-[0.15em] border",
    badgeStyles[variant],
    className
  )}>
    {children}
  </span>
);

interface ClinicalInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const ClinicalInput = ({ label, className, ...props }: ClinicalInputProps) => (
  <div className="space-y-2">
    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{label}</label>
    <input 
      className={cn(
        "w-full h-12 px-4 border border-input rounded-xl text-sm text-foreground bg-background",
        "focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-200",
        "placeholder:text-muted-foreground/50 font-medium",
        className
      )}
      {...props}
    />
  </div>
);

interface ClinicalTextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export const ClinicalTextArea = ({ label, className, ...props }: ClinicalTextAreaProps) => (
  <div className="space-y-2">
    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{label}</label>
    <textarea 
      className={cn(
        "w-full min-h-[120px] px-4 py-3 border border-input rounded-xl text-sm text-foreground bg-background",
        "focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-200 resize-y",
        "placeholder:text-muted-foreground/50 font-medium",
        className
      )}
      {...props}
    />
  </div>
);

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  trend?: string;
  alert?: boolean;
}

export const StatCard = ({ icon, label, value, trend, alert }: StatCardProps) => (
  <div className="bg-card rounded-3xl border border-border p-8 shadow-subtle group hover:border-primary/30 transition-all relative overflow-hidden">
    <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-[0.2em] mb-2">{label}</p>
      <div className="flex items-baseline gap-3">
        <h2 className="text-3xl font-bold text-foreground tracking-tight font-display">{value}</h2>
        {trend && (
          <span className={cn(
            "px-2 py-0.5 rounded-lg text-[10px] font-bold",
            trend.startsWith('+') ? 'bg-emerald-50 text-clinical-success' : trend.startsWith('-') ? 'bg-red-50 text-clinical-error' : 'bg-secondary text-muted-foreground'
          )}>
            {trend}
          </span>
        )}
        {alert && (
          <span className="px-2 py-0.5 rounded bg-red-50 text-clinical-error text-[8px] font-bold border border-red-200 uppercase tracking-widest animate-pulse">
            Critical
          </span>
        )}
      </div>
    </div>
    <div className="absolute bottom-0 left-0 h-1 w-full bg-primary/10 transition-all group-hover:h-1.5 group-hover:bg-primary/20" />
  </div>
);
