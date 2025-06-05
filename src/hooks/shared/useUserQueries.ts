
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useUserQueries = (userType: 'staff' | 'employee') => {
  // Query for users based on type
  const { data: users, isLoading } = useQuery({
    queryKey: ['users', userType],
    queryFn: async () => {
      const roleFilter = userType === 'staff' ? ['staff', 'admin'] : ['staff', 'admin'];
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .in('role', roleFilter);
      
      if (error) throw error;
      return data || [];
    }
  });

  // Query for locations
  const { data: locations } = useQuery({
    queryKey: ['locations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('locations')
        .select('id, name');
      
      if (error) throw error;
      return data || [];
    }
  });

  return {
    users,
    locations,
    isLoading
  };
};
