
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Spinner } from '@/components/ui/spinner';
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
  const { user, role, loading } = useAuth();
  const location = useLocation();

  console.log('ProtectedRoute: Checking access', {
    hasUser: !!user,
    userRole: role,
    requiredRole,
    loading,
    path: location.pathname
  });

  // Show loading spinner while authentication state is being determined
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center space-y-4">
          <Spinner className="mx-auto h-8 w-8" />
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-32 mx-auto"></div>
            <div className="h-3 bg-gray-100 rounded animate-pulse w-24 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  // Redirect to auth if no user
  if (!user) {
    console.log('ProtectedRoute: No user, redirecting to auth');
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // If role is required, check if user has the required role
  if (requiredRole) {
    const requiredRoles: UserRoleType[] = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    
    if (!role) {
      console.log('ProtectedRoute: No role found, redirecting to auth');
      return <Navigate to={redirectTo} state={{ from: location }} replace />;
    }

    if (!requiredRoles.includes(role)) {
      console.log('ProtectedRoute: Insufficient role', { userRole: role, requiredRoles });
      return <Navigate to="/unauthorized" replace />;
    }
  }

  console.log('ProtectedRoute: Access granted');
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

// Specific role guards for common use cases
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
