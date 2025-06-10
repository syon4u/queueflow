
export interface UserAdministrationUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  status: string;
  created_at: string;
  updated_at: string;
  last_sign_in_at?: string | null;
}

export interface RoleStats {
  admin: number;
  power_user: number;
  staff: number;
  customer: number;
}

export interface UserAdministrationState {
  searchTerm: string;
  roleFilter: string;
  selectedUser: UserAdministrationUser | null;
}
