-- Queue position counted every checked_in row at the location regardless of
-- age, and the live data carried checked-in / scheduled rows from mid-2025 that
-- were never resolved. A brand-new walk-in therefore reported "#2 in line"
-- behind a customer from last year. Two fixes:
--   1. Position / wait / snapshot only consider queue entries from the last
--      24 hours (a queue never legitimately spans days).
--   2. One-time hygiene: anything still checked_in / in_progress / scheduled
--      whose time is more than a day old is a no-show. Nothing is deleted.

CREATE OR REPLACE FUNCTION public.public_appointment_payload(p_appointment_id uuid)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE
  r record;
  v_position int;
  v_wait int;
  v_total int;
  v_window timestamptz := now() - interval '24 hours';
BEGIN
  SELECT a.id, a.status, a.scheduled_time, a.check_in_time, a.created_at,
         a.location_id, a.service_id, a.reason_for_visit, a.notes,
         c.first_name, c.last_name, c.phone, c.email, c.confirmation_number,
         l.name AS location_name, l.address AS location_address,
         s.name AS service_name, s.duration AS service_duration, s.description AS service_description
    INTO r
    FROM appointments a
    JOIN customers c ON c.id = a.customer_id
    LEFT JOIN locations l ON l.id = a.location_id
    LEFT JOIN services s ON s.id = a.service_id
   WHERE a.id = p_appointment_id;
  IF NOT FOUND THEN RETURN NULL; END IF;

  SELECT count(*) INTO v_total
    FROM appointments
   WHERE location_id = r.location_id
     AND status IN ('checked_in', 'in_progress')
     AND coalesce(check_in_time, created_at) >= v_window;

  IF r.status = 'checked_in' THEN
    SELECT count(*) + 1, coalesce(sum(coalesce(s2.duration, 15)), 0)
      INTO v_position, v_wait
      FROM appointments a2
      LEFT JOIN services s2 ON s2.id = a2.service_id
     WHERE a2.location_id = r.location_id
       AND a2.id <> r.id
       AND coalesce(a2.check_in_time, a2.created_at) >= v_window
       AND (a2.status = 'in_progress'
            OR (a2.status = 'checked_in'
                AND coalesce(a2.check_in_time, a2.created_at) < coalesce(r.check_in_time, r.created_at)));
  END IF;

  RETURN jsonb_build_object(
    'appointment_id', r.id,
    'confirmation_code', 'APT-' || upper(left(r.id::text, 8)),
    'customer_confirmation', r.confirmation_number,
    'ticket_number', upper(right(r.id::text, 8)),
    'status', r.status,
    'scheduled_time', r.scheduled_time,
    'check_in_time', r.check_in_time,
    'location_id', r.location_id,
    'location_name', r.location_name,
    'location_address', r.location_address,
    'service_id', r.service_id,
    'service_name', r.service_name,
    'service_duration', r.service_duration,
    'service_description', r.service_description,
    'first_name', r.first_name,
    'last_name', r.last_name,
    'phone', r.phone,
    'email', r.email,
    'reason_for_visit', r.reason_for_visit,
    'notes', r.notes,
    'position', v_position,
    'total_in_queue', v_total,
    'estimated_wait_minutes', coalesce(v_wait, 0)
  );
END
$$;

CREATE OR REPLACE FUNCTION public.public_queue_snapshot(p_location_id uuid)
RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT jsonb_build_object(
    'waiting', count(*) FILTER (WHERE a.status = 'checked_in'),
    'in_progress', count(*) FILTER (WHERE a.status = 'in_progress'),
    'estimated_wait_minutes', coalesce(sum(coalesce(s.duration, 15)) FILTER (WHERE a.status = 'checked_in'), 0)
  )
  FROM appointments a LEFT JOIN services s ON s.id = a.service_id
  WHERE a.location_id = p_location_id
    AND a.status IN ('checked_in', 'in_progress')
    AND coalesce(a.check_in_time, a.created_at) >= now() - interval '24 hours'
$$;

-- One-time hygiene for the demo data: close out entries that are more than a
-- day old and were never served. Location capacity counters follow via the
-- existing update_location_capacity trigger.
UPDATE public.appointments
   SET status = 'no_show',
       notes  = concat_ws(E'\n', nullif(notes, ''), 'Auto-closed: stale queue entry (never served)')
 WHERE status IN ('checked_in', 'in_progress', 'scheduled')
   AND coalesce(check_in_time, scheduled_time) < now() - interval '24 hours';
