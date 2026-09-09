-- Remove the three bookings made while verifying 20260909120000_public_rate_limits
-- (customer 'Rate RateLimitTest', phone 5550000001; the fourth call raised
-- RATE_LIMITED as intended) and reset the hit counters those calls left
-- behind. Nothing else is touched.
DELETE FROM public.appointments
 WHERE customer_id IN (SELECT id FROM public.customers
                        WHERE last_name = 'RateLimitTest' AND public.normalize_phone(phone) = '5550000001');
DELETE FROM public.customers
 WHERE last_name = 'RateLimitTest' AND public.normalize_phone(phone) = '5550000001';
DELETE FROM public.public_rate_limits;
