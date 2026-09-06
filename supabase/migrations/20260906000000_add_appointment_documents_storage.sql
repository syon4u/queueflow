-- Private storage bucket for appointment document attachments (ID scans,
-- intake forms, supporting paperwork). Access is restricted to staff-tier
-- roles via the existing get_current_user_role() helper; files are served
-- through short-lived signed URLs from the app, never a public URL.

INSERT INTO storage.buckets (id, name, public)
VALUES ('appointment-documents', 'appointment-documents', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Staff can view appointment documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'appointment-documents'
  AND public.get_current_user_role() IN ('staff', 'power_user', 'admin')
);

CREATE POLICY "Staff can upload appointment documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'appointment-documents'
  AND public.get_current_user_role() IN ('staff', 'power_user', 'admin')
);

CREATE POLICY "Staff can delete appointment documents"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'appointment-documents'
  AND public.get_current_user_role() IN ('staff', 'power_user', 'admin')
);
