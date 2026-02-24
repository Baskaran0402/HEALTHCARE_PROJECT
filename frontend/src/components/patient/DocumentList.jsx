import React, { useState, useEffect, useCallback } from 'react';
import { FileText, Download, Trash2, Share2, Shield, Calendar, Tag, Lock } from 'lucide-react';
import { documentService } from '../../lib/api/documents';

const DocumentList = ({ patientId, refreshTrigger }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDocs = useCallback(async () => {
    try {
      const data = await documentService.getPatientDocuments(patientId);
      setDocuments(data);
    } catch (error) {
      console.error('Failed to fetch documents', error);
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

  if (loading) return <div className="text-center p-10 text-slate-400">Loading your medical vault...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Shield size={20} className="text-green-600" />
          Secure Medical Vault
        </h3>
        <span className="text-xs bg-slate-100 px-3 py-1 rounded-full font-bold text-slate-500 uppercase">
          {documents.length} Documents
        </span>
      </div>

      {documents.length === 0 ? (
        <div className="bg-slate-50 border-2 border-dashed border-slate-200 p-12 rounded-2xl text-center">
            <p className="text-slate-500">No documents found. Upload your reports to keep them secure.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {documents.map((doc) => (
            <div key={doc.id} className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all group border-l-4 border-l-blue-500">
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors uppercase text-sm tracking-tight">{doc.title}</h4>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                      <Calendar size={12}/> {new Date(doc.uploaded_at).toLocaleDateString()}
                    </p>
                    <div className="flex gap-2 mt-2">
                       <span className="text-[10px] bg-slate-50 text-slate-600 px-2 py-0.5 rounded border border-slate-100 font-bold uppercase">
                         {doc.document_type.replace('_', ' ')}
                       </span>
                       {doc.is_encrypted && (
                         <span className="text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded border border-green-100 font-bold flex items-center gap-0.5">
                           <Lock size={8}/> AES-256
                         </span>
                       )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                  <button 
                    onClick={() => handleDownload(doc)}
                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Download decrypted"
                  >
                    <Download size={18} />
                  </button>
                  <button 
                    className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                    title="Share with doctor"
                  >
                    <Share2 size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(doc.id)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete permanently"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentList;
