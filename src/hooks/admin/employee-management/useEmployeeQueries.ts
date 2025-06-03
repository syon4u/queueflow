
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useEmployeeQueries = () => {
  // Fetch staff members from user_profiles view (combines profiles + user_roles)
  const { data: staffMembers, isLoading } = useQuery({
    queryKey: ['staff-members'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .in('role', ['staff', 'admin'])
        .order('first_name');

      if (error) throw error;
      return data?.map(profile => ({
        id: profile.id,
        first_name: profile.first_name,
        last_name: profile.last_name,
        phone: profile.phone,
        email: profile.email,
        role: profile.role,
        status: profile.status,
        location_id: null, // No longer using location_id with consolidated structure
        locations: null
      })) || [];
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
