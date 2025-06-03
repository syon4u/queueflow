
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

  // Fetch all users with their roles from the database using user_profiles view
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
      if (error?.message?.includes('Access denied')) {
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

  // Add test data using existing profiles table
  const addTemporaryDataMutation = useMutation({
    mutationFn: async () => {
      console.log('Adding temporary test data...');
      
      // Add some temporary profiles for testing using the profiles table
      const profilesData = [
        { id: crypto.randomUUID(), first_name: 'John', last_name: 'Doe', email: 'john.doe@example.com' },
        { id: crypto.randomUUID(), first_name: 'Jane', last_name: 'Smith', email: 'jane.smith@example.com' },
        { id: crypto.randomUUID(), first_name: 'Alex', last_name: 'Johnson', email: 'alex.johnson@example.com' }
      ];

      // Insert profiles data if they don't exist
      for (const profile of profilesData) {
        const { error: checkError, data: existingProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', profile.email);

        if (!checkError && (!existingProfile || existingProfile.length === 0)) {
          const { error } = await supabase.from('profiles').insert(profile);
          if (error) {
            console.error('Error inserting profile:', error);
            throw error;
          }

          // Add corresponding user roles
          const { error: roleError } = await supabase.from('user_roles').insert({
            user_id: profile.id,
            role: 'staff'
          });
          if (roleError) {
            console.error('Error inserting user role:', roleError);
            throw roleError;
          }
        }
      }

      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: 'Test data added',
        description: 'Temporary profile data has been created for testing',
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
