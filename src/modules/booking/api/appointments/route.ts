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

    // 5. Dispatch the booking_created automation trigger
    try {
      const { runAutomationsForTrigger } = await import('@/lib/automations/engine');
      
      // Resolve active conversation ID for this contact
      let resolvedConversationId = conversation_id || null;
      if (!resolvedConversationId) {
        const { data: conv } = await supabase
          .from('conversations')
          .select('id')
          .eq('contact_id', contact_id)
          .eq('account_id', accountId)
          .limit(1)
          .maybeSingle();
        resolvedConversationId = conv?.id || null;
      }

      // Fetch provider, service, and contact details for string interpolation in triggers
      const [provResult, servResult, contactResult] = await Promise.all([
        supabase.from('booking_providers').select('name').eq('id', provider_id).single(),
        supabase.from('booking_services').select('name').eq('id', service_id).single(),
        supabase.from('contacts').select('name').eq('id', contact_id).single()
      ]);

      const providerName = provResult.data?.name || 'Provider';
      const serviceName = servResult.data?.name || 'Service';
      const contactName = contactResult.data?.name || 'Customer';
      const startTimeFormatted = new Date(appointment.start_time).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      });

      runAutomationsForTrigger({
        accountId,
        triggerType: 'booking_created' as any,
        contactId: contact_id,
        context: {
          conversation_id: resolvedConversationId || undefined,
          vars: {
            booking_start_time: startTimeFormatted,
            provider_name: providerName,
            service_name: serviceName,
            contact_name: contactName,
            customer_name: contactName,
            appointment_date: new Date(appointment.start_time).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            }),
            appointment_time: new Date(appointment.start_time).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit'
            }),
            booking_reference: appointment.id,
          }
        }
      }).catch(err => console.error('[booking-api] Failed to run automations:', err));
    } catch (err) {
      console.error('[booking-api] Automation dispatch error:', err);
    }

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

export async function PATCH(request: Request) {
  // 1. Role validation - Cancelling appointments requires at least an agent role
  try {
    await requireRole('agent');
  } catch (err) {
    return toErrorResponse(err);
  }

  try {
    const body = await request.json().catch(() => null);
    if (!body || !body.appointment_id) {
      return NextResponse.json({ error: 'appointment_id is required.' }, { status: 400 });
    }

    const { appointment_id } = body;

    // Resolve user authenticated context
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Resolve user tenancy account
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

    // Fetch details of this appointment before cancelling to supply context variables
    const { data: appt } = await supabase
      .from('booking_appointments')
      .select(`
        id,
        start_time,
        contact_id,
        conversation_id,
        provider:booking_providers(name),
        service:booking_services(name),
        contact:contacts(name)
      `)
      .eq('id', appointment_id)
      .eq('account_id', accountId)
      .single();

    if (!appt) {
      return NextResponse.json({ error: 'Appointment not found.' }, { status: 404 });
    }

    // Update appointment status to cancelled
    const { error: updateErr } = await supabase
      .from('booking_appointments')
      .update({ status: 'cancelled', updated_at: new Date().toISOString() })
      .eq('id', appointment_id)
      .eq('account_id', accountId);

    if (updateErr) throw updateErr;

    // Dispatch the booking_cancelled automation trigger
    try {
      const { runAutomationsForTrigger } = await import('@/lib/automations/engine');
      
      const providerName = (appt.provider as any)?.name || 'Provider';
      const serviceName = (appt.service as any)?.name || 'Service';
      const contactName = (appt.contact as any)?.name || 'Customer';
      const startTimeFormatted = new Date(appt.start_time).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      });

      runAutomationsForTrigger({
        accountId,
        triggerType: 'booking_cancelled' as any,
        contactId: appt.contact_id,
        context: {
          conversation_id: appt.conversation_id || undefined,
          vars: {
            booking_start_time: startTimeFormatted,
            provider_name: providerName,
            service_name: serviceName,
            contact_name: contactName,
            customer_name: contactName,
            appointment_date: new Date(appt.start_time).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            }),
            appointment_time: new Date(appt.start_time).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit'
            }),
            booking_reference: appt.id,
          }
        }
      }).catch(err => console.error('[booking-api] Failed to run cancellation automations:', err));
    } catch (err) {
      console.error('[booking-api] Cancellation automation dispatch error:', err);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[booking-api] PATCH cancellation failed:', err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  // 1. Role validation - Deleting appointments requires at least an agent role
  try {
    await requireRole('agent');
  } catch (err) {
    return toErrorResponse(err);
  }

  try {
    const body = await request.json().catch(() => null);
    if (!body || !body.appointment_id) {
      return NextResponse.json({ error: 'appointment_id is required.' }, { status: 400 });
    }

    const { appointment_id } = body;

    // Resolve user authenticated context
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Resolve user tenancy account
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

    // Delete the appointment row
    const { error: deleteErr } = await supabase
      .from('booking_appointments')
      .delete()
      .eq('id', appointment_id)
      .eq('account_id', accountId);

    if (deleteErr) throw deleteErr;

    return NextResponse.json({ success: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[booking-api] DELETE appointment failed:', err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
