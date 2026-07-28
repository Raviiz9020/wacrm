-- Migration: 041_customer_assets_and_catalog.sql
-- Additive schema for Generalized Service Business OS (Customer Assets, Price Matrix, Portfolio Media, Asset Service History).

-- 1. Asset Definitions (Configured per account/industry, e.g. Vehicle, Patient, Property)
CREATE TABLE IF NOT EXISTS asset_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- e.g., 'Vehicle', 'Patient', 'Property'
  description TEXT,
  schema_definition JSONB NOT NULL DEFAULT '{}'::jsonb, -- Attributes schema definition (e.g. make, model, year, category)
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_asset_types_account ON asset_types(account_id);

-- 2. Customer Assets (Specific customer asset instances e.g. 2023 Hyundai Creta)
CREATE TABLE IF NOT EXISTS customer_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  asset_type_id UUID REFERENCES asset_types(id) ON DELETE RESTRICT,
  identifier_code TEXT, -- e.g. License Plate "MH 12 AB 1234", VIN, or Property Code
  name TEXT NOT NULL, -- e.g., "2023 Hyundai Creta (White)"
  attributes JSONB NOT NULL DEFAULT '{}'::jsonb, -- { "make": "Hyundai", "model": "Creta", "year": 2023, "category": "SUV", "color": "White" }
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_customer_assets_account ON customer_assets(account_id);
CREATE INDEX IF NOT EXISTS idx_customer_assets_contact ON customer_assets(contact_id);

