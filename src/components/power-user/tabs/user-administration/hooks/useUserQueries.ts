
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { UserAdministrationUser } from '../types';

export const useUserQueries = () => {
  // Fetch users with profiles and roles using the new user_profiles view
  const { data: users = [], isLoading, error, refetch } = useQuery({
    queryKey: ['power-user-administration'],
    queryFn: async (): Promise<UserAdministrationUser[]> => {
      console.log('Fetching users from user_profiles view...');
      
      const { data: profiles, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user profiles:', error);
        throw error;
      }

      console.log('Fetched user profiles:', profiles);

      return profiles.map(profile => ({
        ...profile,
        last_sign_in_at: null // Add this required field for compatibility
      }));
    }
  });

  // Calculate role statistics with proper typing
  const roleStats = users.reduce((acc, user) => {
    const role = user.role || 'customer';
    acc[role] = (acc[role] || 0) + 1;
    return acc;
  }, {
    admin: 0,
    power_user: 0, 
    staff: 0,
    customer: 0
  });

  return {
    users,
    isLoading,
    error,
    refetch,
    roleStats
  };
};
