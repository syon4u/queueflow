
import React from 'react';
import { UserRoleType } from '@/types/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRoleType | UserRoleType[];
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

// Higher-order component for role-based protection
export const withRoleProtection = (
  Component: React.ComponentType, 
  requiredRole?: UserRoleType | UserRoleType[]
) => {
  return (props: any) => (
    <ProtectedRoute requiredRole={requiredRole}>
      <Component {...props} />
    </ProtectedRoute>
  );
};

// Specific role guards for common use cases - all allow access when auth is disabled
export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute requiredRole="admin">{children}</ProtectedRoute>
);

export const StaffRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute requiredRole={['staff', 'admin']}>{children}</ProtectedRoute>
);

export const CustomerRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute requiredRole={['customer', 'staff', 'admin']}>{children}</ProtectedRoute>
);

export default ProtectedRoute;
