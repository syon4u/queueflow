
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

  // Fetch all users with their roles from the database
  const { 
    data: users = [], 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      try {
        console.log('Fetching users with roles from database...');
        
        // First, let's try to get the current user's role to check permissions
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        console.log('Current authenticated user:', currentUser?.id);
        
        if (!currentUser) {
          console.log('No authenticated user found');
          return [];
        }

        // Call the database function to get users with roles
        const { data, error } = await supabase.rpc('get_users_with_roles');
        
        if (error) {
          console.error('Error fetching users:', error);
          // If we get a permission error, try a different approach
          if (error.message?.includes('Access denied') || error.message?.includes('infinite recursion')) {
            console.log('Permission error detected, falling back to direct query...');
            
            // Fallback: Get users from auth.users directly
            const { data: authUsers, error: authError } = await supabase
              .from('auth.users')
              .select('id, email, created_at, last_sign_in_at');
            
            if (authError) {
              console.error('Fallback auth query failed:', authError);
              throw authError;
            }
            
            console.log('Fallback query successful:', authUsers);
            return authUsers?.map(user => ({
              ...user,
              role: 'customer' // Default role when we can't access role table
            })) || [];
          }
          throw error;
        }
        
        console.log('Fetched users from database:', data);
        return data as UserData[];
      } catch (error) {
        console.error('Error in user management query:', error);
        throw error;
      }
    },
    refetchInterval: 30000, // Refresh every 30 seconds
    retry: (failureCount, error) => {
      // Don't retry permission errors
      if (error?.message?.includes('Access denied') || error?.message?.includes('infinite recursion')) {
        return false;
      }
      return failureCount < 3;
    },
  });

  // Update user role mutation
  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string, role: string }) => {
      console.log(`Updating user ${userId} role to ${role}`);
      
      const { data, error } = await supabase.rpc('update_user_role', {
        target_user_id: userId,
        new_role: role
      });
      
      if (error) {
        console.error('Error updating user role:', error);
        throw error;
      }
      
      return { userId, role };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: 'Role updated',
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

  // Add temporary data for testing (this adds mock users to the temp_staff table)
  const addTemporaryDataMutation = useMutation({
    mutationFn: async () => {
      console.log('Adding temporary test data...');
      
      // Add some temporary staff for testing
      const staffData = [
        { id: 'temp-staff-1', first_name: 'John', last_name: 'Doe', role: 'staff' as const },
        { id: 'temp-staff-2', first_name: 'Jane', last_name: 'Smith', role: 'staff' as const },
        { id: 'temp-staff-3', first_name: 'Alex', last_name: 'Johnson', role: 'admin' as const }
      ];

      // Insert staff data if they don't exist
      for (const staff of staffData) {
        const { error: checkError, data: existingStaff } = await supabase
          .from('temp_staff')
          .select('id')
          .eq('id', staff.id);

        if (!checkError && (!existingStaff || existingStaff.length === 0)) {
          const { error } = await supabase.from('temp_staff').insert(staff);
          if (error) {
            console.error('Error inserting staff:', error);
            throw error;
          }
        }
      }

      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: 'Test data added',
        description: 'Temporary staff data has been created for testing',
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
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    handleRoleChange,
    addTemporaryData
  };
};
