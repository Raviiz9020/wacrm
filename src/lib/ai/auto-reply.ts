import { supabaseAdmin } from './admin-client'
import { loadAiConfig } from './config'
import { buildConversationContext } from './context'
import { retrieveKnowledge } from './knowledge'
import { generateReply } from './generate'
import { buildSystemPrompt } from './defaults'
import { buildHandoffSummary } from './handoff'
import { logAiUsage } from './usage'
import { latestUserMessage } from './query'
import { engineSendText } from '@/lib/flows/meta-send'
import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limit'
import { generateStructuredHandoffBriefing } from './handoff-summarizer'
import { fetchCustomerAssetContext } from '@/modules/booking/services/customerAssetService'
import { fetchServiceMatrixPricingContext } from '@/modules/booking/services/matrixPricingService'
import { fetchPortfolioMediaContext } from '@/modules/booking/services/portfolioService'

interface DispatchArgs {
  /** Tenancy key — drives config, contact, and whatsapp_config lookups. */
  accountId: string
  conversationId: string
  contactId: string
  /** The account's WhatsApp config owner, used for the outbound send's
   *  audit columns (mirrors how the flow runner passes it through). */
  configOwnerUserId: string
}

/**
 * AI auto-reply for a freshly-arrived inbound message.
 *
 * Invoked from the WhatsApp webhook's `after()` block, only when no
 * deterministic flow consumed the message (flows win). Mirrors the flow
 * runner's contract: it owns its try/catch and NEVER throws — a failing
 * or slow LLM call must not affect the webhook's 200 to Meta.
 *
 * Eligibility gates (any → silent no-op):
 *   - AI off / auto-reply disabled for the account
 *   - a human agent is assigned (they own the thread)
 *   - auto-reply was disabled for this conversation (prior handoff)
 *   - the per-conversation reply cap is reached
 *   - there's nothing to reply to
 *
 * The 24h WhatsApp session window is inherently open here — we're
 * reacting to a customer message that just landed — so no separate
 * window check is needed.
 */
