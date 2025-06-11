import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedEmployeeRoute = ({ children }: { children: React.ReactNode }) => {
  const employeeId = localStorage.getItem('employeeId');

  if (!employeeId) {
    return <Navigate to="/employee-login" />;
  }

  return <>{children}</>;
};

export default ProtectedEmployeeRoute;