-- 3. Asset Service History & Maintenance Tracker
CREATE TABLE IF NOT EXISTS customer_asset_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  asset_id UUID NOT NULL REFERENCES customer_assets(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES booking_appointments(id) ON DELETE SET NULL,
  service_id UUID NOT NULL REFERENCES booking_services(id) ON DELETE RESTRICT,
  service_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  warranty_expiry_date DATE,
  next_recommended_service_date DATE,
  notes TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_customer_asset_history_account ON customer_asset_history(account_id);
CREATE INDEX IF NOT EXISTS idx_customer_asset_history_asset ON customer_asset_history(asset_id);
CREATE INDEX IF NOT EXISTS idx_customer_asset_history_next_service ON customer_asset_history(next_recommended_service_date);

-- 4. Dynamic Pricing Matrix Rules (Variant pricing e.g. Hatchback vs SUV)
CREATE TABLE IF NOT EXISTS booking_service_price_matrix (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES booking_services(id) ON DELETE CASCADE,
  attribute_key TEXT NOT NULL DEFAULT 'vehicle_category', -- e.g. "vehicle_category"
  attribute_value TEXT NOT NULL, -- e.g. "Hatchback", "Sedan", "SUV", "Luxury"
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  duration_minutes INT CHECK (duration_minutes IS NULL OR duration_minutes > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(service_id, attribute_key, attribute_value)
);

CREATE INDEX IF NOT EXISTS idx_booking_price_matrix_account ON booking_service_price_matrix(account_id);
CREATE INDEX IF NOT EXISTS idx_booking_price_matrix_service ON booking_service_price_matrix(service_id);

-- 5. Portfolio Media Library (Before/After photos & showcase videos)
CREATE TABLE IF NOT EXISTS portfolio_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL, -- e.g. 'Ceramic Coating', 'PPF', 'Interior Detailing'
  media_url TEXT NOT NULL,
  media_type TEXT NOT NULL DEFAULT 'image' CHECK (media_type IN ('image', 'video')),
  metadata JSONB DEFAULT '{}'::jsonb, -- e.g. { "before_after": true, "car_model": "Creta" }
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_portfolio_media_account ON portfolio_media(account_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_media_category ON portfolio_media(category);

-- 6. Additive non-breaking column to booking_appointments
ALTER TABLE booking_appointments
  ADD COLUMN IF NOT EXISTS asset_id UUID REFERENCES customer_assets(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_booking_appointments_asset ON booking_appointments(asset_id);

-- 7. Additive account settings flags for industry customization
ALTER TABLE accounts
  ADD COLUMN IF NOT EXISTS industry_preset TEXT NOT NULL DEFAULT 'general',
  ADD COLUMN IF NOT EXISTS asset_mode TEXT NOT NULL DEFAULT 'disabled', -- 'disabled' | 'vehicle' | 'patient' | 'custom'
  ADD COLUMN IF NOT EXISTS pricing_mode TEXT NOT NULL DEFAULT 'fixed';  -- 'fixed' | 'matrix'

-- ============================================================
-- Row-Level Security (RLS) Policies
-- Uses existing `is_account_member(account_id, role)` helper
-- ============================================================

ALTER TABLE asset_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_asset_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_service_price_matrix ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_media ENABLE ROW LEVEL SECURITY;

-- asset_types Policies
CREATE POLICY asset_types_select ON asset_types FOR SELECT USING (is_account_member(account_id));
CREATE POLICY asset_types_insert ON asset_types FOR INSERT WITH CHECK (is_account_member(account_id, 'agent'));
CREATE POLICY asset_types_update ON asset_types FOR UPDATE USING (is_account_member(account_id, 'agent'));
CREATE POLICY asset_types_delete ON asset_types FOR DELETE USING (is_account_member(account_id, 'agent'));

-- customer_assets Policies
CREATE POLICY customer_assets_select ON customer_assets FOR SELECT USING (is_account_member(account_id));
CREATE POLICY customer_assets_insert ON customer_assets FOR INSERT WITH CHECK (is_account_member(account_id, 'agent'));
CREATE POLICY customer_assets_update ON customer_assets FOR UPDATE USING (is_account_member(account_id, 'agent'));
CREATE POLICY customer_assets_delete ON customer_assets FOR DELETE USING (is_account_member(account_id, 'agent'));

-- customer_asset_history Policies
CREATE POLICY customer_asset_history_select ON customer_asset_history FOR SELECT USING (is_account_member(account_id));
CREATE POLICY customer_asset_history_insert ON customer_asset_history FOR INSERT WITH CHECK (is_account_member(account_id, 'agent'));
CREATE POLICY customer_asset_history_update ON customer_asset_history FOR UPDATE USING (is_account_member(account_id, 'agent'));
CREATE POLICY customer_asset_history_delete ON customer_asset_history FOR DELETE USING (is_account_member(account_id, 'agent'));

-- booking_service_price_matrix Policies
CREATE POLICY booking_service_price_matrix_select ON booking_service_price_matrix FOR SELECT USING (is_account_member(account_id));
CREATE POLICY booking_service_price_matrix_insert ON booking_service_price_matrix FOR INSERT WITH CHECK (is_account_member(account_id, 'agent'));
CREATE POLICY booking_service_price_matrix_update ON booking_service_price_matrix FOR UPDATE USING (is_account_member(account_id, 'agent'));
CREATE POLICY booking_service_price_matrix_delete ON booking_service_price_matrix FOR DELETE USING (is_account_member(account_id, 'agent'));

-- portfolio_media Policies
CREATE POLICY portfolio_media_select ON portfolio_media FOR SELECT USING (is_account_member(account_id));
CREATE POLICY portfolio_media_insert ON portfolio_media FOR INSERT WITH CHECK (is_account_member(account_id, 'agent'));
CREATE POLICY portfolio_media_update ON portfolio_media FOR UPDATE USING (is_account_member(account_id, 'agent'));
CREATE POLICY portfolio_media_delete ON portfolio_media FOR DELETE USING (is_account_member(account_id, 'agent'));

-- ============================================================
-- Supabase Storage Bucket for Portfolio Media
-- ============================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'portfolio-media',
  'portfolio-media',
  TRUE,
  20971520, -- 20 MB limit
  ARRAY['image/png', 'image/jpeg', 'image/webp', 'video/mp4']
)
ON CONFLICT (id) DO UPDATE
SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Portfolio media is publicly readable" ON storage.objects;
CREATE POLICY "Portfolio media is publicly readable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'portfolio-media');

DROP POLICY IF EXISTS "Members can upload portfolio media" ON storage.objects;
CREATE POLICY "Members can upload portfolio media"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'portfolio-media'
    AND EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.user_id = auth.uid()
        AND ('account-' || p.account_id::text) = (storage.foldername(name))[1]
    )
  );

DROP POLICY IF EXISTS "Members can delete portfolio media" ON storage.objects;
CREATE POLICY "Members can delete portfolio media"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'portfolio-media'
    AND EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.user_id = auth.uid()
        AND ('account-' || p.account_id::text) = (storage.foldername(name))[1]
    )
  );
