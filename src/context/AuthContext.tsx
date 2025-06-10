
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
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch user role when user signs in
          await fetchUserRole(session.user.id);
        } else {
          // Clear role when user signs out
          clearRole();
        }
        
        setLoading(false);
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserRole(session.user.id);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [fetchUserRole, clearRole]);

  const signIn = async (email: string, password: string): Promise<{ error?: AuthError }> => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Sign in error:', error);
        return { error: { message: error.message } };
      }
      
      return {};
    } catch (error: any) {
      console.error('Sign in error:', error);
      return { error: { message: error.message || 'An unexpected error occurred' } };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData?: any): Promise<{ error?: AuthError }> => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData || {},
          emailRedirectTo: `${window.location.origin}/`
        }
      });
      
      if (error) {
        console.error('Sign up error:', error);
        return { error: { message: error.message } };
      }
      
      return {};
    } catch (error: any) {
      console.error('Sign up error:', error);
      return { error: { message: error.message || 'An unexpected error occurred' } };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
      }
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async (): Promise<{ error?: AuthError }> => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });
      
      if (error) {
        console.error('Google sign in error:', error);
        return { error: { message: error.message } };
      }
      
      return {};
    } catch (error: any) {
      console.error('Google sign in error:', error);
      return { error: { message: error.message || 'An unexpected error occurred' } };
    } finally {
      setLoading(false);
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
    loading,
    userId: user?.id
  });

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
