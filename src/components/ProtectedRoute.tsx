// src/components/ProtectedRoute.tsx
import React from 'react';
import { useAuth } from '../context/AuthContext.js';
import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
