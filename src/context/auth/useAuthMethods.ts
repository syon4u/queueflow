
import { useNavigate } from 'react-router-dom';
import { getErrorMessage } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export const useAuthMethods = () => {
  const navigate = useNavigate();

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });
      
      if (error) throw error;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Logged in successfully",
      });
      
      navigate('/');
    } catch (error) {
      console.error('Error signing in with email:', error);
      toast({
        title: "Error",
        description: getErrorMessage(error) || "Failed to sign in",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Account created successfully! Please check your email for verification.",
      });
      
      navigate('/');
    } catch (error) {
      console.error('Error signing up with email:', error);
      toast({
        title: "Error",
        description: getErrorMessage(error) || "Failed to create account",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Logged out successfully",
      });
      
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error",
        description: getErrorMessage(error) || "Failed to sign out",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signOut,
  };
};
