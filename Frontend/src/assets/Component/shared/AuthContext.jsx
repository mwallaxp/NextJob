import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../../../utils/api';
import { USER_API_END_POINT } from '../../../utils/constant';

// Create auth context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state on component mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        // The browser will automatically send the 'token' cookie if it exists
        const response = await api.get('/api/v1/user/current');
        
        if (response.data.success) {
          setCurrentUser(response.data.user);
        }
      } catch (err) {
        // 401/404 means no valid cookie exists, which is fine for init
        console.log('Not authenticated via cookies');
        setCurrentUser(null);
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
      
      const response = await api.post('/api/users/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.data.success) {
        // Store token
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        
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
      const response = await api.post(`${USER_API_END_POINT}/login`, {
        email,
        password,
        role
      });
      
      if (response.data.success) {
        // Store token
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        
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
      await api.post(`${USER_API_END_POINT}/logout`);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Always clear local state regardless of API response
      localStorage.removeItem('token');
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
      
      const response = await api.put(`${USER_API_END_POINT}/profile`, formData, {
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