import api from './api';

const analyticsService = {
  getDashboardMetrics: async () => {
    // Falls back to mock or actual endpoint depending on backend structure
    // Let's assume there's a /analytics/dashboard endpoint or we fetch patients and consultations
    try {
      const response = await api.get('/analytics/dashboard');
      return response.data;
    } catch (e) {
      // In case the endpoint doesn't exist yet, we can mock or throw
      console.warn("Analytics dashboard endpoint not found or failing, maybe implement in backend?", e);
      throw e;
    }
  },

  getModelPerformance: async () => {
    const response = await api.get('/analytics/model-performance');
    return response.data;
  },

  getPatientHistory: async (patientId) => {
    const response = await api.get(`/analytics/patients/${patientId}/history`);
    return response.data;
  }
};

export default analyticsService;
