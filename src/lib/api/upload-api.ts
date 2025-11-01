
import { API_BASE_URL } from '@/config/config';
import axios from 'axios';

// Special instance for file uploads (without Content-Type header)
export const uploadApi = axios.create({
  baseURL: API_BASE_URL,
});

// Add the same interceptors to uploadApi
uploadApi.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    // Don't set Content-Type for FormData - let browser set it automatically
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

uploadApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== 'undefined') {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/signin';
      }
    }
    return Promise.reject(error);
  }
);