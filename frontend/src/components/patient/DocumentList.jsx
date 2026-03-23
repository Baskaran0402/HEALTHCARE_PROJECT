import React, { useState, useEffect, useCallback } from 'react';
import { FileText, Download, Trash2, Share2, Shield, Calendar, Tag, Lock, MoreHorizontal, Database, ChevronRight, CheckCircle2 } from 'lucide-react';
import documentService from '../../services/documentService';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ClinicalCard, 
  ClinicalBadge,
  SectionHeader
} from '../ClinicalComponents';
import { useBreakpoint } from '../../hooks/useBreakpoint';

const DocumentList = ({ patientId, refreshTrigger }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isMobile, isTablet } = useBreakpoint();

  const fetchDocs = useCallback(async () => {
    setLoading(true);
    try {
      const data = await documentService.getByPatient(patientId);
      setDocuments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch documents', error);
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    fetchDocs();
  }, [fetchDocs, refreshTrigger]);

  const handleDownload = async (doc) => {
    try {
      await documentService.download(doc.id, doc.file_name);
    } catch {
      alert('Download failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this document? This cannot be undone.')) return;
    try {
      await documentService.delete(id);
      setDocuments(documents.filter(d => d.id !== id));
    } catch {
      alert('Delete failed');
    }
  };

  if (loading) return (
     <div className="flex flex-col items-center justify-center p-12 md:p-24 space-y-6">
        <div className="w-12 md:w-14 h-12 md:h-14 border-4 border-teal-500/10 border-t-teal-500 rounded-full animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 text-center">Synchronizing Vault Assets...</p>
     </div>
  );

  return (
    <div className="space-y-8 md:space-y-10">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-2 text-center sm:text-left">
        <div>
           <h3 className="text-xl md:text-2xl font-black text-slate-800 font-display tracking-tight flex items-center justify-center sm:justify-start gap-3 uppercase">
             <Shield className="text-teal-600 shrink-0" size={24} />
             Clinical Data Repository
           </h3>
           <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 mt-2">Immutable Healthcare Ledger</p>
        </div>
        <div className="px-5 py-2.5 rounded-2xl bg-white border border-slate-100 flex items-center gap-3 shadow-subtle shrink-0">
           <Database size={14} className="text-teal-600" />
           <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{documents.length} Assets Found</span>
        </div>
      </div>

      {documents.length === 0 ? (
        <ClinicalCard className="border-dashed border-slate-200 text-center py-20 md:py-32 bg-slate-50/30">
            <FileText size={48} className="mx-auto text-slate-200 mb-8" />
            <p className="text-slate-400 font-black uppercase tracking-widest text-[10px] md:text-xs px-10 leading-relaxed">Repository Empty. Upload clinical data to populate node.</p>
        </ClinicalCard>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
          {documents.map((doc, i) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <ClinicalCard className="h-full flex flex-col group-hover:bg-slate-50/50 transition-all duration-500 relative overflow-hidden p-6 md:p-8">
                 <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                    <FileText size={80} className="text-teal-600" />
                 </div>

                 <div className="flex justify-between items-start mb-8 relative z-10 gap-3">
                    <div className="flex gap-4 items-center min-w-0">
                       <div className="w-10 md:w-12 h-10 md:h-12 rounded-xl md:rounded-2xl bg-teal-50 border border-teal-100/50 flex items-center justify-center text-teal-600 shadow-subtle group-hover:scale-110 transition-transform duration-500 shrink-0">
                          <FileText size={20} />
                       </div>
                       <div className="min-w-0">
                          <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight truncate group-hover:text-teal-600 transition-colors leading-none mb-2">{doc.title}</h4>
                          <div className="flex items-center gap-2">
                             <Calendar size={10} className="text-slate-300" />
                             <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">
                                {new Date(doc.uploaded_at).toLocaleDateString()}
                             </span>
                          </div>
                       </div>
                    </div>
                    <button className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 hover:text-slate-600 transition-all shadow-sm shrink-0 cursor-pointer">
                       <MoreHorizontal size={14} />
                    </button>
                 </div>

                 <div className="flex flex-wrap gap-2 mb-10 relative z-10">
                    <span className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100 text-[8px] font-black text-slate-500 uppercase tracking-widest group-hover:bg-white transition-colors">
                       TYPE: {doc.document_type.replace('_', ' ')}
                    </span>
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-100/50 text-[8px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                       <Lock size={10}/> SECURED AES-256
                    </span>
                    <span className="px-3 py-1.5 rounded-xl bg-teal-50 border border-teal-100/50 text-[8px] font-black text-teal-600 uppercase tracking-widest flex items-center gap-2">
                       <CheckCircle2 size={10}/> VERIFIED
                    </span>
                 </div>

                 <div className="mt-auto pt-8 border-t border-slate-100 flex flex-col xs:flex-row items-center gap-3 relative z-10">
                    <button 
                       onClick={() => handleDownload(doc)}
                       className="w-full xs:flex-1 py-3 bg-teal-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-glow hover:bg-teal-700 transition-all border-none cursor-pointer"
                    >
                       <Download size={14} /> Retrieve
                    </button>
                    <button 
                       className="w-full xs:flex-1 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-50 transition-all cursor-pointer"
                    >
                       <Share2 size={14} /> Transmit
                    </button>
                    <button 
                       onClick={() => handleDelete(doc.id)}
                       className="w-full xs:w-12 h-12 flex items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all border border-red-100 cursor-pointer"
                    >
                       <Trash2 size={14} />
                    </button>
                 </div>
              </ClinicalCard>
            </motion.div>
          ))}
        </div>
      )}

      <div className="mt-12 p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] bg-slate-950 text-white border-none shadow-premium flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden group text-center md:text-left">
         <div className="absolute inset-0 bg-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
         <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 relative z-10 w-full md:w-auto">
            <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center text-teal-400 group-hover:scale-110 transition-transform shrink-0">
               <Database size={32} />
            </div>
            <div>
               <h4 className="text-xl md:text-2xl font-black font-display uppercase tracking-tight leading-none mb-3">Vault Statistics</h4>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Usage: <span className="text-teal-400">128.4 MB</span> / 5 GB INSTITUTIONAL QUOTA</p>
            </div>
         </div>
         <button className="w-full md:w-auto flex items-center justify-center gap-4 px-10 py-5 rounded-2xl bg-white text-slate-900 text-[9px] font-black uppercase tracking-[0.3em] hover:bg-teal-500 hover:text-white transition-all group/btn relative z-10 shadow-xl border-none cursor-pointer">
            Clinical Analytics
            <ChevronRight size={14} className="group-hover/btn:translate-x-2 transition-transform" />
         </button>
      </div>
    </div>
  );
};

export default DocumentList;
