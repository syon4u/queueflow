
import React from 'react';
import { Navigate } from 'react-router-dom';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { AuthTabs } from '@/components/auth/AuthTabs';
import { AuthLoadingState } from '@/components/auth/AuthLoadingState';
import { useAuthPageLogic } from '@/hooks/auth/useAuthPageLogic';

const AuthPage: React.FC = () => {
  const {
    user,
    role,
    loading,
    isLoading,
    error,
    state,
    handleSignIn,
    handleSignUp
  } = useAuthPageLogic();

  // Show loading while auth state is being determined
  if (loading) {
    return <AuthLoadingState />;
  }

  // If user is authenticated, redirect to appropriate page
  if (user && role) {
    const redirectTo = role === 'admin' ? '/admin' : role === 'power_user' ? '/power-user' : '/staff';
    return <Navigate to={state?.from?.pathname || redirectTo} replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <AuthHeader />
        <AuthTabs
          error={error}
          isLoading={isLoading}
          onSignIn={handleSignIn}
          onSignUp={handleSignUp}
        />
      </div>
    </div>
  );
};

export default AuthPage;
