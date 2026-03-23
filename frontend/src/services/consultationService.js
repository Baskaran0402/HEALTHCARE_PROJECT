import api from './api';

const consultationService = {
  // Primary analysis endpoint
  analyzeHealth: async (analysisData) => {
    const response = await api.post('/analyze', analysisData);
    return response.data;
  },

  // Brain tumor specific analysis
  analyzeBrainTumor: async (formData, queryParams = '') => {
    // Expects FormData with 'file', 'patient_name', 'age', 'gender'
    const response = await api.post(`/analyze/brain-tumor${queryParams}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  createConsultation: async (data) => {
    const response = await api.post('/consultations', data);
    return response.data;
  },

  getConsultation: async (id) => {
    const response = await api.get(`/consultations/${id}`);
    return response.data;
  },

  listConsultations: async (skip = 0, limit = 100) => {
    const response = await api.get('/consultations', { params: { skip, limit } });
    return response.data;
  },

  // Update consultation stage or context
  updateConsultation: async (id, updateData) => {
    const response = await api.patch(`/consultations/${id}`, updateData);
    return response.data;
  },

  // Get SHAP explanations
  getSHAPExplanation: async (patientData) => {
    const response = await api.post('/explain/heart', patientData);
    return response.data;
  },

  // Generate Report PDF
  generatePDF: async (analysisResults) => {
    const response = await api.post('/generate-pdf', analysisResults, {
      responseType: 'blob'
    });
    return response.data;
  },

  // Human Doctor Consultations
  requestConsultation: async (data) => {
    const response = await api.post('/consultations/request', data);
    return response.data;
  },

  getPatientConsultations: async (patientId) => {
    const response = await api.get(`/consultations/patient/${patientId}`);
    return response.data;
  },

  getDoctorConsultations: async (doctorId) => {
    const response = await api.get(`/consultations/doctor/${doctorId}`);
    return response.data;
  }
};

export default consultationService;
