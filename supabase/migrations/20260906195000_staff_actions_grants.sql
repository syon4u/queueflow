-- staff_actions had RLS policies but no table privileges for `authenticated`,
-- so every logAction() insert from the staff dashboard failed (swallowed by
-- the client's try/catch) and the Undo button — which lists the caller's
-- recent actions — never rendered. undoAction() also needs UPDATE (undone_at),
-- which had neither a grant nor a policy.
GRANT SELECT, INSERT, UPDATE ON public.staff_actions TO authenticated;

DROP POLICY IF EXISTS "Staff can undo own actions" ON public.staff_actions;
CREATE POLICY "Staff can undo own actions"
  ON public.staff_actions
  FOR UPDATE
  TO authenticated
  USING (staff_id = auth.uid() OR get_current_user_role() = 'admin')
  WITH CHECK (staff_id = auth.uid() OR get_current_user_role() = 'admin');
