import { useMemo } from 'react';
import { useAppData, type Appointment } from '@/hooks/useAppData';

export interface DailyWaitPoint {
  date: string;
  label: string;
  avgWaitMinutes: number;
  volume: number;
}

export interface WeekdayVolumePoint {
  day: string;
  volume: number;
}

export interface ServiceSharePoint {
  name: string;
  value: number;
}

export interface BusinessInsights {
  isLoading: boolean;
  hasData: boolean;
  sampleSize: number;
  dailyWaitTrend: DailyWaitPoint[];
  weekdayVolume: WeekdayVolumePoint[];
  serviceShare: ServiceSharePoint[];
  predictedNextWaitMinutes: number | null;
  currentRollingAvgMinutes: number | null;
  trendDirection: 'up' | 'down' | 'flat' | null;
}

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const ROLLING_WINDOW = 5; // simple moving-average window for the wait-time estimator

function getServiceName(appointment: Appointment): string {
  // Different parts of the codebase alias the joined service under different
  // keys (`service` vs `services`) depending on the query shape used — cover both.
  const anyApt = appointment as unknown as Record<string, { name?: string } | undefined>;
  return anyApt.service?.name || anyApt.services?.name || 'Other';
}

function waitMinutes(appointment: Appointment): number | null {
  if (!appointment.check_in_time || !appointment.start_time) return null;
  const checkIn = new Date(appointment.check_in_time).getTime();
  const start = new Date(appointment.start_time).getTime();
  if (Number.isNaN(checkIn) || Number.isNaN(start) || start < checkIn) return null;
  const minutes = (start - checkIn) / 60000;
  // Guard against bad/placeholder data skewing the chart.
  if (minutes < 0 || minutes > 8 * 60) return null;
  return minutes;
}

/**
 * Derives lightweight, real-data analytics (rolling wait-time average, a naive
 * next-period wait-time estimate, weekday demand distribution, and service mix)
 * directly from appointment history — no external ML service required.
 */
export function useBusinessInsights(): BusinessInsights {
  const { appointments, isLoading } = useAppData();

  return useMemo(() => {
    const withWait = appointments
      .map((apt) => ({ apt, minutes: waitMinutes(apt) }))
      .filter((entry): entry is { apt: Appointment; minutes: number } => entry.minutes !== null)
      .sort(
        (a, b) =>
          new Date(a.apt.start_time as string).getTime() - new Date(b.apt.start_time as string).getTime()
      );

    // --- Daily wait-time trend (last 14 days with data) ---
    const byDay = new Map<string, { total: number; count: number }>();
    withWait.forEach(({ apt, minutes }) => {
      const day = new Date(apt.start_time as string).toISOString().slice(0, 10);
      const bucket = byDay.get(day) || { total: 0, count: 0 };
      bucket.total += minutes;
      bucket.count += 1;
      byDay.set(day, bucket);
    });
    const dailyWaitTrend: DailyWaitPoint[] = Array.from(byDay.entries())
      .map(([date, { total, count }]) => ({
        date,
        label: new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        avgWaitMinutes: Math.round((total / count) * 10) / 10,
        volume: count,
      }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-14);

    // --- Weekday demand distribution (all appointments, not just completed) ---
    const weekdayCounts = new Array(7).fill(0);
    appointments.forEach((apt) => {
      const d = new Date(apt.scheduled_time);
      if (!Number.isNaN(d.getTime())) weekdayCounts[d.getDay()] += 1;
    });
    const weekdayVolume: WeekdayVolumePoint[] = WEEKDAY_LABELS.map((day, i) => ({
      day,
      volume: weekdayCounts[i],
    }));

    // --- Service mix ---
    const serviceCounts = new Map<string, number>();
    appointments.forEach((apt) => {
      const name = getServiceName(apt);
      serviceCounts.set(name, (serviceCounts.get(name) || 0) + 1);
    });
    const serviceShare: ServiceSharePoint[] = Array.from(serviceCounts.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);

    // --- Simple moving-average wait-time estimator ---
    // A lightweight stand-in for a full ML predictor: average of the most
    // recent N completed visits' actual wait time, used as the "predicted"
    // wait for the next customer of a similar profile.
    let predictedNextWaitMinutes: number | null = null;
    let currentRollingAvgMinutes: number | null = null;
    let trendDirection: 'up' | 'down' | 'flat' | null = null;

    if (withWait.length > 0) {
      const recent = withWait.slice(-ROLLING_WINDOW);
      currentRollingAvgMinutes =
        Math.round((recent.reduce((sum, e) => sum + e.minutes, 0) / recent.length) * 10) / 10;
      predictedNextWaitMinutes = currentRollingAvgMinutes;

      if (withWait.length > ROLLING_WINDOW) {
        const prior = withWait.slice(-ROLLING_WINDOW * 2, -ROLLING_WINDOW);
        if (prior.length > 0) {
          const priorAvg = prior.reduce((sum, e) => sum + e.minutes, 0) / prior.length;
          const delta = currentRollingAvgMinutes - priorAvg;
          trendDirection = Math.abs(delta) < 1 ? 'flat' : delta > 0 ? 'up' : 'down';
        }
      }
    }

    return {
      isLoading,
      hasData: withWait.length > 0,
      sampleSize: withWait.length,
      dailyWaitTrend,
      weekdayVolume,
      serviceShare,
      predictedNextWaitMinutes,
      currentRollingAvgMinutes,
      trendDirection,
    };
  }, [appointments, isLoading]);
}
