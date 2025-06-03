
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
      // Generate a UUID for the new staff member
      const staffId = crypto.randomUUID();
      
      // Insert into profiles table
      const { data: profileRecord, error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: staffId,
          first_name: data.first_name,
          last_name: data.last_name,
          phone: data.phone,
          email: `${data.first_name.toLowerCase()}.${data.last_name.toLowerCase()}@example.com`,
          status: 'active'
        })
        .select()
        .single();

      if (profileError) throw profileError;

      // Insert user role
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: staffId,
          role: data.role as 'admin' | 'staff' | 'customer'
        });

      if (roleError) throw roleError;

      return profileRecord;
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

      // Update the profile record
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          first_name: data.first_name,
          last_name: data.last_name,
          phone: data.phone,
        })
        .eq('id', data.id);

      if (profileError) throw profileError;

      // Update user role
      const { error: roleError } = await supabase
        .from('user_roles')
        .upsert({
          user_id: data.id,
          role: data.role as 'admin' | 'staff' | 'customer'
        });

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
      // Delete the profile record (this will cascade to user_roles due to foreign key)
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
