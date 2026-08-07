import { createClient as createBrowserClient } from '@/lib/supabase/client';
import { supabaseAdmin } from '@/lib/flows/admin-client';
import type { AssetType } from '@/types';

function getSupabaseClient(customClient?: any) {
  if (customClient) return customClient;
  if (typeof window !== 'undefined') {
    return createBrowserClient();
  }
  return supabaseAdmin();
}

export interface SchemaField {
  key: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'date';
  required?: boolean;
  options?: string[];
}

export interface IndustryPreset {
  key: string;
  name: string;
  description: string;
  icon: string;
  assetTypeName: string;
  assetTypeDescription: string;
  schemaDefinition: {
    fields: SchemaField[];
  };
}

export const INDUSTRY_PRESETS: IndustryPreset[] = [
  {
    key: 'car_detailing',
    name: 'Car Detailing & Auto Spa',
    description: 'Vehicle size matrix pricing (Sedan/SUV/Truck), paint protection tracking & detail history.',
    icon: 'car',
    assetTypeName: 'Vehicle',
    assetTypeDescription: 'Customer vehicles (Make, Model, Year, Category & Plate)',
    schemaDefinition: {
      fields: [
        { key: 'make', label: 'Vehicle Make', type: 'text', required: true },
        { key: 'model', label: 'Vehicle Model', type: 'text', required: true },
        { key: 'year', label: 'Model Year', type: 'number' },
        {
          key: 'category',
          label: 'Vehicle Category',
          type: 'select',
          required: true,
          options: ['Hatchback', 'Sedan', 'Mid-Size SUV', 'Full-Size Truck / 3-Row SUV', 'Luxury / Exotic'],
        },
        { key: 'color', label: 'Paint Color', type: 'text' },
        { key: 'license_plate', label: 'License Plate / Reg #', type: 'text' },
      ],
    },
  },
  {
    key: 'garage',
    name: 'Auto Repair & Garage',
    description: 'Service interval tracking, odometer logs, vehicle diagnostics & repair history.',
    icon: 'wrench',
    assetTypeName: 'Vehicle',
    assetTypeDescription: 'Customer vehicles with odometer and diagnostic history.',
    schemaDefinition: {
      fields: [
        { key: 'make', label: 'Vehicle Make', type: 'text', required: true },
        { key: 'model', label: 'Vehicle Model', type: 'text', required: true },
        { key: 'year', label: 'Model Year', type: 'number' },
        { key: 'license_plate', label: 'License Plate / Reg #', type: 'text', required: true },
        { key: 'vin', label: 'VIN Code', type: 'text' },
        { key: 'odometer_km', label: 'Odometer (kms)', type: 'number' },
      ],
    },
  },
  {
    key: 'dental_clinic',
    name: 'Dental & Medical Clinic',
    description: 'Patient charts, medical history, tooth procedure logs & treatment tracking.',
    icon: 'stethoscope',
    assetTypeName: 'Patient Record',
    assetTypeDescription: 'Patient health profiles, allergies and procedure records.',
    schemaDefinition: {
      fields: [
        { key: 'patient_id', label: 'Patient File ID', type: 'text', required: true },
        { key: 'medical_history', label: 'Medical History Notes', type: 'text' },
        { key: 'allergies', label: 'Known Allergies', type: 'text' },
        {
          key: 'blood_group',
          label: 'Blood Group',
          type: 'select',
          options: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
        },
      ],
    },
  },
  {
    key: 'real_estate',
    name: 'Real Estate & Home Services',
    description: 'Property listings, square footage pricing, HVAC / appliance specs & maintenance.',
    icon: 'home',
    assetTypeName: 'Property',
    assetTypeDescription: 'Customer residential or commercial properties.',
    schemaDefinition: {
      fields: [
        {
          key: 'property_type',
          label: 'Property Type',
          type: 'select',
          required: true,
          options: ['Apartment / Condo', 'Single Family Home', 'Villa', 'Commercial Office'],
        },
        { key: 'sqft', label: 'Area (Sq Ft)', type: 'number', required: true },
        { key: 'bedrooms', label: 'No. of Bedrooms', type: 'number' },
        { key: 'address', label: 'Property Address', type: 'text', required: true },
      ],
    },
  },
  {
    key: 'salon_spa',
    name: 'Beauty Salon & Wellness Spa',
    description: 'Client skin & hair profiles, product sensitivities, treatment formulas & history.',
    icon: 'scissors',
    assetTypeName: 'Client Profile',
    assetTypeDescription: 'Customer skin, hair, and wellness profiles.',
    schemaDefinition: {
      fields: [
        {
          key: 'hair_type',
          label: 'Hair Type',
          type: 'select',
          options: ['Straight', 'Wavy', 'Curly', 'Coily'],
        },
        {
          key: 'skin_type',
          label: 'Skin Type',
          type: 'select',
          options: ['Normal', 'Dry', 'Oily', 'Sensitive', 'Combination'],
        },
        { key: 'allergies', label: 'Product Sensitivity / Allergies', type: 'text' },
      ],
    },
  },
];

