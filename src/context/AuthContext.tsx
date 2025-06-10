
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
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting initial session:', error);
          setLoading(false);
          return;
        }
        
        console.log('Initial session:', session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchUserRole(session.user.id);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Failed to get initial session:', error);
        setLoading(false);
      }
    };

    getInitialSession();

    // Set up auth state listener
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

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchUserRole, clearRole]);

  const signUp = async (
    email: string,
    password: string,
    options?: { data?: { first_name?: string; last_name?: string } }
  ): Promise<{ error: AuthError | null }> => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: options?.data || {}
        }
      });

      if (error) {
        console.error('SignUp error:', error);
        return { error };
      }

      return { error: null };
    } catch (error: any) {
      console.error('SignUp exception:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string): Promise<{ error: AuthError | null }> => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('SignIn error:', error);
        return { error };
      }

      return { error: null };
    } catch (error: any) {
      console.error('SignIn exception:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async (): Promise<{ error: AuthError | null }> => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('SignOut error:', error);
        return { error };
      }

      return { error: null };
    } catch (error: any) {
      console.error('SignOut exception:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async (): Promise<{ error: AuthError | null }> => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });

      if (error) {
        console.error('Google SignIn error:', error);
        setLoading(false);
        return { error };
      }

      // Don't set loading to false here as redirect will handle it
      return { error: null };
    } catch (error: any) {
      console.error('Google SignIn exception:', error);
      setLoading(false);
      return { error };
    }
  };

  const resetPassword = async (email: string): Promise<{ error: AuthError | null }> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        console.error('Reset password error:', error);
        return { error };
      }

      return { error: null };
    } catch (error: any) {
      console.error('Reset password exception:', error);
      return { error };
    }
  };

  const updatePassword = async (password: string): Promise<{ error: AuthError | null }> => {
    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        console.error('Update password error:', error);
        return { error };
      }

      return { error: null };
    } catch (error: any) {
      console.error('Update password exception:', error);
      return { error };
    }
  };

  const resendConfirmation = async (email: string): Promise<{ error: AuthError | null }> => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) {
        console.error('Resend confirmation error:', error);
        return { error };
      }

      return { error: null };
    } catch (error: any) {
      console.error('Resend confirmation exception:', error);
      return { error };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      role,
      loading,
      signUp,
      signIn,
      signOut,
      signInWithGoogle,
      resetPassword,
      updatePassword,
      resendConfirmation,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
