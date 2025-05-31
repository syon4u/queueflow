
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

  // Enhanced debug logging
  useEffect(() => {
    console.log("Protected Route - Current user:", user?.email);
    console.log("Protected Route - Current role:", role);
    console.log("Protected Route - Required roles:", requiredRoles);
    console.log("Protected Route - Location pathname:", location.pathname);
  }, [user, role, requiredRoles, location.pathname]);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>;
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

  // If no specific roles are required, allow access
  if (!requiredRoles || requiredRoles.length === 0) {
    return <>{children}</>;
  }

  // Role hierarchy: admin can access everything, staff can access staff and customer, customer can only access customer
  const currentRole = role || 'customer';
  
  const hasAccess = () => {
    // Admin can access everything
    if (currentRole === 'admin') {
      return true;
    }
    
    // Staff can access staff and customer areas
    if (currentRole === 'staff') {
      return requiredRoles.some(r => ['staff', 'customer'].includes(r));
    }
    
    // Customer can only access customer areas
    if (currentRole === 'customer') {
      return requiredRoles.includes('customer');
    }
    
    // Default: check if current role is in required roles
    return requiredRoles.includes(currentRole);
  };

  if (!hasAccess()) {
    console.log(`Access denied: User role '${currentRole}' not in required roles:`, requiredRoles);
    toast({
      title: "Access Denied",
      description: `Your role (${currentRole}) doesn't have permission to access this page`,
      variant: "destructive",
    });
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }
  
  // User is authenticated and has required role
  console.log(`Access granted: User role '${currentRole}' has access to:`, requiredRoles);
  return <>{children}</>;
};

export default ProtectedRoute;
