import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import type { TimeSlot } from '../services/slotGenerator';

export interface Provider {
  id: string;
  name: string;
  description: string | null;
  profile_id: string | null;
  is_active: boolean;
  services?: { service_id: string }[];
}

export interface Service {
  id: string;
  name: string;
  description: string | null;
  duration_minutes: number;
  price: number | null;
  currency: string;
  is_active: boolean;
}

export interface Appointment {
  id: string;
  start_time: string;
  end_time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'noshow';
  notes: string | null;
  conversation_id: string | null;
  provider: { id: string; name: string };
  service: { id: string; name: string; duration_minutes: number };
  contact: { id: string; name: string; phone: string };
}

export function useBooking() {
  const { account } = useAuth();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const fetchProviders = useCallback(async () => {
    if (!account?.id) return;
    try {
      const { data, error } = await supabase
        .from('booking_providers')
        .select(`
          *,
          booking_provider_services (
            service_id
          )
        `)
        .eq('account_id', account.id)
        .order('name', { ascending: true });
      if (error) throw error;
      
      const mapped = (data || []).map((p: any) => ({
        ...p,
        services: p.booking_provider_services || [],
      }));
      setProviders(mapped);
    } catch (err) {
      console.error('Error fetching providers:', err);
    }
  }, [account?.id]);

  const fetchServices = useCallback(async () => {
    if (!account?.id) return;
    try {
      const { data, error } = await supabase
        .from('booking_services')
        .select('*')
        .eq('account_id', account.id)
        .order('name', { ascending: true });
      if (error) throw error;
      setServices(data || []);
    } catch (err) {
      console.error('Error fetching services:', err);
    }
  }, [account?.id]);

  const fetchAppointments = useCallback(async () => {
    if (!account?.id) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('booking_appointments')
        .select(`
          id, start_time, end_time, status, notes, conversation_id,
          provider:booking_providers(id, name),
          service:booking_services(id, name, duration_minutes),
          contact:contacts(id, name, phone)
        `)
        .eq('account_id', account.id)
        .order('start_time', { ascending: true });
      if (error) throw error;
      
      // Cast the results to the typescript schema shape
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setAppointments((data as any) || []);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
      console.error('Error fetching appointments:', err);
    } finally {
      setLoading(false);
    }
  }, [account?.id]);

  useEffect(() => {
    if (account?.id) {
      fetchProviders();
      fetchServices();
      fetchAppointments();
    }
  }, [account?.id, fetchProviders, fetchServices, fetchAppointments]);

  // Providers crud
  const addProvider = async (name: string, description?: string, profileId?: string) => {
    if (!account?.id) return;
    try {
      const { data, error } = await supabase
        .from('booking_providers')
        .insert({
          account_id: account.id,
          name,
          description: description || null,
          profile_id: profileId || null,
        })
        .select()
        .single();
      if (error) throw error;
      setProviders(prev => [...prev, data]);
      return data;
    } catch (err) {
      console.error('Add provider failed:', err);
      throw err;
    }
  };

  // Services crud
  const addService = async (name: string, durationMinutes: number, price?: number, description?: string) => {
    if (!account?.id) return;
    try {
      const { data, error } = await supabase
        .from('booking_services')
        .insert({
          account_id: account.id,
          name,
          duration_minutes: durationMinutes,
          price: price || null,
          description: description || null,
          currency: 'INR',
        })
        .select()
        .single();
      if (error) throw error;
      setServices(prev => [...prev, data]);
      return data;
    } catch (err) {
      console.error('Add service failed:', err);
      throw err;
    }
  };

  // Map services to providers
  const mapProviderService = async (providerId: string, serviceId: string) => {
    if (!account?.id) return;
    try {
      const { error } = await supabase
        .from('booking_provider_services')
        .insert({
          account_id: account.id,
          provider_id: providerId,
          service_id: serviceId,
        });
      if (error) throw error;
    } catch (err) {
      console.error('Map provider service failed:', err);
      throw err;
    }
  };

  const updateProviderServices = async (providerId: string, serviceIds: string[]) => {
    if (!account?.id) return;
    try {
      // 1. Delete existing mappings
      const { error: delErr } = await supabase
        .from('booking_provider_services')
        .delete()
        .eq('provider_id', providerId);
      if (delErr) throw delErr;

      if (serviceIds.length === 0) {
        await fetchProviders();
        return;
      }

      // 2. Insert new mappings
      const payload = serviceIds.map(serviceId => ({
        account_id: account.id,
        provider_id: providerId,
        service_id: serviceId,
      }));

      const { error: insErr } = await supabase
        .from('booking_provider_services')
        .insert(payload);
      if (insErr) throw insErr;

      await fetchProviders();
    } catch (err) {
      console.error('Update provider services failed:', err);
      throw err;
    }
  };

  // Availability Scheduler API calls
  const saveWeeklySchedule = async (
    providerId: string,
    schedules: { day_of_week: number; start_time: string; end_time: string }[]
  ) => {
    if (!account?.id) return;
    try {
      // First clean existing weekly slots for this provider
      await supabase.from('booking_schedules').delete().eq('provider_id', providerId);
      if (schedules.length === 0) return;

      const payload = schedules.map(s => ({
        account_id: account.id,
        provider_id: providerId,
        ...s,
      }));

      const { error } = await supabase.from('booking_schedules').insert(payload);
      if (error) throw error;
    } catch (err) {
      console.error('Save weekly schedule failed:', err);
      throw err;
    }
  };

  const saveScheduleOverride = async (
    providerId: string,
    dateStr: string,
    isAvailable: boolean,
    startTime?: string,
    endTime?: string
  ) => {
    if (!account?.id) return;
    try {
      const payload = {
        account_id: account.id,
        provider_id: providerId,
        override_date: dateStr,
        is_available: isAvailable,
        start_time: startTime || null,
        end_time: endTime || null,
      };

      const { error } = await supabase
        .from('booking_schedule_overrides')
        .upsert(payload, { onConflict: 'provider_id,override_date' });
      if (error) throw error;
    } catch (err) {
      console.error('Save override failed:', err);
      throw err;
    }
  };

  // Fetch slot availability from our Phase 2 API endpoint
  const getSlots = async (providerId: string, serviceId: string, dateStr: string): Promise<TimeSlot[]> => {
    try {
      const res = await fetch(
        `/api/v1/booking/slots?provider_id=${providerId}&service_id=${serviceId}&date=${dateStr}`
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to fetch slots');
      return json.slots || [];
    } catch (err) {
      console.error('Failed to get slots:', err);
      throw err;
    }
  };

  // Book an appointment via our Phase 2 API endpoint
  const bookAppointment = async (
    providerId: string,
    serviceId: string,
    contactId: string,
    dateStr: string,
    startTimeStr: string,
    notes?: string
  ) => {
    try {
      const res = await fetch('/api/v1/booking/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider_id: providerId,
          service_id: serviceId,
          contact_id: contactId,
          date: dateStr,
          start_time: startTimeStr,
          notes,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to create appointment');
      fetchAppointments(); // Refresh the list
      return json.appointment;
    } catch (err) {
      console.error('Book appointment failed:', err);
      throw err;
    }
  };

  // Cancel an appointment
  const cancel = async (appointmentId: string) => {
    if (!account?.id) return;
    try {
      const res = await fetch('/api/v1/booking/appointments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appointment_id: appointmentId }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to cancel appointment');
      fetchAppointments(); // Refresh
    } catch (err) {
      console.error('Cancel appointment failed:', err);
      throw err;
    }
  };

  const deleteProvider = async (providerId: string) => {
    if (!account?.id) return;
    try {
      const { error } = await supabase
        .from('booking_providers')
        .delete()
        .eq('id', providerId)
        .eq('account_id', account.id);
      if (error) throw error;
      setProviders(prev => prev.filter(p => p.id !== providerId));
    } catch (err) {
      console.error('Delete provider failed:', err);
      throw err;
    }
  };

  const updateProvider = async (providerId: string, name: string, description?: string, isActive?: boolean) => {
    if (!account?.id) return;
    try {
      const { data, error } = await supabase
        .from('booking_providers')
        .update({
          name,
          description: description || null,
          is_active: isActive !== undefined ? isActive : true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', providerId)
        .eq('account_id', account.id)
        .select()
        .single();
      if (error) throw error;
      setProviders(prev => prev.map(p => p.id === providerId ? data : p));
      return data;
    } catch (err) {
      console.error('Update provider failed:', err);
      throw err;
    }
  };

  const deleteService = async (serviceId: string) => {
    if (!account?.id) return;
    try {
      const { error } = await supabase
        .from('booking_services')
        .delete()
        .eq('id', serviceId)
        .eq('account_id', account.id);
      if (error) throw error;
      setServices(prev => prev.filter(s => s.id !== serviceId));
    } catch (err) {
      console.error('Delete service failed:', err);
      throw err;
    }
  };

  const updateService = async (
    serviceId: string,
    name: string,
    durationMinutes: number,
    price?: number,
    description?: string,
    isActive?: boolean
  ) => {
    if (!account?.id) return;
    try {
      const { data, error } = await supabase
        .from('booking_services')
        .update({
          name,
          duration_minutes: durationMinutes,
          price: price || null,
          description: description || null,
          is_active: isActive !== undefined ? isActive : true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', serviceId)
        .eq('account_id', account.id)
        .select()
        .single();
      if (error) throw error;
      setServices(prev => prev.map(s => s.id === serviceId ? data : s));
      return data;
    } catch (err) {
      console.error('Update service failed:', err);
      throw err;
    }
  };

  const deleteAppointment = async (appointmentId: string) => {
    if (!account?.id) return;
    try {
      const res = await fetch('/api/v1/booking/appointments', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appointment_id: appointmentId }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to delete appointment');
      fetchAppointments(); // Refresh
    } catch (err) {
      console.error('Delete appointment failed:', err);
      throw err;
    }
  };

  return {
    providers,
    services,
    appointments,
    loading,
    error,
    addProvider,
    addService,
    mapProviderService,
    updateProviderServices,
    saveWeeklySchedule,
    saveScheduleOverride,
    getSlots,
    bookAppointment,
    cancel,
    deleteAppointment,
    deleteProvider,
    updateProvider,
    deleteService,
    updateService,
    refreshAppointments: fetchAppointments,
  };
}
