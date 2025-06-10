
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, RefreshCw, Shield } from 'lucide-react';

interface UserAdministrationHeaderProps {
  userCount: number;
  onRefresh: () => void;
  onCreateUser: () => void;
  isLoading: boolean;
}

export const UserAdministrationHeader: React.FC<UserAdministrationHeaderProps> = ({
  userCount,
  onRefresh,
  onCreateUser,
  isLoading
}) => {
  return (
    <div className="flex justify-between items-start">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Shield className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Enhanced User Administration</h2>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-gray-600">
            Comprehensive user management with role-based access control and audit logging
          </p>
          {userCount > 0 && (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <Shield className="h-3 w-3 mr-1" />
              {userCount} users loaded
            </Badge>
          )}
        </div>
      </div>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={onRefresh}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
        <Button onClick={onCreateUser} className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create User
        </Button>
      </div>
    </div>
  );
};
