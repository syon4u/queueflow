
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
  // Role checks disabled - allow all access
  console.log('ProtectedRoute: Role checks disabled - allowing access to all features', {
    requiredRole,
    path: window.location.pathname
  });

  // Always allow access when role checks are disabled
  return <>{children}</>;
};

// Higher-order component for role-based protection - disabled
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

// Specific role guards - all allow access when role checks are disabled
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
