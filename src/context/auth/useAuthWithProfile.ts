
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/hooks/useProfile';

export const useAuthWithProfile = () => {
  // Create mock user since JWT verification is disabled
  const mockUser: User = {
    id: 'mock-user-id',
    email: 'test@example.com',
    aud: 'authenticated',
    role: 'authenticated',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    app_metadata: {},
    user_metadata: {},
    identities: [],
    email_confirmed_at: new Date().toISOString(),
    last_sign_in_at: new Date().toISOString(),
    phone: null,
    confirmed_at: new Date().toISOString()
  };

  const mockProfile: UserProfile = {
    id: 'mock-user-id',
    email: 'test@example.com',
    first_name: 'Test',
    last_name: 'User',
    phone: null,
    status: 'active',
    location_id: null,
    role: 'staff',
    last_sign_in_at: new Date().toISOString(),
  };

  const [user, setUser] = useState<User | null>(mockUser);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(mockProfile);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('useAuthWithProfile: JWT verification disabled - using mock data');
    setLoading(false);
  }, []);

  return {
    user,
    session,
    profile,
    loading,
    refetchProfile: async () => {
      console.log('useAuthWithProfile: refetchProfile called - returning mock profile');
      return mockProfile;
    }
  };
};
