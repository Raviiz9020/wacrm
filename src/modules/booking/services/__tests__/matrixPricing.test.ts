import { describe, it, expect, vi } from 'vitest';
import { calculateServiceQuote } from '../matrixPricingService';
import { recordAssetServiceHistory } from '../customerAssetService';

describe('Matrix Pricing & Service Quote Engine', () => {
  it('returns dynamic matrix price override when category rule exists', async () => {
    // Mock Supabase Client
    const mockSupabase = {
      from: (table: string) => {
        if (table === 'booking_services') {
          return {
            select: () => ({
              eq: () => ({
                eq: () => ({
                  eq: () => ({
                    single: async () => ({
                      data: {
                        id: 'service-1',
                        name: 'Root Canal',
                        price: 2000,
                        duration_minutes: 45,
                        currency: 'INR',
                      },
                      error: null,
                    }),
                  }),
                }),
              }),
            }),
          };
        }
        if (table === 'booking_service_price_matrix') {
          return {
            select: () => ({
              eq: () => ({
                eq: () => ({
                  eq: () => ({
                    ilike: () => ({
                      maybeSingle: async () => ({
                        data: {
                          price: 5500,
                          duration_minutes: 60,
                        },
                      }),
                    }),
                  }),
                }),
              }),
            }),
          };
        }
        return {};
      },
    };

    const quote = await calculateServiceQuote(
      'acc-123',
      'service-1',
      'Ceramic Crown',
      'service_variant',
      mockSupabase
    );

    expect(quote.isMatrixPrice).toBe(true);
    expect(quote.price).toBe(5500);
    expect(quote.durationMinutes).toBe(60);
    expect(quote.currency).toBe('INR');
  });

  it('falls back to base service price when no matrix rule exists', async () => {
    const mockSupabase = {
      from: (table: string) => {
        if (table === 'booking_services') {
          return {
            select: () => ({
              eq: () => ({
                eq: () => ({
                  eq: () => ({
                    single: async () => ({
                      data: {
                        id: 'service-1',
                        name: 'General Consultation',
                        price: 500,
                        duration_minutes: 30,
                        currency: 'INR',
                      },
                      error: null,
                    }),
                  }),
                }),
              }),
            }),
          };
        }
        if (table === 'booking_service_price_matrix') {
          return {
            select: () => ({
              eq: () => ({
                eq: () => ({
                  eq: () => ({
                    ilike: () => ({
                      maybeSingle: async () => ({ data: null }),
                    }),
                  }),
                }),
              }),
            }),
          };
        }
        return {};
      },
    };

    const quote = await calculateServiceQuote(
      'acc-123',
      'service-1',
      'Standard',
      'service_variant',
      mockSupabase
    );

    expect(quote.isMatrixPrice).toBe(false);
    expect(quote.price).toBe(500);
    expect(quote.durationMinutes).toBe(30);
  });
});

describe('Customer Asset Service History Engine', () => {
  it('calculates 6-month recommended service and 36-month warranty expiry accurately', async () => {
    let insertedPayload: any = null;

    const mockSupabase = {
      from: () => ({
        insert: (payload: any) => ({
          select: () => ({
            single: async () => {
              insertedPayload = payload;
              return { data: payload, error: null };
            },
          }),
        }),
      }),
    };

    const result = await recordAssetServiceHistory(
      {
        accountId: 'acc-123',
        assetId: 'asset-789',
        serviceId: 'service-ceramic',
        serviceDate: '2026-01-01T00:00:00.000Z',
        warrantyMonths: 36,
        nextServiceMonths: 6,
      },
      mockSupabase
    );

    expect(insertedPayload.warranty_expiry_date).toBe('2029-01-01');
    expect(insertedPayload.next_recommended_service_date).toBe('2026-07-01');
  });
});
