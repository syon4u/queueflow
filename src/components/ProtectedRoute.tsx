
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRoles }) => {
  const location = useLocation();

  useEffect(() => {
    console.log("🚫 ProtectedRoute: JWT verification globally disabled for development");
    console.log("✅ Allowing access to:", location.pathname);
    console.log("Required roles (ignored):", requiredRoles);
  }, [location.pathname, requiredRoles]);

  // JWT GLOBALLY DISABLED - Allow all access without any checks
  return <>{children}</>;
};

export default ProtectedRoute;
