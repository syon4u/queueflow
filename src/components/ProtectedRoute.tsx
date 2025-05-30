
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { UserRole } from '@/hooks/useUserRole';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
  pageType?: 'customer' | 'staff' | 'supervisor' | 'power_user' | 'admin';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRoles, 
  pageType = 'customer' 
}) => {
  const { user, isLoading, role } = useAuth();
  const location = useLocation();

  console.log("ProtectedRoute - Current user:", user?.email);
  console.log("ProtectedRoute - Current role:", role);
  console.log("ProtectedRoute - Page type:", pageType);
  console.log("ProtectedRoute - Required roles:", requiredRoles);

  // Show loading while auth is being determined
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Not logged in - redirect to login
  if (!user) {
    toast({
      title: "Authentication required",
      description: "Please log in to access this page",
      variant: "destructive",
    });
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If specific roles are required, check those
  if (requiredRoles && requiredRoles.length > 0) {
    if (!role || !requiredRoles.includes(role)) {
      toast({
        title: "Access Denied",
        description: `Your role (${role || 'none'}) doesn't have permission to access this page`,
        variant: "destructive",
      });
      return <Navigate to="/unauthorized" state={{ from: location }} replace />;
    }
    return <>{children}</>;
  }

  // Simple role hierarchy for page types
  const hasAccess = () => {
    if (!role) {
      // If no role is set, default to customer access only
      return pageType === 'customer';
    }

    switch (pageType) {
      case 'customer':
        return true; // Everyone can access customer pages
      case 'staff':
        return ['staff', 'supervisor', 'power_user', 'admin'].includes(role);
      case 'supervisor':
        return ['supervisor', 'power_user', 'admin'].includes(role);
      case 'power_user':
        return ['power_user', 'admin'].includes(role);
      case 'admin':
        return role === 'admin';
      default:
        return true;
    }
  };

  if (!hasAccess()) {
    toast({
      title: "Access Denied",
      description: `Your role (${role || 'customer'}) doesn't have permission to access ${pageType} pages`,
      variant: "destructive",
    });
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  // User is authenticated and has required permissions
  return <>{children}</>;
};

export default ProtectedRoute;
