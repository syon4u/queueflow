
-- Enable RLS on all tables that have it disabled
ALTER TABLE public.appointment_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demand_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demand_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prediction_accuracy ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.queue_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduling_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

-- appointments: staff/admin can view/update, anyone can create
CREATE POLICY "Staff and admin can view all appointments" ON public.appointments FOR SELECT TO authenticated USING (public.get_current_user_role() IN ('staff', 'admin', 'power_user'));
CREATE POLICY "Anyone can create appointments" ON public.appointments FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Staff and admin can update appointments" ON public.appointments FOR UPDATE TO authenticated USING (public.get_current_user_role() IN ('staff', 'admin', 'power_user'));
CREATE POLICY "Admin can delete appointments" ON public.appointments FOR DELETE TO authenticated USING (public.get_current_user_role() = 'admin');

-- customers
CREATE POLICY "Staff and admin can view customers" ON public.customers FOR SELECT TO authenticated USING (public.get_current_user_role() IN ('staff', 'admin', 'power_user'));
CREATE POLICY "Anyone can create customers" ON public.customers FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Staff and admin can update customers" ON public.customers FOR UPDATE TO authenticated USING (public.get_current_user_role() IN ('staff', 'admin', 'power_user'));
CREATE POLICY "Admin can delete customers" ON public.customers FOR DELETE TO authenticated USING (public.get_current_user_role() = 'admin');

-- locations: public read, admin manage
CREATE POLICY "Everyone can view locations" ON public.locations FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin can manage locations" ON public.locations FOR ALL TO authenticated USING (public.get_current_user_role() = 'admin');

-- services: public read, admin manage
CREATE POLICY "Everyone can view services" ON public.services FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin can manage services" ON public.services FOR ALL TO authenticated USING (public.get_current_user_role() = 'admin');

-- appointment_history
CREATE POLICY "Staff and admin can view appointment history" ON public.appointment_history FOR SELECT TO authenticated USING (public.get_current_user_role() IN ('staff', 'admin', 'power_user'));
CREATE POLICY "Staff and admin can insert appointment history" ON public.appointment_history FOR INSERT TO authenticated WITH CHECK (public.get_current_user_role() IN ('staff', 'admin', 'power_user'));

-- appointment_reminders
CREATE POLICY "Staff and admin can view reminders" ON public.appointment_reminders FOR SELECT TO authenticated USING (public.get_current_user_role() IN ('staff', 'admin', 'power_user'));
CREATE POLICY "Staff and admin can manage reminders" ON public.appointment_reminders FOR ALL TO authenticated USING (public.get_current_user_role() IN ('staff', 'admin'));

-- break_requests
CREATE POLICY "Staff can view own break requests" ON public.break_requests FOR SELECT TO authenticated USING (staff_id = auth.uid() OR public.get_current_user_role() IN ('admin', 'power_user'));
CREATE POLICY "Staff can create own break requests" ON public.break_requests FOR INSERT TO authenticated WITH CHECK (staff_id = auth.uid());
CREATE POLICY "Admin can manage all break requests" ON public.break_requests FOR ALL TO authenticated USING (public.get_current_user_role() = 'admin');

-- capacity_events
CREATE POLICY "Staff and admin can view capacity events" ON public.capacity_events FOR SELECT TO authenticated USING (public.get_current_user_role() IN ('staff', 'admin', 'power_user'));
CREATE POLICY "Staff and admin can insert capacity events" ON public.capacity_events FOR INSERT TO authenticated WITH CHECK (public.get_current_user_role() IN ('staff', 'admin'));

-- capacity_settings
CREATE POLICY "Staff and admin can view capacity settings" ON public.capacity_settings FOR SELECT TO authenticated USING (public.get_current_user_role() IN ('staff', 'admin', 'power_user'));
CREATE POLICY "Admin can manage capacity settings" ON public.capacity_settings FOR ALL TO authenticated USING (public.get_current_user_role() = 'admin');

-- capacity_waitlist
CREATE POLICY "Staff and admin can view waitlist" ON public.capacity_waitlist FOR SELECT TO authenticated USING (public.get_current_user_role() IN ('staff', 'admin', 'power_user'));
CREATE POLICY "Anyone can join waitlist" ON public.capacity_waitlist FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Staff and admin can update waitlist" ON public.capacity_waitlist FOR UPDATE TO authenticated USING (public.get_current_user_role() IN ('staff', 'admin'));

-- communication_templates
CREATE POLICY "Staff and admin can view templates" ON public.communication_templates FOR SELECT TO authenticated USING (public.get_current_user_role() IN ('staff', 'admin', 'power_user'));
CREATE POLICY "Admin can manage templates" ON public.communication_templates FOR ALL TO authenticated USING (public.get_current_user_role() = 'admin');

