# Security notes

## Abuse protection for the public (anonymous) flows

Every customer-facing action — booking, kiosk ticket, virtual-queue join,
check-in, cancel, status / appointment lookup, the queue snapshot and the lobby
signage board — goes through a `public_*` SECURITY DEFINER function that the
anon key may call. Since 2026-09-09 (migration
`supabase/migrations/20260909120000_public_rate_limits.sql`) each of those
functions enforces a fixed-window rate limit before doing anything else.

### Limits

| Function | Subject | Limit |
|---|---|---|
| `public_create_appointment` | phone (normalized) | 3 per 10 min and 10 per day |
| `public_create_appointment` | IP | 20 per 10 min |
| `public_find_appointment`, `public_list_appointments` | IP (shared bucket `lookup:ip`) | 30 per 5 min; a lookup that finds nothing counts twice |
| `public_check_in` | IP | 20 per 10 min |
| `public_cancel_appointment` | IP | 20 per 10 min |
| `public_queue_snapshot`, `public_signage_board` | IP (shared bucket `poll:ip`) | 240 per 5 min (signage polls every 10 s, so ~8 screens behind one NAT) |

Over the limit the function raises `RATE_LIMITED`; `src/lib/publicQueue.ts`
maps that token to `public.errors.rateLimited` ("Too many attempts. Please wait
a few minutes and try again." in en/es/pt/ht), and every screen shows it
through its normal error path.

### How it works

- `public.public_rate_limits (bucket, subject, window_start, hits)` holds one
  row per subject per window; RLS is on with no policies, so only the definer
  helpers can read or write it. Rows older than a day are swept from inside
  the helper on about 1 % of calls, so the table stays a few hundred rows.
- `public.rate_limit_hit(bucket, subject, window, limit)` upserts the hit for
  the current window (floored to a multiple of `window` since the epoch) and
  returns true when `hits > limit`.
- `public.request_ip()` reads the caller's address from the PostgREST request
  headers (`cf-connecting-ip`, else the first hop of `x-forwarded-for`, else
  `'unknown'`). SQL-editor / MCP calls carry no headers and share the
  `'unknown'` subject.
- A raised `RATE_LIMITED` rolls back the hit that tripped it, so the counter
  parks at exactly the limit for the rest of the window. Calls that fail
  validation (`Appointment not found`, ...) also roll back their hit; lookups
  that miss return NULL / `[]` instead of raising, which is what lets them be
  charged double.
- The lookup functions were `STABLE` and are now `VOLATILE` (they write the
  counter). supabase-js calls RPCs with POST, so this changes nothing for the
  client.

### Tuning

The numbers live as `c_*` constants in the DECLARE block at the top of each
function in the migration. To change one, copy that function's
`CREATE OR REPLACE FUNCTION` into a new migration with the new constant and
apply it; nothing else references the values. To reset a subject during an
incident: `DELETE FROM public_rate_limits WHERE subject = '<ip or phone>'`.
To see who is hitting limits right now:

```sql
SELECT bucket, subject, window_start, hits
  FROM public_rate_limits
 WHERE window_start > now() - interval '1 hour'
 ORDER BY hits DESC LIMIT 20;
```

Staff and admin tools are unaffected: they run as authenticated users through
RLS-protected tables, and login attempts are throttled separately by the
`auth-security` edge function.