export function getIndustryPresets(): IndustryPreset[] {
  return INDUSTRY_PRESETS;
}

/**
 * Retrieves the active AssetType for an account (or null if none set yet).
 */
export async function getActiveAssetType(
  accountId: string,
  passedClient?: any
): Promise<AssetType | null> {
  const client = getSupabaseClient(passedClient);
  const { data, error } = await client
    .from('asset_types')
    .select('*')
    .eq('account_id', accountId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('Error fetching asset_types:', error);
    return null;
  }
  return data as AssetType | null;
}

/**
 * Applies an Industry Preset to an account, creating/updating the default asset_types row.
 */
export async function applyIndustryPreset(
  accountId: string,
  presetKey: string,
  passedClient?: any
): Promise<AssetType> {
  const preset = INDUSTRY_PRESETS.find((p) => p.key === presetKey);
  if (!preset) {
    throw new Error(`Invalid industry preset key: ${presetKey}`);
  }

  const client = getSupabaseClient(passedClient);

  const { data: existing } = await client
    .from('asset_types')
    .select('*')
    .eq('account_id', accountId)
    .maybeSingle();

  if (existing) {
    const { data: updated, error } = await client
      .from('asset_types')
      .update({
        name: preset.assetTypeName,
        description: preset.assetTypeDescription,
        schema_definition: {
          preset_key: preset.key,
          preset_name: preset.name,
          ...preset.schemaDefinition,
        },
        updated_at: new Date().toISOString(),
      })
      .eq('id', existing.id)
      .select()
      .single();

    if (error) throw error;
    return updated as AssetType;
  } else {
    const { data: created, error } = await client
      .from('asset_types')
      .insert({
        account_id: accountId,
        name: preset.assetTypeName,
        description: preset.assetTypeDescription,
        schema_definition: {
          preset_key: preset.key,
          preset_name: preset.name,
          ...preset.schemaDefinition,
        },
      })
      .select()
      .single();

    if (error) throw error;
    return created as AssetType;
  }
}

/**
 * Updates the fields array inside the active asset type schema.
 */
export async function updateActiveAssetTypeSchema(
  accountId: string,
  updatedFields: SchemaField[],
  passedClient?: any
): Promise<AssetType> {
  const client = getSupabaseClient(passedClient);

  const { data: existing, error: fetchErr } = await client
    .from('asset_types')
    .select('*')
    .eq('account_id', accountId)
    .maybeSingle();

  if (fetchErr || !existing) {
    throw new Error('No active asset schema found for this account.');
  }

  const updatedSchema = {
    ...(existing.schema_definition as object),
    fields: updatedFields,
  };

  const { data, error } = await client
    .from('asset_types')
    .update({
      schema_definition: updatedSchema,
      updated_at: new Date().toISOString(),
    })
    .eq('id', existing.id)
    .select()
    .single();

  if (error) throw error;
  return data as AssetType;
}

/**
 * Creates or updates a custom industry preset.
 */
export async function applyCustomIndustryPreset(
  accountId: string,
  input: {
    industryName: string;
    assetName: string;
    description: string;
    fields: SchemaField[];
  },
  passedClient?: any
): Promise<AssetType> {
  const client = getSupabaseClient(passedClient);

  const schemaDefinition = {
    preset_key: 'custom',
    preset_name: input.industryName,
    fields: input.fields,
  };

  const { data: existing } = await client
    .from('asset_types')
    .select('*')
    .eq('account_id', accountId)
    .maybeSingle();

  const payload = {
    account_id: accountId,
    name: input.assetName,
    description: input.description,
    schema_definition: schemaDefinition,
    updated_at: new Date().toISOString(),
  };

  const query = existing
    ? client.from('asset_types').update(payload).eq('id', existing.id)
    : client.from('asset_types').insert(payload);

  const { data, error } = await query.select().single();
  if (error) throw error;
  return data as AssetType;
}

