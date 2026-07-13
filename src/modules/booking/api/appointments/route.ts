import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireRole, toErrorResponse } from '@/lib/auth/account';
import { createAppointment } from '../../services/bookingService';

export async function POST(request: Request) {
  // 1. Role validation - Scheduling appointments requires at least an agent role
  try {
    await requireRole('agent');
  } catch (err) {
    return toErrorResponse(err);
  }

  try {
    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: 'Invalid JSON request body.' }, { status: 400 });
    }

    const {
      provider_id,
      service_id,
      contact_id,
      conversation_id,
      date,           // YYYY-MM-DD
      start_time,     // HH:MM:SS
      notes,
    } = body;

    // Validation checks
    if (!provider_id || !service_id || !contact_id || !date || !start_time) {
      return NextResponse.json(
        { error: 'Missing fields. provider_id, service_id, contact_id, date, and start_time are required.' },
        { status: 400 }
      );
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json({ error: 'Invalid date format. Use YYYY-MM-DD.' }, { status: 400 });
    }

    if (!/^\d{2}:\d{2}:\d{2}$/.test(start_time)) {
      return NextResponse.json({ error: 'Invalid start_time format. Use HH:MM:SS.' }, { status: 400 });
    }

    // 2. Resolve user authenticated context
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 3. Resolve user tenancy account
    const { data: profile } = await supabase
      .from('profiles')
      .select('account_id')
      .eq('user_id', user.id)
      .single();

    const accountId = profile?.account_id as string | undefined;
    if (!accountId) {
      return NextResponse.json(
        { error: 'Your profile is not linked to a tenant account.' },
        { status: 403 }
      );
    }

    // 4. Create appointment passing the user client to respect RLS boundaries
    const appointment = await createAppointment(
      {
        accountId,
        providerId: provider_id,
        serviceId: service_id,
        contactId: contact_id,
        conversationId: conversation_id || null,
        dateStr: date,
        startTimeStr: start_time,
        notes: notes || undefined,
      },
      supabase
    );

    return NextResponse.json({ appointment }, { status: 201 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    
    if (msg === 'SLOT_NOT_AVAILABLE') {
      return NextResponse.json({ error: 'The requested time slot is not available.' }, { status: 409 });
    }
    if (msg === 'SLOT_ALREADY_BOOKED') {
      return NextResponse.json(
        { error: 'This slot was just booked by another customer. Please choose a different slot.' },
        { status: 409 }
      );
    }

    console.error('[booking-api] POST appointment failed:', err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
