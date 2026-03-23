import React from 'react';

export const Input = ({ label, error, helperText, className = '', ...props }) => {
  return (
    <div className={`eb-input-wrapper ${className}`}>
      {label && <label className="eb-label">{label}</label>}
      <input 
        className={`eb-input ${error ? 'border-red-500 ring-red-500/10 focus:border-red-500' : ''}`}
        {...props}
      />
      {error && <p className="text-xs text-red-500 mt-1 font-medium">{error}</p>}
      {helperText && !error && <p className="text-xs text-gray-500 mt-1">{helperText}</p>}
    </div>
  );
};

export const TextArea = ({ label, error, helperText, className = '', ...props }) => {
  return (
    <div className={`eb-input-wrapper ${className}`}>
      {label && <label className="eb-label">{label}</label>}
      <textarea 
        className={`eb-input h-32 py-3 resize-none ${error ? 'border-red-500 ring-red-500/10 focus:border-red-500' : ''}`}
        {...props}
      />
      {error && <p className="text-xs text-red-500 mt-1 font-medium">{error}</p>}
      {helperText && !error && <p className="text-xs text-gray-500 mt-1">{helperText}</p>}
    </div>
  );
};
