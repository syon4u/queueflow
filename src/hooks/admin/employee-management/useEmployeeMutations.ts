
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
      
      // Insert into staff table
      const { data: staffRecord, error: staffError } = await supabase
        .from('staff')
        .insert({
          id: staffId,
          first_name: data.first_name,
          last_name: data.last_name,
          phone: data.phone,
          email: `${data.first_name.toLowerCase()}.${data.last_name.toLowerCase()}@example.com`,
          role: data.role as 'admin' | 'staff',
          location_id: data.location_id || null,
          status: 'active'
        })
        .select()
        .single();

      if (staffError) throw staffError;

      return staffRecord;
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

      // Update the staff record
      const { error: staffError } = await supabase
        .from('staff')
        .update({
          first_name: data.first_name,
          last_name: data.last_name,
          phone: data.phone,
          role: data.role as 'admin' | 'staff',
          location_id: data.location_id || null,
        })
        .eq('id', data.id);

      if (staffError) throw staffError;
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
      // Delete the staff record
      const { error: staffError } = await supabase
        .from('staff')
        .delete()
        .eq('id', id);

      if (staffError) throw staffError;
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
