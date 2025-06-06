
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
  // Create a mock user for admin access since role checks are disabled
  const mockAdminUser: User = {
    id: 'mock-admin-user-id',
    email: 'admin@broward.gov',
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

  const [user, setUser] = useState<User | null>(mockAdminUser);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [role, setRole] = useState<UserRoleType | null>('admin');

  useEffect(() => {
    console.log('AuthProvider: Role checks disabled - using mock admin user with full access');
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string): Promise<{ error?: AuthError }> => {
    console.log('AuthProvider: Sign in disabled - mock success (role checks disabled)');
    return {};
  };

  const signUp = async (email: string, password: string, userData?: any): Promise<{ error?: AuthError }> => {
    console.log('AuthProvider: Sign up disabled - mock success (role checks disabled)');
    return {};
  };

  const signOut = async (): Promise<void> => {
    console.log('AuthProvider: Sign out disabled (role checks disabled)');
  };

  const signInWithGoogle = async (): Promise<{ error?: AuthError }> => {
    console.log('AuthProvider: Google sign in disabled - mock success (role checks disabled)');
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

  console.log('AuthProvider: Current state (role checks disabled):', {
    hasUser: !!user,
    hasSession: !!session,
    role,
    loading,
    userId: user?.id
  });

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
