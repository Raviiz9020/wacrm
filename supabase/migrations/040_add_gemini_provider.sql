-- 040_add_gemini_provider.sql

-- Drops the old CHECK constraints on ai_usage_log.provider and ai_configs.provider
-- and re-adds them with 'gemini' included in the allowlist.

ALTER TABLE ai_usage_log DROP CONSTRAINT IF EXISTS ai_usage_log_provider_check;
ALTER TABLE ai_usage_log ADD CONSTRAINT ai_usage_log_provider_check CHECK (provider IN ('openai', 'anthropic', 'openrouter', 'gemini'));

ALTER TABLE ai_configs DROP CONSTRAINT IF EXISTS ai_configs_provider_check;
ALTER TABLE ai_configs ADD CONSTRAINT ai_configs_provider_check CHECK (provider IN ('openai', 'anthropic', 'openrouter', 'gemini'));
