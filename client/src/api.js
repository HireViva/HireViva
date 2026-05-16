import axios from "axios";
import { getApiBaseUrl } from "./lib/apiConfig";

const baseURL = getApiBaseUrl();

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add error interceptor for debugging
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Handle authentication errors
      console.error('Authentication failed:', error.response.data);
    } else if (error.response?.status === 500) {
      console.error('Server error:', error.response.data);
    }
    return Promise.reject(error);
  }
);

export default api;
