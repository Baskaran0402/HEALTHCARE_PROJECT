import api from './api';

const dashboardService = {
  getSystemMetrics: async () => {
    const response = await api.get('/analytics/dashboard');
    return response.data;
  },
  
  getExecutionLogs: async (limit = 10) => {
    const response = await api.get('/analytics/logs', { params: { limit } });
    return response.data;
  },

  getNeuralThroughput: async (range = '7D') => {
    const response = await api.get('/analytics/throughput', { params: { range } });
    return response.data;
  }
};

export default dashboardService;
