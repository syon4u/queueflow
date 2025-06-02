
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useUserRole = () => {
  const [role, setRole] = useState<string | null>(null);

  const fetchUserRole = async (userId: string) => {
    try {
      console.log('Fetching role for user:', userId);
      
      // First check if user exists in staff table
      const { data: staffData, error: staffError } = await supabase
        .from('staff')
        .select('role, status')
        .eq('id', userId)
        .single();

      if (staffError) {
        console.log('User not found in staff table, checking profiles/user_roles:', staffError);
        
        // Fallback to user_roles table for other users
        const { data: userRoleData, error: userRoleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', userId)
          .single();

        if (userRoleError) {
          console.log('User not found in user_roles either, defaulting to customer:', userRoleError);
          setRole('customer');
          return;
        }

        console.log('Role from user_roles table:', userRoleData?.role);
        setRole(userRoleData?.role || 'customer');
        return;
      }

      // User found in staff table
      console.log('Staff data from database:', staffData);
      
      // Check if staff member is active
      if (staffData.status !== 'active') {
        console.log('Staff member is not active, setting role to customer');
        setRole('customer');
        return;
      }

      console.log('Role from staff table:', staffData.role);
      setRole(staffData.role || 'staff');
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
