
import { toast } from '@/components/ui/use-toast';

export interface AuthError {
  message: string;
  code?: string;
}

export const handleAuthError = (error: AuthError, action: 'login' | 'register' | 'google') => {
  const actionMap = {
    login: 'Sign In',
    register: 'Registration', 
    google: 'Google Sign In'
  };

  const defaultMessages = {
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

export const handleAuthSuccess = (action: 'login' | 'register') => {
  const messages = {
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
