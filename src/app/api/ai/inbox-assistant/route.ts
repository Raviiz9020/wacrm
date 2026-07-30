import { NextResponse } from 'next/server'
import { requireRole, toErrorResponse } from '@/lib/auth/account'
import { checkRateLimit, rateLimitResponse, RATE_LIMITS } from '@/lib/rate-limit'
import { loadAiConfig } from '@/lib/ai/config'
import { buildConversationContext } from '@/lib/ai/context'
import { retrieveKnowledge } from '@/lib/ai/knowledge'
import { generateReply } from '@/lib/ai/generate'
import { buildSystemPrompt } from '@/lib/ai/defaults'
import { latestUserMessage } from '@/lib/ai/query'
import { logAiUsage } from '@/lib/ai/usage'
import { supabaseAdmin } from '@/lib/ai/admin-client'
import { AiError, type ChatMessage } from '@/lib/ai/types'
import { fetchCustomerAssetContext } from '@/modules/booking/services/customerAssetService'
import { fetchServiceMatrixPricingContext } from '@/modules/booking/services/matrixPricingService'

/**
 * POST /api/ai/inbox-assistant  (agent+)
 *
 * Internal AI Co-Pilot for staff/doctors on the Inbox page.
 * Combines:
 *  1. AI Agent Settings & System Prompt (Persona, tone, rules)
 *  2. Knowledge Base Embeddings (Clinic docs, pricing, policies)
 *  3. Full Customer Context (Active contact assets, treatment logs, chat thread)
 */
export async function POST(request: Request) {
  try {
    const { supabase, accountId, userId } = await requireRole('agent')

    // 1. Check Rate Limits
    const userLimit = checkRateLimit(`ai-inbox:${userId}`, RATE_LIMITS.aiDraft)
    if (!userLimit.success) return rateLimitResponse(userLimit)

    const accountLimit = checkRateLimit(
      `ai-inbox-acct:${accountId}`,
      RATE_LIMITS.aiDraftAccount,
    )
    if (!accountLimit.success) return rateLimitResponse(accountLimit)

    // 2. Parse payload
    const body = await request.json().catch(() => null)
    const conversationId =
      body && typeof body.conversation_id === 'string' ? body.conversation_id : ''
    const rawMessages = Array.isArray(body?.messages) ? body.messages : null

    if (!rawMessages || rawMessages.length === 0) {
      return NextResponse.json(
        { error: 'messages array is required' },
        { status: 400 },
      )
    }

    const assistantMessages: ChatMessage[] = rawMessages
      .filter(
        (m: unknown): m is ChatMessage =>
          !!m &&
          typeof m === 'object' &&
          ((m as ChatMessage).role === 'user' || (m as ChatMessage).role === 'assistant') &&
          typeof (m as ChatMessage).content === 'string' &&
          (m as ChatMessage).content.trim().length > 0,
      )
      .slice(-20)

    if (assistantMessages.length === 0) {
      return NextResponse.json(
        { error: 'Valid messages required' },
        { status: 400 },
      )
    }

    // 3. Load AI Config
    const config = await loadAiConfig(supabase, accountId, { requireActive: false }).catch(
      (err) => {
        console.error('[ai/inbox-assistant] loadAiConfig error:', err)
        throw new AiError('Stored API key could not be decrypted.', {
          code: 'key_decrypt_failed',
          status: 400,
        })
      },
    )

    if (!config) {
      return NextResponse.json(
        {
          error: 'AI assistant is not set up. Enable it in Settings → AI Assistant.',
          code: 'ai_not_configured',
        },
        { status: 400 },
      )
    }

    // 4. Retrieve KB Embeddings for the current question
    const latestQuery = latestUserMessage(assistantMessages)
    const knowledge = await retrieveKnowledge(
      supabase,
      accountId,
      config,
      latestQuery,
    )

    // 5. Look up customer's profile, assets, treatment history & chat transcript if conversation_id provided
    if (conversationId) {
      const { data: conversation } = await supabase
        .from('conversations')
        .select('contact_id')
        .eq('id', conversationId)
        .maybeSingle()

      if (conversation?.contact_id) {
        const assetContext = await fetchCustomerAssetContext(
          supabase,
          accountId,
          conversation.contact_id,
        )
        if (assetContext) {
          knowledge.push(assetContext)
        }
      }

      // Include recent WhatsApp conversation context as background knowledge
      const chatMessages = await buildConversationContext(supabase, conversationId).catch(() => [])
      if (chatMessages.length > 0) {
        const chatSnippet = chatMessages
          .slice(-10)
          .map((m) => `[${m.role.toUpperCase()}]: ${m.content}`)
          .join('\n')
        knowledge.push(`--- RECENT WHATSAPP CHAT TRANSCRIPT WITH THIS CUSTOMER ---\n${chatSnippet}`)
      }
    }

    // Append active services & dynamic matrix pricing catalog
    const matrixPricingContext = await fetchServiceMatrixPricingContext(supabase, accountId)
    if (matrixPricingContext) {
      knowledge.push(matrixPricingContext)
    }

    // 6. Build unified System Prompt for internal staff assistant
    const systemPrompt = buildSystemPrompt({
      userPrompt: config.systemPrompt,
      mode: 'staff_assistant',
      knowledge,
    })

    // 7. Generate AI Assistant response
    const { text, usage } = await generateReply({
      config,
      systemPrompt,
      messages: assistantMessages,
    })

    // 8. Fire-and-forget usage logging
    try {
      void logAiUsage(supabaseAdmin(), {
        accountId,
        conversationId: conversationId || undefined,
        mode: 'draft',
        provider: config.provider,
        model: config.model,
        usage,
      })
    } catch (logErr) {
      console.error('[ai/inbox-assistant] usage log skipped:', logErr)
    }

    return NextResponse.json({ reply: text })
  } catch (err) {
    if (err instanceof AiError) {
      return NextResponse.json(
        { error: err.message, code: err.code },
        { status: err.status },
      )
    }
    return toErrorResponse(err)
  }
}
