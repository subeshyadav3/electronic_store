import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import LoadingComponent from '../helper/loadingComponent';
import { Outlet } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const {isLoading, isAuthenticated } = useAuth();
  if(isLoading){
    return <LoadingComponent /> 
  }

  if (!isAuthenticated) {
    console.log("Redirecting to login")
    console.log("isAuthenticated",isAuthenticated)

    return <Navigate to="/login" />; 
  }

  return (
    <div className="">
      <Outlet />
    </div>
  )
};
export default ProtectedRoute;