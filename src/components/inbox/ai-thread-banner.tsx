"use client";

import { useState, useEffect, useCallback } from "react";
import { Sparkles, Hand, Undo2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useAuth } from "@/hooks/use-auth";

// ------------------------------------------------------------
// Account AI status is the same for every conversation, so cache it per
// account and reuse it across thread switches instead of hitting
// /api/ai/config every time the agent opens a chat.
//
// Keyed by accountId (a multi-account user switching workspaces must not
// see the previous account's status), and only *successful* fetches are
// cached — a transient failure returns a default without poisoning the
// cache, so it retries on the next thread open rather than hiding the
// banner for the whole session.
// ------------------------------------------------------------
interface AiAccountStatus {
  autoReplyOn: boolean;
}
const statusCache = new Map<string, AiAccountStatus>();

async function fetchAiAccountStatus(accountId: string): Promise<AiAccountStatus> {
  const cached = statusCache.get(accountId);
  if (cached) return cached;
  try {
    const res = await fetch("/api/ai/config", { cache: "no-store" });
    if (!res.ok) return { autoReplyOn: false }; // don't cache a transient failure
    const j = await res.json();
    const status = {
      // AI auto-reply is "live" only when configured, the master switch
      // is on, and the inbound bot is enabled.
      autoReplyOn: !!(j?.configured && j?.is_active && j?.auto_reply_enabled),
    };
    statusCache.set(accountId, status);
    return status;
  } catch {
    return { autoReplyOn: false }; // don't cache
  }
}

interface ParsedBriefing {
  intent: string;
  key_details?: string[];
  sentiment?: "Urgent" | "Interested" | "Frustrated" | "Neutral";
  recommended_action?: string;
}

function parseBriefing(summaryText?: string | null): ParsedBriefing | null {
  if (!summaryText) return null;
  try {
    const parsed = JSON.parse(summaryText);
    if (parsed && typeof parsed.intent === "string") {
      return parsed as ParsedBriefing;
    }
  } catch {
    // Plain text fallback
  }
  return null;
}

interface AiThreadBannerProps {
  conversationId: string;
  /** `conversations.ai_autoreply_disabled` — bot paused on this thread. */
  disabled: boolean;
  /** `conversations.ai_handoff_summary` — note the bot left on handoff. */
  handoffSummary?: string | null;
  /** Current assignee; when a human owns the thread the bot won't run,
   *  so the "AI active" banner is suppressed. */
  assignedAgentId?: string | null;
  /** The acting agent — "Take over" assigns the thread to them. */
  currentUserId?: string | null;
  /** Called when agent clicks 'Use Suggested Response' to pre-fill composer. */
  onUseSuggestedResponse?: (text: string) => void;
  /** Called after a successful toggle so the parent can patch its local
   *  conversation state. */
  onChange?: (patch: {
    ai_autoreply_disabled: boolean;
    assigned_agent_id?: string | null;
  }) => void;
}

