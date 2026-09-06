-- The location rename (20260906170000) left the prior pilot customer's
-- mailboxes on 11 rows (…@broward.org), which the power-user Locations table
-- and signage footer display. Point them at neutral demo addresses derived
-- from the location name. Nothing is deleted.
UPDATE public.locations
   SET email = regexp_replace(lower(name), '[^a-z0-9]+', '-', 'g') || '@example.com'
 WHERE email ILIKE '%broward%';
