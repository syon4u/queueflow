
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  email: string | null;
  location_id: string | null;
  status: string;
  break_start_time: string | null;
  break_end_time: string | null;
  return_time: string | null;
  break_type: string | null;
  handover_staff_id: string | null;
  created_at: string;
  updated_at: string;
  locations?: {
    id: string;
    name: string;
  };
  user_roles?: {
    role: string;
  };
}

interface ProfileFormData {
  id?: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: 'admin' | 'staff' | 'customer';
  location_id: string;
}

export const useProfileManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    first_name: '',
    last_name: '',
    phone: '',
    role: 'staff',
    location_id: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  // Fetch profiles with staff/admin roles
  const { data: profiles, isLoading } = useQuery({
    queryKey: ['profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          locations(id, name),
          user_roles!inner(role)
        `)
        .in('user_roles.role', ['staff', 'admin']);
      
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
    mutationFn: async (data: ProfileFormData) => {
      const id = crypto.randomUUID();
      
      // Insert profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{ 
          id,
          first_name: data.first_name,
          last_name: data.last_name,
          phone: data.phone || null,
          location_id: data.location_id || null,
          status: 'inactive'
        }]);
      
      if (profileError) throw profileError;

      // Insert or update user role
      const { error: roleError } = await supabase
        .from('user_roles')
        .upsert({ 
          user_id: id,
          role: data.role
        });
      
      if (roleError) throw roleError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      toast({ title: "Success", description: "Profile created successfully" });
      closeDialog();
    },
    onError: (error) => {
      toast({ 
        title: "Error", 
        description: `Failed to create profile: ${error.message}`, 
        variant: "destructive" 
      });
    }
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          first_name: data.first_name,
          last_name: data.last_name,
          phone: data.phone || null,
          location_id: data.location_id || null
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
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      toast({ title: "Success", description: "Profile updated successfully" });
      closeDialog();
    },
    onError: (error) => {
      toast({ 
        title: "Error", 
        description: `Failed to update profile: ${error.message}`, 
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
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      toast({ title: "Success", description: "Profile deleted successfully" });
    },
    onError: (error) => {
      toast({ 
        title: "Error", 
        description: `Failed to delete profile: ${error.message}`, 
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

  const handleEditClick = (profile: Profile) => {
    setFormData({
      id: profile.id,
      first_name: profile.first_name,
      last_name: profile.last_name,
      phone: profile.phone || '',
      role: (profile.user_roles?.role as 'admin' | 'staff' | 'customer') || 'staff',
      location_id: profile.location_id || ''
    });
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (profile: Profile) => {
    if (window.confirm(`Are you sure you want to delete ${profile.first_name} ${profile.last_name}?`)) {
      deleteMutation.mutate(profile.id);
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
    staffMembers: profiles, // Keep the same property name for compatibility
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
