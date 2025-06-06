
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

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
        <h2 className="text-2xl font-bold text-gray-900 mb-2">User Administration</h2>
        <p className="text-gray-600">
          Manage user accounts, roles, and permissions (role checks disabled)
          {userCount > 0 && (
            <span className="ml-2 text-sm text-green-600">
              • Connected to Supabase ({userCount} users loaded)
            </span>
          )}
        </p>
      </div>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={onRefresh}
          disabled={isLoading}
        >
          Refresh Data
        </Button>
        <Button onClick={onCreateUser} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Create User
        </Button>
      </div>
    </div>
  );
};
