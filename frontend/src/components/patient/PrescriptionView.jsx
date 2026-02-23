import React from 'react';
import { FileText, Download, ShieldCheck, Calendar, User, Pill } from 'lucide-react';

const PrescriptionView = ({ prescription }) => {
  if (!prescription) return null;

  return (
    <div className="bg-white rounded-[2rem] border-2 border-slate-50 shadow-xl overflow-hidden max-w-2xl mx-auto my-8 animate-in slide-in-from-bottom-8 duration-500">
      <div className="bg-slate-900 p-10 text-white flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <ShieldCheck size={18} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">Verified Digital Prescription</span>
          </div>
          <h2 className="text-3xl font-black uppercase tracking-tighter">Medical Rx</h2>
          <p className="text-slate-400 text-xs font-bold mt-1">ID: {prescription.id?.substring(0,8).toUpperCase()}</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-black uppercase text-slate-500 tracking-widest mb-1">Date Issued</p>
          <p className="font-bold text-lg">{new Date(prescription.created_at).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="p-10 space-y-8">
        <div className="grid grid-cols-2 gap-8 border-b border-slate-50 pb-8">
            <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Issuing Specialist</p>
                <div className="flex items-center gap-2">
                    <User size={14} className="text-blue-600" />
                    <p className="font-black text-slate-800 uppercase">Dr. {prescription.doctor_name || "Assigned Specialist"}</p>
                </div>
            </div>
            <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Clinical Context</p>
                <div className="flex items-center gap-2">
                    <FileText size={14} className="text-slate-400" />
                    <p className="font-bold text-slate-600">Post-Consultation Protocol</p>
                </div>
            </div>
        </div>

        <div className="space-y-6">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Prescribed Medication</h3>
            <div className="space-y-4">
                {prescription.medicines?.map((med, i) => (
                    <div key={i} className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-blue-200 transition-all">
                        <div className="flex gap-4 items-center">
                            <div className="bg-white p-3 rounded-xl shadow-sm text-blue-600 group-hover:scale-110 transition-transform">
                                <Pill size={24} />
                            </div>
                            <div>
                                <p className="font-black text-slate-900 uppercase text-sm tracking-tight">{med.name}</p>
                                <p className="text-slate-500 text-xs font-bold">{med.dosage} • {med.frequency}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Duration</p>
                            <p className="font-black text-blue-600">{med.duration}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {prescription.notes && (
            <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 italic text-slate-600 text-sm font-medium leading-relaxed">
                <p className="font-black uppercase text-[10px] tracking-widest text-amber-600 mb-2 not-italic">Doctor's Notes</p>
                "{prescription.notes}"
            </div>
        )}

        <div className="pt-8 border-t border-slate-100 flex justify-between items-center">
            <div className="text-[10px] text-slate-400 font-bold max-w-xs">
                This document is electronically signed and legally valid. Verification hash: {prescription.digital_signature?.substring(0,20)}...
            </div>
            <button className="bg-slate-900 text-white px-8 py-4 rounded-xl font-black uppercase text-xs tracking-widest flex items-center gap-2 hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 active:scale-95">
                <Download size={18} />
                Export PDF
            </button>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionView;
