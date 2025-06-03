
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { AuthContextType } from './auth/types';
import { useAuthMethods } from './auth/useAuthMethods';
import { useUserRole } from './auth/useUserRole';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // JWT GLOBALLY DISABLED FOR DEVELOPMENT
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(false); // No loading needed when auth is disabled
  const [roleIsFetching, setRoleIsFetching] = useState(false);
  
  const { role, clearRole } = useUserRole();
  const authMethods = useAuthMethods();

  useEffect(() => {
    console.log("🚫 AuthProvider: JWT verification globally disabled for development");
    // Skip all authentication logic
    setIsLoading(false);
    clearRole();
  }, [clearRole]);

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
