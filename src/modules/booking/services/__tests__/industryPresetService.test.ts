import { describe, it, expect } from 'vitest';
import {
  getIndustryPresets,
  applyIndustryPreset,
  getActiveAssetType,
  INDUSTRY_PRESETS,
} from '../industryPresetService';

describe('Industry Presets & Asset Schema Service', () => {
  it('returns predefined industry presets for Car Detailing, Garage, Dental, Real Estate, Salon', () => {
    const presets = getIndustryPresets();
    expect(presets.length).toBeGreaterThanOrEqual(5);

    const keys = presets.map((p) => p.key);
    expect(keys).toContain('car_detailing');
    expect(keys).toContain('garage');
    expect(keys).toContain('dental_clinic');
    expect(keys).toContain('real_estate');
    expect(keys).toContain('salon_spa');
  });

  it('correctly builds vehicle attributes schema for car detailing', () => {
    const carPreset = INDUSTRY_PRESETS.find((p) => p.key === 'car_detailing');
    expect(carPreset).toBeDefined();
    expect(carPreset?.assetTypeName).toBe('Vehicle');

    const fields = carPreset?.schemaDefinition.fields || [];
    const keys = fields.map((f) => f.key);

    expect(keys).toContain('make');
    expect(keys).toContain('model');
    expect(keys).toContain('category');

    const categoryField = fields.find((f) => f.key === 'category');
    expect(categoryField?.type).toBe('select');
    expect(categoryField?.options).toContain('Sedan');
    expect(categoryField?.options).toContain('Mid-Size SUV');
    expect(categoryField?.options).toContain('Full-Size Truck / 3-Row SUV');
  });

  it('applies industry preset with mocked Supabase client', async () => {
    let insertedRow: any = null;

    const mockSupabase = {
      from: (table: string) => {
        expect(table).toBe('asset_types');
        return {
          select: () => ({
            eq: () => ({
              maybeSingle: async () => ({ data: null, error: null }),
            }),
          }),
          insert: (payload: any) => {
            insertedRow = payload;
            return {
              select: () => ({
                single: async () => ({
                  data: { id: 'asset-type-1', ...payload, created_at: new Date().toISOString() },
                  error: null,
                }),
              }),
            };
          },
        };
      },
    };

    const result = await applyIndustryPreset('account-123', 'car_detailing', mockSupabase);
    expect(result.id).toBe('asset-type-1');
    expect(insertedRow.name).toBe('Vehicle');
    expect(insertedRow.account_id).toBe('account-123');
    expect(insertedRow.schema_definition.preset_key).toBe('car_detailing');
  });
});
