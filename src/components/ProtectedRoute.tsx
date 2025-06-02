
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRoles }) => {
  const { user, isLoading, role } = useAuth();
  const location = useLocation();

  // Enhanced debug logging
  useEffect(() => {
    console.log("=== PROTECTED ROUTE DEBUG (AUTH DISABLED) ===");
    console.log("Current user:", user?.email);
    console.log("Current role:", role);
    console.log("Required roles:", requiredRoles);
    console.log("Location pathname:", location.pathname);
    console.log("Is loading:", isLoading);
    console.log("User ID:", user?.id);
    console.log("Authentication temporarily disabled for development");
    console.log("============================");
  }, [user, role, requiredRoles, location.pathname, isLoading]);

  // Show loading spinner while auth is loading
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>;
  }

  // TEMPORARILY DISABLED: Authentication checks are bypassed for development
  // This allows access to all routes without requiring login
  console.log("✅ ProtectedRoute: Authentication disabled - allowing access to all routes");
  return <>{children}</>;

  /* 
  // Original authentication logic (commented out for development):
  
  // Not logged in - redirect to login
  if (!user) {
    console.log("❌ ProtectedRoute: User not authenticated, redirecting to login");
    toast({
      title: "Authentication required",
      description: "Please log in to access this page",
      variant: "destructive",
    });
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If no specific roles are required, allow access
  if (!requiredRoles || requiredRoles.length === 0) {
    console.log("✅ ProtectedRoute: No roles required, allowing access");
    return <>{children}</>;
  }

  // Role hierarchy: admin can access everything, staff can access staff and customer, customer can only access customer
  const currentRole = role || 'customer';
  
  const hasAccess = () => {
    // Admin can access everything
    if (currentRole === 'admin') {
      console.log("✅ ProtectedRoute: Admin role detected, allowing access to all routes");
      return true;
    }
    
    // Staff can access staff and customer areas
    if (currentRole === 'staff') {
      const staffAccess = requiredRoles.some(r => ['staff', 'customer'].includes(r));
      console.log("🔍 ProtectedRoute: Staff role, access granted:", staffAccess);
      return staffAccess;
    }
    
    // Customer can only access customer areas
    if (currentRole === 'customer') {
      const customerAccess = requiredRoles.includes('customer');
      console.log("🔍 ProtectedRoute: Customer role, access granted:", customerAccess);
      return customerAccess;
    }
    
    // Default: check if current role is in required roles
    const defaultAccess = requiredRoles.includes(currentRole);
    console.log("🔍 ProtectedRoute: Default check, access granted:", defaultAccess);
    return defaultAccess;
  };

  const accessGranted = hasAccess();

  if (!accessGranted) {
    console.log(`❌ ProtectedRoute: Access denied for role '${currentRole}' to routes requiring:`, requiredRoles);
    toast({
      title: "Access Denied",
      description: `Your role (${currentRole}) doesn't have permission to access this page`,
      variant: "destructive",
    });
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }
  
  // User is authenticated and has required role
  console.log(`✅ ProtectedRoute: Access granted for role '${currentRole}' to routes:`, requiredRoles);
  return <>{children}</>;
  */
};

export default ProtectedRoute;
