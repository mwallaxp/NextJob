import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

/**
 * ProtectedRoute handles authentication and role-based authorization.
 * Prevents unauthorized access and redirection loops.
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useSelector((store) => store.auth);
  const location = useLocation();

  if (!user) {
    // Redirect to login but save the current location to redirect back later
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If user doesn't have the right role, send them to their primary dashboard
    // This prevents the "shaking" UI caused by competing redirects
    const redirectPath = user.role === 'recruiter' 
      ? '/recruiter-dashboard' 
      : '/dashboard';
    
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default ProtectedRoute;