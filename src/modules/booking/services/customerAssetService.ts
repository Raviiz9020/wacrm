import { createClient as createBrowserClient } from '@/lib/supabase/client';
import { supabaseAdmin } from '@/lib/flows/admin-client';
import type { CustomerAsset, CustomerAssetHistory } from '@/types';

function getSupabaseClient(customClient?: any) {
  if (customClient) return customClient;
  if (typeof window !== 'undefined') {
    return createBrowserClient();
  }
  return supabaseAdmin();
}

export interface CreateAssetInput {
  accountId: string;
  contactId: string;
  assetTypeId?: string | null;
  identifierCode?: string | null; // e.g. License plate
  name: string; // e.g. "2023 Hyundai Creta (White)"
  attributes: {
    make?: string;
    model?: string;
    year?: number;
    category?: string; // Hatchback | Sedan | SUV | Luxury
    color?: string;
    [key: string]: unknown;
  };
}

/**
 * Creates or updates a customer asset (e.g. Vehicle) for a contact.
 */
export async function createOrUpdateCustomerAsset(
  input: CreateAssetInput,
  passedClient?: any
): Promise<CustomerAsset> {
  const client = getSupabaseClient(passedClient);
  const { accountId, contactId, assetTypeId, identifierCode, name, attributes } = input;

  // Check if asset already exists by identifier code or matching name for this contact
  if (identifierCode) {
    const { data: existing } = await client
      .from('customer_assets')
      .select('*')
      .eq('account_id', accountId)
      .eq('contact_id', contactId)
      .eq('identifier_code', identifierCode)
      .maybeSingle();

    if (existing) {
      const { data: updated, error: updateErr } = await client
        .from('customer_assets')
        .update({
          name,
          attributes: { ...existing.attributes, ...attributes },
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (updateErr) throw new Error(`Asset update failed: ${updateErr.message}`);
      return updated;
    }
  }

  // Create new asset
  const { data: created, error: createErr } = await client
    .from('customer_assets')
    .insert({
      account_id: accountId,
      contact_id: contactId,
      asset_type_id: assetTypeId || null,
      identifier_code: identifierCode || null,
      name,
      attributes,
    })
    .select()
    .single();

  if (createErr) {
    throw new Error(`Asset creation failed: ${createErr.message}`);
  }

  return created;
}

/**
 * Fetches all assets registered to a contact.
 */
export async function getAssetsForContact(
  contactId: string,
  accountId: string,
  passedClient?: any
): Promise<CustomerAsset[]> {
  try {
    const client = getSupabaseClient(passedClient);
    const { data, error } = await client
      .from('customer_assets')
      .select('*')
      .eq('account_id', accountId)
      .eq('contact_id', contactId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to fetch contact assets:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Error in getAssetsForContact:', err);
    return [];
  }
}

/**
 * Records a service entry into an asset's history.
 */
export async function recordAssetServiceHistory(
  input: {
    accountId: string;
    assetId: string;
    appointmentId?: string | null;
    serviceId?: string | null;
    serviceDate?: string;
    warrantyMonths?: number;
    nextServiceMonths?: number;
    notes?: string;
  },
  passedClient?: any
): Promise<CustomerAssetHistory> {
  const client = getSupabaseClient(passedClient);
  const {
    accountId,
    assetId,
    appointmentId,
    serviceDate = new Date().toISOString(),
    warrantyMonths = 36,
    nextServiceMonths = 6,
    notes,
  } = input;

  let finalServiceId = input.serviceId;
  if (!finalServiceId) {
    const { data: firstService } = await client
      .from('booking_services')
      .select('id')
      .eq('account_id', accountId)
      .limit(1)
      .maybeSingle();

    finalServiceId = firstService?.id || null;
  }

  if (!finalServiceId) {
    throw new Error('Please create at least one Booking Service before logging visit history.');
  }

  const serviceDateObj = new Date(serviceDate);

  const warrantyExpiryObj = new Date(serviceDateObj);
  warrantyExpiryObj.setMonth(warrantyExpiryObj.getMonth() + warrantyMonths);

  const nextServiceObj = new Date(serviceDateObj);
  nextServiceObj.setMonth(nextServiceObj.getMonth() + nextServiceMonths);

  const { data, error } = await client
    .from('customer_asset_history')
    .insert({
      account_id: accountId,
      asset_id: assetId,
      appointment_id: appointmentId || null,
      service_id: finalServiceId,
      service_date: serviceDate,
      warranty_expiry_date: warrantyExpiryObj.toISOString().split('T')[0],
      next_recommended_service_date: nextServiceObj.toISOString().split('T')[0],
      notes: notes || null,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to record asset service history: ${error.message}`);
  }

  return data;
}

/**
 * Gets service history timeline for a customer asset.
 */
export async function getAssetServiceHistory(
  assetId: string,
  accountId: string,
  passedClient?: any
): Promise<CustomerAssetHistory[]> {
  try {
    const client = getSupabaseClient(passedClient);
    const { data, error } = await client
      .from('customer_asset_history')
      .select('*, booking_services(name)')
      .eq('account_id', accountId)
      .eq('asset_id', assetId)
      .order('service_date', { ascending: false });

    if (error) {
      console.error('Failed to fetch asset history:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Error in getAssetServiceHistory:', err);
    return [];
  }
}

/**
 * Deletes a customer asset by ID.
 */
export async function deleteCustomerAsset(
  assetId: string,
  accountId: string,
  passedClient?: any
): Promise<boolean> {
  const client = getSupabaseClient(passedClient);
  const { error } = await client
    .from('customer_assets')
    .delete()
    .eq('id', assetId)
    .eq('account_id', accountId);

  if (error) {
    throw new Error(`Failed to delete customer asset: ${error.message}`);
  }
  return true;
}

/**
 * Updates a service history log entry notes.
 */
export async function updateAssetServiceHistory(
  historyId: string,
  accountId: string,
  notes: string,
  passedClient?: any
): Promise<boolean> {
  const client = getSupabaseClient(passedClient);
  const { error } = await client
    .from('customer_asset_history')
    .update({ notes })
    .eq('id', historyId)
    .eq('account_id', accountId);

  if (error) {
    throw new Error(`Failed to update service history entry: ${error.message}`);
  }
  return true;
}

/**
 * Deletes a service history log entry.
 */
export async function deleteAssetServiceHistory(
  historyId: string,
  accountId: string,
  passedClient?: any
): Promise<boolean> {
  const client = getSupabaseClient(passedClient);
  const { error } = await client
    .from('customer_asset_history')
    .delete()
    .eq('id', historyId)
    .eq('account_id', accountId);

  if (error) {
    throw new Error(`Failed to delete service history entry: ${error.message}`);
  }
  return true;
}

/**
 * Formats a customer's assets and visit history logs for AI prompt context.
 */
export async function fetchCustomerAssetContext(
  db: any,
  accountId: string,
  contactId: string
): Promise<string> {
  if (!accountId || !contactId || !db || typeof db.from !== 'function') return '';

  try {
    const assetQuery = db.from('customer_assets');
    if (!assetQuery || typeof assetQuery.select !== 'function') return '';

    const selectQuery = assetQuery.select('id, name, identifier_code, attributes, created_at');
    if (!selectQuery || typeof selectQuery.eq !== 'function') return '';

    const eq1 = selectQuery.eq('account_id', accountId);
    if (!eq1 || typeof eq1.eq !== 'function') return '';

    const { data: assets } = await eq1.eq('contact_id', contactId);
    if (!assets || !Array.isArray(assets) || assets.length === 0) return '';

    const assetIds = assets.map((a: any) => a.id);
    const historyQuery = db.from('customer_asset_history');
    if (!historyQuery || typeof historyQuery.select !== 'function') return '';

    const historySelect = historyQuery.select('asset_id, service_date, notes, booking_services(name)');
    if (!historySelect || typeof historySelect.eq !== 'function') return '';

    const historyEq = historySelect.eq('account_id', accountId);
    if (!historyEq || typeof historyEq.in !== 'function') return '';

    const historyIn = historyEq.in('asset_id', assetIds);
    if (!historyIn || typeof historyIn.order !== 'function') return '';

    const historyOrder = historyIn.order('service_date', { ascending: false });
    if (!historyOrder || typeof historyOrder.limit !== 'function') return '';

    const { data: history } = await historyOrder.limit(10);

    const historyByAsset = (history || []).reduce((acc: any, item: any) => {
      acc[item.asset_id] = acc[item.asset_id] || [];
      acc[item.asset_id].push(item);
      return acc;
    }, {});

    const assetLines = assets.map((asset: any) => {
      const attrs = asset.attributes || {};
      const attrSummary = Object.entries(attrs)
        .filter(([_, v]) => v)
        .map(([k, v]) => `${k.replace(/_/g, ' ')}: ${v}`)
        .join(', ');

      const logs = historyByAsset[asset.id] || [];
      const logSummary = logs
        .map((l: any) => {
          const dateStr = new Date(l.service_date).toLocaleDateString();
          const svcName = l.booking_services?.name || 'Visit';
          return `  - [${dateStr}] ${svcName}${l.notes ? `: ${l.notes}` : ''}`;
        })
        .join('\n');

      return `- Record: "${asset.name}"${asset.identifier_code ? ` (ID/Plate: ${asset.identifier_code})` : ''}\n  Details: ${attrSummary || 'N/A'}\n  Visit Logs:\n${logSummary || '  - No past visit logs'}`;
    });

    return `\n\n## Customer Profile, Registered Assets & Visit Logs:\n${assetLines.join('\n\n')}`;
  } catch (err) {
    console.error('[AI Context] Failed to fetch customer asset context:', err);
    return '';
  }
}
