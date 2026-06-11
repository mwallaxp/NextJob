import axios from 'axios';
import { toast } from 'react-toastify';

// Centralized API URL
const API_URL = import.meta.env.VITE_API_URL || 'https://nextjob-sw2d.onrender.com';

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000, // Global timeout set to 30 seconds
  withCredentials: true, // Automatically send cookies with every request
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach Bearer token if it exists in localStorage
// This is useful if your backend supports both Cookies and Header-based Auth
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

// Response Interceptor: Handle global errors like 401 Unauthorized
api.interceptors.response.use(
  (response) => {
    // Return the response if it's successful
    return response;
  },
  (error) => {
    // Check if the error response exists and the status is 401 (Unauthorized)
    if (error.response && error.response.status === 401 && !error.config?.skipAuthRedirect) {
      // Clear the local token as it's no longer valid
      localStorage.removeItem('token');
      
      // Redirect the user to the login page if they aren't already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    // Handle Request Timeout specifically
    if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
      toast.error('Request Timed Out. Please check your internet connection.');
    } else if (!error.response) {
      // Handle cases where the server is down or the user is offline
      toast.error('Network Error: Unable to connect to the server. Please check your connection.');
    }

    // Always return a rejected promise to allow local catch blocks to execute if needed
    return Promise.reject(error);
  }
);

export default api;
