import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Login = () => {
  const { user } = useAuth();

  // If user is already logged in, redirect to admin dashboard
  if (user) {
    return <Navigate to="/admin" replace />;
  }

  // Otherwise redirect to the main auth page
  return <Navigate to="/auth" replace />;
};

export default Login;
