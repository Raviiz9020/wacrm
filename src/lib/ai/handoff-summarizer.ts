import type { SupabaseClient } from '@supabase/supabase-js'
import { loadAiConfig } from './config'
import { buildConversationContext } from './context'
import type { ChatMessage, AiUsage } from './types'
import { generateOpenAi } from './providers/openai'
import { generateAnthropic } from './providers/anthropic'
import { generateOpenRouter } from './providers/openrouter'
import { generateGemini } from './providers/gemini'
import { buildHandoffSummary } from './handoff'

export interface StructuredHandoffBriefing {
  intent: string
  key_details: string[]
  sentiment: 'Urgent' | 'Interested' | 'Frustrated' | 'Neutral'
  recommended_action: string
}

/**
 * Generate a structured AI briefing card when a conversation is handed off.
 *
 * Slices context to the active session window (messages in the recent active turn),
 * ignoring old historical chats. Calls the account's BYO AI provider (OpenAI,
 * Anthropic, Gemini, OpenRouter) with a JSON schema prompt.
 *
 * Fallback safety: returns deterministic plain text string if LLM fails or is
 * unconfigured.
 */
export async function generateStructuredHandoffBriefing(args: {
  db: SupabaseClient
  accountId: string
  conversationId: string
  messages: ChatMessage[]
  replyCount: number
}): Promise<string> {
  const { db, accountId, conversationId, messages, replyCount } = args

  // Fallback string if AI fails or isn't active
  const fallbackText = buildHandoffSummary({ messages, replyCount })

  try {
    const config = await loadAiConfig(db, accountId)
    if (!config || !config.apiKey) return fallbackText

    // Session Boundary Slicing: take the last 8 text messages max
    // to focus strictly on the current active chat session.
    const activeMessages = messages.slice(-8)
    if (activeMessages.length === 0) return fallbackText

    const systemPrompt = `You are an AI Handoff Assistant for a WhatsApp CRM team.
Analyze the current active conversation transcript between the customer (user) and the business.
Focus ONLY on the immediate active customer request. Ignore past historical resolutions from previous days/weeks.

Return a valid JSON object ONLY (no markdown backticks, no markdown formatting, pure JSON text) with this exact schema:
{
  "intent": "1-sentence description of what the customer is asking or trying to achieve right now",
  "key_details": ["Fact or preference 1", "Fact 2"],
  "sentiment": "Urgent" | "Interested" | "Frustrated" | "Neutral",
  "recommended_action": "Suggested 1-2 sentence response text that the human agent should send back to the customer"
}`

    const providerArgs = {
      apiKey: config.apiKey,
      model: config.model,
      systemPrompt,
      messages: activeMessages,
      timeoutMs: 15_000,
    }

    let result: { text: string; usage: AiUsage | null }
    switch (config.provider) {
      case 'openai':
        result = await generateOpenAi(providerArgs)
        break
      case 'anthropic':
        result = await generateAnthropic(providerArgs)
        break
      case 'openrouter':
        result = await generateOpenRouter(providerArgs)
        break
      case 'gemini':
        result = await generateGemini(providerArgs)
        break
      default:
        return fallbackText
    }

    const cleanJsonText = result.text
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/, '')
      .replace(/```$/, '')
      .trim()

    const parsed = JSON.parse(cleanJsonText) as StructuredHandoffBriefing
    if (
      typeof parsed.intent === 'string' &&
      Array.isArray(parsed.key_details) &&
      typeof parsed.recommended_action === 'string'
    ) {
      return JSON.stringify(parsed)
    }

    return fallbackText
  } catch (err) {
    console.error('[handoff-summarizer] Error generating briefing:', err)
    return fallbackText
  }
}
