
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useUserRole } from './auth/useUserRole';
import { AuthContextType, UserRoleType, AuthError } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { role, fetchUserRole, clearRole } = useUserRole();

  useEffect(() => {
    console.log('AuthProvider: Initializing authentication state');
    
    // Get initial session
    const initializeAuth = async (): Promise<void> => {
      try {
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('AuthProvider: Error getting initial session:', error);
        } else {
          console.log('AuthProvider: Initial session:', initialSession?.user?.id || 'No session');
          setSession(initialSession);
          setUser(initialSession?.user ?? null);
          
          if (initialSession?.user) {
            await fetchUserRole(initialSession.user.id);
          }
        }
      } catch (error) {
        console.error('AuthProvider: Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('AuthProvider: Auth state changed:', event, currentSession?.user?.id || 'No user');
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (currentSession?.user) {
          await fetchUserRole(currentSession.user.id);
        } else {
          clearRole();
        }

        // Only set loading to false after initial session check
        if (event === 'INITIAL_SESSION') {
          setLoading(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchUserRole, clearRole]);

  const signIn = async (email: string, password: string): Promise<{ error?: AuthError }> => {
    try {
      console.log('AuthProvider: Attempting sign in for:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('AuthProvider: Sign in error:', error);
        return { error: { message: error.message, code: error.message } };
      }

      console.log('AuthProvider: Sign in successful for:', data.user?.email);
      return {};
    } catch (error: any) {
      console.error('AuthProvider: Sign in exception:', error);
      return { error: { message: error.message || 'An unexpected error occurred' } };
    }
  };

  const signUp = async (email: string, password: string, userData?: any): Promise<{ error?: AuthError }> => {
    try {
      console.log('AuthProvider: Attempting sign up for:', email);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData || {}
        }
      });

      if (error) {
        console.error('AuthProvider: Sign up error:', error);
        return { error: { message: error.message, code: error.message } };
      }

      console.log('AuthProvider: Sign up successful for:', data.user?.email);
      return {};
    } catch (error: any) {
      console.error('AuthProvider: Sign up exception:', error);
      return { error: { message: error.message || 'An unexpected error occurred' } };
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      console.log('AuthProvider: Signing out');
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('AuthProvider: Sign out error:', error);
        throw new Error(error.message);
      } else {
        console.log('AuthProvider: Sign out successful');
        clearRole();
      }
    } catch (error: any) {
      console.error('AuthProvider: Sign out exception:', error);
      throw error;
    }
  };

  const signInWithGoogle = async (): Promise<{ error?: AuthError }> => {
    try {
      console.log('AuthProvider: Attempting Google sign in');
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        console.error('AuthProvider: Google sign in error:', error);
        return { error: { message: error.message, code: error.message } };
      }

      console.log('AuthProvider: Google sign in initiated');
      return {};
    } catch (error: any) {
      console.error('AuthProvider: Google sign in exception:', error);
      return { error: { message: error.message || 'An unexpected error occurred' } };
    }
  };

  const value: AuthContextType = {
    user,
    session,
    role,
    loading,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
  };

  console.log('AuthProvider: Current state:', {
    hasUser: !!user,
    hasSession: !!session,
    role,
    loading
  });

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
