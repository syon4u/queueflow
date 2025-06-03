
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserRoleType, isValidUserRole } from '@/types/auth';

export const useUserRole = () => {
  const [role, setRole] = useState<UserRoleType | null>(null);

  const fetchUserRole = async (userId: string): Promise<void> => {
    try {
      console.log('Fetching role for user:', userId);
      
      // Use the security definer function to get user role safely
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
        console.log('Role set to:', roleData);
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
      console.log('Ensuring user has role:', userId);
      
      // First check if user already has a role
      const { data: existingRole, error: checkError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (!checkError && existingRole && isValidUserRole(existingRole.role)) {
        console.log('Found existing role:', existingRole.role);
        setRole(existingRole.role);
        return;
      }

      // If no role exists, try to insert a staff role
      const { error: insertError } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role: 'staff'
        });

      if (!insertError) {
        setRole('staff');
        console.log('Default staff role assigned successfully');
        
        // Also try to create a staff record
        const { error: staffError } = await supabase
          .from('staff')
          .insert({
            id: userId,
            first_name: '',
            last_name: '',
            email: '',
            role: 'staff',
            status: 'inactive'
          });

        if (staffError && !staffError.message?.includes('duplicate key')) {
          console.warn('Could not create staff record:', staffError);
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
