import apiClient from './client';

export const documentService = {
  upload: async (formData) => {
    const response = await apiClient.post('/api/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  getPatientDocuments: async (patientId) => {
    const response = await apiClient.get(`/api/documents/patient/${patientId}`);
    return response.data;
  },
  
  getDocument: async (id) => {
    const response = await apiClient.get(`/api/documents/${id}`);
    return response.data;
  },
  
  download: async (id, fileName) => {
    const response = await apiClient.get(`/api/documents/${id}/download`, {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },
  
  delete: async (id) => {
    await apiClient.delete(`/api/documents/${id}`);
  },
  
  share: async (id, shareData) => {
    const response = await apiClient.post(`/api/documents/${id}/share`, shareData);
    return response.data;
  },
};
