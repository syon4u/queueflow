
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { UserRoleType } from '@/types/auth';
import { Loader2 } from 'lucide-react';

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
    currentRole: role,
    requiredRole,
    loading,
    path: location.pathname
  });

  // Show loading while auth state is being determined
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to auth page if user is not authenticated
  if (!user) {
    console.log('ProtectedRoute: No user, redirecting to auth');
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // If no specific role is required, allow access for any authenticated user
  if (!requiredRole) {
    return <>{children}</>;
  }

  // Check if user has required role
  const hasRequiredRole = () => {
    if (!role) return false;
    
    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(role);
    }
    
    return role === requiredRole;
  };

  // Admin has access to everything
  const isAdmin = role === 'admin';
  
  if (!hasRequiredRole() && !isAdmin) {
    console.log('ProtectedRoute: Insufficient permissions, redirecting');
    // Redirect to appropriate page based on user's role
    const roleRedirects: Record<UserRoleType, string> = {
      admin: '/admin',
      power_user: '/power-user',
      staff: '/staff',
      customer: '/'
    };
    
    const redirectPath = role ? roleRedirects[role as UserRoleType] : '/';
    return <Navigate to={redirectPath} replace />;
  }

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

// Specific role guards
export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute requiredRole="admin">{children}</ProtectedRoute>
);

export const StaffRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute requiredRole={['staff', 'power_user', 'admin']}>{children}</ProtectedRoute>
);

export const PowerUserRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute requiredRole={['power_user', 'admin']}>{children}</ProtectedRoute>
);

export const CustomerRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProtectedRoute requiredRole={['customer', 'staff', 'power_user', 'admin']}>{children}</ProtectedRoute>
);

export default ProtectedRoute;
