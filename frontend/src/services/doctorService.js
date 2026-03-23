import api from './api';

const doctorService = {
  searchDoctors: async (params) => {
    const response = await api.get('/doctors/search', { params });
    return response.data;
  },
  
  getDoctor: async (id) => {
    const response = await api.get(`/doctors/${id}`);
    return response.data;
  },
  
  registerDoctor: async (doctorData) => {
    const response = await api.post('/doctors/register', doctorData);
    return response.data;
  },
  
  updateDoctor: async (id, doctorData) => {
    const response = await api.put(`/doctors/${id}`, doctorData);
    return response.data;
  },
  
  verifyLicense: async (id) => {
    const response = await api.post(`/doctors/${id}/verify-license`);
    return response.data;
  },

  getNearbyDoctors: async (lat, lng, radius, specialization) => {
    const response = await api.get('/doctors/nearby', {
      params: { lat, lng, radius, specialization }
    });
    return response.data;
  }
};

export default doctorService;
