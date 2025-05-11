
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';

export interface UserData {
  id: string;
  email: string;
  role: string;
}

export const useUserManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const queryClient = useQueryClient();

  // Fetch all users
  const { 
    data: users, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data: users, error } = await supabase.auth.admin.listUsers();
      
      if (error) throw error;
      
      // Get roles for all users
      const roles = await Promise.all(
        users.users.map(async (user) => {
          const { data } = await supabase.rpc('get_user_role', { user_id: user.id });
          return {
            id: user.id,
            email: user.email,
            role: data || 'customer'
          };
        })
      );
      
      return roles;
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
