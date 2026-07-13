import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAvailableSlots } from '../../services/slotGenerator';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const providerId = searchParams.get('provider_id');
    const serviceId = searchParams.get('service_id');
    const dateStr = searchParams.get('date'); // YYYY-MM-DD

    if (!providerId || !serviceId || !dateStr) {
      return NextResponse.json(
        { error: 'Missing query parameters: provider_id, service_id, and date are required.' },
        { status: 400 }
      );
    }

    // Date validation
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return NextResponse.json(
        { error: 'Invalid date format. Use YYYY-MM-DD.' },
        { status: 400 }
      );
    }

    // 1. Resolve user authenticated context
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Fetch user's profile to resolve account tenancy
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

    // 3. Query slots passing the user-authenticated supabase client to enforce RLS
    const slots = await getAvailableSlots(accountId, providerId, serviceId, dateStr, supabase);

    return NextResponse.json({ slots });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[booking-api] GET slots failed:', err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
