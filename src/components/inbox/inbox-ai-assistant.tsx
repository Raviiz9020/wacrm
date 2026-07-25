"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  Bot,
  RotateCcw,
  Send,
  Loader2,
  UserCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Turn {
  role: "user" | "assistant";
  content: string;
  handoff?: boolean;
}

interface InboxAiAssistantProps {
  /** Key changes when a new conversation is selected — resets the session. */
  conversationKey: string | null;
  /** Called when the turns are cleared so the parent can react (e.g. update a disabled state). */
  onReset?: (canReset: boolean) => void;
  /** Ref setter so parent can trigger reset imperatively. */
  resetRef?: React.MutableRefObject<(() => void) | null>;
}

export function InboxAiAssistant({ conversationKey, onReset, resetRef }: InboxAiAssistantProps) {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Reset session whenever the active conversation changes
  useEffect(() => {
    setTurns([]);
    setInput("");
  }, [conversationKey]);

  // Notify parent whether a reset is possible
  useEffect(() => {
    onReset?.(turns.length > 0 && !sending);
  }, [turns.length, sending, onReset]);

  // Expose reset imperatively so the parent button can trigger it
  useEffect(() => {
    if (resetRef) {
      resetRef.current = () => {
        setTurns([]);
        setInput("");
      };
    }
  }, [resetRef]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [turns, sending]);

  // Auto-resize textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const ta = e.target;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 80)}px`;
  };

  const send = async () => {
    const text = input.trim();
    if (!text || sending) return;

    const next: Turn[] = [...turns, { role: "user", content: text }];
    setTurns(next);
    setInput("");
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
    setSending(true);

    try {
      const res = await fetch("/api/ai/playground", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.map((t) => ({ role: t.role, content: t.content })),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (data.code === "ai_not_configured") {
          toast.error("AI agent not configured yet — go to AI Agents → Setup.");
        } else {
          toast.error(data.error ?? "Couldn't get a reply.");
        }
        setTurns(turns);
        setInput(text);
        return;
      }
      setTurns([
        ...next,
        {
          role: "assistant",
          content:
            typeof data.reply === "string" && data.reply.trim()
              ? data.reply
              : "",
          handoff: Boolean(data.handoff),
        },
      ]);
    } catch {
      toast.error("Couldn't reach the AI agent.");
      setTurns(turns);
      setInput(text);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send();
    }
  };


  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Chat transcript */}
      <div
        ref={scrollRef}
        className="flex-1 space-y-3 overflow-y-auto p-3 scrollbar-thin"
      >
        {turns.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <p className="text-xs font-medium text-foreground">
              Ask AI anything
            </p>
            <p className="max-w-[160px] text-[11px] leading-relaxed text-muted-foreground">
              Get instant answers to help you respond to this customer.
            </p>
            <div className="mt-1 flex flex-wrap justify-center gap-1">
              {[
                "What's our refund policy?",
                "Pricing for root canal?",
                "Appointment rescheduling",
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => {
                    setInput(suggestion);
                    textareaRef.current?.focus();
                  }}
                  className="rounded-full border border-border bg-muted/50 px-2 py-0.5 text-[10px] text-muted-foreground transition-colors hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {turns.map((t, i) => (
          <div
            key={i}
            className={cn(
              "flex gap-1.5",
              t.role === "user" ? "justify-end" : "justify-start",
            )}
          >
            {t.role === "assistant" && (
              <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Bot className="h-3 w-3 text-primary" />
              </div>
            )}
            <div
              className={cn(
                "max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed",
                t.role === "user"
                  ? "rounded-br-sm bg-primary text-primary-foreground"
                  : "rounded-bl-sm bg-muted text-foreground",
              )}
            >
              {t.content && (
                <p className="whitespace-pre-wrap">{t.content}</p>
              )}
              {t.role === "assistant" && t.handoff && (
                <p
                  className={cn(
                    "flex items-center gap-1 text-[10px] text-amber-500",
                    t.content && "mt-1 border-t border-border/50 pt-1",
                  )}
                >
                  <UserCircle2 className="h-3 w-3" />
                  Would hand off to human
                </p>
              )}
            </div>
            {t.role === "user" && (
              <UserCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
            )}
          </div>
        ))}

        {sending && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10">
              <Bot className="h-3 w-3 text-primary" />
            </div>
            <div className="flex gap-1">
              <span className="animate-bounce text-primary" style={{ animationDelay: "0ms" }}>•</span>
              <span className="animate-bounce text-primary" style={{ animationDelay: "150ms" }}>•</span>
              <span className="animate-bounce text-primary" style={{ animationDelay: "300ms" }}>•</span>
            </div>
          </div>
        )}
      </div>

      {/* Composer */}
      <div className="shrink-0 border-t border-border p-2">
        <div className="flex items-end gap-1.5 rounded-xl border border-border bg-muted/50 px-2 py-1.5 focus-within:border-primary/40 focus-within:bg-background transition-colors">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask AI a question…"
            rows={1}
            className="flex-1 resize-none bg-transparent py-0.5 text-xs text-foreground placeholder-muted-foreground outline-none"
            style={{ minHeight: "20px", maxHeight: "80px" }}
          />
          <Button
            size="sm"
            onClick={send}
            disabled={!input.trim() || sending}
            className="h-6 w-6 shrink-0 p-0"
          >
            {sending ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Send className="h-3 w-3" />
            )}
          </Button>
        </div>
        <p className="mt-1 text-center text-[9px] text-muted-foreground/60">
          Internal tool — not visible to customer
        </p>
      </div>
    </div>
  );
}
