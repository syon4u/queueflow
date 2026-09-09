-- Abuse protection for the anonymous customer flows.
--
-- The public_* SECURITY DEFINER functions (20260906190000 / 191000 / 193000)
-- are callable by anyone holding the anon key, i.e. anyone with the URL.
-- Nothing stopped a script from creating thousands of fake customers and
-- appointments, or from walking the 8-hex-char APT code space through the
-- lookup functions. This migration adds fixed-window rate limits keyed by the
-- caller's IP (from the PostgREST request headers) and, for bookings, by the
-- normalized phone number.
--
-- Limits (constants at the top of each function — tune there):
--   public_create_appointment   3 / phone / 10 min, 10 / phone / day, 20 / IP / 10 min
--   public_find_appointment     30 / IP / 5 min  (a miss counts double)
--   public_list_appointments    30 / IP / 5 min  (a miss counts double)
--   public_check_in             20 / IP / 10 min
--   public_cancel_appointment   20 / IP / 10 min
--   public_queue_snapshot       240 / IP / 5 min (signage polls every 10 s)
--   public_signage_board        240 / IP / 5 min
--
-- Over the limit the function raises the bare token RATE_LIMITED, which the
-- client (src/lib/publicQueue.ts) maps to a translated message.
--
-- Notes:
--   * The lookup functions were STABLE; they now write the hit counter, so they
--     are VOLATILE (Postgres refuses data-modifying statements inside a
--     non-volatile function). supabase-js calls rpc() with POST, so nothing
--     else changes.
--   * A RAISE rolls back the whole call, including the hit that tripped the
--     limit, so the counter parks at exactly the limit and every later call in
--     the window trips it again. The same rollback means a call that fails
--     validation ("Appointment not found", ...) does not count; lookups that
--     miss return NULL / [] instead of raising, which is why they can be
--     charged double.
--   * `execute_sql` / the SQL editor run without PostgREST headers, so the
--     subject there is 'unknown'.

CREATE TABLE IF NOT EXISTS public.public_rate_limits (
  bucket       text        NOT NULL,
  subject      text        NOT NULL,
  window_start timestamptz NOT NULL,
  hits         int         NOT NULL DEFAULT 0,
  PRIMARY KEY (bucket, subject, window_start)
);

-- Only the SECURITY DEFINER helpers touch this table.
ALTER TABLE public.public_rate_limits ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.public_rate_limits FROM PUBLIC, anon, authenticated;

-- Caller's IP as seen by PostgREST. Cloudflare's header wins when present;
-- otherwise the first hop in X-Forwarded-For (the client, as set by the edge).
CREATE OR REPLACE FUNCTION public.request_ip()
RETURNS text LANGUAGE plpgsql STABLE SET search_path = public AS $$
DECLARE
  h jsonb;
BEGIN
  BEGIN
    h := nullif(current_setting('request.headers', true), '')::jsonb;
  EXCEPTION WHEN OTHERS THEN
    h := NULL;
  END;
  RETURN coalesce(
    nullif(trim(h->>'cf-connecting-ip'), ''),
    nullif(trim(split_part(h->>'x-forwarded-for', ',', 1)), ''),
    'unknown');
END
$$;

-- Count one hit for (bucket, subject) in the current fixed window and report
-- whether the subject is now over p_limit. Windows are floored to multiples of
-- p_window since the epoch, so each subject holds at most one live row per
-- bucket. Rows older than a day are swept opportunistically (~1 % of calls).
CREATE OR REPLACE FUNCTION public.rate_limit_hit(
  p_bucket text, p_subject text, p_window interval, p_limit int)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_secs  numeric := extract(epoch FROM p_window);
  v_start timestamptz := to_timestamp(floor(extract(epoch FROM now()) / v_secs) * v_secs);
  v_hits  int;
BEGIN
  IF random() < 0.01 THEN
    DELETE FROM public_rate_limits WHERE window_start < now() - interval '1 day';
  END IF;

  INSERT INTO public_rate_limits AS r (bucket, subject, window_start, hits)
  VALUES (p_bucket, coalesce(p_subject, 'unknown'), v_start, 1)
  ON CONFLICT (bucket, subject, window_start)
  DO UPDATE SET hits = r.hits + 1
  RETURNING hits INTO v_hits;

  RETURN v_hits > p_limit;
END
$$;

REVOKE EXECUTE ON FUNCTION public.request_ip() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.rate_limit_hit(text, text, interval, int) FROM PUBLIC, anon, authenticated;

-- ---------------------------------------------------------------------------
-- Bookings (booking form, kiosk walk-in, virtual queue join).
-- Body otherwise as in 20260906190000.
CREATE OR REPLACE FUNCTION public.public_create_appointment(
  p_first_name text, p_last_name text, p_phone text,
  p_email text DEFAULT NULL, p_service_id uuid DEFAULT NULL, p_location_id uuid DEFAULT NULL,
  p_scheduled_time timestamptz DEFAULT now(), p_reason text DEFAULT NULL, p_notes text DEFAULT NULL,
  p_check_in boolean DEFAULT false)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  c_ip_limit        constant int      := 20;
  c_ip_window       constant interval := interval '10 minutes';
  c_phone_limit     constant int      := 3;
  c_phone_window    constant interval := interval '10 minutes';
  c_phone_day_limit constant int      := 10;
  c_phone_day       constant interval := interval '1 day';
  v_customer uuid;
  v_appt uuid;
  v_phone text := normalize_phone(p_phone);
