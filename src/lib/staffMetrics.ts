/**
 * Per-staff performance metrics, computed in the browser from a plain
 * `appointments` query (replaces the `staff-metrics` edge function).
 *
 * Why not the edge function: it grouped by `staff_id` only and filtered by
 * `scheduled_time` with an inclusive upper bound. The queue dashboard
 * (src/context/queue/useQueueOperations.ts) records the serving staff member in
 * `assigned_staff_id` and never sets `staff_id`, so every staff member who
 * works through the queue showed 0 served.
 *
 * Definitions (same as src/lib/dateRanges.ts, applied to an arbitrary range):
 *
 *  - staff for a row      = `assigned_staff_id`, falling back to `staff_id`
 *                           (SQL: coalesce(assigned_staff_id, staff_id)).
 *  - appointments_served  = status `completed` with `end_time` (fallback
 *                           `updated_at`) within the range.
 *  - average_service_time = mean of (end_time - start_time) in minutes over the
 *                           served rows that have both timestamps.
 *  - no_shows             = status `no_show` with `updated_at` within the range.
 */

import { isWithinRange, type DateRange, type IsoDateRange } from '@/lib/dateRanges';

export interface StaffMetric {
  staff_id: string;
  staff_name: string;
  appointments_served: number;
  average_service_time: number;
  no_shows: number;
}

/** Columns the aggregator needs from `appointments`. */
export interface StaffAppointmentRow {
  status: string;
  staff_id: string | null;
  assigned_staff_id: string | null;
  start_time: string | null;
  end_time: string | null;
  updated_at: string | null;
}

/** Columns the aggregator needs from `profiles`. */
export interface StaffProfileRow {
  id: string;
  first_name: string | null;
  last_name: string | null;
}

/** Column list for the `appointments` select feeding `aggregateStaffMetrics`. */
export const STAFF_METRICS_COLUMNS = 'status, staff_id, assigned_staff_id, start_time, end_time, updated_at';

/** The staff member credited with an appointment: coalesce(assigned_staff_id, staff_id). */
export function staffIdFor(row: Pick<StaffAppointmentRow, 'staff_id' | 'assigned_staff_id'>): string | null {
  return row.assigned_staff_id ?? row.staff_id ?? null;
}

/**
 * PostgREST `.or()` filter selecting every row a per-staff metric can need in
 * `[start, end)`: completed by end_time (or updated_at when end_time is null)
 * and no-shows by updated_at. Rows without any staff id are dropped client-side.
 */
export function staffMetricsOrFilter({ start, end }: IsoDateRange): string {
  return [
    `and(status.eq.completed,end_time.gte."${start}",end_time.lt."${end}")`,
    `and(status.eq.completed,end_time.is.null,updated_at.gte."${start}",updated_at.lt."${end}")`,
    `and(status.eq.no_show,updated_at.gte."${start}",updated_at.lt."${end}")`,
  ].join(',');
}

/** `.or()` filter keeping only rows credited to some staff member. */
export const STAFF_METRICS_HAS_STAFF_FILTER = 'assigned_staff_id.not.is.null,staff_id.not.is.null';

export function staffDisplayName(profile: StaffProfileRow | undefined): string {
  const name = [profile?.first_name, profile?.last_name].filter(Boolean).join(' ').trim();
  return name || 'Unknown';
}

/**
 * Group appointment rows by staff and compute the per-staff metrics for
 * `range`. Rows are re-checked against `range` so callers can pass a superset.
 * Output is sorted by appointments_served (desc), then name, for a stable table.
 */
export function aggregateStaffMetrics(
  rows: StaffAppointmentRow[],
  range: DateRange,
  profiles: StaffProfileRow[] = [],
): StaffMetric[] {
  const names = new Map(profiles.map((p) => [p.id, staffDisplayName(p)]));
  const acc = new Map<string, { served: number; serviceMinutes: number; timed: number; noShows: number }>();

  for (const row of rows) {
    const staffId = staffIdFor(row);
    if (!staffId) continue;

    let bucket = acc.get(staffId);
    if (!bucket) {
      bucket = { served: 0, serviceMinutes: 0, timed: 0, noShows: 0 };
      acc.set(staffId, bucket);
    }

    if (row.status === 'completed') {
      if (!isWithinRange(row.end_time ?? row.updated_at, range)) continue;
      bucket.served += 1;
      if (row.start_time && row.end_time) {
        const minutes = (new Date(row.end_time).getTime() - new Date(row.start_time).getTime()) / 60000;
        if (Number.isFinite(minutes) && minutes >= 0) {
          bucket.serviceMinutes += minutes;
          bucket.timed += 1;
        }
      }
    } else if (row.status === 'no_show') {
      if (!isWithinRange(row.updated_at, range)) continue;
      bucket.noShows += 1;
    }
  }

  return Array.from(acc.entries())
    .map(([staff_id, b]) => ({
      staff_id,
      staff_name: names.get(staff_id) ?? 'Unknown',
      appointments_served: b.served,
      average_service_time: b.timed > 0 ? b.serviceMinutes / b.timed : 0,
      no_shows: b.noShows,
    }))
    .filter((m) => m.appointments_served > 0 || m.no_shows > 0)
    .sort((a, b) => b.appointments_served - a.appointments_served || a.staff_name.localeCompare(b.staff_name));
}
