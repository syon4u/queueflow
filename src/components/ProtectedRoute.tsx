
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

// Default permissions based on role hierarchy
const getDefaultPermissions = (role: UserRole): RolePermissions => {
  return {
    role,
    customer_access: true, // Everyone can access customer pages
    staff_access: staffRoles.includes(role),
    supervisor_access: supervisorRoles.includes(role),
    power_user_access: powerUserRoles.includes(role),
    admin_access: adminRoles.includes(role)
  };
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRoles, pageType = 'customer' }) => {
  const { user, isLoading, role } = useAuth();
  const location = useLocation();

  // Fetch permissions for the current role with better error handling
  const { data: permissions, isLoading: isLoadingPermissions, error: permissionsError } = useQuery({
    queryKey: ['role-permissions', role],
    queryFn: async () => {
      if (!role) return null;
      
      try {
        const { data, error } = await supabase
          .from('role_permissions')
          .select('*')
          .eq('role', role)
          .single();
          
        if (error) {
          // If no permissions found in DB, use defaults based on role
          if (error.code === 'PGRST116') {
            console.log(`No permissions found in DB for role ${role}, using defaults`);
            return getDefaultPermissions(role as UserRole);
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
        // Always return default permissions based on role if DB query fails
        return getDefaultPermissions(role as UserRole);
      }
    },
    enabled: !!role,
    retry: 1, // Only retry once to avoid long delays
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Enhanced debug logging
  useEffect(() => {
    console.log("Protected Route - Current user:", user?.email);
    console.log("Protected Route - Current role:", role);
    console.log("Protected Route - Required roles:", requiredRoles);
    console.log("Protected Route - Page type:", pageType);
    console.log("Protected Route - Permissions:", permissions);
    console.log("Protected Route - Permissions error:", permissionsError);
    
    // Additional debugging for role check
    if (requiredRoles && requiredRoles.length > 0 && role) {
      const hasRequiredRole = requiredRoles.includes(role as UserRole);
      console.log("User has required role:", hasRequiredRole);
    }
  }, [user, role, requiredRoles, pageType, permissions, permissionsError]);

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

  // If we have specific required roles, check those first
  if (requiredRoles && requiredRoles.length > 0 && role) {
    const hasRequiredRole = requiredRoles.includes(role as UserRole);
    
    if (!hasRequiredRole) {
      toast({
        title: "Access Denied",
        description: `Your role (${role}) doesn't have permission to access this page`,
        variant: "destructive",
      });
      return <Navigate to="/unauthorized" state={{ from: location }} replace />;
    }
    
    // User has required role, allow access
    return <>{children}</>;
  }

  // No specific roles required, check page type permissions
  // Use default permissions if database permissions aren't available
  const effectivePermissions = permissions || (role ? getDefaultPermissions(role as UserRole) : null);
  
  if (effectivePermissions) {
    let hasAccess = true;
    
    switch (pageType) {
      case 'admin':
        hasAccess = effectivePermissions.admin_access;
        break;
      case 'power_user':
        hasAccess = effectivePermissions.power_user_access;
        break;
      case 'supervisor':
        hasAccess = effectivePermissions.supervisor_access;
        break;
      case 'staff':
        hasAccess = effectivePermissions.staff_access;
        break;
      case 'customer':
        hasAccess = effectivePermissions.customer_access;
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
  } else {
    // Fallback: if no permissions can be determined, allow customer access but deny others
    if (pageType !== 'customer') {
      toast({
        title: "Access Denied",
        description: "Unable to verify permissions for this page",
        variant: "destructive",
      });
      return <Navigate to="/unauthorized" state={{ from: location }} replace />;
    }
  }
  
  // User is authenticated and has required permissions
  return <>{children}</>;
};

export default ProtectedRoute;
