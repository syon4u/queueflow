
import { User, Session } from '@supabase/supabase-js';

export type UserRole = 'admin' | 'staff' | 'customer';

export interface AuthUser extends User {
  role?: UserRole;
}

export interface AuthSession extends Session {
  user: AuthUser;
}

export interface AuthError {
  message: string;
  code?: string;
  status?: number;
}

export interface AuthState {
  user: User | null;
  session: Session | null;
  role: UserRole | null;
  loading: boolean;
}

export interface AuthActions {
  signIn: (email: string, password: string) => Promise<{ error?: AuthError }>;
  signUp: (email: string, password: string, userData?: any) => Promise<{ error?: AuthError }>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<{ error?: AuthError }>;
}

export interface AuthContextType extends AuthState, AuthActions {}
