
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/use-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRoles }) => {
  const { user, isLoading, role } = useAuth();
  const location = useLocation();

  // Debug logging
  useEffect(() => {
    console.log("Protected Route - Current user:", user?.email);
    console.log("Protected Route - Current role:", role);
    console.log("Protected Route - Required roles:", requiredRoles);
  }, [user, role, requiredRoles]);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>;
  }

  // Not logged in - redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if specific roles are required
  if (requiredRoles && requiredRoles.length > 0) {
    // Check if the user's role is in the required roles list
    const hasRequiredRole = requiredRoles.includes(role || '');
    
    if (!hasRequiredRole) {
      return <Navigate to="/unauthorized" state={{ from: location }} replace />;
    }
  }
  
  // User is authenticated and has required role (or no specific role is required)
  return <>{children}</>;
};

export default ProtectedRoute;
