
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Edit, Trash2 } from 'lucide-react';
import { UserSearchFilters } from './UserSearchFilters';

interface User {
  id: string;
  email: string;
  role: string;
  created_at: string;
  last_sign_in_at: string;
}

interface UserManagementTableProps {
  users: User[];
  searchTerm: string;
  roleFilter: string;
  selectedUser: string | null;
  updateRolePending: boolean;
  onSearchChange: (value: string) => void;
  onRoleFilterChange: (value: string) => void;
  onUserSelect: (userId: string) => void;
  onUpdateRole: (userId: string, newRole: string) => void;
  onEditUser: (userId: string) => void;
  onDeleteUser: (userId: string) => void;
}

export const UserManagementTable: React.FC<UserManagementTableProps> = ({
  users,
  searchTerm,
  roleFilter,
  selectedUser,
  updateRolePending,
  onSearchChange,
  onRoleFilterChange,
  onUserSelect,
  onUpdateRole,
  onEditUser,
  onDeleteUser
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

  // Filter users based on search and role
  const filteredUsers = users.filter(user => {
    const matchesSearch = searchTerm === '' || 
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            User Management (Role Checks Disabled)
          </CardTitle>
          <Badge variant="outline">{filteredUsers.length} users</Badge>
        </div>
        
        <UserSearchFilters
          searchTerm={searchTerm}
          roleFilter={roleFilter}
          onSearchChange={onSearchChange}
          onRoleFilterChange={onRoleFilterChange}
        />
      </CardHeader>
      
      <CardContent className="p-0">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-12 px-6">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-500">
              {searchTerm || roleFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'No users available in the database'
              }
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">User</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Role</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Created</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Last Sign In</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr 
                    key={user.id} 
                    className={`border-b hover:bg-gray-50 transition-colors ${
                      selectedUser === user.id ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => onUserSelect(user.id)}
                  >
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-gray-900">{user.email}</p>
                        <p className="text-sm text-gray-500">ID: {user.id.slice(0, 8)}...</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <Select 
                        value={user.role} 
                        onValueChange={(newRole) => onUpdateRole(user.id, newRole)}
                        disabled={updateRolePending}
                      >
                        <SelectTrigger className="w-36">
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
                    <td className="py-4 px-6 text-sm text-gray-500">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-500">
                      {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'Never'}
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
