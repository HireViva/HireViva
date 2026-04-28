import axios from "axios";

// Determine API URL based on environment
let baseURL;

if (import.meta.env.VITE_API_URL) {
  baseURL = `${import.meta.env.VITE_API_URL}/api`;
} else if (import.meta.env.MODE === 'production') {
  // Production fallback - use current domain
  const protocol = window.location.protocol;
  const host = window.location.host;
  // If on Vercel frontend, route to backend
  if (host.includes('vercel.app')) {
    baseURL = `${protocol}//hireviva-api.onrender.com/api`;
  } else {
    baseURL = `${protocol}//${host}/api`;
  }
} else {
  // Development
  baseURL = 'http://localhost:5000/api';
}

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
