import i18next from 'i18next';
import { supabase } from '@/integrations/supabase/client';

/**
 * Customer-facing (anonymous) queue operations.
 *
 * RLS deliberately gives the anon role no SELECT/UPDATE on `customers` or
 * `appointments`, so every public flow goes through the SECURITY DEFINER
 * functions in supabase/migrations/20260906190000_public_queue_rpcs.sql.
 * Each function only ever returns one customer's own appointment(s), keyed by
 * confirmation code, last name + phone, or the unguessable appointment id.
 */

export type PublicAppointmentStatus =
  | 'scheduled'
  | 'checked_in'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'no_show';

export interface PublicAppointment {
  appointment_id: string;
  /** APT-XXXXXXXX — what the customer is told to keep. */
  confirmation_code: string;
  /** CUST-XXXXXXXX — the customer record's code, also accepted everywhere. */
  customer_confirmation: string | null;
  /** Last 8 chars of the appointment id; matches what staff boards show. */
  ticket_number: string;
  status: PublicAppointmentStatus;
  scheduled_time: string;
  check_in_time: string | null;
  location_id: string | null;
  location_name: string | null;
  location_address: string | null;
  service_id: string | null;
  service_name: string | null;
  service_duration: number | null;
  service_description: string | null;
  first_name: string;
  last_name: string;
  phone: string | null;
  email: string | null;
  reason_for_visit: string | null;
  notes: string | null;
  /** 1-based place in line; only set while checked in. */
  position: number | null;
  total_in_queue: number;
  estimated_wait_minutes: number;
}

export interface QueueSnapshot {
  waiting: number;
  in_progress: number;
  estimated_wait_minutes: number;
}

export interface LookupParams {
  code?: string;
  lastName?: string;
  phone?: string;
  appointmentId?: string;
}

export interface CreatePublicAppointmentInput {
  firstName: string;
  lastName: string;
  phone: string;
  email?: string | null;
  serviceId: string;
  locationId: string;
  /** ISO timestamp; defaults to now. */
  scheduledTime?: string;
  reason?: string | null;
  notes?: string | null;
  /** Walk-in: join the queue immediately instead of booking. */
  checkIn?: boolean;
}

interface RpcResponse<T> {
  data: T | null;
  error: { message: string } | null;
}

// The generated Database types don't know these functions yet, so call by name.
const rpc = <T>(fn: string, args: Record<string, unknown>) =>
  (supabase.rpc as unknown as (fn: string, args: Record<string, unknown>) => PromiseLike<RpcResponse<T>>)(fn, args);

/** Customer-facing copy; falls back to the English default when i18n is not initialised (e.g. unit tests). */
const msg = (key: string, defaultValue: string, values: Record<string, unknown> = {}) =>
  i18next.t(key, { defaultValue, ...values }) || defaultValue;

const statusLabel = (dbStatus: string) => {
  const key = dbStatus.trim().replace(/\s+/g, '_');
  return msg(`public.statusLabels.${key}`, dbStatus);
};

// The RAISE EXCEPTION messages from supabase/migrations/20260906190000_public_queue_rpcs.sql,
// mapped to translation keys so the customer sees them in their language.
const DB_MESSAGES: Array<[RegExp, string, (m: RegExpMatchArray) => Record<string, unknown>]> = [
  [/^First and last name are required$/, 'public.errors.db.nameRequired', () => ({})],
  [/^A valid phone number is required$/, 'public.errors.db.phoneRequired', () => ({})],
  [/^Service and location are required$/, 'public.errors.db.serviceLocationRequired', () => ({})],
  [/^Unknown location$/, 'public.errors.db.unknownLocation', () => ({})],
  [/^Unknown or inactive service$/, 'public.errors.db.unknownService', () => ({})],
  [/^Appointment not found$/, 'public.errors.db.appointmentNotFound', () => ({})],
  [/^Confirmation code does not match this appointment$/, 'public.errors.db.codeMismatch', () => ({})],
  [/^This appointment is (.+) and cannot be checked in$/, 'public.errors.db.cannotCheckIn', (m) => ({ status: statusLabel(m[1]) })],
  [/^This appointment is (.+) and cannot be cancelled$/, 'public.errors.db.cannotCancel', (m) => ({ status: statusLabel(m[1]) })],
];

