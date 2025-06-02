
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useUserRole = () => {
  const [role, setRole] = useState<string | null>(null);

  const fetchUserRole = async (userId: string) => {
    try {
      console.log('Fetching role for user:', userId);
      
      // Use the get_user_role function
      const { data, error } = await supabase.rpc('get_user_role', { user_id: userId });

      if (error) {
        console.error('Error fetching user role:', error);
        setRole('customer'); // Default to customer
        return;
      }

      console.log('Role from database:', data);
      setRole(data || 'customer');
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
