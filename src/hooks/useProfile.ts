
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

export interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  status: string;
  location_id: string | null;
  role: string;
  last_sign_in_at: string | null;
}

export const useProfile = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: async (): Promise<UserProfile | null> => {
      if (!user?.id) return null;

      // Use the new unified staff view
      const { data, error } = await supabase
        .from('staff_view')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      return data as UserProfile;
    },
    enabled: !!user?.id,
    refetchOnWindowFocus: false,
  });
};
