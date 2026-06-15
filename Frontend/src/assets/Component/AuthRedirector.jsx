import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Home from './Auth/Home'; // Assuming Home is your landing page component

const AuthRedirector = () => {
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      // User is logged in, redirect to appropriate dashboard
      if (user.role === 'recruiter') {
        navigate('/recruiter-dashboard', { replace: true });
      } else {
        // Assuming 'candidate' or other roles go to the main dashboard
        navigate('/dashboard', { replace: true });
      }
    }
    // If user is null, Home component will be rendered
  }, [user, navigate]);

  return user ? null : <Home />; // Render Home only if no user is logged in
};

export default AuthRedirector;