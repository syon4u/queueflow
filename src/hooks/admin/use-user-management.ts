
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';

export interface UserData {
  id: string;
  email: string;
  role: string;
}

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
        // First get all user_roles entries
        const { data: userRoles, error: rolesError } = await supabase
          .from('user_roles')
          .select('*');
        
        if (rolesError) console.error('Error fetching user roles:', rolesError);
        
        // Then get current user for demonstration
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) throw new Error('Not authenticated');

        // Create a fake list for demonstration since we can't use auth.admin endpoints
        // In a real app with proper permissions, you would use supabase.auth.admin.listUsers()
        const mockUsers = [
          {
            id: user.id,
            email: user.email || 'current@example.com',
            role: 'admin'
          },
          {
            id: 'mock-user-1',
            email: 'staff@example.com',
            role: 'staff'
          },
          {
            id: 'mock-user-2',
            email: 'customer@example.com',
            role: 'customer'
          }
        ];
        
        // Map roles to users if available
        if (userRoles) {
          return mockUsers.map(user => {
            const roleRecord = userRoles.find(r => r.user_id === user.id);
            return {
              ...user,
              role: roleRecord?.role || user.role || 'customer'
            };
          });
        }
        
        return mockUsers;
      } catch (error) {
        console.error('Error in user management:', error);
        throw error;
      }
    }
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

  // Filter users based on search query
  const filteredUsers = users?.filter(user => 
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleRoleChange = (userId: string, role: string) => {
    updateRoleMutation.mutate({ userId, role });
  };

  return {
    users: filteredUsers,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    handleRoleChange
  };
};
