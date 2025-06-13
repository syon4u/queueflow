
-- Remove the location_id constraint from services table to make services independent of locations
ALTER TABLE public.services 
ALTER COLUMN location_id DROP NOT NULL;

-- Update the foreign key constraint to allow NULL values
-- First drop the existing foreign key if it exists
ALTER TABLE public.services 
DROP CONSTRAINT IF EXISTS services_location_id_fkey;

-- Add it back allowing NULL values
ALTER TABLE public.services 
ADD CONSTRAINT services_location_id_fkey 
FOREIGN KEY (location_id) REFERENCES public.locations(id) ON DELETE SET NULL;

-- Update any existing services to have NULL location_id if you want them to be global
-- Uncomment the line below if you want to make all existing services location-independent
-- UPDATE public.services SET location_id = NULL;
