import apiClient from './client';

export const consultationService = {
  requestConsultation: async (data) => {
    const response = await apiClient.post('/api/consultations/request', data);
    return response.data;
  },
  
  getConsultation: async (id) => {
    const response = await apiClient.get(`/api/consultations/${id}`);
    return response.data;
  },
  
  updateStatus: async (id, status) => {
    const response = await apiClient.put(`/api/consultations/${id}/status`, null, {
      params: { status_update: status }
    });
    return response.data;
  },
  
  getPatientConsultations: async (patientId) => {
    const response = await apiClient.get(`/api/consultations/patient/${patientId}`);
    return response.data;
  },
  
  getDoctorConsultations: async (doctorId) => {
    const response = await apiClient.get(`/api/consultations/doctor/${doctorId}`);
    return response.data;
  },
  
  startVideo: async (id) => {
    const response = await apiClient.post(`/api/consultations/${id}/start-video`);
    return response.data;
  },
  
  getVideoToken: async (id) => {
    const response = await apiClient.get(`/api/consultations/${id}/video-token`);
    return response.data;
  },
};
