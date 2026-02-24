import React, { useState } from 'react';
import { CreditCard, Lock, CheckCircle, Loader2, ShieldCheck, ArrowRight } from 'lucide-react';
import apiClient from '../../lib/api/client';

const PaymentModal = ({ consultationId, amount, on鼓Success }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
        const response = await apiClient.post('/api/payments/process', {
            consultation_id: consultationId,
            amount,
            payment_method: 'card'
        });
        
        if (response.data.status === 'completed') {
            setSuccess(true);
            setTimeout(() => on鼓Success(), 2000);
        }
    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        {!success ? (
          <div className="p-8 space-y-6">
            <div className="flex justify-between items-center">
              <div className="bg-blue-50 p-3 rounded-2xl text-blue-600">
                <CreditCard size={24} />
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Amount</p>
                <p className="text-2xl font-black text-slate-900">${amount}</p>
              </div>
            </div>

            <div className="space-y-4">
               <div>
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Card Holder</label>
                 <input type="text" className="w-full mt-1 p-4 bg-slate-50 border border-slate-100 rounded-xl font-bold uppercase text-xs" defaultValue="DEMO PATIENT" readOnly />
               </div>
               <div>
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Card Number</label>
                 <div className="relative">
                    <input type="text" className="w-full mt-1 p-4 bg-slate-50 border border-slate-100 rounded-xl font-bold tracking-[0.2em]" defaultValue="**** **** **** 4482" readOnly />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300">
                        <Lock size={16} />
                    </div>
                 </div>
               </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
                <ShieldCheck className="text-green-600" size={20} />
                <p className="text-[10px] text-slate-500 font-bold leading-tight">Secured by AES-256 Enterprise Encryption. Payment processed via verified gateway.</p>
            </div>

            <button 
                onClick={handlePayment}
                disabled={loading}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 hover:bg-black transition-all active:scale-95 shadow-xl shadow-slate-200"
            >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <>Confirm Payment <ArrowRight size={16} /></>}
            </button>
          </div>
        ) : (
          <div className="p-12 text-center space-y-6 animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600 border-4 border-green-50">
                <CheckCircle size={40} />
            </div>
            <div>
                <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Payment Verified</h3>
                <p className="text-slate-400 font-bold text-xs mt-2">Consultation unlocked. Redirecting...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
