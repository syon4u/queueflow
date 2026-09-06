-- Demo seed applied to the live project on 2026-09-06: 60 completed visits
-- over the previous 14 days (5-32 min waits, 8-27 min service) plus 3
-- no-shows, so analytics surfaces have realistic data for demos.
-- Every seeded row has notes = 'Demo seed data'. Remove with:
--   DELETE FROM public.appointments WHERE notes = 'Demo seed data';
-- (SQL body intentionally omitted here; it is recorded in the project's
--  supabase_migrations.schema_migrations table as seed_demo_appointment_history.)
SELECT 1;
