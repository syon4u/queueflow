-- Public (anonymous) customer flows — booking (/customer), kiosk, virtual
-- queue, check-in (/check-in), status (/status) and appointment lookup — read
-- and wrote `customers` and `appointments` directly with the anon key. RLS
-- grants anon INSERT only (no SELECT, no UPDATE), so on the live demo:
--   * every INSERT ... RETURNING failed with "new row violates row-level
--     security policy" (RETURNING needs SELECT), so no booking/kiosk ticket/
--     virtual-queue join ever succeeded;
--   * every lookup returned nothing, so check-in and status always said
--     "No appointment found";
--   * check-in's UPDATE was silently rejected.
-- The client also fetched *all* appointments and filtered by code prefix in
-- the browser, which would have leaked every customer had anon SELECT been
-- granted. Instead of widening RLS, route these flows through SECURITY
-- DEFINER functions that only ever return one customer's own appointment(s),
-- keyed by confirmation code (or last name + phone).

CREATE OR REPLACE FUNCTION public.normalize_phone(p text)
RETURNS text LANGUAGE sql IMMUTABLE AS $$
  SELECT regexp_replace(coalesce(p, ''), '\D', '', 'g')
$$;

-- Everything the customer-facing UI needs about one appointment, plus live
-- queue position / wait when checked in. Internal: not granted to anon.
CREATE OR REPLACE FUNCTION public.public_appointment_payload(p_appointment_id uuid)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE
  r record;
  v_position int;
  v_wait int;
  v_total int;
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
   WHERE location_id = r.location_id AND status IN ('checked_in', 'in_progress');

  IF r.status = 'checked_in' THEN
    -- Ahead of me: everyone being served now, plus everyone who checked in earlier.
    SELECT count(*) + 1, coalesce(sum(coalesce(s2.duration, 15)), 0)
      INTO v_position, v_wait
      FROM appointments a2
      LEFT JOIN services s2 ON s2.id = a2.service_id
     WHERE a2.location_id = r.location_id
       AND a2.id <> r.id
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

-- Appointments matching a confirmation code (APT-xxxxxxxx or CUST-xxxxxxxx,
-- prefix optional) OR an exact last name + phone pair. Newest first, active
-- (checked in / scheduled) first. Never matches on a partial phone or name.
CREATE OR REPLACE FUNCTION public.public_match_appointments(
  p_code text DEFAULT NULL, p_last_name text DEFAULT NULL, p_phone text DEFAULT NULL)
RETURNS SETOF uuid LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_code text := upper(trim(coalesce(p_code, '')));
  v_apt text;
  v_phone text := normalize_phone(p_phone);
BEGIN
  IF v_code <> '' THEN
    IF v_code LIKE 'CUST-%' THEN
      RETURN QUERY
        SELECT a.id FROM appointments a JOIN customers c ON c.id = a.customer_id
         WHERE c.confirmation_number = v_code
         ORDER BY (a.status IN ('checked_in','in_progress')) DESC, (a.status = 'scheduled') DESC, a.scheduled_time DESC
         LIMIT 10;
      RETURN;
    END IF;
    v_apt := lower(CASE WHEN v_code LIKE 'APT-%' THEN substr(v_code, 5) ELSE v_code END);
    IF v_apt ~ '^[0-9a-f]{8}$' THEN
      RETURN QUERY
        SELECT a.id FROM appointments a
         WHERE left(a.id::text, 8) = v_apt
         ORDER BY a.scheduled_time DESC
         LIMIT 10;
    END IF;
    RETURN;
  END IF;

  IF coalesce(trim(p_last_name), '') <> '' AND length(v_phone) >= 7 THEN
    RETURN QUERY
      SELECT a.id FROM appointments a JOIN customers c ON c.id = a.customer_id
       WHERE lower(c.last_name) = lower(trim(p_last_name))
         AND normalize_phone(c.phone) = v_phone
       ORDER BY (a.status IN ('checked_in','in_progress')) DESC, (a.status = 'scheduled') DESC, a.scheduled_time DESC
       LIMIT 10;
  END IF;
