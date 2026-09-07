-- Remove the customers/appointments created by the 2026-09-06 end-to-end pass
-- (all tagged notes = 'Demo seed data', first name 'E2E'). Staff-action log
-- rows that reference those appointments go too. Nothing else is touched.
WITH e2e_customers AS (
  SELECT id FROM public.customers WHERE first_name = 'E2E'
), e2e_appointments AS (
  SELECT id FROM public.appointments
   WHERE customer_id IN (SELECT id FROM e2e_customers)
     AND notes LIKE 'Demo seed data%'
), deleted_actions AS (
  DELETE FROM public.staff_actions
   WHERE resource_type = 'appointment'
     AND resource_id IN (SELECT id FROM e2e_appointments)
  RETURNING id
), deleted_appointments AS (
  DELETE FROM public.appointments
   WHERE id IN (SELECT id FROM e2e_appointments)
  RETURNING id
)
DELETE FROM public.customers
 WHERE id IN (SELECT id FROM e2e_customers)
   AND NOT EXISTS (SELECT 1 FROM public.appointments a WHERE a.customer_id = customers.id);

-- Data-modifying CTEs cannot see each other's effects, so the customer rows
-- are removed in a second statement once their appointments are gone.
DELETE FROM public.customers c
 WHERE c.first_name = 'E2E'
   AND NOT EXISTS (SELECT 1 FROM public.appointments a WHERE a.customer_id = c.id);
