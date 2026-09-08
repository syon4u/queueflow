
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { UserRoleType } from '@/types/auth';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  role: UserRoleType | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: unknown }>;
  signUp: (email: string, password: string, userData?: Record<string, unknown>) => Promise<{ error?: unknown }>;
  signInWithGoogle: () => Promise<{ error?: unknown }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const fetchUserRole = async (userId: string): Promise<UserRoleType> => {
  try {
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .maybeSingle();
    
    return (roleData?.role as UserRoleType) || 'customer';
  } catch (error) {
    console.error('Error fetching user role:', error);
    return 'customer';
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<UserRoleType | null>(null);
  const [loading, setLoading] = useState(true);

  // The role is resolved ONCE per signed-in user. Supabase fires several auth
  // events on a cold load (getSession, INITIAL_SESSION, SIGNED_IN,
  // TOKEN_REFRESHED, ...) and each used to issue its own
  // `user_roles?select=role` request. The cache is keyed by user id, holds the
  // in-flight promise so concurrent events share one request, and is cleared
  // when that user signs out.
  const roleCacheRef = useRef<{ userId: string; role: Promise<UserRoleType> } | null>(null);

  const resolveUserRole = (userId: string): Promise<UserRoleType> => {
    const cached = roleCacheRef.current;
    if (cached && cached.userId === userId) {
      return cached.role;
    }
    const pending = fetchUserRole(userId);
    roleCacheRef.current = { userId, role: pending };
    return pending;
  };

  // Supabase hands us a fresh `user` object on every auth event even when
  // nothing about the user changed. Keep the previous reference in that case so
  // effects keyed on `user` (realtime subscriptions, status fetches) do not
  // re-run on every token refresh.
  const applySession = (next: Session | null) => {
    setSession(next);
    setUser(prev => {
      const nextUser = next?.user ?? null;
      if (prev && nextUser && prev.id === nextUser.id && prev.updated_at === nextUser.updated_at) {
        return prev;
      }
      return nextUser;
    });
  };

  useEffect(() => {
    console.log('AuthProvider - Setting up auth state listener');
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        applySession(session);
        
        if (session?.user) {
          // Use setTimeout to avoid recursion issues. IMPORTANT: keep
          // `loading` true until the role has actually been resolved --
          // otherwise ProtectedRoute evaluates access with role === null
          // and bounces authenticated staff/admins off deep links.
          const userId = session.user.id;
          setTimeout(async () => {
            const userRole = await resolveUserRole(userId);
            setRole(userRole);
            setLoading(false);
          }, 0);
        } else {
          roleCacheRef.current = null;
          setRole(null);
          setLoading(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.id);
      applySession(session);
      
      if (session?.user) {
        const userRole = await resolveUserRole(session.user.id);
        setRole(userRole);
      } else {
        setRole(null);
      }
      
      setLoading(false);
    });

    return () => {
      console.log('AuthProvider - Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signUp = async (email: string, password: string, userData?: Record<string, unknown>) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
          emailRedirectTo: `${window.location.origin}/`
        }
      });
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      roleCacheRef.current = null;
      setUser(null);
      setSession(null);
      setRole(null);
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    session,
    role,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
  };

  console.log('AuthProvider render - user:', user?.id, 'role:', role, 'loading:', loading);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Minimal auth context for components that don't need full auth
export const MinimalAuthContext = createContext<{ user: User | null; role: UserRoleType | null }>({
  user: null,
  role: null,
});

export const useMinimalAuth = () => {
  return useContext(MinimalAuthContext);
};