END
$$;

-- Best single match (status page, check-in). p_appointment_id is for QR /
-- deep links that already carry the unguessable appointment id.
CREATE OR REPLACE FUNCTION public.public_find_appointment(
  p_code text DEFAULT NULL, p_last_name text DEFAULT NULL, p_phone text DEFAULT NULL, p_appointment_id uuid DEFAULT NULL)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE v_id uuid;
BEGIN
  IF p_appointment_id IS NOT NULL THEN
    v_id := p_appointment_id;
  ELSE
    SELECT id INTO v_id FROM public_match_appointments(p_code, p_last_name, p_phone) AS m(id) LIMIT 1;
  END IF;
  IF v_id IS NULL THEN RETURN NULL; END IF;
  RETURN public_appointment_payload(v_id);
END
$$;

-- All matches (appointment lookup / manage page).
CREATE OR REPLACE FUNCTION public.public_list_appointments(
  p_code text DEFAULT NULL, p_last_name text DEFAULT NULL, p_phone text DEFAULT NULL)
RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT coalesce(jsonb_agg(public_appointment_payload(m.id)), '[]'::jsonb)
    FROM public_match_appointments(p_code, p_last_name, p_phone) AS m(id)
$$;

-- Live queue depth at a location (virtual-queue join screen, signage).
CREATE OR REPLACE FUNCTION public.public_queue_snapshot(p_location_id uuid)
RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT jsonb_build_object(
    'waiting', count(*) FILTER (WHERE a.status = 'checked_in'),
    'in_progress', count(*) FILTER (WHERE a.status = 'in_progress'),
    'estimated_wait_minutes', coalesce(sum(coalesce(s.duration, 15)) FILTER (WHERE a.status = 'checked_in'), 0)
  )
  FROM appointments a LEFT JOIN services s ON s.id = a.service_id
  WHERE a.location_id = p_location_id AND a.status IN ('checked_in', 'in_progress')
$$;

-- Create (or re-use) a customer by phone + last name and book an appointment.
-- p_check_in = true is the kiosk walk-in path: joins the queue immediately.
CREATE OR REPLACE FUNCTION public.public_create_appointment(
  p_first_name text, p_last_name text, p_phone text,
  p_email text DEFAULT NULL, p_service_id uuid DEFAULT NULL, p_location_id uuid DEFAULT NULL,
  p_scheduled_time timestamptz DEFAULT now(), p_reason text DEFAULT NULL, p_notes text DEFAULT NULL,
  p_check_in boolean DEFAULT false)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_customer uuid;
  v_appt uuid;
  v_phone text := normalize_phone(p_phone);
BEGIN
  IF coalesce(trim(p_first_name), '') = '' OR coalesce(trim(p_last_name), '') = '' THEN
    RAISE EXCEPTION 'First and last name are required';
  END IF;
  IF length(v_phone) < 7 THEN
    RAISE EXCEPTION 'A valid phone number is required';
  END IF;
  IF p_service_id IS NULL OR p_location_id IS NULL THEN
    RAISE EXCEPTION 'Service and location are required';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM locations WHERE id = p_location_id) THEN
    RAISE EXCEPTION 'Unknown location';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM services WHERE id = p_service_id AND is_active) THEN
    RAISE EXCEPTION 'Unknown or inactive service';
  END IF;

  SELECT id INTO v_customer FROM customers
   WHERE normalize_phone(phone) = v_phone AND lower(last_name) = lower(trim(p_last_name))
   ORDER BY created_at DESC LIMIT 1;

  IF v_customer IS NULL THEN
    INSERT INTO customers (first_name, last_name, phone, email)
    VALUES (trim(p_first_name), trim(p_last_name), trim(p_phone), nullif(trim(coalesce(p_email, '')), ''))
    RETURNING id INTO v_customer;
  ELSIF nullif(trim(coalesce(p_email, '')), '') IS NOT NULL THEN
    UPDATE customers SET email = trim(p_email) WHERE id = v_customer AND email IS NULL;
  END IF;

  INSERT INTO appointments (customer_id, service_id, location_id, scheduled_time, check_in_time, status, reason_for_visit, notes)
  VALUES (v_customer, p_service_id, p_location_id, coalesce(p_scheduled_time, now()),
          CASE WHEN p_check_in THEN now() END,
          (CASE WHEN p_check_in THEN 'checked_in' ELSE 'scheduled' END)::appointment_status,
          nullif(trim(coalesce(p_reason, '')), ''), nullif(trim(coalesce(p_notes, '')), ''))
  RETURNING id INTO v_appt;

  RETURN public_appointment_payload(v_appt);
