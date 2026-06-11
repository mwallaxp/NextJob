import { createContext, useContext, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, setLoading as setReduxLoading } from '../../../redux/authSlice';
import api from '../../../utils/api';
import { USER_API_END_POINT } from '../../../utils/constant';

// Create auth context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      
      const response = await api.post(`${USER_API_END_POINT}/registration`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.data.success) {
        // Store token
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        
        // Update current user
        dispatch(setUser(user));
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
        dispatch(setUser(user));
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
      await api.get(`${USER_API_END_POINT}/logout`);
      localStorage.removeItem('token');
      sessionStorage.removeItem('adminOriginalToken'); // Ensure shadow token is cleared on logout
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Always clear local state regardless of API response
      localStorage.removeItem('token');
      dispatch(setUser(null));
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
      
      const response = await api.post(`${USER_API_END_POINT}/profile/update`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.data.success) {
        // Update current user with new data
        dispatch(setUser(response.data.user));
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

  // Admin shadow login as another user
  const shadowLogin = async (userId) => {
    setError(null);
    try {
      // Store the current admin token before switching
      const adminToken = localStorage.getItem('token');
      if (adminToken) {
        sessionStorage.setItem('adminOriginalToken', adminToken);
      }

      const response = await api.post(`/api/v1/admin/shadow-login/${userId}`);
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        dispatch(setUser(response.data.user)); // Update Redux with shadow user's data
        return { success: true };
      } else {
        setError(response.data.message);
        return { success: false, message: response.data.message };
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Shadow login failed';
      setError(errorMessage);
      // Revert token if shadow login fails
      const originalToken = sessionStorage.getItem('adminOriginalToken');
      if (originalToken) {
        localStorage.setItem('token', originalToken);
        sessionStorage.removeItem('adminOriginalToken');
        // Optionally re-fetch admin user data here
      }
      return { success: false, message: errorMessage };
    }
  };

  // Exit shadow mode and revert to admin session
  const exitShadowMode = async () => {
    const originalAdminToken = sessionStorage.getItem('adminOriginalToken');
    localStorage.setItem('token', originalAdminToken);
    sessionStorage.removeItem('adminOriginalToken');
    
    // Re-fetch the actual admin data to sync Redux
    try {
      const response = await api.get(`${USER_API_END_POINT}/current`);
      if (response.data.success) {
        dispatch(setUser(response.data.user));
      }
    } catch (err) {
      console.error("Failed to restore admin profile", err);
      dispatch(setUser(null));
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
    shadowLogin,
    exitShadowMode,
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
