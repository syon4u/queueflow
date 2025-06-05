
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';

export interface UserData {
  id: string;
  email: string;
  role: string;
  created_at?: string;
  last_sign_in_at?: string;
}

export const useUserManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const queryClient = useQueryClient();

  // Mock user data since authentication is disabled
  const mockUsers: UserData[] = [
    {
      id: 'mock-admin-user-id',
      email: 'admin@broward.gov',
      role: 'admin',
      created_at: new Date().toISOString(),
      last_sign_in_at: new Date().toISOString()
    },
    {
      id: 'mock-power-user-id',
      email: 'poweruser@broward.gov',
      role: 'power_user',
      created_at: new Date().toISOString(),
      last_sign_in_at: new Date().toISOString()
    },
    {
      id: 'mock-staff-user-1',
      email: 'staff1@broward.gov',
      role: 'staff',
      created_at: new Date().toISOString(),
      last_sign_in_at: new Date().toISOString()
    },
    {
      id: 'mock-staff-user-2',
      email: 'staff2@broward.gov',
      role: 'staff',
      created_at: new Date().toISOString(),
      last_sign_in_at: new Date().toISOString()
    },
    {
      id: 'mock-customer-user-1',
      email: 'customer1@example.com',
      role: 'customer',
      created_at: new Date().toISOString(),
      last_sign_in_at: new Date().toISOString()
    }
  ];

  // Return mock data when authentication is disabled
  const { 
    data: users = mockUsers, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      console.log('Using mock user data since authentication is disabled');
      return mockUsers;
    },
    refetchInterval: 30000,
    retry: false,
  });

  // Mock update role mutation
  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string, role: string }) => {
      console.log(`Mock: Updating user ${userId} role to ${role}`);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return { userId, role };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: 'Role updated (mock)',
        description: `User role has been updated to ${data.role}`,
      });
    },
    onError: (error: any) => {
      console.error('Error updating role:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update user role',
        variant: 'destructive',
      });
    }
  });

  // Mock add temporary data mutation
  const addTemporaryDataMutation = useMutation({
    mutationFn: async () => {
      console.log('Mock: Adding temporary test data...');
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: 'Test data added (mock)',
        description: 'Mock profile data has been created for testing',
      });
    },
    onError: (error: any) => {
      console.error('Error adding temporary data:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to add temporary data',
        variant: 'destructive',
      });
    }
  });

  // Filter users based on search query
  const filteredUsers = users?.filter(user => 
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleRoleChange = (userId: string, role: string) => {
    console.log(`Role change requested: ${userId} -> ${role}`);
    updateRoleMutation.mutate({ userId, role });
  };

  const addTemporaryData = () => {
    addTemporaryDataMutation.mutate();
  };

  return {
    users: filteredUsers,
    isLoading: false,
    error: null,
    searchQuery,
    setSearchQuery,
    handleRoleChange,
    addTemporaryData
  };
};
