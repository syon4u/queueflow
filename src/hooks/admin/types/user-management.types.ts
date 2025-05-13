
import { type Database } from '@/integrations/supabase/types';

export interface UserData {
  id: string;
  email: string;
  role: string;
  created_at?: string;
  last_sign_in_at?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  location_id?: string;
}

// Define a type for user roles that matches the Supabase enum
export type UserRole = Database['public']['Enums']['user_role'];
