import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { UserStatsCards } from '../users/UserStatsCards';
import { UserSearchFilters } from '../users/UserSearchFilters';
import { UserTable } from '../users/UserTable';

interface User {
  id: string;
  email: string;
  role: string;
  created_at: string;
  last_sign_in_at: string;
  first_name?: string;
  last_name?: string;
}

export const UserAdministrationTab: React.FC = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  // Fetch users by combining auth users with profiles and roles
  const { data: users = [], isLoading, refetch } = useQuery({
    queryKey: ['staff-users'],
    queryFn: async () => {
      // Get all users with roles (staff, admin, power_user only)
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role')
        .in('role', ['admin', 'staff', 'power_user']);
      
      if (rolesError) throw rolesError;
      
      if (!userRoles || userRoles.length === 0) {
        return [];
      }

      // Get profiles for these users
      const userIds = userRoles.map(ur => ur.user_id);
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', userIds);

      if (profilesError) throw profilesError;

      // Get auth data using the RPC function
      const { data: authUsers, error: authError } = await supabase.rpc('get_users_with_roles');
      
      if (authError) throw authError;

      // Combine the data
      return userRoles.map(userRole => {
        const profile = profiles?.find(p => p.id === userRole.user_id);
        const authUser = authUsers?.find(au => au.id === userRole.user_id);
        
        return {
          id: userRole.user_id,
          email: authUser?.email || profile?.email || '',
          role: userRole.role,
          created_at: authUser?.created_at || '',
          last_sign_in_at: authUser?.last_sign_in_at || '',
          first_name: profile?.first_name || '',
          last_name: profile?.last_name || '',
        } as User;
      }).filter(user => user.email); // Filter out users without email
    }
  });

  const filteredUsers = users.filter(user => {
    const matchesSearch = searchTerm === '' || 
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase.rpc('update_user_role', {
        target_user_id: userId,
        new_role: newRole
      });
      if (error) throw error;
      toast({
        title: "Success",
        description: `User role updated to ${newRole}`
      });
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive"
      });
    }
  };

  const handleCreateUser = () => {
    toast({
      title: "Create User",
      description: "User creation form would open here"
    });
  };

  const handleEditUser = (userId: string) => {
    setSelectedUser(userId);
    toast({
      title: "Edit User",
      description: "User edit form would open here"
    });
  };

  const handleDeleteUser = (userId: string) => {
    toast({
      title: "Delete User",
      description: "User deletion confirmation would appear here",
      variant: "destructive"
    });
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'staff':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'power_user':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'customer':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const formatRole = (role: string) => {
    return role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const roleStats = {
    admin: users.filter(u => u.role === 'admin').length,
    staff: users.filter(u => u.role === 'staff').length,
    power_user: users.filter(u => u.role === 'power_user').length,
    customer: users.filter(u => u.role === 'customer').length
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-left">User Administration</h2>
          <p className="text-gray-600">Manage user accounts, roles, and permissions across the system</p>
        </div>
        <Button onClick={handleCreateUser} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Create User
        </Button>
      </div>

      {/* Role Statistics */}
      <UserStatsCards roleStats={roleStats} />

      {/* User Management */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Badge variant="outline">{filteredUsers.length} users</Badge>
          </div>
          
          {/* Search and Filter Controls */}
          <UserSearchFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            roleFilter={roleFilter}
            setRoleFilter={setRoleFilter}
          />
        </CardHeader>
        
        <CardContent className="p-0">
          <UserTable
            filteredUsers={filteredUsers}
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
            handleUpdateRole={handleUpdateRole}
            handleEditUser={handleEditUser}
            handleDeleteUser={handleDeleteUser}
            getRoleBadgeColor={getRoleBadgeColor}
            formatRole={formatRole}
          />
        </CardContent>
      </Card>
    </div>
  );
};
