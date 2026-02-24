import apiClient from './client';

export const doctorService = {
  searchDoctors: async (params) => {
    const response = await apiClient.get('/api/doctors/search', { params });
    return response.data;
  },
  
  getDoctor: async (id) => {
    const response = await apiClient.get(`/api/doctors/${id}`);
    return response.data;
  },
  
  registerDoctor: async (doctorData) => {
    const response = await apiClient.post('/api/doctors/register', doctorData);
    return response.data;
  },
  
  updateDoctor: async (id, doctorData) => {
    const response = await apiClient.put(`/api/doctors/${id}`, doctorData);
    return response.data;
  },
  
  verifyLicense: async (id) => {
    const response = await apiClient.post(`/api/doctors/${id}/verify-license`);
    return response.data;
  },
};
