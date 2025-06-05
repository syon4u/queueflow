
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserFormData {
  id?: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: 'admin' | 'staff' | 'customer';
  email: string;
  location_id?: string;
}

export const useUserMutations = (userType: 'staff' | 'employee') => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createUser = useMutation({
    mutationFn: async (data: UserFormData) => {
      const id = crypto.randomUUID();
      
      // Insert profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{ 
          id,
          first_name: data.first_name,
          last_name: data.last_name,
          phone: data.phone || null,
          email: data.email || null,
          status: 'active'
        }]);
      
      if (profileError) throw profileError;

      // Insert user role
      const { error: roleError } = await supabase
        .from('user_roles')
        .upsert({ 
          user_id: id,
          role: data.role
        });
      
      if (roleError) throw roleError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', userType] });
      toast({ title: "Success", description: `${userType} created successfully` });
    },
    onError: (error: any) => {
      toast({ 
        title: "Error", 
        description: `Failed to create ${userType}: ${error.message}`, 
        variant: "destructive" 
      });
    }
  });

  const updateUser = useMutation({
    mutationFn: async (data: UserFormData) => {
      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          first_name: data.first_name,
          last_name: data.last_name,
          phone: data.phone || null,
          email: data.email || null
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
      queryClient.invalidateQueries({ queryKey: ['users', userType] });
      toast({ title: "Success", description: `${userType} updated successfully` });
    },
    onError: (error: any) => {
      toast({ 
        title: "Error", 
        description: `Failed to update ${userType}: ${error.message}`, 
        variant: "destructive" 
      });
    }
  });

  const deleteUser = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', userType] });
      toast({ title: "Success", description: `${userType} deleted successfully` });
    },
    onError: (error: any) => {
      toast({ 
        title: "Error", 
        description: `Failed to delete ${userType}: ${error.message}`, 
        variant: "destructive" 
      });
    }
  });

  return {
    createUser,
    updateUser,
    deleteUser
  };
};
