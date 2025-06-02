
import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface EmployeeFormData {
  id?: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: 'admin' | 'staff' | 'customer';
  location_id: string;
}

export const useEmployeeManagement = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<EmployeeFormData>({
    first_name: '',
    last_name: '',
    phone: '',
    role: 'staff',
    location_id: '',
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch staff members from profiles with user_roles
  const { data: staffMembers, isLoading } = useQuery({
    queryKey: ['staff-members'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          first_name,
          last_name,
          phone,
          location_id,
          user_roles!inner(role),
          locations(name)
        `)
        .in('user_roles.role', ['staff', 'admin']);

      if (error) throw error;
      return data;
    },
  });

  // Fetch locations
  const { data: locations } = useQuery({
    queryKey: ['locations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('locations')
        .select('id, name')
        .order('name');

      if (error) throw error;
      return data;
    },
  });

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
      setIsDialogOpen(false);
      resetForm();
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
      setIsDialogOpen(false);
      resetForm();
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

  const resetForm = () => {
    setFormData({
      first_name: '',
      last_name: '',
      phone: '',
      role: 'staff',
      location_id: '',
    });
    setIsEditing(false);
  };

  const handleAddClick = useCallback(() => {
    resetForm();
    setIsDialogOpen(true);
  }, []);

  const handleEditClick = useCallback((member: any) => {
    setFormData({
      id: member.id,
      first_name: member.first_name,
      last_name: member.last_name,
      phone: member.phone || '',
      role: member.user_roles?.role || 'staff',
      location_id: member.location_id || '',
    });
    setIsEditing(true);
    setIsDialogOpen(true);
  }, []);

  const handleDeleteClick = useCallback((id: string) => {
    if (confirm('Are you sure you want to delete this staff member?')) {
      deleteStaffMember.mutate(id);
    }
  }, [deleteStaffMember]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing) {
      updateStaffMember.mutate(formData);
    } else {
      createStaffMember.mutate(formData);
    }
  }, [formData, isEditing, createStaffMember, updateStaffMember]);

  return {
    staffMembers,
    locations,
    isLoading,
    isDialogOpen,
    setIsDialogOpen,
    formData,
    setFormData,
    isEditing,
    handleAddClick,
    handleEditClick,
    handleDeleteClick,
    handleSubmit,
  };
};
