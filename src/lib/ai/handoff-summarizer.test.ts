import { describe, it, expect, vi, beforeEach } from 'vitest'
import { generateStructuredHandoffBriefing } from './handoff-summarizer'

const h = vi.hoisted(() => ({
  loadAiConfig: vi.fn(),
  generateOpenAi: vi.fn(),
  generateAnthropic: vi.fn(),
}))

vi.mock('./config', () => ({ loadAiConfig: h.loadAiConfig }))
vi.mock('./providers/openai', () => ({ generateOpenAi: h.generateOpenAi }))
vi.mock('./providers/anthropic', () => ({ generateAnthropic: h.generateAnthropic }))

describe('generateStructuredHandoffBriefing', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns fallback plain text when AI is not configured', async () => {
    h.loadAiConfig.mockResolvedValue(null)
    const result = await generateStructuredHandoffBriefing({
      db: {} as any,
      accountId: 'acct-1',
      conversationId: 'conv-1',
      messages: [{ role: 'user', content: 'i need help with pricing' }],
      replyCount: 2,
    })

    expect(result).toContain('AI agent handed off after 2 replies')
  })

  it('parses valid JSON response from LLM into structured briefing string', async () => {
    h.loadAiConfig.mockResolvedValue({
      provider: 'openai',
      model: 'gpt-4o-mini',
      apiKey: 'sk-test',
    })

    const sampleBriefing = {
      intent: 'Customer wants to check root canal pricing and tomorrow appointment',
      key_details: ['Upper molar pain', 'Prefers afternoon'],
      sentiment: 'Urgent',
      recommended_action: 'Quote $150 consultation fee and offer 2:30 PM slot.',
    }

    h.generateOpenAi.mockResolvedValue({
      text: JSON.stringify(sampleBriefing),
      usage: { input_tokens: 100, output_tokens: 50 },
    })

    const result = await generateStructuredHandoffBriefing({
      db: {} as any,
      accountId: 'acct-1',
      conversationId: 'conv-1',
      messages: [{ role: 'user', content: 'i need help with root canal pricing' }],
      replyCount: 1,
    })

    const parsed = JSON.parse(result)
    expect(parsed.intent).toBe(sampleBriefing.intent)
    expect(parsed.sentiment).toBe('Urgent')
    expect(parsed.recommended_action).toContain('Quote $150')
  })

  it('slices only the active session window messages for summary generation', async () => {
    h.loadAiConfig.mockResolvedValue({
      provider: 'openai',
      model: 'gpt-4o-mini',
      apiKey: 'sk-test',
    })

    h.generateOpenAi.mockResolvedValue({
      text: JSON.stringify({
        intent: 'Inquiring about root canal pricing',
        key_details: ['Today query'],
        sentiment: 'Neutral',
        recommended_action: 'Send pricing PDF',
      }),
      usage: null,
    })

    const historicalMessages = Array.from({ length: 15 }, (_, i) => ({
      role: (i % 2 === 0 ? 'user' : 'assistant') as 'user' | 'assistant',
      content: `Old message ${i}`,
    }))

    await generateStructuredHandoffBriefing({
      db: {} as any,
      accountId: 'acct-1',
      conversationId: 'conv-1',
      messages: historicalMessages,
      replyCount: 5,
    })

    // Verify system prompt received sliced active window (last 8 messages)
    expect(h.generateOpenAi).toHaveBeenCalledWith(
      expect.objectContaining({
        messages: expect.arrayContaining([
          expect.objectContaining({ content: 'Old message 14' }),
        ]),
      })
    )
    const callArgs = h.generateOpenAi.mock.calls[0][0]
    expect(callArgs.messages.length).toBe(8)
  })
})
