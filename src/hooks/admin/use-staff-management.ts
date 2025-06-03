
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Staff {
  id: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  role: 'admin' | 'staff';
  status: string;
}

interface StaffFormData {
  id?: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: 'admin' | 'staff';
  location_id: string;
}

export const useStaffManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<StaffFormData>({
    first_name: '',
    last_name: '',
    phone: '',
    role: 'staff',
    location_id: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  // Fetch staff using user_profiles view
  const { data: staffMembers, isLoading } = useQuery({
    queryKey: ['staff'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .in('role', ['staff', 'admin']);
      
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch locations for select dropdown
  const { data: locations } = useQuery({
    queryKey: ['locations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('locations')
        .select('id, name');
      
      if (error) throw error;
      return data || [];
    }
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: StaffFormData) => {
      const id = crypto.randomUUID();
      
      // Insert into profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{ 
          id,
          first_name: data.first_name,
          last_name: data.last_name,
          phone: data.phone || null,
          status: 'active'
        }]);
      
      if (profileError) throw profileError;

      // Insert user role
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert([{
          user_id: id,
          role: data.role
        }]);

      if (roleError) throw roleError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      toast({ title: "Success", description: "Staff member created successfully" });
      closeDialog();
    },
    onError: (error) => {
      toast({ 
        title: "Error", 
        description: `Failed to create staff member: ${error.message}`, 
        variant: "destructive" 
      });
    }
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (data: StaffFormData) => {
      // Update profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          first_name: data.first_name,
          last_name: data.last_name,
          phone: data.phone || null
        })
        .eq('id', data.id);
      
      if (profileError) throw profileError;

      // Update user role
      const { error: roleError } = await supabase
        .from('user_roles')
        .upsert({
          user_id: data.id!,
          role: data.role
        });

      if (roleError) throw roleError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      toast({ title: "Success", description: "Staff member updated successfully" });
      closeDialog();
    },
    onError: (error) => {
      toast({ 
        title: "Error", 
        description: `Failed to update staff member: ${error.message}`, 
        variant: "destructive" 
      });
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      toast({ title: "Success", description: "Staff member deleted successfully" });
    },
    onError: (error) => {
      toast({ 
        title: "Error", 
        description: `Failed to delete staff member: ${error.message}`, 
        variant: "destructive" 
      });
    }
  });

  const handleAddClick = () => {
    const defaultLocationId = locations && locations.length > 0 ? locations[0].id : '';
    
    setFormData({
      first_name: '',
      last_name: '',
      phone: '',
      role: 'staff',
      location_id: defaultLocationId
    });
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  const handleEditClick = (staff: Staff) => {
    setFormData({
      id: staff.id,
      first_name: staff.first_name,
      last_name: staff.last_name,
      phone: staff.phone || '',
      role: staff.role,
      location_id: ''
    });
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (staff: Staff) => {
    if (window.confirm(`Are you sure you want to delete ${staff.first_name} ${staff.last_name}?`)) {
      deleteMutation.mutate(staff.id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

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
    closeDialog
  };
};
