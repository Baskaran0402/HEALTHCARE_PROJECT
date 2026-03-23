import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, subtitle, children, footer, size = 'md' }) => {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-xl',
    lg: 'max-w-3xl',
    xl: 'max-w-5xl',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={`relative bg-white w-full ${sizes[size]} rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100`}
          >
            {/* Header */}
            <div className="px-10 pt-10 pb-6 flex items-start justify-between">
               <div>
                  {title && <h3 className="text-2xl font-bold font-display text-gray-900 tracking-tight">{title}</h3>}
                  {subtitle && <p className="text-sm text-gray-500 font-medium mt-1">{subtitle}</p>}
               </div>
               <button 
                 onClick={onClose}
                 className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all"
               >
                  <X size={24} />
               </button>
            </div>

            {/* Content */}
            <div className="px-10 pb-10">
               {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className="px-10 py-6 bg-gray-50/50 border-t border-gray-100 flex items-center justify-end gap-3">
                 {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
