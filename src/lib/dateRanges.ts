/**
 * One definition of "today" for every dashboard.
 *
 * All dashboards run in the browser and their users sit in one time zone, so
 * "today" is the browser's local calendar day. The previous per-screen
 * implementations disagreed: some sliced `toISOString()` (UTC day, which rolls
 * over at 19:00/20:00 US Eastern), some used local midnight, some did not
 * filter at all. That is why /staff, /admin and /power-user showed three
 * different "today" counts for the same data.
 *
 * Headline metric definitions (use these everywhere a card says "today"):
 *
 *  - Appointments Today  = `scheduled_time` within the local day, any status.
 *  - Waiting Now         = status `checked_in` with `check_in_time` within the
 *                          last 24 h. This is the same window as the DB
 *                          function `public_queue_snapshot`
 *                          (supabase/migrations/20260906191000_queue_window_and_stale_cleanup.sql),
 *                          so the staff/admin counters agree with the public
 *                          kiosk / signage numbers.
 *  - Served Today        = status `completed` with `end_time` (fallback
 *                          `updated_at`) within the local day.
 *  - No-shows Today      = status `no_show` with `updated_at` within the local
 *                          day.
 */

export interface DateRange {
  start: Date;
  end: Date;
}

export interface IsoDateRange {
  start: string;
  end: string;
}

/** Window (in hours) a checked-in customer stays "waiting"; mirrors public_queue_snapshot. */
export const QUEUE_WINDOW_HOURS = 24;

/** Local calendar day containing `date`: [local midnight, next local midnight). */
export function localDayRange(date: Date = new Date()): DateRange {
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const end = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
  return { start, end };
}

/** Same as `localDayRange`, as ISO strings for Supabase `.gte(start)` / `.lt(end)` filters. */
export function localDayRangeIso(date: Date = new Date()): IsoDateRange {
  const { start, end } = localDayRange(date);
  return { start: start.toISOString(), end: end.toISOString() };
}

/** Start of the rolling queue window (now - 24 h) for `check_in_time >= start` filters. */
export function queueWindowStart(now: Date = new Date()): Date {
  return new Date(now.getTime() - QUEUE_WINDOW_HOURS * 60 * 60 * 1000);
}

export function queueWindowStartIso(now: Date = new Date()): string {
  return queueWindowStart(now).toISOString();
}

/** True when `iso` parses to a time inside `range` (start inclusive, end exclusive). */
export function isWithinRange(iso: string | null | undefined, range: DateRange): boolean {
  if (!iso) return false;
  const t = new Date(iso).getTime();
  return Number.isFinite(t) && t >= range.start.getTime() && t < range.end.getTime();
}

/** True when `iso` falls inside the local calendar day containing `date`. */
export function isWithinLocalDay(iso: string | null | undefined, date: Date = new Date()): boolean {
  return isWithinRange(iso, localDayRange(date));
}

/** True when `iso` is within the rolling queue window (last 24 h). */
export function isWithinQueueWindow(iso: string | null | undefined, now: Date = new Date()): boolean {
  if (!iso) return false;
  const t = new Date(iso).getTime();
  return Number.isFinite(t) && t >= queueWindowStart(now).getTime();
}

/** Minimal appointment shape the metric predicates need. */
export interface AppointmentTimes {
  status: string;
  scheduled_time?: string | null;
  check_in_time?: string | null;
  end_time?: string | null;
  updated_at?: string | null;
  created_at?: string | null;
}

/** Appointments Today: scheduled within the local day, any status. */
export function isAppointmentToday(a: AppointmentTimes, now: Date = new Date()): boolean {
  return isWithinLocalDay(a.scheduled_time, now);
}

/** Waiting Now: checked in within the last 24 h (falls back to created_at like the DB snapshot). */
export function isWaitingNow(a: AppointmentTimes, now: Date = new Date()): boolean {
  return a.status === 'checked_in' && isWithinQueueWindow(a.check_in_time ?? a.created_at, now);
}

/** In service now: called within the last 24 h (same window as Waiting Now). */
export function isInServiceNow(a: AppointmentTimes, now: Date = new Date()): boolean {
  return a.status === 'in_progress' && isWithinQueueWindow(a.check_in_time ?? a.created_at, now);
}

/** Served Today: completed with end_time (fallback updated_at) within the local day. */
export function isServedToday(a: AppointmentTimes, now: Date = new Date()): boolean {
  return a.status === 'completed' && isWithinLocalDay(a.end_time ?? a.updated_at, now);
}

/** No-shows Today: marked no_show (updated_at) within the local day. */
export function isNoShowToday(a: AppointmentTimes, now: Date = new Date()): boolean {
  return a.status === 'no_show' && isWithinLocalDay(a.updated_at, now);
}

/**
 * PostgREST `.or()` filter selecting every row any "today" metric can need:
 * scheduled today, in the 24 h queue window, served today or no-showed today.
 * Callers still classify rows client-side with the predicates above.
 */
export function todayMetricsOrFilter(now: Date = new Date()): string {
  const { start, end } = localDayRangeIso(now);
  const since = queueWindowStartIso(now);
  return [
    `and(scheduled_time.gte."${start}",scheduled_time.lt."${end}")`,
    `and(status.in.(checked_in,in_progress),check_in_time.gte."${since}")`,
    `and(status.eq.completed,end_time.gte."${start}",end_time.lt."${end}")`,
    `and(status.eq.no_show,updated_at.gte."${start}",updated_at.lt."${end}")`,
  ].join(',');
}
