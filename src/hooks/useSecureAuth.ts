
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface SecureAuthRequest {
  action: 'signin' | 'signup' | 'password_reset';
  email: string;
  password?: string;
  metadata?: Record<string, unknown>;
}

interface SecureAuthResult {
  success: boolean;
  data?: unknown;
  error?: string;
  retryAfter?: number;
}

export const useSecureAuth = () => {
  const [isLoading, setIsLoading] = useState(false);

  const makeSecureAuthRequest = async (request: SecureAuthRequest): Promise<SecureAuthResult> => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('auth-security', {
        body: request
      });

      if (error) {
        console.error('Secure auth error:', error);
        
        // Handle rate limiting
        if (error.message?.includes('Rate limit exceeded')) {
          const retryAfter = error.context?.retryAfter || 300;
          toast({
            title: 'Too Many Attempts',
            description: `Please wait ${Math.ceil(retryAfter / 60)} minutes before trying again.`,
            variant: 'destructive'
          });
          return { success: false, error: error.message, retryAfter };
        }
        
        // Handle validation errors
        if (error.context?.details) {
          const validationErrors = error.context.details;
          const errorMessage = validationErrors.map((err: { message: string }) => err.message).join(', ');
          toast({
            title: 'Validation Error',
            description: errorMessage,
            variant: 'destructive'
          });
          return { success: false, error: errorMessage };
        }
        
        return { success: false, error: error.message };
      }

      if (!data.success) {
        return { success: false, error: data.error };
      }

      return { success: true, data: data.data };
    } catch (error) {
      console.error('Secure auth request failed:', error);
      return { success: false, error: 'Network error. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const secureSignIn = async (email: string, password: string) => {
    return makeSecureAuthRequest({
      action: 'signin',
      email,
      password
    });
  };

  const secureSignUp = async (email: string, password: string, metadata?: Record<string, unknown>) => {
    return makeSecureAuthRequest({
      action: 'signup',
      email,
      password,
      metadata
    });
  };

  const securePasswordReset = async (email: string) => {
    return makeSecureAuthRequest({
      action: 'password_reset',
      email
    });
  };

  return {
    isLoading,
    secureSignIn,
    secureSignUp,
    securePasswordReset
  };
};
