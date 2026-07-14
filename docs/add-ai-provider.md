# Adding a New AI Provider

This document outlines the exact procedure for integrating a new AI provider (like Gemini, DeepSeek, Groq, etc.) into the WaCRM BYO-key AI architecture. 

The architecture is highly modular; the rest of the application (e.g. the webhook auto-reply bot, the draft generator, and the usage dashboard) uses a unified interface and will seamlessly support the new provider as long as you follow these 5 steps.

## 1. Database Migration (Crucial First Step)
The database enforces strict `CHECK` constraints on the provider strings to maintain data integrity. You **must** create a new Supabase migration (e.g., `supabase/migrations/XXX_add_new_provider.sql`) to drop and recreate the constraints for both the configuration and usage logging tables:

```sql
-- Drops the old CHECK constraints on ai_usage_log.provider and ai_configs.provider
-- and re-adds them with 'newprovider' included in the allowlist.

ALTER TABLE ai_usage_log DROP CONSTRAINT IF EXISTS ai_usage_log_provider_check;
ALTER TABLE ai_usage_log ADD CONSTRAINT ai_usage_log_provider_check CHECK (provider IN ('openai', 'anthropic', 'openrouter', 'gemini', 'newprovider'));

ALTER TABLE ai_configs DROP CONSTRAINT IF EXISTS ai_configs_provider_check;
ALTER TABLE ai_configs ADD CONSTRAINT ai_configs_provider_check CHECK (provider IN ('openai', 'anthropic', 'openrouter', 'gemini', 'newprovider'));
```

## 2. Core Types & Defaults
Update the global types and default configurations so the app recognizes the new provider.

**`src/lib/ai/types.ts`**
Add the new provider string to the `AiProvider` type:
```typescript
export type AiProvider = 'openai' | 'anthropic' | 'openrouter' | 'gemini' | 'newprovider'
```

**`src/lib/ai/defaults.ts`**
Add a sensible default model for the new provider:
```typescript
export const AI_PROVIDER_DEFAULT_MODEL: Record<AiProvider, string> = {
  // ... existing
  newprovider: 'new-model-name-latest',
}
```

## 3. Create the Provider Adapter
Create a new adapter file in `src/lib/ai/providers/` (e.g., `newprovider.ts`).

- The adapter must export a function (e.g., `generateNewProvider(args: ProviderArgs)`) that returns a `Promise<ProviderResult>`.
- **Note:** If the provider offers an OpenAI-compatible REST API (like Gemini and DeepSeek do), you can simply copy `src/lib/ai/providers/openai.ts` and change the `URL` endpoint. Avoid installing heavy provider SDKs if standard `fetch()` with an OpenAI-compatible endpoint is available.
- **Important compatibility gotcha:** When copying `openai.ts`, change `max_completion_tokens` in the request body to `max_tokens`. Many compatible endpoints (like Gemini's) are built on older OpenAI specs and will throw a `400 Bad Request` if they receive the newer `max_completion_tokens` parameter.
- Ensure you normalize the returned token counts using `normalizeUsage({ prompt, completion, total })` so the AI Dashboard graphs it correctly.

## 4. Hook into the Generator and API Routes
You need to wire the adapter into the central dispatcher and update the hardcoded API route validations.

**`src/lib/ai/generate.ts`**
Import your new adapter function and add it to the `switch` statement:
```typescript
import { generateNewProvider } from './providers/newprovider'

// Inside generateReply()
switch (config.provider) {
  // ... existing cases
  case 'newprovider':
    result = await generateNewProvider(providerArgs)
    break;
}
```

**`src/app/api/ai/test/route.ts` & `src/app/api/ai/config/route.ts`**
Update the hardcoded validation logic in **both** files to accept the new provider string:
```typescript
if (provider !== 'openai' && provider !== 'anthropic' && provider !== 'openrouter' && provider !== 'gemini' && provider !== 'newprovider') {
  return bad('provider must be "openai", "anthropic", "openrouter", "gemini", or "newprovider"')
}
```

## 5. Update the UI Settings Form
Finally, expose the new provider in the AI Settings dashboard so users can select it.

**`src/components/settings/ai-config.tsx`**
Update the label and placeholder configurations:
```typescript
const PROVIDER_LABEL: Record<AiProvider, string> = {
  // ... existing
  newprovider: 'New Provider Name',
};

const KEY_PLACEHOLDER: Record<AiProvider, string> = {
  // ... existing
  newprovider: 'sk-new...',
};
```
Then, add a `<SelectItem>` in the `provider` dropdown:
```tsx
<SelectItem value="newprovider">
  {PROVIDER_LABEL.newprovider}
</SelectItem>
```

---
**Done!** Test the connection in the UI. Usage logs will automatically begin populating the "AI Agents" dashboard tab for the new provider.
