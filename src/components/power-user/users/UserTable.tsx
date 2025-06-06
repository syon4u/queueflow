
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Trash2, Users } from 'lucide-react';

interface User {
  id: string;
  email: string;
  role: string;
  created_at: string;
  last_sign_in_at: string;
  first_name?: string;
  last_name?: string;
}

interface UserTableProps {
  filteredUsers: User[];
  selectedUser: string | null;
  setSelectedUser: (userId: string | null) => void;
  handleUpdateRole: (userId: string, newRole: string) => void;
  handleEditUser: (userId: string) => void;
  handleDeleteUser: (userId: string) => void;
  getRoleBadgeColor: (role: string) => string;
  formatRole: (role: string) => string;
}

export const UserTable: React.FC<UserTableProps> = ({
  filteredUsers,
  selectedUser,
  setSelectedUser,
  handleUpdateRole,
  handleEditUser,
  handleDeleteUser,
  getRoleBadgeColor,
  formatRole
}) => {
  if (filteredUsers.length === 0) {
    return (
      <div className="text-center py-12 px-6">
        <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
        <p className="text-gray-500">Try adjusting your search or filter criteria</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="text-left py-3 px-6 font-medium text-gray-900">Name</th>
            <th className="text-left py-3 px-6 font-medium text-gray-900">Email</th>
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
              onClick={() => setSelectedUser(user.id)}
            >
              <td className="py-4 px-6 text-left">
                <div>
                  <p className="font-medium text-gray-900">
                    {user.first_name || user.last_name 
                      ? `${user.first_name} ${user.last_name}`.trim()
                      : 'N/A'
                    }
                  </p>
                  <p className="text-sm text-gray-500">ID: {user.id.slice(0, 8)}...</p>
                </div>
              </td>
              <td className="py-4 px-6 text-left">
                <p className="font-medium text-gray-900">{user.email}</p>
              </td>
              <td className="py-4 px-6 text-left">
                <Select
                  value={user.role}
                  onValueChange={(newRole) => handleUpdateRole(user.id, newRole)}
                >
                  <SelectTrigger className="w-32">
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
              <td className="py-4 px-6 text-sm text-gray-500 text-left">
                {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
              </td>
              <td className="py-4 px-6 text-sm text-gray-500 text-left">
                {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'Never'}
              </td>
              <td className="py-4 px-6 text-left">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditUser(user.id);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteUser(user.id);
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
  );
};