-- customer_communications
CREATE POLICY "Staff and admin can view communications" ON public.customer_communications FOR SELECT TO authenticated USING (public.get_current_user_role() IN ('staff', 'admin', 'power_user'));
CREATE POLICY "Staff and admin can create communications" ON public.customer_communications FOR INSERT TO authenticated WITH CHECK (public.get_current_user_role() IN ('staff', 'admin'));

-- customer_notes
CREATE POLICY "Staff and admin can view customer notes" ON public.customer_notes FOR SELECT TO authenticated USING (public.get_current_user_role() IN ('staff', 'admin', 'power_user'));
CREATE POLICY "Staff and admin can manage customer notes" ON public.customer_notes FOR ALL TO authenticated USING (public.get_current_user_role() IN ('staff', 'admin'));

-- customer_surveys
CREATE POLICY "Staff and admin can view surveys" ON public.customer_surveys FOR SELECT TO authenticated USING (public.get_current_user_role() IN ('staff', 'admin', 'power_user'));
CREATE POLICY "Anyone can submit surveys" ON public.customer_surveys FOR INSERT TO anon, authenticated WITH CHECK (true);

-- demand_patterns
CREATE POLICY "Staff and admin can view demand patterns" ON public.demand_patterns FOR SELECT TO authenticated USING (public.get_current_user_role() IN ('staff', 'admin', 'power_user'));
CREATE POLICY "Admin can manage demand patterns" ON public.demand_patterns FOR ALL TO authenticated USING (public.get_current_user_role() = 'admin');

-- demand_predictions
CREATE POLICY "Staff and admin can view predictions" ON public.demand_predictions FOR SELECT TO authenticated USING (public.get_current_user_role() IN ('staff', 'admin', 'power_user'));
CREATE POLICY "Admin can manage predictions" ON public.demand_predictions FOR ALL TO authenticated USING (public.get_current_user_role() = 'admin');

-- notification_logs
CREATE POLICY "Staff and admin can view notification logs" ON public.notification_logs FOR SELECT TO authenticated USING (public.get_current_user_role() IN ('staff', 'admin', 'power_user'));
CREATE POLICY "Staff and admin can create notification logs" ON public.notification_logs FOR INSERT TO authenticated WITH CHECK (public.get_current_user_role() IN ('staff', 'admin'));

-- notification_rules
CREATE POLICY "Staff and admin can view notification rules" ON public.notification_rules FOR SELECT TO authenticated USING (public.get_current_user_role() IN ('staff', 'admin', 'power_user'));
CREATE POLICY "Admin can manage notification rules" ON public.notification_rules FOR ALL TO authenticated USING (public.get_current_user_role() = 'admin');

-- performance_metrics
CREATE POLICY "Staff can view own metrics" ON public.performance_metrics FOR SELECT TO authenticated USING (staff_id = auth.uid() OR public.get_current_user_role() IN ('admin', 'power_user'));
CREATE POLICY "Admin can manage metrics" ON public.performance_metrics FOR ALL TO authenticated USING (public.get_current_user_role() = 'admin');

-- prediction_accuracy
CREATE POLICY "Staff and admin can view prediction accuracy" ON public.prediction_accuracy FOR SELECT TO authenticated USING (public.get_current_user_role() IN ('staff', 'admin', 'power_user'));
CREATE POLICY "Admin can manage prediction accuracy" ON public.prediction_accuracy FOR ALL TO authenticated USING (public.get_current_user_role() = 'admin');

-- queue_positions
CREATE POLICY "Staff and admin can view queue positions" ON public.queue_positions FOR SELECT TO authenticated USING (public.get_current_user_role() IN ('staff', 'admin', 'power_user'));
CREATE POLICY "Staff and admin can manage queue positions" ON public.queue_positions FOR ALL TO authenticated USING (public.get_current_user_role() IN ('staff', 'admin'));

-- queue_schedule
CREATE POLICY "Staff and admin can view queue schedule" ON public.queue_schedule FOR SELECT TO authenticated USING (public.get_current_user_role() IN ('staff', 'admin', 'power_user'));
CREATE POLICY "Admin can manage queue schedule" ON public.queue_schedule FOR ALL TO authenticated USING (public.get_current_user_role() = 'admin');

-- queue_schedules
CREATE POLICY "Staff and admin can view queue schedules" ON public.queue_schedules FOR SELECT TO authenticated USING (public.get_current_user_role() IN ('staff', 'admin', 'power_user'));
CREATE POLICY "Admin can manage queue schedules" ON public.queue_schedules FOR ALL TO authenticated USING (public.get_current_user_role() = 'admin');