export async function dispatchInboundToAiReply(
  args: DispatchArgs,
): Promise<void> {
  const { accountId, conversationId, contactId, configOwnerUserId } = args

  try {
    const db = supabaseAdmin()

    const config = await loadAiConfig(db, accountId)
    if (!config || !config.autoReplyEnabled) return

    // Deterministic, user-configured responders win over the LLM — the
    // caller already excludes messages a Flow consumed. Message-level
    // automations (`new_message_received` / `keyword_match`) are
    // dispatched independently for this same inbound and may send their
    // own reply, so if the account has any active one we stand down to
    // avoid double-texting the customer. (Relationship triggers like
    // `first_inbound_message` don't count — they're not per-message
    // auto-responders.)
    const { data: autoResponders } = await db
      .from('automations')
      .select('id')
      .eq('account_id', accountId)
      .eq('is_active', true)
      .in('trigger_type', ['new_message_received', 'keyword_match'])
      .limit(1)
    if (autoResponders && autoResponders.length > 0) return

    const { data: conv, error: convErr } = await db
      .from('conversations')
      .select('assigned_agent_id, ai_autoreply_disabled, ai_reply_count')
      .eq('id', conversationId)
      .maybeSingle()
    if (convErr || !conv) return
    if (conv.assigned_agent_id) return // a human owns this thread
    if (conv.ai_autoreply_disabled) return // handed off / turned off here
    // Cheap early-out; the authoritative cap check is the atomic claim
    // below (this read can race a concurrent inbound).
    const messages = await buildConversationContext(db, conversationId)
    if (messages.length === 0) return

    // ------------------------------------------------------------
    // 1. Explicit Handoff Keyword Detector
    // ------------------------------------------------------------
    const latestMsg = latestUserMessage(messages).trim().toLowerCase()
    const HANDOFF_KEYWORDS = [
      'human agent', 'talk to human', 'talk to a human', 'speak to human', 'speak to a human',
      'talk to agent', 'speak to agent', 'hand off', 'handoff', 'connect me to human',
      'connect to agent', 'human support', 'customer service agent', 'representative', 'real person',
      'connect me with someone', 'connect with someone', 'connect me to someone', 'connect to someone',
      'talk with someone', 'speak with someone', 'talk to someone', 'speak to someone',
      'connect me with a person', 'connect me to a person', 'talk to a person', 'speak to a person',
      'connect me to staff', 'connect me with staff', 'talk to staff', 'speak to staff',
      'connect me to team', 'connect me with team', 'transfer me', 'transfer to human', 'transfer to agent',
      'customer service executive', 'support executive', 'talk to specialist', 'connect with expert'
    ]
    const handoffPattern = /(connect|talk|speak|transfer)\s+(me\s+)?(to|with)?\s*(a|an)?\s*(someone|person|human|agent|representative|rep|staff|team|executive|doctor|specialist|expert)/i

    const isExplicitHandoff =
      HANDOFF_KEYWORDS.some((kw) => latestMsg.includes(kw)) ||
      handoffPattern.test(latestMsg)

    // Helper to execute full handoff sequence
    const performHandoff = async (summaryNote: string) => {
      let targetAgentId = config.handoffAgentId
      if (!targetAgentId && !conv.assigned_agent_id) {
        // Fallback: assign to account owner/admin if no handoff target configured
        const { data: owner } = await db
          .from('profiles')
          .select('user_id')
          .eq('account_id', accountId)
          .order('created_at', { ascending: true })
          .limit(1)
          .maybeSingle()
        if (owner) targetAgentId = owner.user_id
      }

      // Generate structured briefing card
      const structuredSummary = await generateStructuredHandoffBriefing({
        db,
        accountId,
        conversationId,
        messages,
        replyCount: conv.ai_reply_count ?? 0,
      })

      const finalSummary = structuredSummary || summaryNote

      const update: Record<string, unknown> = {
        ai_autoreply_disabled: true,
        ai_handoff_summary: finalSummary,
        status: 'pending',
      }
      if (targetAgentId && !conv.assigned_agent_id) {
        update.assigned_agent_id = targetAgentId
      }
      await db.from('conversations').update(update).eq('id', conversationId)

      // Optionally log a human-readable note under contact_notes for audit history
      try {
        let noteText = `🤖 AI Handoff Briefing`
        try {
          const parsed = JSON.parse(finalSummary)
          if (parsed?.intent) {
            noteText += `\n📌 Intent: ${parsed.intent}\n📋 Details: ${(parsed.key_details || []).join(', ')}\n🏷️ Sentiment: ${parsed.sentiment || 'Neutral'}\n💡 Recommended Action: ${parsed.recommended_action || 'N/A'}`
          } else {
            noteText += `\n${finalSummary}`
          }
        } catch {
          noteText += `\n${finalSummary}`
        }

        await db.from('contact_notes').insert({
          account_id: accountId,
          contact_id: contactId,
          user_id: targetAgentId || configOwnerUserId,
          note_text: noteText,
        })
      } catch (e) {
        console.error('[ai auto-reply] Failed to write contact note on handoff:', e)
      }

      // Send outbound confirmation text to customer's WhatsApp
      await engineSendText({
        accountId,
        userId: configOwnerUserId,
        conversationId,
        contactId,
        text: 'Connecting you with a human agent to assist with your request. Please wait a moment...',
        aiGenerated: true,
      })
    }

    if (isExplicitHandoff) {
      const summary = buildHandoffSummary({
        messages,
        replyCount: conv.ai_reply_count ?? 0,
      })
      await performHandoff(summary)
      return
    }

    // ------------------------------------------------------------
    // 2. Cap Exhaustion Gate — trigger handoff instead of silent exit
    // ------------------------------------------------------------
    if (conv.ai_reply_count >= config.autoReplyMaxPerConversation) {
      const summary = `🤖 AI bot reached max reply cap (${config.autoReplyMaxPerConversation} replies). Handed off to human agent.`
      await performHandoff(summary)
      return
    }

    // Quick static reply guard to bypass LLM and embeddings API for simple greetings/filler
    const GREETINGS = new Set(['hi', 'hello', 'hey', 'ola', 'yo', 'hlo', 'hllo'])
    const THANKS = new Set(['thanks', 'thank you', 'tq', 'ty'])
    const FAREWELLS = new Set(['bye', 'goodbye', 'tc'])

    let staticReply: string | null = null
    if (GREETINGS.has(latestMsg)) {
      staticReply = 'Hello! How can I help you today?'
    } else if (THANKS.has(latestMsg)) {
      staticReply = "You're very welcome! Let me know if you need anything else."
    } else if (FAREWELLS.has(latestMsg)) {
      staticReply = 'Goodbye! Have a great day.'
    }

    if (staticReply) {
      const { data: claimed, error: claimErr } = await db.rpc(
        'claim_ai_reply_slot',
        {
          conversation_id: conversationId,
          max_replies: config.autoReplyMaxPerConversation,
        },
      )
      if (claimErr) {
        console.error('[ai auto-reply] claim_ai_reply_slot failed for static reply:', claimErr)
        return
      }
      if (claimed !== true) {
        const summary = `🤖 AI bot reached max reply cap (${config.autoReplyMaxPerConversation} replies). Handed off to human agent.`
        await performHandoff(summary)
        return
      }

      await engineSendText({
        accountId,
        userId: configOwnerUserId,
        conversationId,
        contactId,
        text: staticReply,
        aiGenerated: true,
      })
      return
    }

    // Account-wide throttle on the shared BYO key.
    const acctLimit = checkRateLimit(
      `ai-autoreply:${accountId}`,
      RATE_LIMITS.aiAutoReplyAccount,
    )
    if (!acctLimit.success) {
      console.warn(
        `[ai auto-reply] account ${accountId} hit the per-account rate limit — skipping this inbound.`,
      )
      return
    }

    // Ground the reply in the account's knowledge base, customer assets, matrix pricing, and portfolio showcase concurrently.
    const [knowledge, assetContext, matrixPricingContext, portfolioContext] = await Promise.all([
      retrieveKnowledge(db, accountId, config, latestUserMessage(messages)).catch(() => [] as string[]),
      contactId ? fetchCustomerAssetContext(db, accountId, contactId).catch(() => '') : Promise.resolve(''),
      fetchServiceMatrixPricingContext(db, accountId).catch(() => ''),
      fetchPortfolioMediaContext(db, accountId).catch(() => ''),
    ])

    if (matrixPricingContext) {
      knowledge.unshift(matrixPricingContext)
    }
    if (portfolioContext) {
      knowledge.unshift(portfolioContext)
    }
    if (assetContext) {
      knowledge.push(assetContext)
    }

    const systemPrompt = buildSystemPrompt({
      userPrompt: config.systemPrompt,
      mode: 'auto_reply',
      knowledge,
    })

    const { text, handoff, usage } = await generateReply({
      config,
      systemPrompt,
      messages,
    })

    // Record token spend on the account's BYO key.
    void logAiUsage(db, {
      accountId,
      conversationId,
      mode: 'auto_reply',
      provider: config.provider,
      model: config.model,
      usage,
    })

    if (handoff || !text) {
      const summary = buildHandoffSummary({
        messages,
        replyCount: conv.ai_reply_count ?? 0,
      })
      await performHandoff(summary)
      return
    }

    // Atomically claim a reply slot
    const { data: claimed, error: claimErr } = await db.rpc(
      'claim_ai_reply_slot',
      {
        conversation_id: conversationId,
        max_replies: config.autoReplyMaxPerConversation,
      },
    )
    if (claimErr) {
      console.error('[ai auto-reply] claim_ai_reply_slot failed:', claimErr)
      return
    }
    if (claimed !== true) {
      const summary = `🤖 AI bot reached max reply cap (${config.autoReplyMaxPerConversation} replies). Handed off to human agent.`
      await performHandoff(summary)
      return
    }

    await engineSendText({
      accountId,
      userId: configOwnerUserId,
      conversationId,
      contactId,
      text,
      aiGenerated: true,
    })
  } catch (err) {
    console.error('[ai auto-reply] dispatch failed:', err)
  }
}
