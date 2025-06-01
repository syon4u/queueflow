import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  role: string | null;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // For demo purposes, create a mock user with all required User properties
    const mockUser = {
      id: '00000000-0000-0000-0000-000000000000',
      email: 'demo@example.com',
      user_metadata: {
        name: 'Demo User'
      },
      app_metadata: {},
      aud: 'authenticated',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      phone: '',
      email_confirmed_at: new Date().toISOString(),
      confirmed_at: new Date().toISOString(),
      last_sign_in_at: new Date().toISOString(),
      role: 'authenticated'
    } as User;
    
    setUser(mockUser);
    setRole('admin'); // Set as admin for demo
    setIsLoading(false);
    
    // Set up auth state listener for real implementation
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event);
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          fetchUserRole(session.user.id);
        } else {
          setRole(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserRole = async (userId: string) => {
    try {
      console.log('Fetching role for user:', userId);
      
      // First check hardcoded admin emails for development convenience
      if (user?.email === 'demo@example.com' || 
          user?.email === 'admin@example.com') {
        setRole('admin');
        console.log('Admin user detected via hardcoded check - setting admin role');
        setIsLoading(false);
        return;
      }

      // Try to get role from database using the fixed function
      const { data, error } = await supabase.rpc('get_user_role', { user_id: userId });

      if (error) {
        console.error('Error fetching user role:', error);
        
        // Check for role in the user_roles table directly as fallback
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', userId)
          .single();
        
        if (roleError || !roleData) {
          console.log('No role found in database, defaulting to customer');
          setRole('customer');
          setIsLoading(false);
          return;
        }
        
        console.log('Role found in database:', roleData.role);
        setRole(roleData.role);
        setIsLoading(false);
        return;
      }

      console.log('Role from RPC function:', data);
      setRole(data || 'customer');
      console.log(`Role set to ${data || 'customer'} from database`);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to fetch user role:', error);
      setRole('customer');
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      // In demo mode, just set the mock user
      setUser({
        id: '00000000-0000-0000-0000-000000000000',
        email: 'demo@example.com',
        user_metadata: {
          name: 'Demo User'
        },
        app_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        phone: '',
        email_confirmed_at: new Date().toISOString(),
        confirmed_at: new Date().toISOString(),
        last_sign_in_at: new Date().toISOString(),
        role: 'authenticated'
      } as User);
      setRole('admin');
      navigate('/');
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      // In demo mode, just set the mock user
      setUser({
        id: '00000000-0000-0000-0000-000000000000',
        email: email,
        user_metadata: {
          name: 'Demo User'
        },
        app_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        phone: '',
        email_confirmed_at: new Date().toISOString(),
        confirmed_at: new Date().toISOString(),
        last_sign_in_at: new Date().toISOString(),
        role: 'authenticated'
      } as User);
      setRole('admin');
      navigate('/');
    } catch (error) {
      console.error('Error signing in with email:', error);
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, password: string) => {
    try {
      // In demo mode, just set the mock user
      setUser({
        id: '00000000-0000-0000-0000-000000000000',
        email: email,
        user_metadata: {
          name: 'Demo User'
        },
        app_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        phone: '',
        email_confirmed_at: new Date().toISOString(),
        confirmed_at: new Date().toISOString(),
        last_sign_in_at: new Date().toISOString(),
        role: 'authenticated'
      } as User);
      setRole('admin');
      navigate('/');
    } catch (error) {
      console.error('Error signing up with email:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      // In demo mode, just clear the user
      setUser(null);
      setRole(null);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const value = {
    user,
    session,
    isLoading,
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
