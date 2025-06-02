
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { EmployeeFormData } from './types';

export const useEmployeeMutations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Create staff member
  const createStaffMember = useMutation({
    mutationFn: async (data: EmployeeFormData) => {
      // Generate a UUID for the new profile
      const profileId = crypto.randomUUID();
      
      // First create the profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: profileId,
          first_name: data.first_name,
          last_name: data.last_name,
          phone: data.phone,
          location_id: data.location_id || null,
          status: 'inactive'
        })
        .select()
        .single();

      if (profileError) throw profileError;

      // Then set the user role
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: profileId,
          role: data.role,
        });

      if (roleError) throw roleError;

      return profile;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Staff member created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['staff-members'] });
    },
    onError: (error) => {
      console.error('Error creating staff member:', error);
      toast({
        title: "Error",
        description: "Failed to create staff member",
        variant: "destructive",
      });
    },
  });

  // Update staff member
  const updateStaffMember = useMutation({
    mutationFn: async (data: EmployeeFormData) => {
      if (!data.id) throw new Error('No ID provided for update');

      // Update the profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          first_name: data.first_name,
          last_name: data.last_name,
          phone: data.phone,
          location_id: data.location_id || null,
        })
        .eq('id', data.id);

      if (profileError) throw profileError;

      // Update the user role
      const { error: roleError } = await supabase
        .from('user_roles')
        .update({ role: data.role })
        .eq('user_id', data.id);

      if (roleError) throw roleError;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Staff member updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['staff-members'] });
    },
    onError: (error) => {
      console.error('Error updating staff member:', error);
      toast({
        title: "Error",
        description: "Failed to update staff member",
        variant: "destructive",
      });
    },
  });

  // Delete staff member
  const deleteStaffMember = useMutation({
    mutationFn: async (id: string) => {
      // Delete user role first (due to foreign key constraints)
      const { error: roleError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', id);

      if (roleError) throw roleError;

      // Then delete the profile
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);

      if (profileError) throw profileError;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Staff member deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['staff-members'] });
    },
    onError: (error) => {
      console.error('Error deleting staff member:', error);
      toast({
        title: "Error",
        description: "Failed to delete staff member",
        variant: "destructive",
      });
    },
  });

  return {
    createStaffMember,
    updateStaffMember,
    deleteStaffMember,
  };
};
