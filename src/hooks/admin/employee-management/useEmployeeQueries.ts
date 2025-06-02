
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useEmployeeQueries = () => {
  // Fetch staff members from staff table
  const { data: staffMembers, isLoading } = useQuery({
    queryKey: ['staff-members'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('staff')
        .select(`
          id,
          first_name,
          last_name,
          phone,
          email,
          role,
          status,
          location_id,
          locations(name)
        `)
        .order('first_name');

      if (error) throw error;
      return data;
    },
  });

  // Fetch locations
  const { data: locations } = useQuery({
    queryKey: ['locations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('locations')
        .select('id, name')
        .order('name');

      if (error) throw error;
      return data;
    },
  });

  return {
    staffMembers,
    locations,
    isLoading,
  };
};
