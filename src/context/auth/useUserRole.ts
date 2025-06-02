
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
        .maybeSingle(); // Use maybeSingle to avoid errors when no data found

      if (staffData && !staffError) {
        console.log('Staff data from database:', staffData);
        
        // Check if staff member is active
        if (staffData.status !== 'active') {
          console.log('Staff member is not active, checking user_roles table');
        } else {
          console.log('Role from staff table:', staffData.role);
          setRole(staffData.role || 'staff');
          return;
        }
      } else {
        console.log('User not found in staff table, checking user_roles:', staffError);
      }
      
      // Check user_roles table
      const { data: userRoleData, error: userRoleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle(); // Use maybeSingle to avoid errors when no data found

      if (userRoleData && !userRoleError) {
        console.log('Role from user_roles table:', userRoleData.role);
        setRole(userRoleData.role || 'customer');
      } else {
        console.log('User not found in user_roles either, defaulting to customer:', userRoleError);
        setRole('customer');
      }
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
