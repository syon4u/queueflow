
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, ArrowLeft, Home } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const Unauthorized: React.FC = () => {
  const { user, role, signOut } = useAuth();

  const handleSignOut = () => {
    signOut();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Shield className="mx-auto h-12 w-12 text-red-500" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Access Denied
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            You don't have permission to access this page
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Insufficient Permissions</CardTitle>
            <CardDescription>
              The page you're trying to access requires higher privileges than your current account has.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {user && (
              <Alert>
                <AlertDescription>
                  <strong>Current Account:</strong> {user.email}<br />
                  <strong>Current Role:</strong> {role || 'No role assigned'}
                </AlertDescription>
              </Alert>
            )}
            
            <div className="text-sm text-gray-600">
              <p>If you believe this is an error, please:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Contact your system administrator</li>
                <li>Verify you're signed in with the correct account</li>
                <li>Request the appropriate access level</li>
              </ul>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="flex space-x-2 w-full">
              <Button variant="outline" asChild className="flex-1">
                <Link to="/">
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </Link>
              </Button>
              <Button variant="outline" onClick={() => window.history.back()} className="flex-1">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
            </div>
            {user && (
              <Button variant="secondary" onClick={handleSignOut} className="w-full">
                Sign Out & Switch Account
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Unauthorized;