const friendly = (message: string) => {
  // Postgres RAISE messages are already customer-readable; strip the PostgREST noise.
  const cleaned = message.replace(/^.*?:\s*/, '').replace(/\s*\(SQLSTATE.*$/, '');
  for (const [pattern, key, values] of DB_MESSAGES) {
    const match = cleaned.match(pattern);
    if (match) return msg(key, cleaned, values(match));
  }
  return cleaned;
};

export const customerName = (a: Pick<PublicAppointment, 'first_name' | 'last_name'>) =>
  `${a.first_name ?? ''} ${a.last_name ?? ''}`.trim();

export const isInQueue = (status: PublicAppointmentStatus) =>
  status === 'checked_in' || status === 'in_progress';

const lookupArgs = (params: LookupParams) => ({
  p_code: params.code?.trim() || null,
  p_last_name: params.lastName?.trim() || null,
  p_phone: params.phone?.trim() || null,
});

export async function findPublicAppointment(params: LookupParams): Promise<PublicAppointment | null> {
  const { data, error } = await rpc<PublicAppointment | null>('public_find_appointment', {
    ...lookupArgs(params),
    p_appointment_id: params.appointmentId ?? null,
  });
  if (error) throw new Error(friendly(error.message));
  return data ?? null;
}

export async function listPublicAppointments(params: LookupParams): Promise<PublicAppointment[]> {
  const { data, error } = await rpc<PublicAppointment[]>('public_list_appointments', lookupArgs(params));
  if (error) throw new Error(friendly(error.message));
  return data ?? [];
}

export interface SignageBoard {
  location_id: string;
  location_name: string;
  currently_serving: number;
  total_waiting: number;
  completed_today: number;
  average_wait_time_minutes: number;
  queue_status: 'active' | 'empty' | 'closed';
  capacity: { current: number; maximum: number; utilization_percentage: number };
  queue: {
    waiting: Array<{ ticket_number: string; customer_name: string; service_name: string; position: number; current_wait_time_minutes: number }>;
    currently_serving: Array<{ ticket_number: string; customer_name: string; service_name: string }>;
  };
  last_updated: string;
}

/** Lobby display board for one location; names are already reduced to first name + initial. */
export async function getSignageBoard(locationId: string): Promise<SignageBoard> {
  const { data, error } = await rpc<SignageBoard | null>('public_signage_board', { p_location_id: locationId });
  if (error) throw new Error(friendly(error.message));
  if (!data) throw new Error(msg('public.errors.locationNotFound', 'Location not found'));
  return data;
}

export async function getQueueSnapshot(locationId: string): Promise<QueueSnapshot> {
  const { data, error } = await rpc<QueueSnapshot>('public_queue_snapshot', { p_location_id: locationId });
  if (error) throw new Error(friendly(error.message));
  return data ?? { waiting: 0, in_progress: 0, estimated_wait_minutes: 0 };
}

export async function createPublicAppointment(input: CreatePublicAppointmentInput): Promise<PublicAppointment> {
  const { data, error } = await rpc<PublicAppointment>('public_create_appointment', {
    p_first_name: input.firstName,
    p_last_name: input.lastName,
    p_phone: input.phone,
    p_email: input.email || null,
    p_service_id: input.serviceId,
    p_location_id: input.locationId,
    p_scheduled_time: input.scheduledTime ?? new Date().toISOString(),
    p_reason: input.reason || null,
    p_notes: input.notes || null,
    p_check_in: input.checkIn ?? false,
  });
  if (error) throw new Error(friendly(error.message));
  if (!data) throw new Error(msg('public.errors.createFailed', 'The appointment could not be created. Please try again.'));
  return data;
}

export async function checkInPublicAppointment(appointmentId: string, code?: string | null): Promise<PublicAppointment> {
  const { data, error } = await rpc<PublicAppointment>('public_check_in', {
    p_appointment_id: appointmentId,
    p_code: code ?? null,
  });
  if (error) throw new Error(friendly(error.message));
  if (!data) throw new Error(msg('public.errors.checkInFailed', 'Check-in failed. Please see a staff member.'));
  return data;
}

export async function cancelPublicAppointment(appointmentId: string, code?: string | null): Promise<PublicAppointment> {
  const { data, error } = await rpc<PublicAppointment>('public_cancel_appointment', {
    p_appointment_id: appointmentId,
    p_code: code ?? null,
  });
  if (error) throw new Error(friendly(error.message));
  if (!data) throw new Error(msg('public.errors.cancelFailed', 'The appointment could not be cancelled.'));
  return data;
}
