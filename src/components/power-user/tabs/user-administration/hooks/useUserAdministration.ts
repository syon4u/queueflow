
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuditLog } from '@/hooks/power-user/useAuditLog';

export const useUserAdministration = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { logAction } = useAuditLog();

  // Fetch users with profiles and roles using the new user_profiles view
  const { data: users = [], isLoading, error, refetch } = useQuery({
    queryKey: ['power-user-administration'],
    queryFn: async () => {
      console.log('Fetching users from user_profiles view...');
      
      const { data: profiles, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user profiles:', error);
        throw error;
      }

      console.log('Fetched user profiles:', profiles);

      return profiles.map(profile => ({
        ...profile,
        last_sign_in_at: null // Add this required field for compatibility
      }));
    }
  });

  // Update user role mutation with audit logging
  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, newRole }: { userId: string; newRole: string }) => {
      console.log('Updating user role:', { userId, newRole });
      
      // Get current role for audit logging
      const { data: currentUser } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      const { error } = await supabase
        .from('user_roles')
        .upsert({
          user_id: userId,
          role: newRole
        });

      if (error) throw error;

      // Log the role change
      await logAction({
        action: 'UPDATE_USER_ROLE',
        resource_type: 'user_role',
        resource_id: userId,
        details: {
          old_role: currentUser?.role || 'none',
          new_role: newRole,
          user_id: userId
        }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['power-user-administration'] });
      toast({
        title: 'Success',
        description: 'User role updated successfully'
      });
    },
    onError: (error) => {
      console.error('Error updating user role:', error);
      toast({
        title: 'Error',
        description: 'Failed to update user role',
        variant: 'destructive'
      });
    }
  });

  // Delete user mutation with audit logging
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      console.log('Deleting user:', userId);
      
      // Get user data for audit logging before deletion
      const { data: userData } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      // Delete user roles first
      await supabase.from('user_roles').delete().eq('user_id', userId);
      
      // Delete profile
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      // Log the user deletion
      await logAction({
        action: 'DELETE_USER',
        resource_type: 'user_profile',
        resource_id: userId,
        details: {
          deleted_user: userData,
          user_id: userId
        }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['power-user-administration'] });
      toast({
        title: 'Success',
        description: 'User deleted successfully'
      });
    },
    onError: (error) => {
      console.error('Error deleting user:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete user',
        variant: 'destructive'
      });
    }
  });

  // Calculate role statistics with proper typing
  const roleStats = users.reduce((acc, user) => {
    const role = user.role || 'customer';
    acc[role] = (acc[role] || 0) + 1;
    return acc;
  }, {
    admin: 0,
    power_user: 0, 
    staff: 0,
    customer: 0
  });

  const handleUpdateRole = (userId: string, newRole: string) => {
    console.log('Handle update role called:', { userId, newRole });
    updateRoleMutation.mutate({ userId, newRole });
  };

  const handleCreateUser = () => {
    // This will be handled by the UserCreateDialog component
    return true;
  };

  const handleEditUser = (user: any) => {
    console.log('Edit user selected:', user);
    setSelectedUser(user);
    // This will trigger the edit dialog
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      deleteUserMutation.mutate(userId);
    }
  };

  const addTemporaryData = () => {
    // Refresh the data instead of adding temporary data
    console.log('Refreshing user data...');
    refetch();
  };

  return {
    users,
    isLoading,
    error,
    refetch,
    searchTerm,
    setSearchTerm,
    roleFilter,
    setRoleFilter,
    selectedUser,
    setSelectedUser,
    roleStats,
    updateRolePending: updateRoleMutation.isPending,
    handleUpdateRole,
    handleCreateUser,
    handleEditUser,
    handleDeleteUser,
    addTemporaryData
  };
};
