
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { handleAuthError, handleAuthSuccess } from '@/utils/auth-helpers';

export const useAuthActions = () => {
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async (email: string, password: string) => {
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
      handleAuthError(error, 'login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (email: string, password: string) => {
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
      handleAuthError(error, 'register');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
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
      handleAuthError(error, 'google');
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
