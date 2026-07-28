// src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:5062/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✅ Token attached:', token.substring(0, 20) + '...'); // Debug
    } else {
      console.warn('⚠️ No token found in localStorage');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 without redirecting immediately
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('⚠️ 401 Unauthorized:', error.config.url);
      // Only redirect if not already on login page
      if (window.location.pathname !== '/login') {
        // Clear token and redirect to login
        localStorage.removeItem('authToken');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;