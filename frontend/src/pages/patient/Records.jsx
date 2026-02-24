import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import DocumentUpload from '../../components/patient/DocumentUpload';
import DocumentList from '../../components/patient/DocumentList';
import { ShieldCheck, Lock, Activity } from 'lucide-react';
import Navbar from '../../components/Navbar';

const PatientRecords = () => {
    // In a real app, this would be the logged-in user's profile ID
    const { patientId } = useParams();
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleUploadComplete = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    return (
        <div className="records-page-wrapper">
            <Navbar />
            <div className="min-h-screen bg-slate-50 p-6 pt-32">
            <div className="max-w-6xl mx-auto space-y-8">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-200">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-[0.2em]">Medical Vault</span>
                            <div className="flex items-center gap-1 text-green-600 text-xs font-bold bg-green-50 px-2 py-0.5 rounded border border-green-100">
                                <ShieldCheck size={12} />
                                end-to-end encrypted
                            </div>
                        </div>
                        <h1 className="text-4xl font-extrabold font-heading text-slate-900 tracking-tight">Health Records</h1>
                        <p className="text-slate-500 mt-2 font-medium">Securely store and manage your lab reports, prescriptions, and radiology scans.</p>
                    </div>

                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                        <div className="bg-slate-50 p-3 rounded-xl text-slate-600">
                            <Lock size={20}/>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Security Level</p>
                            <p className="text-lg font-black text-slate-800">AES-256 Military Grade</p>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 space-y-6">
                        <DocumentUpload patientId={patientId || 'default_patient'} onUploadSuccess={handleUploadComplete} />
                        
                        <div className="bg-blue-900 text-white p-6 rounded-2xl shadow-xl space-y-4">
                            <div className="bg-blue-800/50 w-12 h-12 rounded-xl flex items-center justify-center">
                                <Activity size={24}/>
                            </div>
                            <h4 className="text-xl font-bold">Clinical Integration</h4>
                            <p className="text-blue-100 text-sm leading-relaxed">
                                Once uploaded, you can securely share reports with your doctor. Our AI Assistant can also parse these files to update your health profile automatically.
                            </p>
                            <button className="w-full bg-white text-blue-900 py-3 rounded-xl font-black text-sm uppercase tracking-wider hover:bg-blue-50 transition-colors">
                                Enable AI Parsing
                            </button>
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <DocumentList patientId={patientId || 'default_patient'} refreshTrigger={refreshTrigger} />
                    </div>
                </div>
                </div>
            </div>
        </div>
    );
};

export default PatientRecords;
