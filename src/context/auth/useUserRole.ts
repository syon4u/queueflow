
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserRoleType, isValidUserRole } from '@/types/auth';

export const useUserRole = () => {
  const [role, setRole] = useState<UserRoleType | null>(null);

  const fetchUserRole = async (userId: string): Promise<void> => {
    try {
      console.log('Fetching role for user:', userId);
      
      // Query the user_roles table directly instead of using RPC
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();
      
      if (roleError) {
        console.error('Error fetching user role:', roleError);
        
        // If no role found, assign default role
        console.log('No role found, assigning default staff role');
        await ensureUserHasRole(userId);
        return;
      }

      console.log('Role data fetched:', roleData);
      
      if (roleData?.role && isValidUserRole(roleData.role)) {
        setRole(roleData.role);
        console.log('Role set to:', roleData.role);
        return;
      }

      // If no valid role found, assign default role
      console.log('No valid role found, assigning default staff role');
      await ensureUserHasRole(userId);
      
    } catch (error) {
      console.error('Failed to fetch user role:', error);
      await ensureUserHasRole(userId);
    }
  };

  const ensureUserHasRole = async (userId: string): Promise<void> => {
    try {
      console.log('Ensuring user has role:', userId);
      
      // Insert staff role if it doesn't exist
      const { error: insertError } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role: 'staff'
        });

      if (!insertError) {
        setRole('staff');
        console.log('Default staff role assigned successfully');
        
        // Also ensure we have a profiles record
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: userId,
            first_name: '',
            last_name: '',
            email: '',
            status: 'inactive'
          }, {
            onConflict: 'id'
          });

        if (profileError && !profileError.message?.includes('duplicate key')) {
          console.warn('Could not create/update profile record:', profileError);
        }
      } else {
        console.error('Failed to assign default role:', insertError);
        setRole('customer'); // Ultimate fallback
      }
    } catch (error) {
      console.error('Failed to ensure user has role:', error);
      setRole('customer'); // Ultimate fallback
    }
  };

  const clearRole = (): void => {
    console.log('Clearing user role');
    setRole(null);
  };

  return {
    role,
    fetchUserRole,
    clearRole,
  };
};
