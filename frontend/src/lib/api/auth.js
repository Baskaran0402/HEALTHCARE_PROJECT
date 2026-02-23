import apiClient from './client';

export const authService = {
  login: async (email, password, organizationId = null) => {
    const response = await apiClient.post('/api/auth/login', {
      email,
      password,
      organization_id: organizationId
    });
    return response.data;
  },
  
  register: async (userData) => {
    const response = await apiClient.post('/api/auth/register', userData);
    return response.data;
  },
  
  getMe: async () => {
    const response = await apiClient.get('/api/auth/me');
    return response.data;
  },

  logout: async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      await apiClient.post(`/api/auth/logout?refresh_token=${refreshToken}`);
    }
    localStorage.clear();
    window.location.href = '/login';
  }
};
