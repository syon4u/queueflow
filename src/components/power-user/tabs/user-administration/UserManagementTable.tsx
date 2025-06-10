
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Edit, Trash2, Shield } from 'lucide-react';
import { UserSearchFilters } from './UserSearchFilters';
import { UserAdministrationUser } from './types';

interface UserManagementTableProps {
  users: UserAdministrationUser[];
  selectedUserId: string | null;
  onSelectUser: (userId: string) => void;
  onEditUser: (userId: string) => void;
  onUpdateRole: (userId: string, newRole: string) => void;
  onDeleteUser: (userId: string) => void;
  isUpdatingRole: boolean;
}

export const UserManagementTable: React.FC<UserManagementTableProps> = ({
  users,
  selectedUserId,
  onSelectUser,
  onEditUser,
  onUpdateRole,
  onDeleteUser,
  isUpdatingRole
}) => {
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'power_user':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'staff':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'customer':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const formatRole = (role: string) => {
    return role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'inactive':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            Enhanced User Management
          </CardTitle>
          <Badge variant="outline">{users.length} users</Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        {users.length === 0 ? (
          <div className="text-center py-12 px-6">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-500">
              No users available in the database
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">User</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Role</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Created</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr 
                    key={user.id} 
                    className={`border-b hover:bg-gray-50 transition-colors ${
                      selectedUserId === user.id ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => onSelectUser(user.id)}
                  >
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-gray-900">
                          {user.first_name && user.last_name 
                            ? `${user.first_name} ${user.last_name}`
                            : user.email
                          }
                        </p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        <p className="text-xs text-gray-400">ID: {user.id.slice(0, 8)}...</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <Select 
                        value={user.role} 
                        onValueChange={(newRole) => onUpdateRole(user.id, newRole)}
                        disabled={isUpdatingRole}
                      >
                        <SelectTrigger className="w-40">
                          <Badge 
                            variant="outline" 
                            className={`${getRoleBadgeColor(user.role)} border-0`}
                          >
                            {formatRole(user.role)}
                          </Badge>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Administrator</SelectItem>
                          <SelectItem value="power_user">Power User</SelectItem>
                          <SelectItem value="staff">Staff</SelectItem>
                          <SelectItem value="customer">Customer</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="py-4 px-6">
                      <Badge 
                        variant="outline" 
                        className={`${getStatusBadgeColor(user.status || 'active')} border-0`}
                      >
                        {user.status || 'Active'}
                      </Badge>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-500">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditUser(user.id);
                          }}
                          title="Edit user"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteUser(user.id);
                          }}
                          className="text-red-600 hover:text-red-700"
                          title="Delete user"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