END
$$;

-- Arrive for a scheduled appointment. The code must belong to this appointment
-- (APT code, the customer's CUST code, or the full appointment id from a QR).
CREATE OR REPLACE FUNCTION public.public_check_in(p_appointment_id uuid, p_code text DEFAULT NULL)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  r record;
  v_code text := upper(trim(coalesce(p_code, '')));
BEGIN
  SELECT a.id, a.status, c.confirmation_number INTO r
    FROM appointments a JOIN customers c ON c.id = a.customer_id
   WHERE a.id = p_appointment_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Appointment not found'; END IF;
  IF v_code <> ''
     AND v_code <> 'APT-' || upper(left(r.id::text, 8))
     AND v_code <> upper(left(r.id::text, 8))
     AND v_code <> coalesce(r.confirmation_number, '')
     AND v_code <> upper(r.id::text) THEN
    RAISE EXCEPTION 'Confirmation code does not match this appointment';
  END IF;
  IF r.status IN ('checked_in', 'in_progress') THEN
    RETURN public_appointment_payload(r.id);
  END IF;
  IF r.status <> 'scheduled' THEN
    RAISE EXCEPTION 'This appointment is % and cannot be checked in', replace(r.status::text, '_', ' ');
  END IF;
  UPDATE appointments SET status = 'checked_in', check_in_time = now() WHERE id = r.id;
  RETURN public_appointment_payload(r.id);
END
$$;

-- Customer self-service cancel of a not-yet-started appointment.
CREATE OR REPLACE FUNCTION public.public_cancel_appointment(p_appointment_id uuid, p_code text DEFAULT NULL)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  r record;
  v_code text := upper(trim(coalesce(p_code, '')));
BEGIN
  SELECT a.id, a.status, a.notes, c.confirmation_number INTO r
    FROM appointments a JOIN customers c ON c.id = a.customer_id
   WHERE a.id = p_appointment_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Appointment not found'; END IF;
  IF v_code <> ''
     AND v_code <> 'APT-' || upper(left(r.id::text, 8))
     AND v_code <> upper(left(r.id::text, 8))
     AND v_code <> coalesce(r.confirmation_number, '')
     AND v_code <> upper(r.id::text) THEN
    RAISE EXCEPTION 'Confirmation code does not match this appointment';
  END IF;
  IF r.status NOT IN ('scheduled', 'checked_in') THEN
    RAISE EXCEPTION 'This appointment is % and cannot be cancelled', replace(r.status::text, '_', ' ');
  END IF;
  UPDATE appointments
     SET status = 'cancelled',
         notes = concat_ws(E'\n\n', nullif(r.notes, ''), 'Cancelled by customer via portal')
   WHERE id = r.id;
  RETURN public_appointment_payload(r.id);
END
$$;

-- Only the entry points are callable by the public roles.
REVOKE EXECUTE ON FUNCTION public.public_appointment_payload(uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.public_match_appointments(text, text, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.normalize_phone(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.public_find_appointment(text, text, text, uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.public_list_appointments(text, text, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.public_queue_snapshot(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.public_create_appointment(text, text, text, text, uuid, uuid, timestamptz, text, text, boolean) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.public_check_in(uuid, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.public_cancel_appointment(uuid, text) TO anon, authenticated;
