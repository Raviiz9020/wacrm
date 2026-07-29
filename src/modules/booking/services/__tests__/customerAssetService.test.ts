import { describe, it, expect, vi } from 'vitest';
import {
  fetchCustomerAssetContext,
  getAssetsForContact,
  deleteCustomerAsset,
  updateAssetServiceHistory,
  deleteAssetServiceHistory,
} from '../customerAssetService';

describe('customerAssetService', () => {
  describe('fetchCustomerAssetContext', () => {
    it('returns empty string if db client is invalid or incomplete', async () => {
      const result = await fetchCustomerAssetContext(null, 'acc_123', 'con_456');
      expect(result).toBe('');
    });

    it('returns empty string when contact has no assets', async () => {
      const mockDb = {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({ data: [] }),
            }),
          }),
        }),
      };

      const result = await fetchCustomerAssetContext(mockDb, 'acc_123', 'con_456');
      expect(result).toBe('');
    });

    it('formats customer assets and visit history logs into structured markdown', async () => {
      const mockAssets = [
        {
          id: 'asset_1',
          name: 'Ravi Patil File',
          identifier_code: '123',
          attributes: { blood_group: 'O+', allergies: 'no' },
          created_at: '2026-07-29T10:00:00Z',
        },
      ];

      const mockHistory = [
        {
          asset_id: 'asset_1',
          service_date: '2026-07-29T10:00:00Z',
          notes: 'Root canal completed on Tooth #3',
          booking_services: { name: 'Dental Checkup' },
        },
      ];

      const mockDb = {
        from: vi.fn().mockImplementation((table: string) => {
          if (table === 'customer_assets') {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  eq: vi.fn().mockResolvedValue({ data: mockAssets }),
                }),
              }),
            };
          }
          if (table === 'customer_asset_history') {
            return {
              select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  in: vi.fn().mockReturnValue({
                    order: vi.fn().mockReturnValue({
                      limit: vi.fn().mockResolvedValue({ data: mockHistory }),
                    }),
                  }),
                }),
              }),
            };
          }
          return {};
        }),
      };

      const result = await fetchCustomerAssetContext(mockDb, 'acc_123', 'con_456');

      expect(result).toContain('## Customer Profile, Registered Assets & Visit Logs');
      expect(result).toContain('Ravi Patil File');
      expect(result).toContain('ID/Plate: 123');
      expect(result).toContain('blood group: O+');
      expect(result).toContain('Root canal completed on Tooth #3');
    });
  });

  describe('getAssetsForContact', () => {
    it('queries customer_assets table with correct (contactId, accountId) parameters', async () => {
      const mockOrder = vi.fn().mockResolvedValue({ data: [{ id: 'asset_1', name: 'Car 1' }], error: null });
      const mockEq2 = vi.fn().mockReturnValue({ order: mockOrder });
      const mockEq1 = vi.fn().mockReturnValue({ eq: mockEq2 });
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq1 });
      const mockDb = {
        from: vi.fn().mockReturnValue({ select: mockSelect }),
      };

      const assets = await getAssetsForContact('con_123', 'acc_456', mockDb);

      expect(mockDb.from).toHaveBeenCalledWith('customer_assets');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockEq1).toHaveBeenCalledWith('account_id', 'acc_456');
      expect(mockEq2).toHaveBeenCalledWith('contact_id', 'con_123');
      expect(mockOrder).toHaveBeenCalledWith('created_at', { ascending: false });
      expect(assets).toEqual([{ id: 'asset_1', name: 'Car 1' }]);
    });
  });

  describe('deleteCustomerAsset', () => {
    it('deletes customer asset by id and account_id', async () => {
      const mockEq2 = vi.fn().mockResolvedValue({ error: null });
      const mockEq1 = vi.fn().mockReturnValue({ eq: mockEq2 });
      const mockDelete = vi.fn().mockReturnValue({ eq: mockEq1 });
      const mockDb = {
        from: vi.fn().mockReturnValue({ delete: mockDelete }),
      };

      const res = await deleteCustomerAsset('asset_123', 'acc_456', mockDb);
      expect(mockDb.from).toHaveBeenCalledWith('customer_assets');
      expect(mockEq1).toHaveBeenCalledWith('id', 'asset_123');
      expect(mockEq2).toHaveBeenCalledWith('account_id', 'acc_456');
      expect(res).toBe(true);
    });
  });

  describe('updateAssetServiceHistory', () => {
    it('updates service history notes for given history id and account_id', async () => {
      const mockEq2 = vi.fn().mockResolvedValue({ error: null });
      const mockEq1 = vi.fn().mockReturnValue({ eq: mockEq2 });
      const mockUpdate = vi.fn().mockReturnValue({ eq: mockEq1 });
      const mockDb = {
        from: vi.fn().mockReturnValue({ update: mockUpdate }),
      };

      const res = await updateAssetServiceHistory('hist_1', 'acc_456', 'New notes text', mockDb);
      expect(mockDb.from).toHaveBeenCalledWith('customer_asset_history');
      expect(mockUpdate).toHaveBeenCalledWith({ notes: 'New notes text' });
      expect(mockEq1).toHaveBeenCalledWith('id', 'hist_1');
      expect(mockEq2).toHaveBeenCalledWith('account_id', 'acc_456');
      expect(res).toBe(true);
    });
  });

  describe('deleteAssetServiceHistory', () => {
    it('deletes service history entry by id and account_id', async () => {
      const mockEq2 = vi.fn().mockResolvedValue({ error: null });
      const mockEq1 = vi.fn().mockReturnValue({ eq: mockEq2 });
      const mockDelete = vi.fn().mockReturnValue({ eq: mockEq1 });
      const mockDb = {
        from: vi.fn().mockReturnValue({ delete: mockDelete }),
      };

      const res = await deleteAssetServiceHistory('hist_1', 'acc_456', mockDb);
      expect(mockDb.from).toHaveBeenCalledWith('customer_asset_history');
      expect(mockEq1).toHaveBeenCalledWith('id', 'hist_1');
      expect(mockEq2).toHaveBeenCalledWith('account_id', 'acc_456');
      expect(res).toBe(true);
    });
  });
});
