import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { USER_API_END_POINT } from '../../../utils/constant';

// Create auth context
const AuthContext = createContext();

// API base URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state on component mount
  useEffect(() => {
    const initAuth = async () => {
      // Check for existing token in localStorage
      const token = localStorage.getItem('token');
      
      if (token) {
        // Set default auth header
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        try {
          // Validate token and fetch current user
          const response = await axios.get(`${API_URL}/api/users/current`);
          
          if (response.data.success) {
            setCurrentUser(response.data.user);
          } else {
            // Clear invalid token
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
          }
        } catch (err) {
          console.error('Authentication error:', err);
          // Clear token on auth error
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
        }
      }
      
      setLoading(false);
    };

    initAuth();
  }, []);

  // Register a new user
  const register = async (userData, profilePhoto) => {
    setError(null);
    try {
      // Create form data for file upload
      const formData = new FormData();
      
      // Add user data to form
      Object.keys(userData).forEach(key => {
        formData.append(key, userData[key]);
      });
      
      // Add profile photo if provided
      if (profilePhoto) {
        formData.append('profilePhoto', profilePhoto);
      }
      
      const response = await axios.post(`${API_URL}/api/users/register`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.data.success) {
        // Store token
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        
        // Set default auth header
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Update current user
        setCurrentUser(user);
        return { success: true };
      } else {
        setError(response.data.message);
        return { success: false, message: response.data.message };
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  // Login user
  const login = async (email, password, role) => {
    setError(null);
    try {
      const response = await axios.post(`${USER_API_END_POINT}/login`, {
        email,
        password,
        role
      });
      
      if (response.data.success) {
        // Store token
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        
        // Set default auth header
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Update current user
        setCurrentUser(user);
        return { success: true };
      } else {
        setError(response.data.message);
        return { success: false, message: response.data.message };
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  // Logout user
  const logout = async () => {
    try {
      await axios.post(`${USER_API_END_POINT}/logout`);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Always clear local state regardless of API response
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      setCurrentUser(null);
    }
  };

  // Update user profile
  const updateProfile = async (profileData, resume) => {
    setError(null);
    try {
      // Create form data for file upload
      const formData = new FormData();
      
      // Add profile data to form
      Object.keys(profileData).forEach(key => {
        formData.append(key, profileData[key]);
      });
      
      // Add resume file if provided
      if (resume) {
        formData.append('resume', resume);
      }
      
      const response = await axios.put(`${USER_API_END_POINT}/profile`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.data.success) {
        // Update current user with new data
        setCurrentUser(response.data.user);
        return { success: true };
      } else {
        setError(response.data.message);
        return { success: false, message: response.data.message };
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Profile update failed';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  // Context value
  const value = {
    currentUser,
    loading,
    error,
    register,
    login,
    logout,
    updateProfile,
    isAuthenticated: !!currentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};