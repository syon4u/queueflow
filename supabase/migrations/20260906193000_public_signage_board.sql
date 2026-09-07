-- /digital-signage fetched the queue-stats edge function with the (absent)
-- user session as the bearer token, so an unauthenticated lobby screen always
-- showed "Connection Error". Serve the board from a public RPC instead. Names
-- are reduced to first name + last initial because this renders in a lobby.

CREATE OR REPLACE FUNCTION public.public_signage_board(p_location_id uuid)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE
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

GRANT EXECUTE ON FUNCTION public.public_signage_board(uuid) TO anon, authenticated;
