
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SignInForm } from './SignInForm';
import { SignUpForm } from './SignUpForm';
import { ForgotPasswordForm } from './ForgotPasswordForm';

interface AuthTabsProps {
  error: string | null;
  isLoading: boolean;
  onSignIn: (email: string, password: string) => Promise<void>;
  onSignUp: (data: {
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
  }) => Promise<void>;
}

export const AuthTabs: React.FC<AuthTabsProps> = ({
  error,
  isLoading,
  onSignIn,
  onSignUp
}) => {
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Authentication</CardTitle>
        <CardDescription>
          {showForgotPassword 
            ? 'Reset your password to regain access to your account'
            : 'Sign in to your staff account or create a new one'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {showForgotPassword ? (
          <ForgotPasswordForm onBackToLogin={() => setShowForgotPassword(false)} />
        ) : (
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="space-y-4">
              <SignInForm 
                onSubmit={onSignIn} 
                isLoading={isLoading}
                onForgotPassword={() => setShowForgotPassword(true)}
              />
            </TabsContent>

            <TabsContent value="signup" className="space-y-4">
              <SignUpForm onSubmit={onSignUp} isLoading={isLoading} />
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};
