
import { User, Session, WeakPassword } from '@supabase/supabase-js';
import { UserRole } from '@/hooks/useUserRole';

export type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  role: UserRole | null;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<{
    user: User | null;
    session: Session | null;
  } | undefined>;
  signUpWithEmail: (email: string, password: string) => Promise<{
    user: User | null;
    session: Session | null;
  } | undefined>;
  signOut: () => Promise<void>;
};
