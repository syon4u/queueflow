
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { toast } from '@/hooks/use-toast';

export type UserRole = 'customer' | 'staff' | 'supervisor' | 'power_user' | 'admin';

export const useUserRole = (user: User | null) => {
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (!user) {
      setRole(null);
      setIsLoading(false);
      return;
    }

    const fetchUserRole = async (userId: string) => {
      try {
        console.log('Fetching role for user:', userId);
        
        // First check hardcoded admin emails for development convenience
        if (user?.email === 'syon4u@gmail.com' || 
            user?.email === 'syon4uu@gmail.com' || 
            user?.email?.toLowerCase().includes('syon') ||
            user?.email?.toLowerCase().includes('garrick')) {
          setRole('admin');
          console.log('Admin user detected via hardcoded check - setting admin role');
          setIsLoading(false);
          return;
        }

        // Try to get role from database using the fixed function
        const { data, error } = await supabase.rpc('get_user_role', { user_id: userId });

        if (error) {
          console.error('Error fetching user role:', error);
          
          // Check for role in the user_roles table directly as fallback
          const { data: roleData, error: roleError } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', userId)
            .single();
          
          if (roleError || !roleData) {
            console.log('No role found in database, defaulting to customer');
            setRole('customer');
            setIsLoading(false);
            return;
          }
          
          console.log('Role found in database:', roleData.role);
          setRole(roleData.role as UserRole);
          setIsLoading(false);
          return;
        }

        console.log('Role from RPC function:', data);
        setRole(data as UserRole || 'customer');
        console.log(`Role set to ${data || 'customer'} from database`);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch user role:', error);
        toast({
          title: "Error fetching user role",
          description: "Defaulting to customer permissions",
          variant: "destructive",
        });
        setRole('customer');
        setIsLoading(false);
      }
    };

    fetchUserRole(user.id);
  }, [user]);

  return { role, isLoading };
};
