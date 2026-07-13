import { supabaseAdmin } from '@/lib/flows/admin-client';
import { getAvailableSlots } from './slotGenerator';

export interface BookingInput {
  accountId: string;
  providerId: string;
  serviceId: string;
  contactId: string;
  conversationId?: string | null;
  dateStr: string;        // YYYY-MM-DD
  startTimeStr: string;   // HH:MM:SS
  notes?: string;
}

/**
 * Calculates end time string by adding duration to start time.
 */
function addMinutesToTime(timeStr: string, minutes: number): string {
  const [h, m] = timeStr.split(':').map(Number);
  const totalMins = h * 60 + m + minutes;
  const newH = Math.floor(totalMins / 60) % 24;
  const newM = totalMins % 60;
  return `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}:00`;
}

const BUSINESS_TIMEZONE_OFFSET = "+05:30"; // IST

/**
 * Converts local date and time strings (e.g. '2026-08-15' and '09:00:00')
 * into a UTC ISO string, using the fixed business timezone offset.
 */
function toUTCISOString(dateStr: string, timeStr: string): string {
  // Construct ISO string with offset and parse to Date to get correct UTC
  const isoWithOffset = `${dateStr}T${timeStr}${BUSINESS_TIMEZONE_OFFSET}`;
  return new Date(isoWithOffset).toISOString();
}

/**
 * Books an appointment for a contact.
 * Relies on PostgreSQL's exclusion constraint to dynamically prevent double booking.
 */
export async function createAppointment(
  input: BookingInput,
  client = supabaseAdmin()
) {
  const { accountId, providerId, serviceId, contactId, conversationId, dateStr, startTimeStr, notes } = input;

  // 1. Fetch service details to get duration
  const { data: service, error: serviceErr } = await client
    .from('booking_services')
    .select('duration_minutes')
    .eq('id', serviceId)
    .eq('account_id', accountId)
    .eq('is_active', true)
    .maybeSingle();

  if (serviceErr || !service) {
    throw new Error(`Service not found or inactive: ${serviceErr?.message || 'Not found'}`);
  }

  const duration = service.duration_minutes;
  const endTimeStr = addMinutesToTime(startTimeStr, duration);

  // 2. Build UTC bounds
  const startTimeUTC = toUTCISOString(dateStr, startTimeStr);
  const endTimeUTC = toUTCISOString(dateStr, endTimeStr);

  // 3. Double-check slot availability in generator before inserting (pre-flight check)
  const availableSlots = await getAvailableSlots(accountId, providerId, serviceId, dateStr, client);
  const isSlotAvailable = availableSlots.some(
    slot => slot.start_time.slice(0, 5) === startTimeStr.slice(0, 5)
  );

  if (!isSlotAvailable) {
    throw new Error('SLOT_NOT_AVAILABLE');
  }

  // 4. Insert appointment
  const { data: appointment, error: insertErr } = await client
    .from('booking_appointments')
    .insert({
      account_id: accountId,
      provider_id: providerId,
      service_id: serviceId,
      contact_id: contactId,
      conversation_id: conversationId || null,
      start_time: startTimeUTC,
      end_time: endTimeUTC,
      status: 'confirmed',
      notes: notes || null,
    })
    .select()
    .single();

  if (insertErr) {
    // PostgREST/PostgreSQL error code 23P01 represents an exclusion_violation
    if (insertErr.code === '23P01') {
      throw new Error('SLOT_ALREADY_BOOKED');
    }
    throw new Error(`Booking execution failed: ${insertErr.message}`);
  }

  return appointment;
}

/**
 * Cancels an appointment by changing its status to 'cancelled'.
 * This immediately releases the time slot for future bookings.
 */
export async function cancelAppointment(
  accountId: string,
  appointmentId: string,
  client = supabaseAdmin()
) {
  const { data: appointment, error: updateErr } = await client
    .from('booking_appointments')
    .update({ status: 'cancelled', updated_at: new Date().toISOString() })
    .eq('id', appointmentId)
    .eq('account_id', accountId)
    .select()
    .single();

  if (updateErr) {
    throw new Error(`Cancellation failed: ${updateErr.message}`);
  }

  return appointment;
}

/**
 * Reschedules an existing appointment to a new date and time.
 * Operates safely, releasing the old slot during update via transactional safety.
 */
export async function rescheduleAppointment(
  accountId: string,
  appointmentId: string,
  newDateStr: string,
  newStartTimeStr: string,
  client = supabaseAdmin()
) {
  // 1. Fetch current appointment details
  const { data: appointment, error: fetchErr } = await client
    .from('booking_appointments')
    .select('*')
    .eq('id', appointmentId)
    .eq('account_id', accountId)
    .single();

  if (fetchErr || !appointment) {
    throw new Error(`Appointment not found: ${fetchErr?.message || 'Not found'}`);
  }

  // 2. Fetch service details to get duration
  const { data: service, error: serviceErr } = await client
    .from('booking_services')
    .select('duration_minutes')
    .eq('id', appointment.service_id)
    .eq('account_id', accountId)
    .single();

  if (serviceErr || !service) {
    throw new Error(`Service not found: ${serviceErr?.message}`);
  }

  const duration = service.duration_minutes;
  const newEndTimeStr = addMinutesToTime(newStartTimeStr, duration);

  const newStartTimeUTC = toUTCISOString(newDateStr, newStartTimeStr);
  const newEndTimeUTC = toUTCISOString(newDateStr, newEndTimeStr);

  // 3. Update appointment
  const { data: updated, error: updateErr } = await client
    .from('booking_appointments')
    .update({
      start_time: newStartTimeUTC,
      end_time: newEndTimeUTC,
      status: 'confirmed',
      updated_at: new Date().toISOString(),
    })
    .eq('id', appointmentId)
    .eq('account_id', accountId)
    .select()
    .single();

  if (updateErr) {
    if (updateErr.code === '23P01') {
      throw new Error('SLOT_ALREADY_BOOKED');
    }
    throw new Error(`Rescheduling failed: ${updateErr.message}`);
  }

  return updated;
}
