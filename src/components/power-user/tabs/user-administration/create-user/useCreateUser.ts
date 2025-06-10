
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuditLog } from '@/hooks/power-user/useAuditLog';
import { CreateUserFormData } from './types';

export const useCreateUser = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { logAction } = useAuditLog();

  const createUser = async (formData: CreateUserFormData): Promise<boolean> => {
    setIsLoading(true);

    try {
      console.log('Creating new user with data:', formData);
      
      // Generate a UUID for the new profile
      const userId = crypto.randomUUID();

      // Create user profile with generated UUID
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone || null,
          status: 'active'
        })
        .select()
        .single();

      if (profileError) {
        console.error('Profile creation error:', profileError);
        throw profileError;
      }

      console.log('Profile created:', profile);

      // Set user role
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role: formData.role
        });

      if (roleError) {
        console.error('Role assignment error:', roleError);
        throw roleError;
      }

      console.log('Role assigned successfully');

      // Log the user creation
      await logAction({
        action: 'CREATE_USER',
        resource_type: 'user_profile',
        resource_id: userId,
        details: {
          created_user: {
            id: userId,
            email: formData.email,
            first_name: formData.firstName,
            last_name: formData.lastName,
            role: formData.role
          }
        }
      });

      toast({
        title: 'Success',
        description: 'User created successfully'
      });

      return true;
    } catch (error) {
      console.error('Error creating user:', error);
      toast({
        title: 'Error',
        description: 'Failed to create user',
        variant: 'destructive'
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createUser,
    isLoading
  };
};
