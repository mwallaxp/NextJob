import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Home from './Auth/Home'; // Assuming Home is your landing page component
import { getDashboardRouteForRole } from '../../routes/paths';

const AuthRedirector = () => {
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate(getDashboardRouteForRole(user.role), { replace: true });
    }
    // If user is null, Home component will be rendered
  }, [user, navigate]);

  return user ? null : <Home />; // Render Home only if no user is logged in
};

export default AuthRedirector;
