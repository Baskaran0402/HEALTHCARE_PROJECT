import api from './api';

const documentService = {
  getPatientDocuments: async (patientId) => {
    const response = await api.get(`/documents/patient/${patientId}`);
    return response.data;
  },

  upload: async (formData) => {
    const response = await api.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  download: async (documentId, fileName) => {
     const response = await api.get(`/documents/${documentId}/download`, {
       responseType: 'blob'
     });
     
     const url = window.URL.createObjectURL(new Blob([response.data]));
     const link = document.createElement('a');
     link.href = url;
     link.setAttribute('download', fileName);
     document.body.appendChild(link);
     link.click();
     link.remove();
  },

  delete: async (documentId) => {
    const response = await api.delete(`/documents/${documentId}`);
    return response.data;
  }
};

export default documentService;
