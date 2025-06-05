
import React from 'react';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string | string[];
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole,
  redirectTo = '/auth'
}) => {
  // Temporarily disable authentication - allow all access
  console.log('ProtectedRoute: Authentication disabled - allowing access', {
    requiredRole,
    path: window.location.pathname
  });

  // Always allow access when auth is disabled
  return <>{children}</>;
};

export default ProtectedRoute;
