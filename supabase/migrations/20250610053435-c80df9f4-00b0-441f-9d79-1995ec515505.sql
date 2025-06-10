
-- First, drop the user_profiles view that depends on the role column
DROP VIEW IF EXISTS user_profiles CASCADE;

-- Drop the get_current_user_role function first to break all dependencies
DROP FUNCTION IF EXISTS get_current_user_role() CASCADE;

-- Drop ALL policies from ALL tables in the database to ensure no dependencies remain
DO $$
DECLARE
    pol RECORD;
BEGIN
    -- Get all policies from all tables in the public schema
    FOR pol IN SELECT schemaname, tablename, policyname 
               FROM pg_policies 
               WHERE schemaname = 'public'
    LOOP
        BEGIN
            EXECUTE 'DROP POLICY IF EXISTS "' || pol.policyname || '" ON ' || pol.schemaname || '.' || pol.tablename;
        EXCEPTION
            WHEN OTHERS THEN
                -- Continue if there's an error dropping a policy
                CONTINUE;
        END;
    END LOOP;
END $$;

-- Also drop any other functions that might depend on the role column
DROP FUNCTION IF EXISTS has_role(TEXT) CASCADE;
DROP FUNCTION IF EXISTS is_power_user() CASCADE;
DROP FUNCTION IF EXISTS has_power_user_access() CASCADE;
DROP FUNCTION IF EXISTS can_access_customer(UUID) CASCADE;
DROP FUNCTION IF EXISTS can_manage_appointments() CASCADE;

-- Drop any existing enum type
DROP TYPE IF EXISTS user_role CASCADE;

-- Instead of using an enum, let's keep the column as TEXT but add a check constraint
-- First, update any existing data to ensure it matches the allowed values
UPDATE user_roles SET role = 'customer' WHERE role NOT IN ('admin', 'power_user', 'staff', 'customer');

-- Add a check constraint to ensure only valid roles are allowed
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_roles_role_check') THEN
        ALTER TABLE user_roles ADD CONSTRAINT user_roles_role_check 
        CHECK (role IN ('admin', 'power_user', 'staff', 'customer'));
    END IF;
END $$;

-- Set the default and constraints
ALTER TABLE user_roles 
  ALTER COLUMN role SET DEFAULT 'customer',
  ALTER COLUMN role SET NOT NULL,
  ALTER COLUMN user_id SET NOT NULL;

-- Add unique constraint to prevent duplicate role assignments
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_roles_user_id_unique') THEN
        ALTER TABLE user_roles ADD CONSTRAINT user_roles_user_id_unique UNIQUE (user_id);
    END IF;
END $$;

-- Recreate the user_profiles view with proper typing
CREATE OR REPLACE VIEW user_profiles AS
SELECT 
  p.id,
  p.first_name,
  p.last_name,
  p.email,
  p.phone,
  p.status,
  p.created_at,
  p.updated_at,
  COALESCE(ur.role, 'customer') as role
FROM profiles p
LEFT JOIN user_roles ur ON p.id = ur.user_id;

-- Create admin_sessions table for secure session management
CREATE TABLE IF NOT EXISTS admin_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_token TEXT NOT NULL UNIQUE,
  ip_address INET,
  user_agent TEXT,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  revoked_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create audit_log table for tracking admin actions
CREATE TABLE IF NOT EXISTS audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all admin tables (only if not already enabled)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'user_roles' AND relrowsecurity = true) THEN
        ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'admin_sessions' AND relrowsecurity = true) THEN
        ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'audit_log' AND relrowsecurity = true) THEN
        ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'profiles' AND relrowsecurity = true) THEN
        ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Create function to get current user role
CREATE OR REPLACE FUNCTION get_current_user_role()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_role_val TEXT;
BEGIN
  SELECT role INTO user_role_val 
  FROM user_roles 
  WHERE user_id = auth.uid()
  LIMIT 1;
  
  RETURN COALESCE(user_role_val, 'customer');
END;
$$;

-- Recreate essential RLS policies

-- Create RLS policies for user_roles
CREATE POLICY "Admin and power users can view all user roles" ON user_roles
  FOR SELECT USING (
    get_current_user_role() IN ('admin', 'power_user')
  );

CREATE POLICY "Admin can manage all user roles" ON user_roles
  FOR ALL USING (
    get_current_user_role() = 'admin'
  );

-- Create RLS policies for profiles  
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admin and power users can view all profiles" ON profiles
  FOR SELECT USING (
    get_current_user_role() IN ('admin', 'power_user')
  );

CREATE POLICY "Admin can manage all profiles" ON profiles
  FOR ALL USING (
    get_current_user_role() = 'admin'
  );

-- Create RLS policies for admin_sessions
CREATE POLICY "Users can view their own sessions" ON admin_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own sessions" ON admin_sessions
  FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for audit_log
CREATE POLICY "Admin can view all audit logs" ON audit_log
  FOR SELECT USING (
    get_current_user_role() = 'admin'
  );

-- Create function to check if user has required role
CREATE OR REPLACE FUNCTION has_role(required_role TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN get_current_user_role() = required_role OR get_current_user_role() = 'admin';
END;
$$;

-- Recreate other essential role functions
CREATE OR REPLACE FUNCTION is_power_user()
RETURNS BOOLEAN
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT get_current_user_role() = 'power_user';
$$;

CREATE OR REPLACE FUNCTION has_power_user_access()
RETURNS BOOLEAN
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT get_current_user_role() IN ('power_user', 'admin');
$$;

CREATE OR REPLACE FUNCTION can_access_customer(customer_uuid uuid)
RETURNS BOOLEAN
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT 
    CASE 
      WHEN get_current_user_role() IN ('staff', 'admin') THEN true
      ELSE false
    END;
$$;

CREATE OR REPLACE FUNCTION can_manage_appointments()
RETURNS BOOLEAN
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT get_current_user_role() IN ('staff', 'admin');
$$;

-- Create function to log admin actions
CREATE OR REPLACE FUNCTION log_admin_action(
  action_type TEXT,
  resource_type TEXT,
  resource_id UUID DEFAULT NULL,
  old_values JSONB DEFAULT NULL,
  new_values JSONB DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO audit_log (
    user_id,
    action,
    resource_type,
    resource_id,
    old_values,
    new_values,
    ip_address,
    user_agent
  ) VALUES (
    auth.uid(),
    action_type,
    resource_type,
    resource_id,
    old_values,
    new_values,
    inet_client_addr(),
    'admin-portal'
  ) RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$;

-- Create triggers for automatic audit logging on user_roles changes
CREATE OR REPLACE FUNCTION audit_user_roles_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM log_admin_action(
      'CREATE',
      'user_role',
      NEW.id,
      NULL,
      to_jsonb(NEW)
    );
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    PERFORM log_admin_action(
      'UPDATE',
      'user_role',
      NEW.id,
      to_jsonb(OLD),
      to_jsonb(NEW)
    );
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM log_admin_action(
      'DELETE',
      'user_role',
      OLD.id,
      to_jsonb(OLD),
      NULL
    );
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

CREATE TRIGGER audit_user_roles_trigger
  AFTER INSERT OR UPDATE OR DELETE ON user_roles
  FOR EACH ROW EXECUTE FUNCTION audit_user_roles_changes();

-- Drop existing triggers before recreating them to avoid conflicts
DROP TRIGGER IF EXISTS update_admin_sessions_updated_at ON admin_sessions;
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;

-- Add updated_at triggers
CREATE TRIGGER update_admin_sessions_updated_at
  BEFORE UPDATE ON admin_sessions
  FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
