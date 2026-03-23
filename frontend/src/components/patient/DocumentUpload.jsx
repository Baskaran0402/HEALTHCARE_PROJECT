import React, { useState, useRef } from 'react';
import { Upload, X, FileText, CheckCircle, AlertCircle, Loader2, ShieldCheck, Cpu } from 'lucide-react';
import documentService from '../../services/documentService';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ClinicalCard, 
  ClinicalBadge, 
  ClinicalInput, 
  ClinicalTextArea 
} from '../ClinicalComponents';
import { useBreakpoint } from '../../hooks/useBreakpoint';

const DocumentUpload = ({ patientId, onUploadSuccess }) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [docType, setDocType] = useState('lab_report');
  const { isMobile, isTablet } = useBreakpoint();
  
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (selectedFile) => {
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File too large. Max 10MB.');
      return;
    }
    setFile(selectedFile);
    setTitle(selectedFile.name.split('.')[0]);
    setError('');
  };

  const handleUpload = async () => {
    if (!file || !title) return;
    
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('patient_id', patientId);
    formData.append('title', title);
    formData.append('document_type', docType);
    
    try {
      await documentService.upload(formData);
      setFile(null);
      setTitle('');
      if (onUploadSuccess) onUploadSuccess();
    } catch (err) {
      setError(err.response?.data?.detail || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <ClinicalCard className="relative overflow-hidden group p-6 md:p-10">
      <div className="absolute top-0 right-0 p-6 opacity-5">
         <Upload size={isMobile ? 60 : 80} className="text-teal-600" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-8 md:mb-10 text-left">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-100/50 flex items-center justify-center text-teal-600 group-hover:scale-110 transition-transform shadow-subtle shrink-0">
             <FileText size={22}/>
          </div>
          <div className="min-w-0">
             <h3 className="text-lg md:text-xl font-black text-slate-800 font-display tracking-tight uppercase truncate">Ingest Document</h3>
             <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 mt-1.5">Binary Stream Analysis</p>
          </div>
        </div>

        <div 
          className={`relative border-2 border-dashed rounded-3xl md:rounded-[2.5rem] p-8 md:p-12 transition-all text-center ${
            dragActive ? 'border-teal-500 bg-teal-50' : 'border-slate-100 hover:border-teal-300 bg-slate-50/50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            multiple={false}
            onChange={handleChange}
            accept=".pdf,.jpg,.png,.jpeg"
          />

          {!file ? (
            <div className="space-y-6">
              <div className="w-14 md:w-16 h-14 md:h-16 rounded-2xl bg-white border border-slate-100 flex items-center justify-center mx-auto text-teal-500 shadow-premium group-hover:scale-110 transition-transform duration-500">
                <Upload size={isMobile ? 24 : 28}/>
              </div>
              <div>
                <button 
                  onClick={() => inputRef.current.click()}
                  className="text-slate-800 font-black uppercase tracking-widest text-[10px] hover:text-teal-600 transition-colors cursor-pointer border-none bg-transparent"
                >
                  {isMobile ? 'Touch to Upload' : 'Terminate Drag & Click to Upload'}
                </button>
                <p className="text-[8px] text-slate-400 mt-4 uppercase tracking-[0.2em] font-black">PDF, JPG, PNG (Max 10MB)</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-between bg-white border border-slate-100 p-5 md:p-6 rounded-2xl shadow-subtle gap-4">
              <div className="flex items-center gap-4 min-w-0 w-full">
                 <div className="bg-teal-50 w-11 h-11 rounded-xl flex items-center justify-center text-teal-600 shrink-0 shadow-sm">
                   <FileText size={20}/>
                 </div>
                 <div className="text-left min-w-0">
                   <p className="font-black text-slate-800 uppercase tracking-tight truncate text-xs">{file.name}</p>
                   <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{(file.size / (1024 * 1024)).toFixed(2)} MB • Verified Binary</p>
                 </div>
              </div>
              <button onClick={() => setFile(null)} className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all cursor-pointer shrink-0">
                <X size={18}/>
              </button>
            </div>
          )}
        </div>

        <AnimatePresence>
          {file && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-8 md:mt-10 space-y-6"
            >
              <div className="space-y-6">
                <ClinicalInput 
                  label="Identification"
                  placeholder="Document Title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />

                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Classifier</label>
                  <select 
                    className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] font-bold tracking-widest uppercase text-slate-700 px-5 outline-none focus:border-teal-500/40 focus:ring-4 focus:ring-teal-500/5 transition-all appearance-none cursor-pointer"
                    value={docType}
                    onChange={(e) => setDocType(e.target.value)}
                  >
                    <option value="lab_report">Lab Report</option>
                    <option value="radiology">Radiology (X-Ray/CT/MRI)</option>
                    <option value="prescription">Prescription</option>
                    <option value="discharge">Discharge Summary</option>
                    <option value="vaccination">Vaccination Record</option>
                  </select>
                </div>
              </div>

              <button 
                onClick={handleUpload}
                disabled={uploading}
                className={`w-full py-5 rounded-2xl bg-teal-600 text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-glow hover:bg-teal-700 transition-all flex items-center justify-center gap-3 border-none cursor-pointer ${
                  uploading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {uploading ? (
                  <>
                    <Loader2 size={16} className="animate-spin text-white"/>
                    <span>Encrypting Stream...</span>
                  </>
                ) : (
                  <span>Commit to Secure Storage</span>
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 p-5 bg-red-50 text-red-500 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 border border-red-100 shadow-sm"
            >
              <AlertCircle size={16}/> {error}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ClinicalCard>
  );
};

export default DocumentUpload;
