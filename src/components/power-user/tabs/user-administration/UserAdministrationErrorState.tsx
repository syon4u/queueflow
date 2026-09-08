
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface UserAdministrationErrorStateProps {
  error: Error;
  onRetry: () => void;
}

export const UserAdministrationErrorState: React.FC<UserAdministrationErrorStateProps> = ({
  error,
  onRetry
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">User Administration</h2>
          <p className="text-gray-600">Manage user accounts, roles, and permissions (role checks disabled)</p>
        </div>
      </div>
      
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <div>
              <h3 className="font-medium text-red-900">Failed to load users</h3>
              <p className="text-sm text-red-700 mt-1">
                {error.message || 'Unable to connect to Supabase database'}
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onRetry}
                className="mt-3 border-red-300 text-red-700 hover:bg-red-100"
              >
                Retry Connection
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
