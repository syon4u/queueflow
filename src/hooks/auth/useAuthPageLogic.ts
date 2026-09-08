
import { useState, useEffect } from 'react';
import { getErrorMessage } from '@/lib/utils';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';

interface LocationState {
  from?: {
    pathname: string;
  };
}

export const useAuthPageLogic = () => {
  const { user, role, loading, signIn, signUp } = useAuth();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const state = location.state as LocationState;

  // Handle OAuth callback
  useEffect(() => {
    const handleOAuthCallback = async () => {
      const error = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');
      
      if (error) {
        console.error('OAuth error:', error, errorDescription);
        setError(errorDescription || 'Authentication failed');
        toast({
          title: 'Authentication Failed',
          description: errorDescription || 'Failed to sign in',
          variant: 'destructive'
        });
      }
    };

    handleOAuthCallback();
  }, [searchParams]);

  // Redirect logic
  useEffect(() => {
    if (!loading && user && role) {
      console.log('AuthPage: User authenticated with role, redirecting...', { user: user.email, role });
      
      // Determine redirect path based on role
      let redirectTo = '/staff'; // default for staff role
      
      if (role === 'admin') {
        redirectTo = '/admin';
      } else if (role === 'power_user') {
        redirectTo = '/power-user';
      } else if (role === 'staff') {
        redirectTo = '/staff';
      }
      
      // Use previous location if it was trying to access a protected route
      if (state?.from?.pathname && state.from.pathname !== '/auth') {
        redirectTo = state.from.pathname;
      }
      
      console.log('AuthPage: Redirecting to:', redirectTo);
    }
  }, [user, role, loading, state]);

  const handleSignIn = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        setError(getErrorMessage(error) || 'Failed to sign in');
        toast({
          title: 'Sign In Failed',
          description: getErrorMessage(error) || 'Please check your credentials and try again',
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'Welcome back!',
          description: 'You have been successfully signed in',
        });
        // Redirect will be handled by the useEffect above
      }
    } catch (error) {
      console.error('Sign in error:', error);
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (formData: {
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
  }) => {
    setIsLoading(true);
    setError(null);

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    // Validate password strength
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await signUp(formData.email, formData.password, {
        first_name: formData.firstName,
        last_name: formData.lastName
      });
      
      if (error) {
        setError(getErrorMessage(error) || 'Failed to create account');
        toast({
          title: 'Sign Up Failed',
          description: getErrorMessage(error) || 'Please try again',
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'Account Created!',
          description: 'Welcome to the staff portal',
        });
        // User will be automatically signed in and redirected
      }
    } catch (error) {
      console.error('Sign up error:', error);
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    role,
    loading,
    isLoading,
    error,
    state,
    handleSignIn,
    handleSignUp
  };
};
