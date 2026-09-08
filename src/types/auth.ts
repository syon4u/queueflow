
import { User, Session } from '@supabase/supabase-js';

// Define role enum for better type safety
export enum UserRole {
  ADMIN = 'admin',
  STAFF = 'staff',
  CUSTOMER = 'customer',
  POWER_USER = 'power_user'
}

// Union type for roles - provides flexibility while maintaining type safety
export type UserRoleType = 'admin' | 'staff' | 'customer' | 'power_user';

export interface AuthUser extends User {
  role?: UserRoleType;
}

export interface AuthSession extends Session {
  user: AuthUser;
}

export interface AuthError {
  message: string;
  code?: string;
  status?: number;
}

export interface AuthState {
  user: User | null;
  session: Session | null;
  role: UserRoleType | null;
  loading: boolean;
}

export interface AuthActions {
  signIn: (email: string, password: string) => Promise<{ error?: AuthError }>;
  signUp: (email: string, password: string, userData?: Record<string, unknown>) => Promise<{ error?: AuthError }>;
  signOut: () => Promise<{ error?: AuthError }>;
  signInWithGoogle: () => Promise<{ error?: AuthError }>;
  resetPassword: (email: string) => Promise<{ error?: AuthError }>;
  updatePassword: (password: string) => Promise<{ error?: AuthError }>;
  resendConfirmation: (email: string) => Promise<{ error?: AuthError }>;
}

export interface AuthContextType extends AuthState, AuthActions {}

// Form validation types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
}

// Auth hook return types
export interface UseAuthActionsReturn {
  handleSignIn: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  handleSignUp: (email: string, password: string) => Promise<void>;
  handleGoogleSignIn: () => Promise<void>;
  handleSignOut: () => Promise<void>;
  isLoading: boolean;
}

// User role utility types
export interface RolePermissions {
  canManageUsers: boolean;
  canManageStaff: boolean;
  canViewAdmin: boolean;
  canManageAppointments: boolean;
  canViewReports: boolean;
}

// Type guards for better type safety
export const isValidUserRole = (role: string): role is UserRoleType => {
  return ['admin', 'staff', 'customer', 'power_user'].includes(role);
};

export const getUserRolePermissions = (role: UserRoleType | null): RolePermissions => {
  // Role checks disabled - grant all permissions regardless of role
  return {
    canManageUsers: true,
    canManageStaff: true,
    canViewAdmin: true,
    canManageAppointments: true,
    canViewReports: true,
  };
};
