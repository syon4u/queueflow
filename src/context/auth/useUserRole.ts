
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useUserRole = () => {
  const [role, setRole] = useState<string | null>(null);

  const fetchUserRole = async (userId: string) => {
    try {
      console.log('Fetching role for user:', userId);
      
      // First check user_roles table for explicit role assignments
      const { data: userRoleData, error: userRoleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle();

      // If user has an explicit role in user_roles, use it (this takes priority)
      if (userRoleData && !userRoleError) {
        console.log('Role found in user_roles table:', userRoleData.role);
        setRole(userRoleData.role);
        return; // Exit early with the explicit role
      }

      console.log('No role found in user_roles, checking staff table:', userRoleError);
      
      // Check staff table as fallback
      const { data: staffData, error: staffError } = await supabase
        .from('staff')
        .select('role, status')
        .eq('id', userId)
        .maybeSingle();

      if (staffData && !staffError) {
        console.log('Staff data from database:', staffData);
        
        // For staff members, use their role regardless of status
        // (admins/staff should retain access even if status is not active)
        if (staffData.role === 'admin' || staffData.role === 'staff') {
          console.log('Staff/Admin role from staff table:', staffData.role);
          setRole(staffData.role);
          return;
        }
        
        // Only check status for non-admin/non-staff roles
        if (staffData.status === 'active') {
          console.log('Active staff member, using role:', staffData.role);
          setRole(staffData.role || 'staff');
          return;
        }
      }

      console.log('User not found in staff table or is inactive non-admin:', staffError);
      
      // Default to customer only if no role found anywhere
      console.log('Defaulting to customer role');
      setRole('customer');
    } catch (error) {
      console.error('Failed to fetch user role:', error);
      setRole('customer');
    }
  };

  const clearRole = () => {
    setRole(null);
  };

  return {
    role,
    fetchUserRole,
    clearRole,
  };
};
