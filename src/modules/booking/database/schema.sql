-- ============================================================
-- Booking Module Schema (HyperAgent AI Additive Module)
--
-- This schema represents the isolated database state of the booking
-- module. It manages resources (providers), services, availability
-- (schedules), exclusions (overrides), appointments, and session 
-- contexts for multi-turn conversational booking wizard flows.
-- ============================================================

-- 1. Enable btree_gist extension (required for exclusion constraints)
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- 2. Providers (Resources providing services, e.g., Dentists, Car Detailing Bays, Consultants)
CREATE TABLE IF NOT EXISTS booking_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  profile_id UUID REFERENCES profiles(user_id) ON DELETE SET NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for tenancy lookups
CREATE INDEX IF NOT EXISTS idx_booking_providers_account ON booking_providers(account_id);

-- 3. Services (Services offered, e.g., Dental Checkup, Car Wash, Consulting Session)
CREATE TABLE IF NOT EXISTS booking_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  duration_minutes INT NOT NULL CHECK (duration_minutes > 0),
  price NUMERIC(10, 2) CHECK (price >= 0),
  currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_booking_services_account ON booking_services(account_id);

-- 4. Provider Services (Many-to-Many mapping of Providers to Services)
CREATE TABLE IF NOT EXISTS booking_provider_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES booking_providers(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES booking_services(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(provider_id, service_id)
);

CREATE INDEX IF NOT EXISTS idx_booking_prov_serv_account ON booking_provider_services(account_id);

-- 5. Weekly Schedules (Recurring availability blocks, e.g., Monday 9 AM - 5 PM)
CREATE TABLE IF NOT EXISTS booking_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES booking_providers(id) ON DELETE CASCADE,
  day_of_week INT NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0 = Sunday, 6 = Saturday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (start_time < end_time)
);

CREATE INDEX IF NOT EXISTS idx_booking_schedules_provider ON booking_schedules(provider_id);

-- 6. Schedule Overrides (Exceptions to recurring hours, e.g., vacation days, sick leaves)
CREATE TABLE IF NOT EXISTS booking_schedule_overrides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES booking_providers(id) ON DELETE CASCADE,
  override_date DATE NOT NULL,
  start_time TIME, -- NULL if taking the day off
  end_time TIME,   -- NULL if taking the day off
  is_available BOOLEAN NOT NULL DEFAULT true, -- false = fully unavailable (vacation/holiday)
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK ((is_available = false) OR (start_time IS NOT NULL AND end_time IS NOT NULL AND start_time < end_time)),
  UNIQUE(provider_id, override_date)
);

CREATE INDEX IF NOT EXISTS idx_booking_overrides_provider ON booking_schedule_overrides(provider_id);

-- 7. Appointments (Actual bookings made by contacts)
CREATE TABLE IF NOT EXISTS booking_appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES booking_providers(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES booking_services(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  conversation_id UUID REFERENCES conversations(id) ON DELETE SET NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'noshow')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (start_time < end_time),
  
  -- Exclude overlaps: Prevents double-booking for the same provider
  -- where start_time and end_time overlap, excluding cancelled bookings.
  CONSTRAINT no_double_booking
    EXCLUDE USING gist (
      provider_id WITH =,
      tstzrange(start_time, end_time) WITH &&
    )
    WHERE (status != 'cancelled')
);

CREATE INDEX IF NOT EXISTS idx_booking_appointments_provider ON booking_appointments(provider_id);
CREATE INDEX IF NOT EXISTS idx_booking_appointments_contact ON booking_appointments(contact_id);
CREATE INDEX IF NOT EXISTS idx_booking_appointments_time ON booking_appointments(start_time, end_time);

-- 8. Booking Contexts (Stores temporary wizard/session state for multi-turn WhatsApp scheduling)
CREATE TABLE IF NOT EXISTS booking_contexts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  current_step VARCHAR(50) NOT NULL DEFAULT 'select_provider', -- select_provider -> select_service -> select_slot -> confirm
  provider_id UUID REFERENCES booking_providers(id) ON DELETE CASCADE,
  service_id UUID REFERENCES booking_services(id) ON DELETE CASCADE,
  selected_date DATE,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(contact_id) -- only one active wizard session per contact
);

