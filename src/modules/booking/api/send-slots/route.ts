import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/flows/admin-client';
import { getAvailableSlots } from '../../services/slotGenerator';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: 'Invalid JSON request body.' }, { status: 400 });
    }

    const { contact_id, provider_id, service_id, date } = body;

    if (!contact_id || !provider_id || !service_id || !date) {
      return NextResponse.json(
        { error: 'Missing fields. contact_id, provider_id, service_id, and date are required.' },
        { status: 400 }
      );
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json({ error: 'Invalid date format. Use YYYY-MM-DD.' }, { status: 400 });
    }

    // 1. Resolve authenticated user context
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Resolve user tenancy account
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

    // 3. Resolve active conversation ID for this contact
    const dbAdmin = supabaseAdmin();
    const { data: conv } = await dbAdmin
      .from('conversations')
      .select('id')
      .eq('contact_id', contact_id)
      .eq('account_id', accountId)
      .limit(1)
      .maybeSingle();

    if (!conv) {
      return NextResponse.json({ error: 'No conversation found for this contact.' }, { status: 404 });
    }

    // 4. Fetch available slots using admin client to bypass any reading restrictions
    const availableSlots = await getAvailableSlots(accountId, provider_id, service_id, date, dbAdmin);

    if (availableSlots.length === 0) {
      // Send a plain text message letting the user know no slots are open
      const { engineSendText } = await import('@/lib/flows/meta-send');
      await engineSendText({
        accountId,
        userId: user.id,
        conversationId: conv.id,
        contactId: contact_id,
        text: `Sorry, there are no available appointments remaining for Dr. Sarah on ${date}.`,
      });
      return NextResponse.json({ success: true, message: 'No slots available, sent text explanation.' });
    }

    // 5. Slice first 3 available slots (Meta buttons message limit is 3)
    const slotsToSend = availableSlots.slice(0, 3);
    const buttons = slotsToSend.map(slot => ({
      id: `book:${provider_id}:${service_id}:${date}:${slot.start_time}`,
      title: slot.formatted_time.slice(0, 20), // Meta button title limit is 20 chars
    }));

    // 6. Send the interactive buttons message
    const { engineSendInteractiveButtons } = await import('@/lib/flows/meta-send');
    await engineSendInteractiveButtons({
      accountId,
      userId: user.id,
      conversationId: conv.id,
      contactId: contact_id,
      bodyText: `Available slots on ${date}:`,
      buttons,
    });

    return NextResponse.json({ success: true, sent_count: buttons.length });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[send-slots-api] Failed to send slot options:', err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
