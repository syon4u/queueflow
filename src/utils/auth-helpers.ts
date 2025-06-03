
import { toast } from '@/components/ui/use-toast';
import { AuthError } from '@/types/auth';

export const handleAuthError = (error: AuthError, action: 'login' | 'register' | 'google'): void => {
  const actionMap: Record<string, string> = {
    login: 'Sign In',
    register: 'Registration', 
    google: 'Google Sign In'
  };

  const defaultMessages: Record<string, string> = {
    login: 'Please check your credentials and try again',
    register: 'Please try again with different credentials',
    google: 'Please try again'
  };

  toast({
    title: `${actionMap[action]} Failed`,
    description: error.message || defaultMessages[action],
    variant: 'destructive'
  });
};

export const handleAuthSuccess = (action: 'login' | 'register'): void => {
  const messages: Record<string, { title: string; description: string }> = {
    login: {
      title: 'Welcome back!',
      description: 'You have been successfully signed in'
    },
    register: {
      title: 'Account Created!',
      description: 'Please check your email to verify your account'
    }
  };

  toast({
    title: messages[action].title,
    description: messages[action].description,
  });
};
