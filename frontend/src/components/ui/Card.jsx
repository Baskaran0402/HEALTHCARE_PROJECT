import React from 'react';
import { motion } from 'framer-motion';

export const Card = ({ children, title, subtitle, footer, className = '', noPadding = false, hover = true, ...props }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`eb-card overflow-hidden ${hover ? 'hover:-translate-y-1' : ''} ${className}`}
      {...props}
    >
      {(title || subtitle) && (
        <div className="px-6 py-5 border-b border-gray-100">
          {title && <h3 className="text-lg font-bold text-gray-900 leading-none">{title}</h3>}
          {subtitle && <p className="text-sm text-gray-500 mt-1.5">{subtitle}</p>}
        </div>
      )}
      <div className={noPadding ? '' : 'p-6'}>
        {children}
      </div>
      {footer && (
        <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100">
          {footer}
        </div>
      )}
    </motion.div>
  );
};

export const Badge = ({ children, variant = 'neutral', className = '' }) => {
  const variants = {
    neutral: 'bg-gray-100 text-gray-700 border-gray-200',
    primary: 'bg-violet-50 text-violet-700 border-violet-100',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    warning: 'bg-amber-50 text-amber-700 border-amber-100',
    error: 'bg-red-50 text-red-700 border-red-100',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};
