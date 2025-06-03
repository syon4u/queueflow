
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { handleAuthError, handleAuthSuccess } from '@/utils/auth-helpers';
import { UseAuthActionsReturn } from '@/types/auth';

export const useAuthActions = (): UseAuthActionsReturn => {
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSignIn = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        handleAuthError(error, 'login');
      } else {
        handleAuthSuccess('login');
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
      handleAuthError({ message: error.message || 'An unexpected error occurred' }, 'login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      const { error } = await signUp(email, password);
      
      if (error) {
        handleAuthError(error, 'register');
      } else {
        handleAuthSuccess('register');
      }
    } catch (error: any) {
      console.error('Sign up error:', error);
      handleAuthError({ message: error.message || 'An unexpected error occurred' }, 'register');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const { error } = await signInWithGoogle();
      
      if (error) {
        handleAuthError(error, 'google');
        setIsLoading(false);
      }
      // Don't set loading to false here as the redirect will handle it
    } catch (error: any) {
      console.error('Google sign in error:', error);
      handleAuthError({ message: error.message || 'An unexpected error occurred' }, 'google');
      setIsLoading(false);
    }
  };

  return {
    handleSignIn,
    handleSignUp,
    handleGoogleSignIn,
    isLoading
  };
};
