
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { authService } from '@/services/authService';
import { useUserRole } from '@/hooks/useUserRole';
import { AuthContextType } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  // Use our custom hook to fetch role
  const { role, isLoading: roleLoading } = useUserRole(user);
  
  // Determine overall loading state
  const combinedLoading = isLoading || (user !== null && roleLoading);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event);
        setSession(session);
        setUser(session?.user ?? null);
        
        // Redirect users after authentication events
        if (event === 'SIGNED_IN') {
          navigate('/');  // This will take them to the Dashboard
        } else if (event === 'SIGNED_OUT') {
          navigate('/login');
        }
      }
    );

    // THEN check for existing session
    authService.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.email || 'no session');
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session?.user) {
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const signInWithGoogle = async () => {
    try {
      await authService.signInWithGoogle();
      // Note: We don't need to do anything here because onAuthStateChange will handle the session update
    } catch (error: any) {
      console.error('Error signing in with Google:', error);
      throw new Error(error.message || 'Google sign-in is not enabled. Please use email/password instead.');
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      const data = await authService.signInWithEmail(email, password);
      // No need to navigate here as onAuthStateChange will handle it
      return data;
    } catch (error: any) {
      console.error('Error signing in with email:', error);
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, password: string) => {
    try {
      const data = await authService.signUpWithEmail(email, password);
      return data;
    } catch (error: any) {
      console.error('Error signing up with email:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      await authService.signOut();
      // No need to navigate here as onAuthStateChange will handle it
    } catch (error: any) {
      console.error('Error signing out:', error);
      toast({
        variant: "destructive",
        title: "Sign out failed",
        description: error.message || "There was an error signing out.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    session,
    isLoading: combinedLoading,
    role,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signOut,
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
