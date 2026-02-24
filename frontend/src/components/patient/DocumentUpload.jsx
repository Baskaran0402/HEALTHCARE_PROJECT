import React, { useState, useRef } from 'react';
import { Upload, X, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { documentService } from '../../lib/api/documents';

const DocumentUpload = ({ patientId, onUploadSuccess }) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [docType, setDocType] = useState('lab_report');
  
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
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <FileText size={20} className="text-blue-600"/>
        Upload Medical Document
      </h3>

      <div 
        className={`relative border-2 border-dashed rounded-xl p-8 transition-all text-center ${
          dragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-blue-400'
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
          <div className="space-y-4">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-blue-600">
              <Upload size={28}/>
            </div>
            <div>
              <button 
                onClick={() => inputRef.current.click()}
                className="text-blue-600 font-bold hover:underline"
              >
                Click to upload
              </button>
              <span className="text-slate-500"> or drag and drop</span>
              <p className="text-xs text-slate-400 mt-2">PDF, JPG, PNG (Max 10MB)</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between bg-slate-50 p-4 rounded-lg">
            <div className="flex items-center gap-3 overflow-hidden">
               <div className="bg-blue-200 p-2 rounded text-blue-700"><FileText size={20}/></div>
               <div className="text-left overflow-hidden">
                 <p className="font-bold text-slate-700 truncate">{file.name}</p>
                 <p className="text-xs text-slate-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
               </div>
            </div>
            <button onClick={() => setFile(null)} className="text-slate-400 hover:text-red-500">
              <X size={20}/>
            </button>
          </div>
        )}
      </div>

      {file && (
        <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-top-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Document Title</label>
              <input 
                type="text"
                className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Category</label>
              <select 
                className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
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
            className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
              uploading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {uploading ? (
              <><Loader2 size={20} className="animate-spin"/> Encrypting & Uploading...</>
            ) : (
              'Save to Secure Storage'
            )}
          </button>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center gap-2 border border-red-100">
          <AlertCircle size={16}/> {error}
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;
