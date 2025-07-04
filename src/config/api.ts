import axios from 'axios';

// Get the API base URL from environment variables
const getApiBaseUrl = (): string => {
  // In development, use the proxy (relative URLs)
  if (import.meta.env.DEV) {
    return '';
  }
  
  // In production, use the environment variable or fallback
  return import.meta.env.VITE_API_BASE_URL || 'https://your-backend-url.com/api';
};

// Create axios instance with base configuration
const api = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// Export the base URL for debugging
export const API_BASE_URL = getApiBaseUrl();