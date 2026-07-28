import { createClient as createBrowserClient } from '@/lib/supabase/client';
import { supabaseAdmin } from '@/lib/flows/admin-client';
import type { BookingServicePriceMatrix } from '@/types';

function getSupabaseClient(customClient?: any) {
  if (customClient) return customClient;
  if (typeof window !== 'undefined') {
    return createBrowserClient();
  }
  return supabaseAdmin();
}

export interface MatrixQuoteResult {
  serviceId: string;
  serviceName: string;
  attributeKey: string;
  attributeValue: string;
  price: number;
  durationMinutes: number;
  isMatrixPrice: boolean;
  currency: string;
}

/**
 * Looks up the calculated price and duration for a service given asset attributes.
 * Falls back seamlessly to the default booking_services price if no matrix rule exists.
 */
export async function calculateServiceQuote(
  accountId: string,
  serviceId: string,
  attributeValue: string, // e.g. "SUV", "Hatchback", "Sedan"
  attributeKey = 'vehicle_category',
  passedClient?: any
): Promise<MatrixQuoteResult> {
  const client = getSupabaseClient(passedClient);
  // 1. Fetch base service
  const { data: service, error: serviceErr } = await client
    .from('booking_services')
    .select('id, name, price, duration_minutes, currency')
    .eq('id', serviceId)
    .eq('account_id', accountId)
    .eq('is_active', true)
    .single();

  if (serviceErr || !service) {
    throw new Error(`Service not found: ${serviceErr?.message || 'Not found'}`);
  }

  // 2. Try fetching dynamic matrix override
  const { data: matrixRule } = await client
    .from('booking_service_price_matrix')
    .select('price, duration_minutes')
    .eq('account_id', accountId)
    .eq('service_id', serviceId)
    .eq('attribute_key', attributeKey)
    .ilike('attribute_value', attributeValue)
    .maybeSingle();

  if (matrixRule) {
    return {
      serviceId: service.id,
      serviceName: service.name,
      attributeKey,
      attributeValue,
      price: Number(matrixRule.price),
      durationMinutes: matrixRule.duration_minutes || service.duration_minutes,
      isMatrixPrice: true,
      currency: service.currency || 'INR',
    };
  }

  // Fallback to base fixed service price
  return {
    serviceId: service.id,
    serviceName: service.name,
    attributeKey,
    attributeValue,
    price: Number(service.price || 0),
    durationMinutes: service.duration_minutes,
    isMatrixPrice: false,
    currency: service.currency || 'INR',
  };
}

/**
 * Lists all matrix rules configured for a given service.
 */
export async function getMatrixRulesForService(
  accountId: string,
  serviceId: string,
  passedClient?: any
): Promise<BookingServicePriceMatrix[]> {
  const client = getSupabaseClient(passedClient);
  const { data, error } = await client
    .from('booking_service_price_matrix')
    .select('*')
    .eq('account_id', accountId)
    .eq('service_id', serviceId)
    .order('attribute_value', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch matrix rules: ${error.message}`);
  }

  return data || [];
}

/**
 * Upserts a matrix pricing rule for a service.
 */
export async function upsertMatrixRule(
  input: {
    accountId: string;
    serviceId: string;
    attributeKey?: string;
    attributeValue: string;
    price: number;
    durationMinutes?: number | null;
  },
  passedClient?: any
) {
  const client = getSupabaseClient(passedClient);
  const { accountId, serviceId, attributeKey = 'vehicle_category', attributeValue, price, durationMinutes } = input;

  const { data, error } = await client
    .from('booking_service_price_matrix')
    .upsert(
      {
        account_id: accountId,
        service_id: serviceId,
        attribute_key: attributeKey,
        attribute_value: attributeValue,
        price,
        duration_minutes: durationMinutes || null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'service_id, attribute_key, attribute_value' }
    )
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to upsert matrix rule: ${error.message}`);
  }

  return data;
}

/**
 * Deletes a matrix pricing rule.
 */
export async function deleteMatrixRule(
  accountId: string,
  matrixRuleId: string,
  passedClient?: any
) {
  const client = getSupabaseClient(passedClient);
  const { error } = await client
    .from('booking_service_price_matrix')
    .delete()
    .eq('id', matrixRuleId)
    .eq('account_id', accountId);

  if (error) {
    throw new Error(`Failed to delete matrix rule: ${error.message}`);
  }

  return true;
}
