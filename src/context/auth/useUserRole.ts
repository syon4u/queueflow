
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useUserRole = () => {
  const [role, setRole] = useState<string | null>(null);

  const fetchUserRole = async (userId: string) => {
    try {
      console.log('Fetching role for user:', userId);
      
      // Get role from user_roles table
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching user role:', error);
        setRole('customer'); // Default to customer
        return;
      }

      console.log('Role from database:', data?.role);
      setRole(data?.role || 'customer');
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
