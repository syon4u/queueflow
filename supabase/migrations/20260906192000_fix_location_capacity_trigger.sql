-- locations.current_capacity leaked: update_location_capacity() only released a
-- seat when a row left 'checked_in', but the staff flow goes checked_in ->
-- in_progress (call next) -> completed (mark served), so every served customer
-- stayed counted forever. Main Office showed 2/50 with one person in the queue.
-- Release on leaving either active state, then recompute every counter from
-- the live queue so past leaks are gone.

CREATE OR REPLACE FUNCTION public.update_location_capacity()
RETURNS trigger LANGUAGE plpgsql SET search_path TO 'public' AS $$
DECLARE
  old_active boolean := TG_OP <> 'INSERT' AND OLD.status IN ('checked_in', 'in_progress');
  new_active boolean := TG_OP <> 'DELETE' AND NEW.status IN ('checked_in', 'in_progress');
BEGIN
  IF TG_OP = 'UPDATE' AND OLD.location_id IS DISTINCT FROM NEW.location_id THEN
    -- Moved between locations: release the old seat, take the new one.
    IF old_active THEN
      UPDATE public.locations SET current_capacity = GREATEST(0, current_capacity - 1) WHERE id = OLD.location_id;
    END IF;
    IF new_active THEN
      UPDATE public.locations SET current_capacity = current_capacity + 1 WHERE id = NEW.location_id;
    END IF;
  ELSIF new_active AND NOT old_active THEN
    UPDATE public.locations SET current_capacity = current_capacity + 1 WHERE id = NEW.location_id;
  ELSIF old_active AND NOT new_active THEN
    UPDATE public.locations SET current_capacity = GREATEST(0, current_capacity - 1) WHERE id = OLD.location_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Recompute from the source of truth (same 24h window the queue uses).
UPDATE public.locations l
   SET current_capacity = coalesce(q.n, 0)
  FROM (SELECT location_id, count(*) AS n
          FROM public.appointments
         WHERE status IN ('checked_in', 'in_progress')
           AND coalesce(check_in_time, created_at) >= now() - interval '24 hours'
         GROUP BY location_id) q
 WHERE q.location_id = l.id;

UPDATE public.locations l
   SET current_capacity = 0
 WHERE NOT EXISTS (SELECT 1 FROM public.appointments a
                    WHERE a.location_id = l.id
                      AND a.status IN ('checked_in', 'in_progress')
                      AND coalesce(a.check_in_time, a.created_at) >= now() - interval '24 hours');
