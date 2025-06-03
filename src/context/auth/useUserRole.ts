
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
        // For existing users, let's check if they need a role assigned
        await ensureUserHasRole(userId);
        return;
      }

      console.log('Role fetched successfully:', roleData);
      
      if (roleData && isValidUserRole(roleData)) {
        setRole(roleData);
        return;
      }

      // If no role found, assign default role
      console.log('No role found, assigning default staff role');
      await ensureUserHasRole(userId);
      
    } catch (error) {
      console.error('Failed to fetch user role:', error);
      await ensureUserHasRole(userId);
    }
  };

  const ensureUserHasRole = async (userId: string): Promise<void> => {
    try {
      // First try to insert a staff role for this user
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
        // If insert failed, the user might already have a role, try to get it
        const { data: existingRole } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', userId)
          .single();
        
        if (existingRole && isValidUserRole(existingRole.role)) {
          setRole(existingRole.role);
          console.log('Found existing role:', existingRole.role);
        } else {
          setRole('customer'); // Ultimate fallback
          console.log('Fallback to customer role');
        }
      }
    } catch (error) {
      console.error('Failed to ensure user has role:', error);
      setRole('customer'); // Ultimate fallback
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
