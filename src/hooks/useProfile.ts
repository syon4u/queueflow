
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

      // JWT verification disabled - return mock profile data
      console.log('useProfile: JWT verification disabled - returning mock profile');
      
      return {
        id: user.id,
        email: user.email || 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
        phone: null,
        status: 'active',
        location_id: null,
        role: 'staff',
        last_sign_in_at: new Date().toISOString(),
      } as UserProfile;
    },
    enabled: !!user?.id,
    refetchOnWindowFocus: false,
  });
};
