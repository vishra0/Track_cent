import axios from 'axios';

// Create axios instance with base URL
const instance = axios.create({
  baseURL: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
instance.interceptors.request.use(
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

// Add response interceptor to handle errors
instance.interceptors.response.use(
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

export default instance; 