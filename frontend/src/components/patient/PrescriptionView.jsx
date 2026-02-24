import React from 'react';
import { FileText, Download, ShieldCheck, Printer, Clock } from 'lucide-react';
import { motion as Motion } from 'framer-motion';

const PrescriptionView = ({ prescription }) => {
    if (!prescription) return null;

    const formattedDate = new Date(prescription.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <Motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="enterprise-card h-full flex flex-col"
            style={{ padding: '0', overflow: 'hidden' }}
        >
            {/* Header / Meta */}
            <div className="bg-slate-50 border-b border-slate-100 p-6 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="bg-primary text-white p-2 rounded-xl">
                        <FileText size={20} />
                    </div>
                    <div>
                        <h4 className="font-black text-slate-800 text-sm uppercase tracking-tight">Digital Prescription</h4>
                        <p className="text-[10px] font-bold text-slate-500">{prescription.id} • Issued {formattedDate}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-400">
                        <Printer size={16} />
                    </button>
                    <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-400">
                        <Download size={16} />
                    </button>
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="p-8 flex-1 overflow-y-auto space-y-8">
                {/* Doctor Note */}
                <div className="bg-primary-light p-5 rounded-2xl border border-blue-100 flex gap-4">
                    <div className="text-primary mt-1">
                        <Clock size={20} />
                    </div>
                    <div>
                        <p className="text-xs font-black text-primary uppercase mb-1">Physician's Clinical Guidance</p>
                        <p className="text-sm text-slate-700 leading-relaxed font-medium">
                            {prescription.notes}
                        </p>
                    </div>
                </div>

                {/* Medicine List */}
                <div className="space-y-4">
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Prescribed Medications</h5>
                    <div className="space-y-3">
                        {prescription.medicines.map((med, idx) => (
                            <div key={idx} className="bg-white border border-slate-100 p-4 rounded-2xl flex justify-between items-center shadow-sm hover:border-primary/30 transition-colors">
                                <div className="flex gap-4 items-center">
                                    <div className="w-2 h-10 bg-primary/20 rounded-full"></div>
                                    <div>
                                        <h6 className="font-black text-slate-800 text-md">{med.name}</h6>
                                        <p className="text-xs font-bold text-slate-500 uppercase">{med.dosage} • {med.duration}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="bg-slate-100 px-3 py-1 rounded-full text-[10px] font-black text-slate-600 uppercase">
                                        {med.frequency}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Security Section */}
                <div className="pt-6 border-t border-slate-100">
                    <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl">
                        <ShieldCheck className="text-success" size={24} />
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cryptographic Attestation</p>
                            <code className="text-[9px] text-slate-500 font-mono break-all opacity-60">
                                {prescription.digital_signature}
                            </code>
                        </div>
                    </div>
                    <div className="mt-4 flex justify-between items-end">
                        <div className="text-left">
                            <p className="text-[10px] font-black text-slate-400 uppercase">Authorized Clinician</p>
                            <p className="text-sm font-black text-slate-800">Dr. {prescription.doctor_name}</p>
                        </div>
                        <div className="text-right italic font-serif text-slate-400 opacity-50 text-xl">
                            {prescription.doctor_name}
                        </div>
                    </div>
                </div>
            </div>
        </Motion.div>
    );
};

export default PrescriptionView;
