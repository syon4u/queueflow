import { describe, it, expect } from 'vitest';
import { localDayRange, localDayRangeIso } from '@/lib/dateRanges';
import {
  aggregateStaffMetrics,
  staffIdFor,
  staffMetricsOrFilter,
  type StaffAppointmentRow,
} from '@/lib/staffMetrics';

const now = new Date(2026, 8, 7, 21, 30); // 7 Sep 2026 21:30 local
const range = localDayRange(now);
const at = (h: number, m = 0, day = 7) => new Date(2026, 8, day, h, m).toISOString();

const row = (overrides: Partial<StaffAppointmentRow>): StaffAppointmentRow => ({
  status: 'completed',
  staff_id: null,
  assigned_staff_id: null,
  start_time: null,
  end_time: null,
  updated_at: null,
  ...overrides,
});

describe('staffMetrics', () => {
  it('credits assigned_staff_id first, then staff_id', () => {
    expect(staffIdFor({ assigned_staff_id: 'a', staff_id: 'b' })).toBe('a');
    expect(staffIdFor({ assigned_staff_id: null, staff_id: 'b' })).toBe('b');
    expect(staffIdFor({ assigned_staff_id: null, staff_id: null })).toBeNull();
  });

  it('counts queue-dashboard serves (assigned_staff_id only) as served', () => {
    const rows = [
      row({ assigned_staff_id: 'alice', start_time: at(10), end_time: at(10, 12), updated_at: at(10, 12) }),
      row({ assigned_staff_id: 'alice', start_time: at(11), end_time: at(11, 8), updated_at: at(11, 8) }),
      row({ staff_id: 'bob', start_time: at(12), end_time: at(12, 20), updated_at: at(12, 20) }),
    ];
    const metrics = aggregateStaffMetrics(rows, range, [
      { id: 'alice', first_name: 'Alice', last_name: 'A' },
    ]);
    expect(metrics).toEqual([
      { staff_id: 'alice', staff_name: 'Alice A', appointments_served: 2, average_service_time: 10, no_shows: 0 },
      { staff_id: 'bob', staff_name: 'Unknown', appointments_served: 1, average_service_time: 20, no_shows: 0 },
    ]);
  });

  it('uses end_time (fallback updated_at) for served and updated_at for no-shows, within the range', () => {
    const rows = [
      // completed yesterday: excluded
      row({ assigned_staff_id: 'alice', start_time: at(10, 0, 6), end_time: at(10, 30, 6), updated_at: at(10, 30, 6) }),
      // completed at local midnight tomorrow: excluded (end exclusive)
      row({ assigned_staff_id: 'alice', end_time: at(0, 0, 8), updated_at: at(0, 0, 8) }),
      // completed today, no end_time -> updated_at fallback, no service time
      row({ assigned_staff_id: 'alice', start_time: at(9), end_time: null, updated_at: at(9, 30) }),
      // no-show today
      row({ status: 'no_show', assigned_staff_id: 'alice', updated_at: at(14) }),
      // no-show yesterday: excluded
      row({ status: 'no_show', assigned_staff_id: 'alice', updated_at: at(14, 0, 6) }),
      // still in progress: not counted
      row({ status: 'in_progress', assigned_staff_id: 'alice', start_time: at(15), updated_at: at(15) }),
      // no staff at all: dropped
      row({ start_time: at(16), end_time: at(16, 5), updated_at: at(16, 5) }),
    ];
    expect(aggregateStaffMetrics(rows, range)).toEqual([
      { staff_id: 'alice', staff_name: 'Unknown', appointments_served: 1, average_service_time: 0, no_shows: 1 },
    ]);
  });

  it('builds a half-open PostgREST filter on end_time / updated_at', () => {
    const iso = localDayRangeIso(now);
    const filter = staffMetricsOrFilter(iso);
    expect(filter).toContain(`and(status.eq.completed,end_time.gte."${iso.start}",end_time.lt."${iso.end}")`);
    expect(filter).toContain(`and(status.eq.no_show,updated_at.gte."${iso.start}",updated_at.lt."${iso.end}")`);
    expect(filter).not.toContain('lte');
    expect(filter).not.toContain('scheduled_time');
  });
});