export function AiThreadBanner({
  conversationId,
  disabled,
  handoffSummary,
  assignedAgentId,
  currentUserId,
  onUseSuggestedResponse,
  onChange,
}: AiThreadBannerProps) {
  const t = useTranslations("Inbox.aiBanner");
  const { accountId } = useAuth();
  const [autoReplyOn, setAutoReplyOn] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);
  const [paused, setPaused] = useState(disabled);
  useEffect(() => setPaused(disabled), [conversationId, disabled]);

  useEffect(() => {
    if (!accountId) return;
    let alive = true;
    fetchAiAccountStatus(accountId).then((s) => alive && setAutoReplyOn(s.autoReplyOn));
    return () => {
      alive = false;
    };
  }, [accountId]);

  const toggle = useCallback(
    async (paused: boolean) => {
      setBusy(true);
      try {
        const res = await fetch(`/api/ai/autoreply/${conversationId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paused, assign_to_me: paused }),
        });
        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          toast.error(j?.error ?? t("updateError"));
          return;
        }
        setPaused(paused);
        onChange?.({
          ai_autoreply_disabled: paused,
          ...(paused
            ? currentUserId
              ? { assigned_agent_id: currentUserId }
              : {}
            : { assigned_agent_id: null }),
        });
        toast.success(paused ? t("tookOver") : t("resumed"));
      } catch {
        toast.error(t("networkError"));
      } finally {
        setBusy(false);
      }
    },
    [conversationId, currentUserId, onChange, t],
  );

  // Account has no auto-reply → nothing to show.
  if (!autoReplyOn) return null;

  const briefing = parseBriefing(handoffSummary);

  // Paused here (a human took over, or the model handed off).
  if (paused) {
    const sentimentColor: Record<string, string> = {
      Urgent: "bg-red-500/10 text-red-500 border-red-500/20",
      Frustrated: "bg-amber-500/10 text-amber-500 border-amber-500/20",
      Interested: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
      Neutral: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    };

    return (
      <Banner tone="muted">
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="font-medium text-foreground">{t("pausedTitle")}</span>
              {briefing?.sentiment && (
                <span
                  className={cn(
                    "rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                    sentimentColor[briefing.sentiment] || sentimentColor.Neutral,
                  )}
                >
                  {briefing.sentiment}
                </span>
              )}
            </div>
          </div>

          {briefing ? (
            <div className="space-y-1 text-xs text-muted-foreground">
              <p className="font-medium text-foreground">📌 {briefing.intent}</p>
              {briefing.key_details && briefing.key_details.length > 0 && (
                <ul className="list-inside list-disc space-y-0.5 text-[11px]">
                  {briefing.key_details.map((detail, idx) => (
                    <li key={idx} className="truncate">{detail}</li>
                  ))}
                </ul>
              )}
              {briefing.recommended_action && (
                <div className="mt-1 flex items-center justify-between gap-2 rounded-md bg-muted/60 p-1.5 text-[11px] text-foreground">
                  <span className="truncate italic">💡 "{briefing.recommended_action}"</span>
                  {onUseSuggestedResponse && (
                    <button
                      type="button"
                      onClick={() => onUseSuggestedResponse(briefing.recommended_action!)}
                      className="shrink-0 rounded bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary transition-colors hover:bg-primary/20"
                    >
                      ⚡ Use Reply
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : (
            handoffSummary && (
              <p className="truncate text-muted-foreground" title={handoffSummary}>
                {handoffSummary}
              </p>
            )
          )}
        </div>
        <div className="shrink-0 self-start">
          <BannerButton onClick={() => toggle(false)} busy={busy} icon={Undo2}>
            {t("resume")}
          </BannerButton>
        </div>
      </Banner>
    );
  }

  // Active, but a human already owns it → the bot won't fire; no banner.
  if (assignedAgentId) return null;

  // Active on this thread.
  return (
    <Banner tone="primary">
      <div className="flex min-w-0 flex-1 items-center gap-1.5">
        <Sparkles className="h-3.5 w-3.5 flex-shrink-0 text-primary" />
        <span className="truncate font-medium text-foreground">
          {t("activeText")}
        </span>
      </div>
      <BannerButton onClick={() => toggle(true)} busy={busy} icon={Hand}>
        {t("takeOver")}
      </BannerButton>
    </Banner>
  );
}

function Banner({
  tone,
  children,
}: {
  tone: "primary" | "muted";
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 border-b px-3 py-2 text-xs sm:px-4",
        tone === "primary"
          ? "border-primary/20 bg-primary/5"
          : "border-border bg-muted/40",
      )}
    >
      {children}
    </div>
  );
}

function BannerButton({
  onClick,
  busy,
  icon: Icon,
  children,
}: {
  onClick: () => void;
  busy: boolean;
  icon: typeof Hand;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      className="inline-flex flex-shrink-0 items-center gap-1 rounded-md border border-border bg-card px-2.5 py-1 font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-60"
    >
      {busy ? (
        <Loader2 className="h-3 w-3 animate-spin" />
      ) : (
        <Icon className="h-3 w-3" />
      )}
      {children}
    </button>
  );
}
