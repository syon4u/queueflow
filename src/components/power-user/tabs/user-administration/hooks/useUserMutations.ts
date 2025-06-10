
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuditLog } from '@/hooks/power-user/useAuditLog';

export const useUserMutations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { logAction } = useAuditLog();

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

  return {
    updateRoleMutation,
    deleteUserMutation
  };
};
