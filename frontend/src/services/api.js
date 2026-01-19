import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const healthAPI = {
  // Health check
  checkHealth: async () => {
    const response = await api.get("/health");
    return response.data;
  },

  // Complete health analysis
  analyzeHealth: async (data) => {
    const response = await api.post("/api/analyze", data);
    return response.data;
  },

  // Create patient
  createPatient: async (patientData) => {
    const response = await api.post("/api/patients", patientData);
    return response.data;
  },

  // Get patient
  getPatient: async (patientId) => {
    const response = await api.get(`/api/patients/${patientId}`);
    return response.data;
  },

  // Create consultation
  createConsultation: async (consultationData) => {
    const response = await api.post("/api/consultations", consultationData);
    return response.data;
  },

  // Update consultation
  updateConsultation: async (consultationId, updateData) => {
    const response = await api.patch(
      `/api/consultations/${consultationId}`,
      updateData,
    );
    return response.data;
  },

  // Get SHAP explanation (returns base64 string)
  getSHAPExplanation: async (patientData) => {
    // Expects dict with patient features
    const response = await api.post("/api/explain/heart", patientData);
    return response.data;
  },

  // Generate PDF Report (returns blob)
  generatePDF: async (analysisData) => {
    // Expects AnalyzeHealthResponse
    const response = await api.post("/api/generate-pdf", analysisData, {
      responseType: "blob", // Important for handling binary file
    });
    return response.data;
  },

  // Chat with Kira
  chatWithKira: async (chatData) => {
    const response = await api.post("/api/chat/", chatData);
    return response.data;
  },

  // Book appointment
  bookAppointment: async (appointmentData) => {
    const response = await api.post("/api/chat/appointments", appointmentData);
    return response.data;
  },
};

export default api;
