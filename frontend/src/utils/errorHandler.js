export const handleApiError = (error) => {
  // If it's a validation error from Zod or backend schema
  if (error.response?.data?.detail) {
    // Array of details implies validation errors, else it might be a simple string
    if (Array.isArray(error.response.data.detail)) {
      return error.response.data.detail.map((err) => err.msg || err.message).join(", ");
    }
    return error.response.data.detail;
  }

  // If it's a generic axios error
  if (error.message) {
    if (error.message === "Network Error") {
      return "Network Error: Please check your internet connection or server status.";
    }
    return error.message;
  }

  return "An unexpected error occurred.";
};
