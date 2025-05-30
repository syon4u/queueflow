
import { supabase } from '@/integrations/supabase/client';
import { UserData, UserRole } from '../types/user-management.types';

export async function fetchUsers(): Promise<UserData[]> {
  try {
    // Get all auth users via staff list
    const { data: staffData, error: staffError } = await supabase
      .from('temp_staff')
      .select('id, first_name, last_name, phone, location_id, role, created_at');
    
    if (staffError) throw staffError;
    
    // Get all user_roles entries
    const { data: userRoles, error: rolesError } = await supabase
      .from('user_roles')
      .select('*');
    
    if (rolesError) throw rolesError;
    
    // Create a unified list with user details and their roles
    const mergedUsers: UserData[] = staffData.map(staff => {
      const roleRecord = userRoles?.find(r => r.user_id === staff.id);
      return {
        id: staff.id,
        email: `${staff.first_name.toLowerCase()}.${staff.last_name.toLowerCase()}@example.com`,
        role: roleRecord?.role || staff.role || 'customer',
        first_name: staff.first_name,
        last_name: staff.last_name,
        phone: staff.phone,
        location_id: staff.location_id,
        created_at: staff.created_at,
        last_sign_in_at: new Date().toISOString()
      };
    });
    
    // Add some more mock users for testing
    mergedUsers.push(
      {
        id: 'mock-admin-1',
        email: 'admin@example.com',
        role: 'admin',
        first_name: 'Admin',
        last_name: 'User',
        created_at: new Date().toISOString(),
        last_sign_in_at: new Date().toISOString()
      },
      {
        id: 'mock-staff-1',
        email: 'staff@example.com',
        role: 'staff',
        first_name: 'Staff',
        last_name: 'Member',
        created_at: new Date().toISOString(),
        last_sign_in_at: new Date().toISOString()
      },
      {
        id: 'mock-customer-1',
        email: 'customer@example.com',
        role: 'customer',
        first_name: 'Regular',
        last_name: 'Customer',
        created_at: new Date().toISOString(),
        last_sign_in_at: new Date().toISOString()
      }
    );
    
    return mergedUsers;
  } catch (error) {
    console.error('Error in user management:', error);
    throw error;
  }
}

export async function fetchStaff() {
  try {
    const { data, error } = await supabase
      .from('staff')
      .select('*, locations(name)');
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching staff:', error);
    return [];
  }
}

export async function updateUserRole(userId: string, role: string) {
  // First check if the user has a role record
  const { data: existingRole, error: checkError } = await supabase
    .from('user_roles')
    .select('*')
    .eq('user_id', userId);
  
  if (checkError) throw checkError;
  
  if (existingRole && existingRole.length > 0) {
    // Update existing role
    const { error } = await supabase
      .from('user_roles')
      .update({ role })
      .eq('user_id', userId);
      
    if (error) throw error;
  } else {
    // Insert new role
    const { error } = await supabase
      .from('user_roles')
      .insert({ user_id: userId, role });
      
    if (error) throw error;
  }
  
  // Also update in staff table if the user exists there
  const { data: staffUser } = await supabase
    .from('temp_staff')
    .select('id')
    .eq('id', userId);
    
  if (staffUser && staffUser.length > 0) {
    await supabase
      .from('temp_staff')
      .update({ role: role as UserRole })
      .eq('id', userId);
  }
  
  return { userId, role };
}

export async function addTemporaryData() {
  // Add some temporary staff for analytics
  const staffData = [
    { id: 'temp-staff-1', first_name: 'John', last_name: 'Doe', role: 'staff' as UserRole, location_id: null },
    { id: 'temp-staff-2', first_name: 'Jane', last_name: 'Smith', role: 'staff' as UserRole, location_id: null },
    { id: 'temp-staff-3', first_name: 'Alex', last_name: 'Johnson', role: 'admin' as UserRole, location_id: null }
  ];

  // Insert staff data if they don't exist
  for (const staff of staffData) {
    const { error: checkError, data: existingStaff } = await supabase
      .from('temp_staff')
      .select('id')
      .eq('id', staff.id);

    if (!checkError && (!existingStaff || existingStaff.length === 0)) {
      const { error } = await supabase.from('temp_staff').insert(staff);
      if (error) throw error;
    }
  }
  
  // Add user roles for analytics
  const roleData = [
    { user_id: 'temp-staff-1', role: 'staff' },
    { user_id: 'temp-staff-2', role: 'staff' },
    { user_id: 'temp-staff-3', role: 'admin' }
  ];

  for (const role of roleData) {
    const { error: checkError, data: existingRole } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', role.user_id);

    if (!checkError && (!existingRole || existingRole.length === 0)) {
      const { error } = await supabase.from('user_roles').insert(role);
      if (error) throw error;
    }
  }

  return { success: true };
}