-- role_permissions
CREATE POLICY "Authenticated can view role permissions" ON public.role_permissions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin can manage role permissions" ON public.role_permissions FOR ALL TO authenticated USING (public.get_current_user_role() = 'admin');

-- scheduling_recommendations
CREATE POLICY "Staff and admin can view recommendations" ON public.scheduling_recommendations FOR SELECT TO authenticated USING (public.get_current_user_role() IN ('staff', 'admin', 'power_user'));
CREATE POLICY "Admin can manage recommendations" ON public.scheduling_recommendations FOR ALL TO authenticated USING (public.get_current_user_role() = 'admin');

-- security_audit_log
CREATE POLICY "Admin can view security audit log" ON public.security_audit_log FOR SELECT TO authenticated USING (public.get_current_user_role() = 'admin');
CREATE POLICY "System can insert security audit log" ON public.security_audit_log FOR INSERT TO anon, authenticated WITH CHECK (true);

-- service_wait_times
CREATE POLICY "Everyone can view service wait times" ON public.service_wait_times FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin can manage service wait times" ON public.service_wait_times FOR ALL TO authenticated USING (public.get_current_user_role() = 'admin');

-- staff_actions
CREATE POLICY "Staff can view own actions" ON public.staff_actions FOR SELECT TO authenticated USING (staff_id = auth.uid() OR public.get_current_user_role() IN ('admin', 'power_user'));
CREATE POLICY "Staff can insert own actions" ON public.staff_actions FOR INSERT TO authenticated WITH CHECK (staff_id = auth.uid() OR public.get_current_user_role() = 'admin');

-- staff_audit_log
CREATE POLICY "Admin can view staff audit log" ON public.staff_audit_log FOR SELECT TO authenticated USING (public.get_current_user_role() IN ('admin', 'power_user'));
CREATE POLICY "Staff can insert own audit log" ON public.staff_audit_log FOR INSERT TO authenticated WITH CHECK (staff_id = auth.uid());

-- staff_notification_queue
CREATE POLICY "Staff can view own notification queue" ON public.staff_notification_queue FOR SELECT TO authenticated USING (staff_id = auth.uid() OR public.get_current_user_role() IN ('admin', 'power_user'));
CREATE POLICY "Staff and admin can manage notification queue" ON public.staff_notification_queue FOR ALL TO authenticated USING (public.get_current_user_role() IN ('staff', 'admin'));

-- staff_notifications
CREATE POLICY "Staff can view own notifications" ON public.staff_notifications FOR SELECT TO authenticated USING (staff_id = auth.uid() OR public.get_current_user_role() IN ('admin', 'power_user'));
CREATE POLICY "System can create staff notifications" ON public.staff_notifications FOR INSERT TO authenticated WITH CHECK (public.get_current_user_role() IN ('staff', 'admin'));
CREATE POLICY "Staff can update own notifications" ON public.staff_notifications FOR UPDATE TO authenticated USING (staff_id = auth.uid());

-- survey_questions
CREATE POLICY "Everyone can view survey questions" ON public.survey_questions FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin can manage survey questions" ON public.survey_questions FOR ALL TO authenticated USING (public.get_current_user_role() = 'admin');

-- survey_responses
CREATE POLICY "Staff and admin can view survey responses" ON public.survey_responses FOR SELECT TO authenticated USING (public.get_current_user_role() IN ('staff', 'admin', 'power_user'));
CREATE POLICY "Anyone can submit survey responses" ON public.survey_responses FOR INSERT TO anon, authenticated WITH CHECK (true);

-- system_settings
CREATE POLICY "Staff and admin can view system settings" ON public.system_settings FOR SELECT TO authenticated USING (public.get_current_user_role() IN ('staff', 'admin', 'power_user'));
CREATE POLICY "Admin can manage system settings" ON public.system_settings FOR ALL TO authenticated USING (public.get_current_user_role() = 'admin');

-- user_sessions
CREATE POLICY "Users can view own sessions" ON public.user_sessions FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can manage own sessions" ON public.user_sessions FOR ALL TO authenticated USING (user_id = auth.uid());

-- voice_notifications
CREATE POLICY "Staff and admin can view voice notifications" ON public.voice_notifications FOR SELECT TO authenticated USING (public.get_current_user_role() IN ('staff', 'admin', 'power_user'));
CREATE POLICY "Staff and admin can manage voice notifications" ON public.voice_notifications FOR ALL TO authenticated USING (public.get_current_user_role() IN ('staff', 'admin'));
