
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface EmployeeFormData {
  id?: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: 'admin' | 'staff';
  location_id: string;
}

interface Location {
  id: string;
  name: string;
}

export const useEmployeeManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<EmployeeFormData>({
    first_name: '',
    last_name: '',
    phone: '',
    role: 'staff',
    location_id: ''
  });

  // Fetch staff members
  const { data: staffMembers, isLoading } = useQuery({
    queryKey: ['staff-members'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('staff')
        .select(`
          *,
          locations (
            id,
            name
          )
        `)
        .order('created_at', { ascending: false });

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

  const handleAddClick = () => {
    setFormData({
      first_name: '',
      last_name: '',
      phone: '',
      role: 'staff',
      location_id: ''
    });
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  const handleEditClick = (staff: any) => {
    setFormData({
      id: staff.id,
      first_name: staff.first_name,
      last_name: staff.last_name,
      phone: staff.phone || '',
      role: staff.role,
      location_id: staff.location_id || ''
    });
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = async (id: string) => {
    try {
      const { error } = await supabase
        .from('staff')
        .delete()
        .eq('id', id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['staff-members'] });
      
      toast({
        title: 'Success',
        description: 'Employee deleted successfully'
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEditing && formData.id) {
        // Update existing staff member
        const { error } = await supabase
          .from('staff')
          .update({
            first_name: formData.first_name,
            last_name: formData.last_name,
            phone: formData.phone,
            role: formData.role,
            location_id: formData.location_id || null
          })
          .eq('id', formData.id);

        if (error) throw error;
      } else {
        // Create new staff member - generate UUID for id
        const newId = crypto.randomUUID();
        const { error } = await supabase
          .from('staff')
          .insert({
            id: newId,
            first_name: formData.first_name,
            last_name: formData.last_name,
            phone: formData.phone,
            role: formData.role,
            location_id: formData.location_id || null
          });

        if (error) throw error;
      }

      queryClient.invalidateQueries({ queryKey: ['staff-members'] });
      setIsDialogOpen(false);
      
      toast({
        title: 'Success',
        description: `Employee ${isEditing ? 'updated' : 'created'} successfully`
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message
      });
    }
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
    handleSubmit
  };
};