BEGIN
  IF rate_limit_hit('create:ip', request_ip(), c_ip_window, c_ip_limit) THEN
    RAISE EXCEPTION 'RATE_LIMITED';
  END IF;

  IF coalesce(trim(p_first_name), '') = '' OR coalesce(trim(p_last_name), '') = '' THEN
    RAISE EXCEPTION 'First and last name are required';
  END IF;
  IF length(v_phone) < 7 THEN
    RAISE EXCEPTION 'A valid phone number is required';
  END IF;

  IF rate_limit_hit('create:phone', v_phone, c_phone_window, c_phone_limit)
     OR rate_limit_hit('create:phone:day', v_phone, c_phone_day, c_phone_day_limit) THEN
    RAISE EXCEPTION 'RATE_LIMITED';
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

-- ---------------------------------------------------------------------------
-- Lookups (status page, check-in lookup, manage page). A miss is charged
-- twice so code enumeration burns the budget faster than real use.
CREATE OR REPLACE FUNCTION public.public_find_appointment(
  p_code text DEFAULT NULL, p_last_name text DEFAULT NULL, p_phone text DEFAULT NULL, p_appointment_id uuid DEFAULT NULL)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  c_limit  constant int      := 30;
  c_window constant interval := interval '5 minutes';
  v_ip text := request_ip();
  v_id uuid;
  v_payload jsonb;
BEGIN
  IF rate_limit_hit('lookup:ip', v_ip, c_window, c_limit) THEN
    RAISE EXCEPTION 'RATE_LIMITED';
  END IF;

  IF p_appointment_id IS NOT NULL THEN
    v_id := p_appointment_id;
  ELSE
    SELECT id INTO v_id FROM public_match_appointments(p_code, p_last_name, p_phone) AS m(id) LIMIT 1;
  END IF;
  IF v_id IS NOT NULL THEN
    v_payload := public_appointment_payload(v_id);
  END IF;
  IF v_payload IS NULL THEN
    PERFORM rate_limit_hit('lookup:ip', v_ip, c_window, c_limit);
    RETURN NULL;
  END IF;
  RETURN v_payload;
END
$$;

CREATE OR REPLACE FUNCTION public.public_list_appointments(
  p_code text DEFAULT NULL, p_last_name text DEFAULT NULL, p_phone text DEFAULT NULL)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  c_limit  constant int      := 30;
  c_window constant interval := interval '5 minutes';
  v_ip text := request_ip();
  v_result jsonb;
BEGIN
  IF rate_limit_hit('lookup:ip', v_ip, c_window, c_limit) THEN
    RAISE EXCEPTION 'RATE_LIMITED';
  END IF;

  SELECT coalesce(jsonb_agg(public_appointment_payload(m.id)), '[]'::jsonb)
    INTO v_result
    FROM public_match_appointments(p_code, p_last_name, p_phone) AS m(id);

  IF jsonb_array_length(v_result) = 0 THEN
    PERFORM rate_limit_hit('lookup:ip', v_ip, c_window, c_limit);
  END IF;
  RETURN v_result;
END
$$;

-- ---------------------------------------------------------------------------
-- Check-in / cancel. Appointment ids are unguessable UUIDs, so a modest
-- per-IP ceiling is enough.
CREATE OR REPLACE FUNCTION public.public_check_in(p_appointment_id uuid, p_code text DEFAULT NULL)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  c_limit  constant int      := 20;
  c_window constant interval := interval '10 minutes';
  r record;
  v_code text := upper(trim(coalesce(p_code, '')));
BEGIN
  IF rate_limit_hit('checkin:ip', request_ip(), c_window, c_limit) THEN
    RAISE EXCEPTION 'RATE_LIMITED';
  END IF;

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

CREATE OR REPLACE FUNCTION public.public_cancel_appointment(p_appointment_id uuid, p_code text DEFAULT NULL)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  c_limit  constant int      := 20;
  c_window constant interval := interval '10 minutes';
  r record;
  v_code text := upper(trim(coalesce(p_code, '')));
BEGIN
  IF rate_limit_hit('cancel:ip', request_ip(), c_window, c_limit) THEN
    RAISE EXCEPTION 'RATE_LIMITED';
  END IF;

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

