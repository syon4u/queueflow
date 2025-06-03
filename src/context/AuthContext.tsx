
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
  // Temporarily disable authentication - provide mock data
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(false); // Set to false to skip loading
  const [role, setRole] = useState<UserRoleType | null>('admin'); // Mock admin role

  useEffect(() => {
    console.log('AuthProvider: Authentication disabled - using mock data');
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string): Promise<{ error?: AuthError }> => {
    console.log('AuthProvider: Sign in disabled - mock success');
    return {};
  };

  const signUp = async (email: string, password: string, userData?: any): Promise<{ error?: AuthError }> => {
    console.log('AuthProvider: Sign up disabled - mock success');
    return {};
  };

  const signOut = async (): Promise<void> => {
    console.log('AuthProvider: Sign out disabled');
  };

  const signInWithGoogle = async (): Promise<{ error?: AuthError }> => {
    console.log('AuthProvider: Google sign in disabled - mock success');
    return {};
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

  console.log('AuthProvider: Current state (auth disabled):', {
    hasUser: !!user,
    hasSession: !!session,
    role,
    loading
  });

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
