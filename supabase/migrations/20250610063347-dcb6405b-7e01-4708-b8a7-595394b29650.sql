
-- Remove RLS from locations table and make it publicly accessible
ALTER TABLE public.locations DISABLE ROW LEVEL SECURITY;

-- Remove RLS from services table and make it publicly accessible  
ALTER TABLE public.services DISABLE ROW LEVEL SECURITY;

-- Grant public access to locations table
GRANT SELECT ON public.locations TO anon;
GRANT SELECT ON public.locations TO authenticated;

-- Grant public access to services table
GRANT SELECT ON public.services TO anon;
GRANT SELECT ON public.services TO authenticated;

-- Drop any existing RLS policies on locations (if any exist)
DROP POLICY IF EXISTS "Enable read access for all users" ON public.locations;
DROP POLICY IF EXISTS "locations_select_policy" ON public.locations;

-- Drop any existing RLS policies on services (if any exist)
DROP POLICY IF EXISTS "Enable read access for all users" ON public.services;
DROP POLICY IF EXISTS "services_select_policy" ON public.services;
