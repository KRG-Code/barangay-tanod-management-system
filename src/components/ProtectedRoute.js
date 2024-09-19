// src/components/ProtectedRoute.js
import { useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';



const ProtectedRoute = ({ children }) => {
  const { token } = useContext(AuthContext);


  if (!token) {
    // Redirect to login if no token
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
