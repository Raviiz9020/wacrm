import { supabaseAdmin } from '@/lib/flows/admin-client';

export interface TimeSlot {
  start_time: string; // HH:MM:SS format
  end_time: string;   // HH:MM:SS format
  formatted_time: string; // e.g. "09:00 AM"
  formatted_date: string; // e.g. "Mon, Aug 15"
}

/**
 * Parses time string (HH:MM:SS or HH:MM) into minutes since midnight.
 */
function timeToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

/**
 * Formats minutes since midnight into HH:MM:SS time string.
 */
function minutesToTime(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`;
}

/**
 * Formats time string into user-friendly AM/PM format.
 */
function formatTime12Hour(timeStr: string): string {
  const [hStr, mStr] = timeStr.split(':');
  const h = Number(hStr);
  const m = Number(mStr);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const displayHour = h % 12 === 0 ? 12 : h % 12;
  return `${displayHour}:${String(m).padStart(2, '0')} ${ampm}`;
}

/**
 * Formats DATE string into friendly day representation.
 */
function formatDateFriendly(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Generates available booking time slots for a provider, service, and date.
 * Excludes pre-existing active bookings and handles split business hours.
 *
 * @param accountId - Tenancy account scope
 * @param providerId - The provider/resource
 * @param serviceId - The service being booked
 * @param dateStr - The target date (YYYY-MM-DD)
 * @param client - Supabase client instance (defaults to admin client)
 */
export async function getAvailableSlots(
  accountId: string,
  providerId: string,
  serviceId: string,
  dateStr: string,
  client = supabaseAdmin()
): Promise<TimeSlot[]> {
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

  // 2. Fetch overrides (vacations, custom hours)
  const { data: override, error: overrideErr } = await client
    .from('booking_schedule_overrides')
    .select('start_time, end_time, is_available')
    .eq('provider_id', providerId)
    .eq('override_date', dateStr)
    .maybeSingle();

  if (overrideErr) {
    throw new Error(`Error looking up schedule overrides: ${overrideErr.message}`);
  }

  let availabilityWindows: { start_time: string; end_time: string }[] = [];

  if (override) {
    // If override exists and marked unavailable, provider is off
    if (override.is_available && override.start_time && override.end_time) {
      availabilityWindows.push({
        start_time: override.start_time,
        end_time: override.end_time,
      });
    }
  } else {
    // 3. Fallback to weekly recurring schedule
    // Parse dateStr manually as a local date to avoid timezone shift
    const [year, month, day] = dateStr.split('-').map(Number);
    const dayOfWeek = new Date(year, month - 1, day).getDay();

    const { data: weekly, error: weeklyErr } = await client
      .from('booking_schedules')
      .select('start_time, end_time')
      .eq('provider_id', providerId)
      .eq('day_of_week', dayOfWeek);

    if (weeklyErr) {
      throw new Error(`Error looking up weekly schedule: ${weeklyErr.message}`);
    }

    if (weekly && weekly.length > 0) {
      availabilityWindows = weekly;
    }
  }

  // If no working windows for this date, return empty list
  if (availabilityWindows.length === 0) {
    return [];
  }

  // 4. Generate potential time slots matching service duration
  const potentialSlots: TimeSlot[] = [];
  const friendlyDate = formatDateFriendly(dateStr);

  for (const window of availabilityWindows) {
    const startMin = timeToMinutes(window.start_time);
    const endMin = timeToMinutes(window.end_time);

    let currentMin = startMin;
    // Step by 30 minutes to allow slots to start at 30-min intervals,
    // or step by the duration of the service.
    // Stepping by 30 minutes is generally preferred for dense schedules.
    // We will step by 30 minutes or service duration, whichever is smaller.
    const stepSize = Math.min(30, duration);

    while (currentMin + duration <= endMin) {
      const slotStart = minutesToTime(currentMin);
      const slotEnd = minutesToTime(currentMin + duration);

      potentialSlots.push({
        start_time: slotStart,
        end_time: slotEnd,
        formatted_time: formatTime12Hour(slotStart),
        formatted_date: friendlyDate,
      });

      currentMin += stepSize;
    }
  }

  // 5. Fetch existing active appointments for this provider on this day
  // To verify overlaps, we match on the date. Since start_time is TIMESTAMPTZ,
  // we filter by date range in UTC/ISO representation.
  const startOfDay = `${dateStr}T00:00:00.000Z`;
  const endOfDay = `${dateStr}T23:59:59.999Z`;

  const { data: appointments, error: apptErr } = await client
    .from('booking_appointments')
    .select('start_time, end_time')
    .eq('provider_id', providerId)
    .neq('status', 'cancelled')
    .gte('start_time', startOfDay)
    .lte('start_time', endOfDay);

  if (apptErr) {
    throw new Error(`Error fetching existing appointments: ${apptErr.message}`);
  }

  // Helper to parse database timestamptz back to local time components (HH:MM:SS)
  // this is safe because the slot query dates match the appointment query dates
  const parseLocalTimeFromISO = (isoStr: string): string => {
    const date = new Date(isoStr);
    const h = date.getHours();
    const m = date.getMinutes();
    const s = date.getSeconds();
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Convert existing appointments to local minute ranges
  const apptRanges = (appointments ?? []).map(appt => {
    const startLocal = parseLocalTimeFromISO(appt.start_time);
    const endLocal = parseLocalTimeFromISO(appt.end_time);
    return {
      start: timeToMinutes(startLocal),
      end: timeToMinutes(endLocal),
    };
  });

  // 6. Filter slots that overlap with existing appointments OR are in the past (if date is today)
  const now = new Date();
  const y = now.getFullYear();
  const mon = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const todayDateStr = `${y}-${mon}-${d}`;
  const nowInMinutes = now.getHours() * 60 + now.getMinutes();

  return potentialSlots.filter(slot => {
    const slotStartMin = timeToMinutes(slot.start_time);
    const slotEndMin = timeToMinutes(slot.end_time);

    // If booking for today, filter out past slots (including 15-minute booking buffer)
    if (dateStr === todayDateStr && slotStartMin < nowInMinutes + 15) {
      return false;
    }

    // Check overlap with any pre-existing booking:
    // Overlap occurs if slot starts before appointment ends AND slot ends after appointment starts
    const hasOverlap = apptRanges.some(
      appt => slotStartMin < appt.end && slotEndMin > appt.start
    );

    return !hasOverlap;
  });
}
