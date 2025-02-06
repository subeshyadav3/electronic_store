import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import LoadingComponent from '../helper/loadingComponent';
import { Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles, redirectRoles }) => {
  const location = useLocation();
  const { isLoading, isAuthenticated, user } = useAuth();

  if (isLoading) {
    return <LoadingComponent />;
  }

  if (!isAuthenticated) {
    console.log("Redirecting to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (location.pathname === "/dashboard") {
    const userRedirectPath = redirectRoles[user.role];
    if (userRedirectPath && userRedirectPath !== location.pathname) {
      console.log("Redirecting to:", userRedirectPath);
      return <Navigate to={userRedirectPath} replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
