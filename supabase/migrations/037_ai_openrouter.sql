-- ============================================================
-- 037_ai_openrouter.sql — Add OpenRouter as an AI provider
--
-- Drops the old CHECK constraint on ai_configs.provider and
-- replaces it with one that includes 'openrouter'.
-- ============================================================

ALTER TABLE ai_configs DROP CONSTRAINT IF EXISTS ai_configs_provider_check;
ALTER TABLE ai_configs ADD CONSTRAINT ai_configs_provider_check CHECK (provider IN ('openai', 'anthropic', 'openrouter'));
