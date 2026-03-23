import React, { useState } from 'react';
import { X, ArrowRight, Loader2, ShieldCheck, Mail, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ClinicalCard, 
  ClinicalBadge, 
  ClinicalInput 
} from './ClinicalComponents';

const SignupModal = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
        setLoading(false);
        onClose();
        navigate('/register');
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-xl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="w-full max-w-[550px]"
      >
        <ClinicalCard className="p-12 md:p-16 border-teal-500/10 shadow-premium relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
             <ShieldCheck size={120} className="text-teal-600" />
          </div>

          <button 
            onClick={onClose} 
            className="absolute top-8 right-8 w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all z-20 shadow-sm"
          >
            <X size={20} />
          </button>

          <div className="relative z-10 mb-12">
            <div className="flex items-center gap-2 mb-6">
               <span className="w-2 h-2 rounded-full bg-teal-500" />
               <p className="text-[10px] font-black uppercase tracking-[0.3em] text-teal-600">Institutional Access</p>
            </div>
            <h2 className="text-4xl md:text-5xl font-black font-display text-slate-900 tracking-tight leading-none mb-6">
              Create <span className="text-teal-600">Identity.</span>
            </h2>
            <p className="text-slate-400 font-medium text-sm leading-relaxed max-w-sm">
              Initialize your clinical credentials within the eBpages Professional lattice for verified AI diagnostics.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
              <div className="grid grid-cols-2 gap-6">
                  <ClinicalInput 
                    label="P-Name"
                    placeholder="First*"
                    required
                  />
                  <ClinicalInput 
                    label="S-Name"
                    placeholder="Last*"
                    required
                  />
              </div>
              
              <ClinicalInput 
                label="Nodal Address"
                placeholder="name@institution.com*"
                required
                type="email"
              />

              <button 
                disabled={loading} 
                className="w-full h-16 bg-teal-600 text-white font-black text-[11px] uppercase tracking-[0.25em] rounded-2xl flex items-center justify-center gap-4 shadow-glow hover:bg-teal-700 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    Initialize Credentials 
                    <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                  </>
                )}
              </button>
          </form>

          <div className="mt-12 text-center pt-10 border-t border-slate-50 relative z-10">
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
              Existing verified entity?{' '}
              <a href="/login" className="text-teal-600 hover:text-teal-700 transition-colors">Sign In Portal</a>
            </p>
          </div>
        </ClinicalCard>
      </motion.div>
    </div>
  );
};

export default SignupModal;
