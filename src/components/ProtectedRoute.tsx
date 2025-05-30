
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/hooks/useUserRole';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
  pageType?: 'customer' | 'staff' | 'supervisor' | 'power_user' | 'admin';
}

interface RolePermissions {
  role: string;
  customer_access: boolean;
  staff_access: boolean;
  supervisor_access: boolean;
  power_user_access: boolean;
  admin_access: boolean;
}

const staffRoles: UserRole[] = ['staff', 'supervisor', 'power_user', 'admin'];
const supervisorRoles: UserRole[] = ['supervisor', 'admin'];
const powerUserRoles: UserRole[] = ['power_user', 'admin'];
const adminRoles: UserRole[] = ['admin'];

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRoles, pageType = 'customer' }) => {
  const { user, isLoading, role } = useAuth();
  const location = useLocation();

  // Fetch permissions for the current role
  const { data: permissions, isLoading: isLoadingPermissions } = useQuery({
    queryKey: ['role-permissions', role],
    queryFn: async () => {
      if (!role) return null;
      
      try {
        // Use type-safe table reference from the generated types
        const { data, error } = await supabase
          .from('role_permissions')
          .select('*')
          .eq('role', role)
          .single();
          
        if (error) {
          // If no permissions found, use defaults based on role
          if (error.code === 'PGRST116') { // No rows returned
            return {
              role,
              customer_access: true, // Everyone can access customer pages by default
              staff_access: staffRoles.includes(role as UserRole),
              supervisor_access: supervisorRoles.includes(role as UserRole),
              power_user_access: powerUserRoles.includes(role as UserRole),
              admin_access: adminRoles.includes(role as UserRole)
            } as RolePermissions;
          }
          throw error;
        }
        
        // Ensure all required fields are present in the returned data
        return {
          role: data.role,
          customer_access: data.customer_access,
          staff_access: data.staff_access,
          supervisor_access: data.supervisor_access ?? false,
          power_user_access: data.power_user_access ?? false,
          admin_access: data.admin_access
        } as RolePermissions;
      } catch (error) {
        console.error('Error fetching permissions:', error);
        // Return default permissions based on role
        return {
          role,
          customer_access: true, // Everyone can access customer pages by default
          staff_access: staffRoles.includes(role as UserRole),
          supervisor_access: supervisorRoles.includes(role as UserRole),
          power_user_access: powerUserRoles.includes(role as UserRole),
          admin_access: adminRoles.includes(role as UserRole)
        } as RolePermissions;
      }
    },
    enabled: !!role,
  });

  // Enhanced debug logging
  useEffect(() => {
    console.log("Protected Route - Current user:", user?.email);
    console.log("Protected Route - Current role:", role);
    console.log("Protected Route - Required roles:", requiredRoles);
    console.log("Protected Route - Page type:", pageType);
    console.log("Protected Route - Permissions:", permissions);
    
    // Additional debugging for role check
    if (requiredRoles && requiredRoles.length > 0 && role) {
      const hasRequiredRole = requiredRoles.includes(role as UserRole);
      console.log("User has required role:", hasRequiredRole);
    }
  }, [user, role, requiredRoles, pageType, permissions]);

  if (isLoading || isLoadingPermissions) {
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

  // First check specific roles if provided
  if (requiredRoles && requiredRoles.length > 0 && role) {
    // Check if the user's role is in the required roles list
    const hasRequiredRole = requiredRoles.includes(role as UserRole);
    
    if (!hasRequiredRole) {
      toast({
        title: "Access Denied",
        description: `Your role (${role || 'customer'}) doesn't have permission to access this page`,
        variant: "destructive",
      });
      return <Navigate to="/unauthorized" state={{ from: location }} replace />;
    }
  } 
  // Then check page type permissions if no specific roles were required
  else if (permissions) {
    let hasAccess = true;
    
    switch (pageType) {
      case 'admin':
        hasAccess = permissions.admin_access;
        break;
      case 'power_user':
        hasAccess = permissions.power_user_access;
        break;
      case 'supervisor':
        hasAccess = permissions.supervisor_access;
        break;
      case 'staff':
        hasAccess = permissions.staff_access;
        break;
      case 'customer':
        hasAccess = permissions.customer_access;
        break;
    }
    
    if (!hasAccess) {
      toast({
        title: "Access Denied",
        description: `Your role (${role || 'customer'}) doesn't have permission to access ${pageType} pages`,
        variant: "destructive",
      });
      return <Navigate to="/unauthorized" state={{ from: location }} replace />;
    }
  }
  
  // User is authenticated and has required role/permissions
  return <>{children}</>;
};

export default ProtectedRoute;
