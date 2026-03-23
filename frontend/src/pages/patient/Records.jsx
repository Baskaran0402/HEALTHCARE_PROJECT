import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import DocumentUpload from '../../components/patient/DocumentUpload';
import DocumentList from '../../components/patient/DocumentList';
import { 
  ShieldCheck, 
  Activity, 
  Database, 
  Cpu, 
  ChevronRight 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  ClinicalCard, 
  ClinicalBadge, 
  SectionHeader,
  StatCard
} from '../../components/ClinicalComponents';
import { AruviAILayout } from '../../components/ui/AruviAILayout';
import { useBreakpoint } from '../../hooks/useBreakpoint';

const PatientRecords = () => {
    const { patientId } = useParams();
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const { isMobile, isTablet } = useBreakpoint();

    const handleUploadComplete = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    return (
        <AruviAILayout activeTab="Records">
            <div className={`w-full max-w-7xl mx-auto ${isMobile ? 'px-4' : 'px-8'}`}>
                <div className="space-y-10 md:space-y-12 pb-24 pt-6 md:pt-10 text-center md:text-left">
                  
                  <SectionHeader 
                    badge="Lattice Vault v2.1 — Secured"
                    title={<>Clinical <span className="text-teal-600">Archive.</span></>}
                    subtitle="Multi-layer encrypted storage for longitudinal clinical history, lab reports, and radiological data."
                    actions={
                      <ClinicalBadge variant="success" className="font-black text-[9px] uppercase tracking-widest px-4 py-2">
                        <div className="flex items-center gap-2">
                          <ShieldCheck size={14} />
                          <span>AES-256 MASTER-GRADE</span>
                        </div>
                      </ClinicalBadge>
                    }
                  />

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
                      <div className="lg:col-span-4 space-y-8">
                          <DocumentUpload patientId={patientId || 'default_patient'} onUploadSuccess={handleUploadComplete} />
                          
                          <ClinicalCard className="bg-gradient-to-br from-teal-600 to-teal-800 text-white border-none shadow-premium group relative overflow-hidden p-8 md:p-10 text-center md:text-left">
                              <div className="absolute top-0 right-0 p-8 opacity-10">
                                  <Cpu size={100} className="text-white" />
                              </div>
                              <div className="relative z-10">
                                  <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center text-white mb-8 group-hover:scale-110 transition-transform shadow-xl mx-auto md:mx-0">
                                      <Activity size={28}/>
                                  </div>
                                  <h4 className="text-2xl font-black text-white font-display tracking-tight mb-4 leading-tight uppercase">Neural <br /> Interpretation</h4>
                                  <p className="text-xs font-bold text-teal-100/60 leading-relaxed uppercase tracking-widest mb-10 opacity-80">
                                      Activate AI parsing to automatically update clinical profiles based on recent diagnostics.
                                  </p>
                                  <button className="w-full py-4 bg-white text-teal-900 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-teal-50 transition-all flex items-center justify-center gap-3 shadow-lg cursor-pointer border-none">
                                      Initiate Parsing <ChevronRight size={14} />
                                  </button>
                              </div>
                          </ClinicalCard>
                      </div>

                      <div className="lg:col-span-8">
                          <DocumentList patientId={patientId || 'default_patient'} refreshTrigger={refreshTrigger} />
                      </div>
                  </div>
                </div>
            </div>
        </AruviAILayout>
    );
};

export default PatientRecords;
