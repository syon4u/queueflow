
-- Fix security definer view
DROP VIEW IF EXISTS public.user_profiles;
CREATE VIEW public.user_profiles WITH (security_invoker = true) AS
SELECT p.id, p.first_name, p.last_name, p.email, p.phone, p.status, p.created_at, p.updated_at, ur.role
FROM public.profiles p LEFT JOIN public.user_roles ur ON p.id = ur.user_id;

-- Fix function search_path on all security definer functions
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $function$
DECLARE user_role_val TEXT;
BEGIN
  SELECT role INTO user_role_val FROM user_roles WHERE user_id = auth.uid() LIMIT 1;
  RETURN COALESCE(user_role_val, 'customer');
END;
$function$;

CREATE OR REPLACE FUNCTION public.has_role(required_role text)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $function$
BEGIN
  RETURN get_current_user_role() = required_role OR get_current_user_role() = 'admin';
END;
$function$;

CREATE OR REPLACE FUNCTION public.is_power_user()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $function$ SELECT get_current_user_role() = 'power_user'; $function$;

CREATE OR REPLACE FUNCTION public.has_power_user_access()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $function$ SELECT get_current_user_role() IN ('power_user', 'admin'); $function$;

CREATE OR REPLACE FUNCTION public.can_access_customer(customer_uuid uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $function$
  SELECT CASE WHEN get_current_user_role() IN ('staff', 'admin') THEN true ELSE false END;
$function$;

CREATE OR REPLACE FUNCTION public.can_manage_appointments()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $function$ SELECT get_current_user_role() IN ('staff', 'admin'); $function$;

CREATE OR REPLACE FUNCTION public.log_admin_action(action_type text, resource_type text, resource_id uuid DEFAULT NULL::uuid, old_values jsonb DEFAULT NULL::jsonb, new_values jsonb DEFAULT NULL::jsonb)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $function$
DECLARE log_id UUID;
BEGIN
  INSERT INTO audit_log (user_id, action, resource_type, resource_id, old_values, new_values, ip_address, user_agent)
  VALUES (auth.uid(), action_type, resource_type, resource_id, old_values, new_values, inet_client_addr(), 'admin-portal')
  RETURNING id INTO log_id;
  RETURN log_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_user_role(user_id uuid)
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $function$
DECLARE role_val TEXT;
BEGIN
  SELECT ur.role INTO role_val FROM public.user_roles ur WHERE ur.user_id = $1;
  RETURN COALESCE(role_val, 'customer');
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_users_with_roles()
RETURNS TABLE(id uuid, email text, role text, created_at timestamp with time zone, last_sign_in_at timestamp with time zone)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $function$
BEGIN
    IF public.get_current_user_role() != 'admin' THEN RAISE EXCEPTION 'Access denied. Admin role required.'; END IF;
    RETURN QUERY SELECT au.id, au.email::TEXT, COALESCE(ur.role::TEXT, 'customer') as role, au.created_at, au.last_sign_in_at
    FROM auth.users au LEFT JOIN user_roles ur ON au.id = ur.user_id ORDER BY au.created_at DESC;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_user_role(target_user_id uuid, new_role text)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $function$
BEGIN
    IF public.get_current_user_role() != 'admin' THEN RAISE EXCEPTION 'Access denied. Admin role required.'; END IF;
    IF new_role NOT IN ('admin', 'staff', 'customer') THEN RAISE EXCEPTION 'Invalid role. Must be admin, staff, or customer.'; END IF;
    INSERT INTO user_roles (user_id, role) VALUES (target_user_id, new_role::user_role)
    ON CONFLICT (user_id) DO UPDATE SET role = new_role::user_role, updated_at = NOW();
    RETURN TRUE;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_admin_dashboard_stats()
RETURNS json LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $function$
DECLARE result JSON; today_date DATE := CURRENT_DATE;
BEGIN
  WITH today_counts AS (SELECT status, COUNT(*) as count FROM appointments WHERE DATE(scheduled_time) = today_date GROUP BY status),
    service_wait_times_cte AS (SELECT s.id as service_id, s.name as service_name, COALESCE(EXTRACT(EPOCH FROM AVG(a.end_time - a.start_time))/60, 0)::FLOAT as avg_wait_minutes FROM services s LEFT JOIN appointments a ON s.id = a.service_id AND a.status = 'completed' GROUP BY s.id, s.name),
    location_queues AS (SELECT l.id as location_id, l.name as location_name, json_agg(json_build_object('id', a.id, 'customer_id', a.customer_id, 'service_id', a.service_id, 'status', a.status, 'scheduled_time', a.scheduled_time, 'check_in_time', a.check_in_time, 'wait_duration_minutes', CASE WHEN a.check_in_time IS NOT NULL AND a.status = 'checked_in' THEN EXTRACT(EPOCH FROM (NOW() - a.check_in_time))/60 ELSE NULL END) ORDER BY a.check_in_time ASC NULLS LAST, a.scheduled_time ASC) as queue FROM locations l LEFT JOIN appointments a ON l.id = a.location_id AND (a.status = 'checked_in' OR a.status = 'scheduled') AND DATE(a.scheduled_time) = today_date GROUP BY l.id, l.name)
  SELECT json_build_object('today_totals', (SELECT json_object_agg(status, count) FROM today_counts), 'service_wait_times', (SELECT json_agg(json_build_object('service_id', service_id, 'service_name', service_name, 'avg_wait_minutes', avg_wait_minutes)) FROM service_wait_times_cte), 'location_queues', (SELECT json_agg(json_build_object('location_id', location_id, 'location_name', location_name, 'queue', queue)) FROM location_queues), 'generated_at', NOW()) INTO result;
  RETURN result;
END;
$function$;

CREATE OR REPLACE FUNCTION public.calculate_demand_patterns(target_location_id uuid DEFAULT NULL::uuid, target_service_id uuid DEFAULT NULL::uuid)
RETURNS json LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $function$
DECLARE result JSON; pattern_data RECORD;
BEGIN
  FOR pattern_data IN SELECT a.location_id, a.service_id, EXTRACT(DOW FROM a.scheduled_time) as day_of_week, EXTRACT(HOUR FROM a.scheduled_time) as hour_of_day, COUNT(*) as demand_count FROM appointments a WHERE (target_location_id IS NULL OR a.location_id = target_location_id) AND (target_service_id IS NULL OR a.service_id = target_service_id) AND a.scheduled_time >= CURRENT_DATE - INTERVAL '90 days' GROUP BY a.location_id, a.service_id, EXTRACT(DOW FROM a.scheduled_time), EXTRACT(HOUR FROM a.scheduled_time) HAVING COUNT(*) > 0
  LOOP
    INSERT INTO public.demand_patterns (location_id, service_id, pattern_type, pattern_key, average_demand, peak_demand, sample_size) VALUES (pattern_data.location_id, pattern_data.service_id, 'hourly', CONCAT('day_', pattern_data.day_of_week, '_hour_', pattern_data.hour_of_day), pattern_data.demand_count, pattern_data.demand_count, 1) ON CONFLICT (location_id, service_id, pattern_type, pattern_key) DO UPDATE SET average_demand = (demand_patterns.average_demand * demand_patterns.sample_size + pattern_data.demand_count) / (demand_patterns.sample_size + 1), peak_demand = GREATEST(demand_patterns.peak_demand, pattern_data.demand_count), sample_size = demand_patterns.sample_size + 1, last_calculated = NOW(), updated_at = NOW();
  END LOOP;
  SELECT json_build_object('patterns_calculated', COUNT(*), 'locations_processed', COUNT(DISTINCT location_id), 'services_processed', COUNT(DISTINCT service_id), 'calculated_at', NOW()) INTO result FROM public.demand_patterns WHERE last_calculated >= NOW() - INTERVAL '1 minute';
  RETURN result;
END;
$function$;

CREATE OR REPLACE FUNCTION public.generate_demand_predictions(target_location_id uuid, prediction_days integer DEFAULT 7)
RETURNS json LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $function$
DECLARE result JSON; predictions_count INTEGER := 0; pred_date DATE; hour_val INTEGER; pattern_rec RECORD;
BEGIN
  FOR day_offset IN 0..(prediction_days - 1) LOOP
    pred_date := CURRENT_DATE + INTERVAL '1 day' * (day_offset + 1);
    FOR hour_val IN 0..23 LOOP
      FOR pattern_rec IN SELECT service_id, average_demand, LEAST(1.0, GREATEST(0.5, average_demand / GREATEST(peak_demand, 1))) as confidence_score FROM public.demand_patterns WHERE location_id = target_location_id AND pattern_type = 'hourly' AND pattern_key = CONCAT('day_', EXTRACT(DOW FROM pred_date), '_hour_', hour_val)
      LOOP
        INSERT INTO public.demand_predictions (location_id, service_id, prediction_date, hour_of_day, day_of_week, predicted_demand, confidence_score, model_version) VALUES (target_location_id, pattern_rec.service_id, pred_date, hour_val, EXTRACT(DOW FROM pred_date), GREATEST(0, ROUND(pattern_rec.average_demand * (0.8 + (RANDOM() * 0.4)))), GREATEST(0.5, pattern_rec.confidence_score * (0.9 + (RANDOM() * 0.2))), 'v1.0') ON CONFLICT (location_id, service_id, prediction_date, hour_of_day) DO UPDATE SET predicted_demand = EXCLUDED.predicted_demand, confidence_score = EXCLUDED.confidence_score, updated_at = NOW();
        predictions_count := predictions_count + 1;
      END LOOP;
    END LOOP;
  END LOOP;
  result := json_build_object('predictions_generated', predictions_count, 'location_id', target_location_id, 'prediction_period_days', prediction_days, 'generated_at', NOW());
  RETURN result;
END;
$function$;

CREATE OR REPLACE FUNCTION public.check_location_capacity(location_uuid uuid, requested_time timestamp with time zone DEFAULT now())
RETURNS json LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $function$
DECLARE location_capacity INTEGER; current_count INTEGER; buffer_amount INTEGER; max_allowed INTEGER; result JSON;
BEGIN
  SELECT l.max_capacity, l.current_capacity, l.capacity_buffer INTO location_capacity, current_count, buffer_amount FROM public.locations l WHERE l.id = location_uuid;
  max_allowed := location_capacity - buffer_amount;
  result := json_build_object('has_capacity', current_count < max_allowed, 'current_capacity', current_count, 'max_capacity', location_capacity, 'max_allowed', max_allowed, 'available_spots', GREATEST(0, max_allowed - current_count), 'buffer_amount', buffer_amount);
  RETURN result;
END;
$function$;

-- Fix trigger functions search_path (non-security-definer but still good practice)
CREATE OR REPLACE FUNCTION public.trigger_set_timestamp()
RETURNS trigger LANGUAGE plpgsql SET search_path = public
AS $function$ BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $function$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger LANGUAGE plpgsql SET search_path = public
AS $function$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $function$;

CREATE OR REPLACE FUNCTION public.update_modified_column()
RETURNS trigger LANGUAGE plpgsql SET search_path = public
AS $function$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $function$;

CREATE OR REPLACE FUNCTION public.update_user_sessions_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public
AS $function$ BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $function$;

CREATE OR REPLACE FUNCTION public.update_user_roles_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public
AS $function$ BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $function$;

CREATE OR REPLACE FUNCTION public.audit_user_roles_changes()
RETURNS trigger LANGUAGE plpgsql SET search_path = public
AS $function$
BEGIN
  IF TG_OP = 'INSERT' THEN PERFORM log_admin_action('CREATE', 'user_role', NEW.id, NULL, to_jsonb(NEW)); RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN PERFORM log_admin_action('UPDATE', 'user_role', NEW.id, to_jsonb(OLD), to_jsonb(NEW)); RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN PERFORM log_admin_action('DELETE', 'user_role', OLD.id, to_jsonb(OLD), NULL); RETURN OLD;
  END IF; RETURN NULL;
END;
$function$;

CREATE OR REPLACE FUNCTION public.notify_queue_updated()
RETURNS trigger LANGUAGE plpgsql SET search_path = public
AS $function$
DECLARE payload JSON;
BEGIN
  payload := json_build_object('id', COALESCE(NEW.id, OLD.id), 'status', COALESCE(NEW.status, OLD.status), 'old_status', CASE WHEN TG_OP = 'UPDATE' THEN OLD.status ELSE NULL END, 'customer_id', COALESCE(NEW.customer_id, OLD.customer_id), 'service_id', COALESCE(NEW.service_id, OLD.service_id), 'location_id', COALESCE(NEW.location_id, OLD.location_id), 'staff_id', COALESCE(NEW.staff_id, OLD.staff_id), 'scheduled_time', COALESCE(NEW.scheduled_time, OLD.scheduled_time), 'check_in_time', COALESCE(NEW.check_in_time, OLD.check_in_time), 'start_time', COALESCE(NEW.start_time, OLD.start_time), 'end_time', COALESCE(NEW.end_time, OLD.end_time), 'updated_at', COALESCE(NEW.updated_at, OLD.updated_at), 'operation', TG_OP);
  PERFORM pg_notify('queue_updates', payload::text);
  RETURN COALESCE(NEW, OLD);
END;
$function$;

CREATE OR REPLACE FUNCTION public.notify_queue()
RETURNS trigger LANGUAGE plpgsql SET search_path = public
AS $function$
DECLARE payload JSON;
BEGIN
  payload := json_build_object('id', NEW.id, 'status', NEW.status, 'old_status', CASE WHEN TG_OP = 'UPDATE' THEN OLD.status ELSE NULL END, 'customer_id', NEW.customer_id, 'service_id', NEW.service_id, 'location_id', NEW.location_id, 'staff_id', NEW.staff_id, 'scheduled_time', NEW.scheduled_time, 'check_in_time', NEW.check_in_time, 'start_time', NEW.start_time, 'end_time', NEW.end_time, 'updated_at', NEW.updated_at);
  PERFORM pg_notify('queue_updates', payload::text);
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_location_capacity()
RETURNS trigger LANGUAGE plpgsql SET search_path = public
AS $function$
BEGIN
  IF TG_OP = 'UPDATE' AND OLD.status != NEW.status THEN
    IF NEW.status = 'checked_in' THEN UPDATE public.locations SET current_capacity = current_capacity + 1 WHERE id = NEW.location_id;
    ELSIF OLD.status = 'checked_in' AND NEW.status IN ('completed', 'no_show', 'cancelled') THEN UPDATE public.locations SET current_capacity = GREATEST(0, current_capacity - 1) WHERE id = NEW.location_id;
    END IF;
  ELSIF TG_OP = 'INSERT' AND NEW.status = 'checked_in' THEN UPDATE public.locations SET current_capacity = current_capacity + 1 WHERE id = NEW.location_id;
  ELSIF TG_OP = 'DELETE' AND OLD.status = 'checked_in' THEN UPDATE public.locations SET current_capacity = GREATEST(0, current_capacity - 1) WHERE id = OLD.location_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_service_wait_times()
RETURNS trigger LANGUAGE plpgsql SET search_path = public
AS $function$
DECLARE service_id_val UUID; day_of_week_val INTEGER; hour_of_day_val INTEGER; duration_minutes INTEGER; old_avg_wait_time INTEGER; new_avg_wait_time INTEGER; record_count INTEGER;
BEGIN
  IF (NEW.status = 'completed' AND NEW.start_time IS NOT NULL AND NEW.end_time IS NOT NULL) THEN
    service_id_val := NEW.service_id;
    duration_minutes := EXTRACT(EPOCH FROM (NEW.end_time - NEW.start_time))/60;
    day_of_week_val := EXTRACT(DOW FROM NEW.scheduled_time);
    hour_of_day_val := EXTRACT(HOUR FROM NEW.scheduled_time);
    SELECT average_wait_time, 1 as count_val INTO old_avg_wait_time, record_count FROM public.service_wait_times WHERE service_id = service_id_val AND day_of_week = day_of_week_val AND hour_of_day = hour_of_day_val LIMIT 1;
    IF old_avg_wait_time IS NOT NULL THEN
      new_avg_wait_time := (old_avg_wait_time * 0.7 + duration_minutes * 0.3)::INTEGER;
      UPDATE public.service_wait_times SET average_wait_time = new_avg_wait_time, updated_at = NOW() WHERE service_id = service_id_val AND day_of_week = day_of_week_val AND hour_of_day = hour_of_day_val;
    ELSE
      INSERT INTO public.service_wait_times (service_id, day_of_week, hour_of_day, average_wait_time) VALUES (service_id_val, day_of_week_val, hour_of_day_val, duration_minutes);
    END IF;
  END IF;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.generate_confirmation_number()
RETURNS text LANGUAGE plpgsql SET search_path = public
AS $function$
DECLARE confirmation_code TEXT;
BEGIN
    confirmation_code := 'CUST-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8));
    RETURN confirmation_code;
END;
$function$;

CREATE OR REPLACE FUNCTION public.set_customer_confirmation_number()
RETURNS trigger LANGUAGE plpgsql SET search_path = public
AS $function$
BEGIN
    IF NEW.confirmation_number IS NULL THEN NEW.confirmation_number := generate_confirmation_number(); END IF;
    RETURN NEW;
END;
$function$;
