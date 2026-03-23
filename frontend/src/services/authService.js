import api from './api';

const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('refresh_token', response.data.refresh_token);
      
      // Map role explicitly if not provided
      const user = response.data.user || {};
      // Normalize and map roles for consistent frontend access
      if (!user.role) {
        user.role = email.includes('admin') ? 'institution' : 
                    (email.includes('doctor') || email.toLowerCase().includes('dr.')) ? 'doctor' : 
                    'patient';
      }
      
      if (user.role && (user.role.includes('admin') || user.role === 'org_admin') && user.role !== 'super_admin') {
        user.role = 'institution';
      }

      localStorage.setItem('user', JSON.stringify(user));
    }
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  logout: async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken) {
      try {
        await api.post('/auth/logout', { refresh_token: refreshToken });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    const user = response.data;
    
    // Safety check for role normalization
    if (!user.role) {
      user.role = user.email?.includes('admin') ? 'institution' : 
                  (user.email?.includes('doctor') || user.email?.toLowerCase().includes('dr.')) ? 'doctor' : 
                  'patient';
    }
    
    if (user.role && (user.role.includes('admin') || user.role === 'org_admin') && user.role !== 'super_admin') {
      user.role = 'institution';
    }
    
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('access_token');
  },

  getStoredUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  googleLogin: async (googleToken) => {
    const response = await api.post('/auth/google', { token: googleToken });
    if (response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('refresh_token', response.data.refresh_token);
    }
    return response.data;
  }
};

export default authService;
