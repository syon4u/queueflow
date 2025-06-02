
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AuthContextType } from './auth/types';
import { useAuthMethods } from './auth/useAuthMethods';
import { useUserRole } from './auth/useUserRole';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [roleIsFetching, setRoleIsFetching] = useState(false);
  
  const { role, fetchUserRole, clearRole } = useUserRole();
  const authMethods = useAuthMethods();

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user && !roleIsFetching) {
          // Prevent multiple simultaneous role fetches
          setRoleIsFetching(true);
          try {
            await fetchUserRole(session.user.id);
          } finally {
            setRoleIsFetching(false);
          }
        } else if (!session?.user) {
          clearRole();
        }
        setIsLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user && !roleIsFetching) {
        setRoleIsFetching(true);
        fetchUserRole(session.user.id).finally(() => {
          setRoleIsFetching(false);
        });
      } else {
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchUserRole, clearRole, roleIsFetching]);

  const value = {
    user,
    session,
    isLoading,
    role,
    ...authMethods,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
