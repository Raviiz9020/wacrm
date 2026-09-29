import { describe, it, expect, vi } from 'vitest';
import { rescheduleAppointment } from '../bookingService';

describe('rescheduleAppointment', () => {
  it('successfully reschedules an existing appointment and updates its asset history', async () => {
    const mockAppointment = {
      id: 'appt_1',
      service_id: 'srv_1',
      account_id: 'acc_1',
      start_time: '2026-08-01T04:30:00.000Z',
      end_time: '2026-08-01T05:00:00.000Z',
    };

    const mockService = {
      id: 'srv_1',
      duration_minutes: 45,
    };

    const updatedAppt = {
      ...mockAppointment,
      start_time: '2026-08-05T09:00:00.000Z',
      end_time: '2026-08-05T09:45:00.000Z',
      status: 'confirmed',
    };

    const mockClient: any = {
      from: vi.fn((table: string) => {
        if (table === 'booking_appointments') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({ data: mockAppointment, error: null }),
                }),
              }),
            }),
            update: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  select: vi.fn().mockReturnValue({
                    single: vi.fn().mockResolvedValue({ data: updatedAppt, error: null }),
                  }),
                }),
              }),
            }),
          };
        }

        if (table === 'booking_services') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({ data: mockService, error: null }),
                }),
              }),
            }),
          };
        }

        if (table === 'customer_asset_history') {
          return {
            update: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({ data: null, error: null }),
              }),
            }),
          };
        }

        return {};
      }),
    };

    const result = await rescheduleAppointment(
      'acc_1',
      'appt_1',
      '2026-08-05',
      '14:30:00',
      mockClient
    );

    expect(result).toBeDefined();
    expect(result.status).toBe('confirmed');
    expect(mockClient.from).toHaveBeenCalledWith('booking_appointments');
    expect(mockClient.from).toHaveBeenCalledWith('booking_services');
    expect(mockClient.from).toHaveBeenCalledWith('customer_asset_history');
  });

  it('throws SLOT_ALREADY_BOOKED when PostgreSQL returns 23P01 exclusion conflict', async () => {
    const mockAppointment = {
      id: 'appt_1',
      service_id: 'srv_1',
      account_id: 'acc_1',
    };

    const mockService = {
      id: 'srv_1',
      duration_minutes: 30,
    };

    const mockClient: any = {
      from: vi.fn((table: string) => {
        if (table === 'booking_appointments') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({ data: mockAppointment, error: null }),
                }),
              }),
            }),
            update: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  select: vi.fn().mockReturnValue({
                    single: vi.fn().mockResolvedValue({
                      data: null,
                      error: { code: '23P01', message: 'exclusion violation' },
                    }),
                  }),
                }),
              }),
            }),
          };
        }

        if (table === 'booking_services') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({ data: mockService, error: null }),
                }),
              }),
            }),
          };
        }

        return {};
      }),
    };

    await expect(
      rescheduleAppointment('acc_1', 'appt_1', '2026-08-05', '14:30:00', mockClient)
    ).rejects.toThrow('SLOT_ALREADY_BOOKED');
  });

  it('throws error when appointment is not found', async () => {
    const mockClient: any = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: null, error: { message: 'Not found' } }),
            }),
          }),
        }),
      }),
    };

    await expect(
      rescheduleAppointment('acc_1', 'appt_missing', '2026-08-05', '14:30:00', mockClient)
    ).rejects.toThrow('Appointment not found');
  });
});
