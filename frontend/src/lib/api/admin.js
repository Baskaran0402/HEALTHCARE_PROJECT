import apiClient from './client';

export const adminService = {
  getSystemStats: async () => {
    const response = await apiClient.get('/api/admin/system-stats');
    return response.data;
  },

  getPendingApprovals: async () => {
    const response = await apiClient.get('/api/admin/users/pending');
    return response.data;
  },
  
  approveUser: async (userId) => {
    const response = await apiClient.put(`/api/admin/users/${userId}/approve`);
    return response.data;
  },
  
  rejectUser: async (userId) => {
    const response = await apiClient.put(`/api/admin/users/${userId}/reject`);
    return response.data;
  },

  getAllUsers: async () => {
    const response = await apiClient.get('/api/admin/users');
    return response.data;
  },

  getAllOrganizations: async () => {
    const response = await apiClient.get('/api/admin/organizations');
    return response.data;
  }
};
