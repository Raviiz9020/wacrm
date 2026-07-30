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

/**
 * Formats all active booking services and their dynamic matrix pricing rules for AI prompt context.
 */
export async function fetchServiceMatrixPricingContext(
  db: any,
  accountId: string
): Promise<string> {
  if (!accountId || !db || typeof db.from !== 'function') return '';

  try {
    const { data: services, error: serviceErr } = await db
      .from('booking_services')
      .select('id, name, description, price, currency, duration_minutes')
      .eq('account_id', accountId)
      .order('name', { ascending: true });

    if (serviceErr || !services || !Array.isArray(services) || services.length === 0) return '';

    const serviceIds = services.map((s: any) => s.id);
    const { data: matrixRules } = await db
      .from('booking_service_price_matrix')
      .select('service_id, attribute_key, attribute_value, price, duration_minutes')
      .eq('account_id', accountId)
      .in('service_id', serviceIds);

    const rulesByService = (matrixRules || []).reduce((acc: Record<string, any[]>, rule: any) => {
      acc[rule.service_id] = acc[rule.service_id] || [];
      acc[rule.service_id].push(rule);
      return acc;
    }, {});

    const serviceBlocks = services.map((s: any) => {
      const currency = s.currency || '₹';
      const basePriceStr = s.price !== null && s.price !== undefined ? `${currency}${s.price}` : 'Price on Request';
      const baseDurationStr = s.duration_minutes ? `${s.duration_minutes} mins` : '';

      let block = `- **${s.name}**: Base Price: ${basePriceStr}${baseDurationStr ? ` | Duration: ${baseDurationStr}` : ''}`;
      if (s.description) {
        block += `\n  Description: ${s.description}`;
      }

      const rules = rulesByService[s.id] || [];
      if (rules.length > 0) {
        const ruleLines = rules.map((r: any) => {
          const rulePriceStr = `${currency}${r.price}`;
          const ruleDurStr = r.duration_minutes ? ` (${r.duration_minutes} mins)` : '';
          const attrKeyLabel = r.attribute_key ? r.attribute_key.replace(/_/g, ' ') : 'Variant';
          return `    - ${attrKeyLabel}: ${r.attribute_value} => ${rulePriceStr}${ruleDurStr}`;
        });
        block += `\n  - Dynamic Matrix Pricing Rules / Variants:\n${ruleLines.join('\n')}`;
      }
      return block;
    });

    return `\n\n## Active Services & Dynamic Matrix Pricing Catalog:\n${serviceBlocks.join('\n\n')}`;
  } catch (err) {
    console.error('[AI Context] Failed to fetch service matrix pricing context:', err);
    return '';
  }
}


