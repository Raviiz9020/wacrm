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
  accountId: string,
  contactId: string,
  passedClient?: any
): Promise<CustomerAsset[]> {
  const client = getSupabaseClient(passedClient);
  const { data, error } = await client
    .from('customer_assets')
    .select('*')
    .eq('account_id', accountId)
    .eq('contact_id', contactId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch contact assets: ${error.message}`);
  }

  return data || [];
}

/**
 * Records a service entry into an asset's history.
 */
export async function recordAssetServiceHistory(
  input: {
    accountId: string;
    assetId: string;
    appointmentId?: string | null;
    serviceId: string;
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
    serviceId,
    serviceDate = new Date().toISOString(),
    warrantyMonths = 36, // Default 3 years
    nextServiceMonths = 6, // Default 6 months checkup
    notes,
  } = input;

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
      service_id: serviceId,
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
  accountId: string,
  assetId: string,
  passedClient?: any
): Promise<CustomerAssetHistory[]> {
  const client = getSupabaseClient(passedClient);
  const { data, error } = await client
    .from('customer_asset_history')
    .select('*, booking_services(name)')
    .eq('account_id', accountId)
    .eq('asset_id', assetId)
    .order('service_date', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch asset history: ${error.message}`);
  }

  return data || [];
}
