
import { User, Session, WeakPassword } from '@supabase/supabase-js';

export type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  role: string | null;
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
