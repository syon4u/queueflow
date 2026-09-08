-- security_audit_log allowed INSERT from the anon role with CHECK (true),
-- so anyone on the internet could write arbitrary rows into the audit log.
-- Server-side writers (edge functions) use the service role, which bypasses
-- RLS, and the client only reads this table (src/hooks/useSecurityMetrics.ts).
-- Restrict inserts to signed-in users.

DROP POLICY IF EXISTS "System can insert security audit log" ON public.security_audit_log;

CREATE POLICY "Authenticated can insert security audit log"
  ON public.security_audit_log
  FOR INSERT
  TO authenticated
  WITH CHECK (true);
