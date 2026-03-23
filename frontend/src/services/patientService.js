import api from './api';

const patientService = {
  createPatient: async (patientData) => {
    const response = await api.post('/patients', patientData);
    return response.data;
  },

  getPatient: async (id) => {
    const response = await api.get(`/patients/${id}`);
    return response.data;
  },

  listPatients: async (skip = 0, limit = 100) => {
    const response = await api.get('/patients', { params: { skip, limit } });
    return response.data;
  },

  getPatientHistory: async (patientId) => {
    const response = await api.get(`/analytics/patients/${patientId}/history`);
    return response.data;
  },

  getPatientRecords: async (patientId) => {
    const response = await api.get(`/patients/${patientId}/medical-records`);
    return response.data;
  },

  getPatientAssessments: async (patientId) => {
    const response = await api.get(`/patients/${patientId}/assessments`);
    return response.data;
  }
};

export default patientService;
