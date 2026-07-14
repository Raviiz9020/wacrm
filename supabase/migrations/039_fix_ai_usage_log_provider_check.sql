-- ============================================================
-- 039_fix_ai_usage_log_provider_check.sql
--
-- Drops the old CHECK constraint on ai_usage_log.provider and
-- replaces it with one that includes 'openrouter'.
-- ============================================================

ALTER TABLE ai_usage_log DROP CONSTRAINT IF EXISTS ai_usage_log_provider_check;
ALTER TABLE ai_usage_log ADD CONSTRAINT ai_usage_log_provider_check CHECK (provider IN ('openai', 'anthropic', 'openrouter'));
