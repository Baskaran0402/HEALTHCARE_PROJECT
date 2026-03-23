import api from './api';

const chatService = {
  chatWithKira: async (chatData) => {
    const response = await api.post('/chat', chatData);
    return response.data;
  },

  bookAppointment: async (appointmentData) => {
    const response = await api.post('/chat/appointments', appointmentData);
    return response.data;
  }
};

export default chatService;
