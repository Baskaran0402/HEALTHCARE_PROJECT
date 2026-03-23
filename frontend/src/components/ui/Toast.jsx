import React, { useState, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, AlertCircle, Info, ShieldAlert } from 'lucide-react';

const ToastContext = createContext(null);

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = React.useCallback((message, type = 'success', duration = 5000) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-8 right-8 z-[2000] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`pointer-events-auto w-[calc(100vw-64px)] sm:w-auto sm:min-w-[320px] max-w-md bg-white rounded-2xl shadow-2xl border p-4 flex items-center gap-4 ${
                toast.type === 'success' ? 'border-emerald-100 shadow-emerald-500/5' :
                toast.type === 'error' ? 'border-red-100 shadow-red-500/5' :
                toast.type === 'warning' ? 'border-amber-100 shadow-amber-500/5' :
                'border-violet-100 shadow-violet-500/5'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                toast.type === 'success' ? 'bg-emerald-50 text-emerald-600' :
                toast.type === 'error' ? 'bg-red-50 text-red-600' :
                toast.type === 'warning' ? 'bg-amber-50 text-amber-600' :
                'bg-violet-50 text-violet-600'
              }`}>
                {toast.type === 'success' && <CheckCircle2 size={24} />}
                {toast.type === 'error' && <ShieldAlert size={24} />}
                {toast.type === 'warning' && <AlertCircle size={24} />}
                {toast.type === 'info' && <Info size={24} />}
              </div>
              
              <div className="flex-1 pr-2">
                 <p className="text-sm font-bold text-gray-900 leading-tight">{toast.message}</p>
              </div>

              <button 
                onClick={() => removeToast(toast.id)}
                className="p-1 text-gray-400 hover:text-gray-900 transition-colors"
              >
                <X size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