CREATE INDEX IF NOT EXISTS idx_booking_contexts_contact ON booking_contexts(contact_id);

-- ============================================================
-- Row-Level Security (RLS) Policies
-- Uses existing `is_account_member(account_id, role)` helper
-- ============================================================

ALTER TABLE booking_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_provider_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_schedule_overrides ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_contexts ENABLE ROW LEVEL SECURITY;

-- booking_providers Policies
CREATE POLICY booking_providers_select ON booking_providers FOR SELECT USING (is_account_member(account_id));
CREATE POLICY booking_providers_insert ON booking_providers FOR INSERT WITH CHECK (is_account_member(account_id, 'agent'));
CREATE POLICY booking_providers_update ON booking_providers FOR UPDATE USING (is_account_member(account_id, 'agent'));
CREATE POLICY booking_providers_delete ON booking_providers FOR DELETE USING (is_account_member(account_id, 'agent'));

-- booking_services Policies
CREATE POLICY booking_services_select ON booking_services FOR SELECT USING (is_account_member(account_id));
CREATE POLICY booking_services_insert ON booking_services FOR INSERT WITH CHECK (is_account_member(account_id, 'agent'));
CREATE POLICY booking_services_update ON booking_services FOR UPDATE USING (is_account_member(account_id, 'agent'));
CREATE POLICY booking_services_delete ON booking_services FOR DELETE USING (is_account_member(account_id, 'agent'));

-- booking_provider_services Policies
CREATE POLICY booking_provider_services_select ON booking_provider_services FOR SELECT USING (is_account_member(account_id));
CREATE POLICY booking_provider_services_insert ON booking_provider_services FOR INSERT WITH CHECK (is_account_member(account_id, 'agent'));
CREATE POLICY booking_provider_services_update ON booking_provider_services FOR UPDATE USING (is_account_member(account_id, 'agent'));
CREATE POLICY booking_provider_services_delete ON booking_provider_services FOR DELETE USING (is_account_member(account_id, 'agent'));

-- booking_schedules Policies
CREATE POLICY booking_schedules_select ON booking_schedules FOR SELECT USING (is_account_member(account_id));
CREATE POLICY booking_schedules_insert ON booking_schedules FOR INSERT WITH CHECK (is_account_member(account_id, 'agent'));
CREATE POLICY booking_schedules_update ON booking_schedules FOR UPDATE USING (is_account_member(account_id, 'agent'));
CREATE POLICY booking_schedules_delete ON booking_schedules FOR DELETE USING (is_account_member(account_id, 'agent'));

-- booking_schedule_overrides Policies
CREATE POLICY booking_schedule_overrides_select ON booking_schedule_overrides FOR SELECT USING (is_account_member(account_id));
CREATE POLICY booking_schedule_overrides_insert ON booking_schedule_overrides FOR INSERT WITH CHECK (is_account_member(account_id, 'agent'));
CREATE POLICY booking_schedule_overrides_update ON booking_schedule_overrides FOR UPDATE USING (is_account_member(account_id, 'agent'));
CREATE POLICY booking_schedule_overrides_delete ON booking_schedule_overrides FOR DELETE USING (is_account_member(account_id, 'agent'));

-- booking_appointments Policies
CREATE POLICY booking_appointments_select ON booking_appointments FOR SELECT USING (is_account_member(account_id));
CREATE POLICY booking_appointments_insert ON booking_appointments FOR INSERT WITH CHECK (is_account_member(account_id, 'agent'));
CREATE POLICY booking_appointments_update ON booking_appointments FOR UPDATE USING (is_account_member(account_id, 'agent'));
CREATE POLICY booking_appointments_delete ON booking_appointments FOR DELETE USING (is_account_member(account_id, 'agent'));

-- booking_contexts Policies
CREATE POLICY booking_contexts_select ON booking_contexts FOR SELECT USING (is_account_member(account_id));
CREATE POLICY booking_contexts_insert ON booking_contexts FOR INSERT WITH CHECK (is_account_member(account_id, 'agent'));
CREATE POLICY booking_contexts_update ON booking_contexts FOR UPDATE USING (is_account_member(account_id, 'agent'));
CREATE POLICY booking_contexts_delete ON booking_contexts FOR DELETE USING (is_account_member(account_id, 'agent'));
