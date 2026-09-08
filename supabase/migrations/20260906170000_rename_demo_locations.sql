-- Sales-readiness: the live location list was seeded with a prior pilot
-- customer's office names ("Broward County Consumer Protection - ...").
-- Rename to neutral demo names so the admin dashboard, booking form and
-- signage no longer show another organisation's branding.
--
-- Only rows whose name exactly matches are touched; nothing is deleted.

UPDATE public.locations SET name = 'Main Office'              WHERE name = 'Broward County Consumer Protection - Main Office';
UPDATE public.locations SET name = 'North Office'             WHERE name = 'Broward County Consumer Protection - North Office';
UPDATE public.locations SET name = 'West Office'              WHERE name = 'Broward County Consumer Protection - West Office';
UPDATE public.locations SET name = 'Government Center'        WHERE name = 'Broward County Government Center';
UPDATE public.locations SET name = 'Coral Springs Branch'     WHERE name = 'Coral Springs Satellite Office';
UPDATE public.locations SET name = 'Davie Branch'             WHERE name = 'Davie Consumer Services';
UPDATE public.locations SET name = 'Lauderhill Branch'        WHERE name = 'Lauderhill Community Center';
UPDATE public.locations SET name = 'Miramar Branch'           WHERE name = 'Miramar City Center';
UPDATE public.locations SET name = 'Pembroke Pines Branch'    WHERE name = 'Pembroke Pines Service Center';
UPDATE public.locations SET name = 'Plantation Branch'        WHERE name = 'Plantation City Hall Annex';
UPDATE public.locations SET name = 'Sunrise Branch'           WHERE name = 'Sunrise Consumer Protection';

-- NOTE (not applied here): the ~30 seeded services are consumer-protection
-- specific ("Lemon Law Consultation", "Medicare Scam Report", ...). Whether to
-- replace them with a generic catalogue (e.g. "New Application", "Renewal",
-- "Document Drop-off") is a product decision — do it in a follow-up migration
-- once the target vertical for the first demos is chosen.
