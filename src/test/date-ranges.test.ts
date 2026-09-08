import { describe, it, expect } from 'vitest';
import {
  localDayRange,
  localDayRangeIso,
  isWithinLocalDay,
  isWaitingNow,
  isServedToday,
  isNoShowToday,
  isAppointmentToday,
  todayMetricsOrFilter,
} from '@/lib/dateRanges';

describe('dateRanges', () => {
  const now = new Date(2026, 8, 7, 21, 30); // 7 Sep 2026 21:30 local

  it('localDayRange spans local midnight to next local midnight', () => {
    const { start, end } = localDayRange(now);
    expect(start.getHours()).toBe(0);
    expect(start.getDate()).toBe(7);
    expect(end.getDate()).toBe(8);
    expect(end.getTime() - start.getTime()).toBe(24 * 60 * 60 * 1000);
    expect(localDayRangeIso(now)).toEqual({ start: start.toISOString(), end: end.toISOString() });
  });

  it('isWithinLocalDay uses the local day, not the UTC day', () => {
    expect(isWithinLocalDay(new Date(2026, 8, 7, 23, 59).toISOString(), now)).toBe(true);
    expect(isWithinLocalDay(new Date(2026, 8, 8, 0, 0).toISOString(), now)).toBe(false);
    expect(isWithinLocalDay(new Date(2026, 8, 6, 23, 59).toISOString(), now)).toBe(false);
    expect(isWithinLocalDay(null, now)).toBe(false);
  });

  it('metric predicates follow the shared definitions', () => {
    const hoursAgo = (h: number) => new Date(now.getTime() - h * 3600 * 1000).toISOString();
    expect(isWaitingNow({ status: 'checked_in', check_in_time: hoursAgo(2) }, now)).toBe(true);
    expect(isWaitingNow({ status: 'checked_in', check_in_time: hoursAgo(30) }, now)).toBe(false);
    expect(isWaitingNow({ status: 'in_progress', check_in_time: hoursAgo(1) }, now)).toBe(false);
    expect(isServedToday({ status: 'completed', end_time: hoursAgo(1) }, now)).toBe(true);
    expect(isServedToday({ status: 'completed', end_time: null, updated_at: hoursAgo(1) }, now)).toBe(true);
    expect(isServedToday({ status: 'completed', end_time: hoursAgo(30) }, now)).toBe(false);
    expect(isNoShowToday({ status: 'no_show', updated_at: hoursAgo(1) }, now)).toBe(true);
    expect(isNoShowToday({ status: 'no_show', updated_at: hoursAgo(48) }, now)).toBe(false);
    expect(isAppointmentToday({ status: 'cancelled', scheduled_time: hoursAgo(1) }, now)).toBe(true);
  });

  it('todayMetricsOrFilter quotes ISO timestamps', () => {
    const filter = todayMetricsOrFilter(now);
    const { start, end } = localDayRangeIso(now);
    expect(filter).toContain(`scheduled_time.gte."${start}"`);
    expect(filter).toContain(`scheduled_time.lt."${end}"`);
    expect(filter).toContain('status.in.(checked_in,in_progress)');
  });
});
