import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import LoadingComponent from '../helper/loadingComponent';
import { Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles, redirectRoles, redirectTo }) => {
  const location = useLocation();
  const { isLoading, isAuthenticated, user } = useAuth();

  if (isLoading) {
    return <LoadingComponent />;
  }

  if (!isAuthenticated) {
    console.log("Redirecting to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  
  const userRedirectPath = (redirectRoles && user?.role ? redirectRoles[user.role] : null) || redirectTo;

  if (location.pathname === "/dashboard" && userRedirectPath) {
    if (userRedirectPath !== location.pathname) {
      console.log("Redirecting to:", userRedirectPath);
      return <Navigate to={userRedirectPath} replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
