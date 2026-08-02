-- 037_whatsapp_config_app_id.sql — Multi-tenant Meta App ID support

ALTER TABLE whatsapp_config ADD COLUMN IF NOT EXISTS app_id TEXT;
