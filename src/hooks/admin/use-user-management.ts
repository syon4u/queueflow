
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { useUserFilter } from './use-user-filter';
import { UserData } from './types/user-management.types';
import { 
  fetchUsers, 
  fetchStaff, 
  updateUserRole, 
  addTemporaryData 
} from './services/user-management.service';

export type { UserData } from './types/user-management.types';

export const useUserManagement = () => {
  const queryClient = useQueryClient();

  // Fetch all users with their roles
  const { 
    data: users = [], 
    isLoading: isLoadingUsers, 
    error: usersError 
  } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    refetchInterval: 30000, // Refresh every 30 seconds
  });
  
  // Fetch staff members specifically
  const { 
    data: staffMembers = [], 
    isLoading: isLoadingStaff,
    error: staffError
  } = useQuery({
    queryKey: ['staff'],
    queryFn: fetchStaff
  });

  // Update user role
  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: string }) => {
      return updateUserRole(userId, role);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      toast({
        title: 'Role updated',
        description: `User role has been updated to ${data.role}`,
      });
    },
    onError: (error) => {
      console.error('Error updating role:', error);
      toast({
        title: 'Error',
        description: 'Failed to update user role',
        variant: 'destructive',
      });
    }
  });

  // Add temporary data for analytics
  const addTemporaryDataMutation = useMutation({
    mutationFn: addTemporaryData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      toast({
        title: 'Test data added',
        description: 'Temporary data for analytics has been created',
      });
    },
    onError: (error) => {
      console.error('Error adding temporary data:', error);
      toast({
        title: 'Error',
        description: 'Failed to add temporary data',
        variant: 'destructive',
      });
    }
  });

  // Use the filter hook
  const { filteredUsers, searchQuery, setSearchQuery } = useUserFilter(users);

  const handleRoleChange = (userId: string, role: string) => {
    updateRoleMutation.mutate({ userId, role });
  };

  const handleAddTemporaryData = () => {
    addTemporaryDataMutation.mutate();
  };

  const isLoading = isLoadingUsers || isLoadingStaff;
  const error = usersError || staffError;

  return {
    users: filteredUsers,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    handleRoleChange,
    addTemporaryData: handleAddTemporaryData,
    staffMembers
  };
};
