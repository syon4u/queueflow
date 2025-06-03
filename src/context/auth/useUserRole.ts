
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserRoleType, isValidUserRole } from '@/types/auth';

export const useUserRole = () => {
  const [role, setRole] = useState<UserRoleType | null>(null);

  const fetchUserRole = async (userId: string): Promise<void> => {
    try {
      console.log('Fetching role for user:', userId);
      
      // Use the new security definer function to get user role safely
      const { data: roleData, error: roleError } = await supabase.rpc('get_current_user_role');
      
      if (roleError) {
        console.error('Error fetching user role:', roleError);
        // Default to staff for authenticated users
        setRole('staff');
        return;
      }

      console.log('Role fetched successfully:', roleData);
      
      if (roleData && isValidUserRole(roleData)) {
        setRole(roleData);
        return;
      }

      // If no role found, check if this is a new user and assign default role
      console.log('No role found, assigning default staff role');
      
      const { error: insertError } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role: 'staff'
        });

      if (!insertError) {
        setRole('staff');
        console.log('Default staff role assigned successfully');
      } else {
        console.error('Failed to assign default role:', insertError);
        setRole('staff'); // Default fallback
      }
    } catch (error) {
      console.error('Failed to fetch user role:', error);
      setRole('staff'); // Default to staff instead of customer
    }
  };

  const clearRole = (): void => {
    setRole(null);
  };

  return {
    role,
    fetchUserRole,
    clearRole,
  };
};