-- ---------------------------------------------------------------------------
-- Polled read-only views (virtual queue join screen, lobby signage). Signage
-- polls every 10 s = 30 per 5 min per screen; 240 leaves room for several
-- screens behind one NAT. Body as in 20260906191000.
CREATE OR REPLACE FUNCTION public.public_queue_snapshot(p_location_id uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  c_limit  constant int      := 240;
  c_window constant interval := interval '5 minutes';
  v_result jsonb;
BEGIN
  IF rate_limit_hit('poll:ip', request_ip(), c_window, c_limit) THEN
    RAISE EXCEPTION 'RATE_LIMITED';
  END IF;

  SELECT jsonb_build_object(
    'waiting', count(*) FILTER (WHERE a.status = 'checked_in'),
    'in_progress', count(*) FILTER (WHERE a.status = 'in_progress'),
    'estimated_wait_minutes', coalesce(sum(coalesce(s.duration, 15)) FILTER (WHERE a.status = 'checked_in'), 0)
  )
  INTO v_result
  FROM appointments a LEFT JOIN services s ON s.id = a.service_id
  WHERE a.location_id = p_location_id
    AND a.status IN ('checked_in', 'in_progress')
    AND coalesce(a.check_in_time, a.created_at) >= now() - interval '24 hours';

  RETURN v_result;
END
$$;

-- Body as in 20260906193000.
CREATE OR REPLACE FUNCTION public.public_signage_board(p_location_id uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  c_limit  constant int      := 240;
  c_window constant interval := interval '5 minutes';
  loc record;
  v_window timestamptz := now() - interval '24 hours';
  v_day timestamptz := date_trunc('day', now());
  v_waiting jsonb;
  v_serving jsonb;
  v_waiting_n int;
  v_serving_n int;
  v_completed int;
  v_avg int;
BEGIN
  IF rate_limit_hit('poll:ip', request_ip(), c_window, c_limit) THEN
    RAISE EXCEPTION 'RATE_LIMITED';
  END IF;

  SELECT id, name, current_capacity, max_capacity, queue_status
    INTO loc FROM locations WHERE id = p_location_id;
  IF NOT FOUND THEN RETURN NULL; END IF;

  SELECT coalesce(jsonb_agg(jsonb_build_object(
           'ticket_number', upper(right(w.id::text, 8)),
           'customer_name', w.first_name || ' ' || left(coalesce(w.last_name, ''), 1) || '.',
           'service_name', coalesce(w.service_name, 'Service'),
           'position', w.rn,
           'current_wait_time_minutes', floor(extract(epoch FROM (now() - w.arrived)) / 60)::int
         ) ORDER BY w.rn), '[]'::jsonb), count(*)
    INTO v_waiting, v_waiting_n
    FROM (SELECT a.id, c.first_name, c.last_name, s.name AS service_name,
                 coalesce(a.check_in_time, a.created_at) AS arrived,
                 row_number() OVER (ORDER BY coalesce(a.check_in_time, a.created_at)) AS rn
            FROM appointments a
            JOIN customers c ON c.id = a.customer_id
            LEFT JOIN services s ON s.id = a.service_id
           WHERE a.location_id = p_location_id
             AND a.status = 'checked_in'
             AND coalesce(a.check_in_time, a.created_at) >= v_window) w;

  SELECT coalesce(jsonb_agg(jsonb_build_object(
           'ticket_number', upper(right(a.id::text, 8)),
           'customer_name', c.first_name || ' ' || left(coalesce(c.last_name, ''), 1) || '.',
           'service_name', coalesce(s.name, 'Service')
         ) ORDER BY a.start_time NULLS LAST), '[]'::jsonb), count(*)
    INTO v_serving, v_serving_n
    FROM appointments a
    JOIN customers c ON c.id = a.customer_id
    LEFT JOIN services s ON s.id = a.service_id
   WHERE a.location_id = p_location_id
     AND a.status = 'in_progress'
     AND coalesce(a.check_in_time, a.created_at) >= v_window;

  SELECT count(*),
         coalesce(round(avg(extract(epoch FROM (a.start_time - a.check_in_time)) / 60))::int, 15)
    INTO v_completed, v_avg
    FROM appointments a
   WHERE a.location_id = p_location_id
     AND a.status = 'completed'
     AND coalesce(a.end_time, a.updated_at) >= v_day;

  RETURN jsonb_build_object(
    'location_id', loc.id,
    'location_name', loc.name,
    'currently_serving', v_serving_n,
    'total_waiting', v_waiting_n,
    'completed_today', v_completed,
    'average_wait_time_minutes', greatest(v_avg, 0),
    'queue_status', CASE WHEN loc.queue_status = 'closed' THEN 'closed'
                         WHEN v_waiting_n + v_serving_n = 0 THEN 'empty'
                         ELSE 'active' END,
    'capacity', jsonb_build_object(
      'current', coalesce(loc.current_capacity, 0),
      'maximum', coalesce(loc.max_capacity, 0),
      'utilization_percentage', CASE WHEN coalesce(loc.max_capacity, 0) > 0
                                     THEN round(100.0 * coalesce(loc.current_capacity, 0) / loc.max_capacity)::int
                                     ELSE 0 END),
    'queue', jsonb_build_object('waiting', v_waiting, 'currently_serving', v_serving),
    'last_updated', now()
  );
END
$$;

-- GRANTs are unchanged: CREATE OR REPLACE keeps the existing ACLs from
-- 20260906190000 / 20260906193000 (anon + authenticated may EXECUTE the
-- public_* entry points; the helpers above are definer-only).
