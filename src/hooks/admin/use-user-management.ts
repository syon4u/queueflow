
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { type Database } from '@/integrations/supabase/types';

export interface UserData {
  id: string;
  email: string;
  role: string;
  created_at?: string;
  last_sign_in_at?: string;
}

// Define a type for user roles that matches the Supabase enum
type UserRole = Database['public']['Enums']['user_role'];

export const useUserManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const queryClient = useQueryClient();

  // Fetch all users with their roles
  const { 
    data: users = [], 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      try {
        // First get all users from auth (this is a mock since we can't access auth.users directly)
        const { data: authUsers, error: authError } = await supabase
          .from('temp_staff') // Using temp_staff for demo purposes
          .select('id, first_name, last_name');
        
        if (authError) throw authError;
        
        // Then get all user_roles entries
        const { data: userRoles, error: rolesError } = await supabase
          .from('user_roles')
          .select('*');
        
        if (rolesError) throw rolesError;
        
        // Create a unified list with user details and their roles
        const mockUsers: UserData[] = authUsers.map(user => {
          const roleRecord = userRoles?.find(r => r.user_id === user.id);
          return {
            id: user.id,
            email: `${user.first_name.toLowerCase()}.${user.last_name.toLowerCase()}@example.com`,
            role: roleRecord?.role || 'customer',
            created_at: new Date().toISOString(),
            last_sign_in_at: new Date().toISOString()
          };
        });
        
        // Add some more mock users for testing
        mockUsers.push(
          {
            id: 'mock-admin-1',
            email: 'admin@example.com',
            role: 'admin',
            created_at: new Date().toISOString(),
            last_sign_in_at: new Date().toISOString()
          },
          {
            id: 'mock-staff-1',
            email: 'staff@example.com',
            role: 'staff',
            created_at: new Date().toISOString(),
            last_sign_in_at: new Date().toISOString()
          },
          {
            id: 'mock-customer-1',
            email: 'customer@example.com',
            role: 'customer',
            created_at: new Date().toISOString(),
            last_sign_in_at: new Date().toISOString()
          }
        );
        
        return mockUsers;
      } catch (error) {
        console.error('Error in user management:', error);
        throw error;
      }
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Update user role
  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string, role: string }) => {
      // First check if the user has a role record
      const { data: existingRole, error: checkError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId);
      
      if (checkError) throw checkError;
      
      if (existingRole && existingRole.length > 0) {
        // Update existing role
        const { error } = await supabase
          .from('user_roles')
          .update({ role })
          .eq('user_id', userId);
          
        if (error) throw error;
      } else {
        // Insert new role
        const { error } = await supabase
          .from('user_roles')
          .insert({ user_id: userId, role });
          
        if (error) throw error;
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
    mutationFn: async () => {
      // Add some temporary staff for analytics
      const staffData = [
        { id: 'temp-staff-1', first_name: 'John', last_name: 'Doe', role: 'staff' as UserRole, location_id: null },
        { id: 'temp-staff-2', first_name: 'Jane', last_name: 'Smith', role: 'staff' as UserRole, location_id: null },
        { id: 'temp-staff-3', first_name: 'Alex', last_name: 'Johnson', role: 'admin' as UserRole, location_id: null }
      ];

      // Insert staff data if they don't exist
      for (const staff of staffData) {
        const { error: checkError, data: existingStaff } = await supabase
          .from('temp_staff')
          .select('id')
          .eq('id', staff.id);

        if (!checkError && (!existingStaff || existingStaff.length === 0)) {
          const { error } = await supabase.from('temp_staff').insert(staff);
          if (error) throw error;
        }
      }
      
      // Add user roles for analytics
      const roleData = [
        { user_id: 'temp-staff-1', role: 'staff' },
        { user_id: 'temp-staff-2', role: 'staff' },
        { user_id: 'temp-staff-3', role: 'admin' }
      ];

      for (const role of roleData) {
        const { error: checkError, data: existingRole } = await supabase
          .from('user_roles')
          .select('*')
          .eq('user_id', role.user_id);

        if (!checkError && (!existingRole || existingRole.length === 0)) {
          const { error } = await supabase.from('user_roles').insert(role);
          if (error) throw error;
        }
      }

      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
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

  // Filter users based on search query
  const filteredUsers = users?.filter(user => 
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleRoleChange = (userId: string, role: string) => {
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
