"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import type { Contact, Deal, ContactNote, Tag } from "@/types";
import {
  Phone,
  Mail,
  Copy,
  Check,
  Tag as TagIcon,
  DollarSign,
  StickyNote,
  Plus,
  ChevronDown,
  ChevronUp,
  Sparkles,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { useTranslations } from "next-intl";
import { InboxAiAssistant } from "@/components/inbox/inbox-ai-assistant";

const AI_PANEL_STORAGE_KEY = "wacrm:inbox:ai-panel-open";

interface ContactSidebarProps {
  contact: Contact | null;
  /** Passed down as the AI session key — resets chat on conversation change. */
  conversationId?: string | null;
}

export function ContactSidebar({
  contact,
  conversationId,
}: ContactSidebarProps) {
  const tSidebar = useTranslations("Inbox.sidebar");
  const tThread = useTranslations("Inbox.messageThread");

  const { accountId } = useAuth();
  const [copied, setCopied] = useState(false);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [notes, setNotes] = useState<ContactNote[]>([]);
  const [tags, setTags] = useState<(Tag & { contact_tag_id: string })[]>([]);
  const [newNote, setNewNote] = useState("");
  const [addingNote, setAddingNote] = useState(false);

  /**
   * Whether the AI assistant panel is expanded.
   * Defaults to `true` (show by default) and is restored from localStorage
   * after mount to avoid hydration mismatches.
   */
  const [aiPanelOpen, setAiPanelOpen] = useState(true);
  const [canReset, setCanReset] = useState(false);
  const aiResetRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(AI_PANEL_STORAGE_KEY);
      if (stored !== null) setAiPanelOpen(stored === "true");
    } catch {
      // localStorage can throw in private-browsing / sandboxed contexts.
    }
  }, []);

  const handleToggleAiPanel = useCallback(() => {
    setAiPanelOpen((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(AI_PANEL_STORAGE_KEY, String(next));
      } catch {
        // Persistence is best-effort; ignore storage failures.
      }
      return next;
    });
  }, []);

  const handleAiReset = useCallback(() => {
    aiResetRef.current?.();
  }, []);

  const fetchContactData = useCallback(async () => {
    if (!contact) return;

    const supabase = createClient();

    // Fetch deals, notes, and tags in parallel
    const [dealsRes, notesRes, tagsRes] = await Promise.all([
      supabase
        .from("deals")
        .select("*, stage:pipeline_stages(*)")
        .eq("contact_id", contact.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("contact_notes")
        .select("*")
        .eq("contact_id", contact.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("contact_tags")
        .select("id, tag_id, tags(*)")
        .eq("contact_id", contact.id),
    ]);

    if (dealsRes.data) setDeals(dealsRes.data);
    if (notesRes.data) setNotes(notesRes.data);
    if (tagsRes.data) {
      const mapped = tagsRes.data
        .filter((ct: Record<string, unknown>) => ct.tags)
        .map((ct: Record<string, unknown>) => ({
          ...(ct.tags as Tag),
          contact_tag_id: ct.id as string,
        }));
      setTags(mapped);
    }
  }, [contact]);

  // Load on contact change. setContactData/setTags run inside async
  // Supabase callbacks, not synchronously in the effect body.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchContactData();
  }, [fetchContactData]);

  const handleCopyPhone = useCallback(async () => {
    if (!contact?.phone) return;
    await navigator.clipboard.writeText(contact.phone);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    // Dep is the whole `contact` object (not `contact?.phone`) so the
    // React Compiler's inference agrees with the manual dep list —
    // fixes the `preserve-manual-memoization` lint error.
  }, [contact]);

  const handleAddNote = useCallback(async () => {
    if (!contact || !newNote.trim()) return;
    if (!accountId) return;
    setAddingNote(true);

    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const user = session?.user;

    const { data, error } = await supabase
      .from("contact_notes")
      .insert({
        contact_id: contact.id,
        account_id: accountId,
        user_id: user?.id,
        note_text: newNote.trim(),
      })
      .select()
      .single();

    if (!error && data) {
      setNotes((prev) => [data, ...prev]);
      setNewNote("");
    }
    setAddingNote(false);
  }, [contact, newNote, accountId]);

  if (!contact) {
    return (
      <div className="flex h-full w-72 flex-col border-l border-border bg-card">
        {/* Contact area placeholder */}
        <div className="flex flex-1 items-center justify-center border-b border-border">
          <p className="text-sm text-muted-foreground">
            {tThread("selectConversation")}
          </p>
        </div>

        {/* AI panel — always shown even with no contact selected */}
        <div
          className={cn(
            "flex flex-col transition-all duration-200",
            aiPanelOpen ? "flex-1" : "shrink-0",
          )}
        >
          {/* AI panel header */}
          <button
            onClick={handleToggleAiPanel}
            className="flex w-full items-center justify-between px-3 py-2 hover:bg-muted/50 transition-colors border-b border-border"
          >
            <div className="flex items-center gap-1.5">
              <div className="flex h-5 w-5 items-center justify-center rounded-md bg-primary/10">
                <Sparkles className="h-3 w-3 text-primary" />
              </div>
              <span className="text-xs font-semibold text-foreground">
                AI Assistant
              </span>
              <span className="rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wider text-emerald-500">
                Live
              </span>
            </div>
            {aiPanelOpen ? (
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            ) : (
              <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" />
            )}
          </button>

          {aiPanelOpen && (
            <div className="min-h-0 flex-1 overflow-hidden">
              <InboxAiAssistant conversationKey={conversationId ?? null} />
            </div>
          )}
        </div>
      </div>
    );
  }

  const displayName = contact.name || contact.phone;
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <div className="flex h-full w-72 flex-col border-l border-border bg-card">
      {/* ──────────────────────────────────────────────
          TOP: Contact info — fixed height, scrollable
          ────────────────────────────────────────────── */}
      <div className="flex-none overflow-y-auto" style={{ maxHeight: "52%" }}>
        <ScrollArea className="flex-1">
          <div className="p-3">
            {/* Contact Info — compact horizontal row */}
            <div className="flex items-center gap-3 rounded-lg bg-muted/50 px-3 py-2.5">
              {/* Avatar */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold text-foreground">
                {contact.avatar_url ? (
                  <img
                    src={contact.avatar_url}
                    alt={displayName}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  initials
                )}
              </div>
              {/* Name + company + phone */}
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-semibold text-foreground">
                  {displayName}
                </h3>
                {contact.company && (
                  <p className="truncate text-xs text-muted-foreground">
                    {contact.company}
                  </p>
                )}
                <button
                  onClick={handleCopyPhone}
                  className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Phone className="h-3 w-3 shrink-0" />
                  <span className="truncate">{contact.phone}</span>
                  {copied ? (
                    <Check className="h-3 w-3 text-primary" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </button>
              </div>
            </div>

            {/* Email (if present) */}
            {contact.email && (
              <div className="mt-1.5 flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs text-muted-foreground">
                <Mail className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{contact.email}</span>
              </div>
            )}


            {/* Divider */}
            <div className="my-3 border-t border-border" />

            {/* Tags */}
            <div>
              <div className="flex items-center gap-2 px-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <TagIcon className="h-3 w-3" />
                {tSidebar("tags")}
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {tags.length === 0 ? (
                  <p className="px-1 text-xs text-muted-foreground">
                    {tSidebar("noTags")}
                  </p>
                ) : (
                  tags.map((tag) => (
                    <span
                      key={tag.contact_tag_id}
                      className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                      style={{
                        backgroundColor: `${tag.color}20`,
                        color: tag.color,
                      }}
                    >
                      {tag.name}
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* Divider */}
            <div className="my-3 border-t border-border" />

            {/* Active Deals */}
            <div>
              <div className="flex items-center gap-2 px-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <DollarSign className="h-3 w-3" />
                {tSidebar("deals")}
              </div>
              <div className="mt-2 space-y-2">
                {deals.length === 0 ? (
                  <p className="px-1 text-xs text-muted-foreground">
                    {tSidebar("noDeals")}
                  </p>
                ) : (
                  deals.map((deal) => (
                    <div
                      key={deal.id}
                      className="rounded-lg bg-muted px-3 py-2"
                    >
                      <p className="text-xs font-medium text-foreground">
                        {deal.title}
                      </p>
                      <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                          {deal.currency ?? "$"}
                          {deal.value.toLocaleString()}
                        </span>
                        {deal.stage && (
                          <span
                            className="rounded-full px-1.5 py-0.5 text-[10px]"
                            style={{
                              backgroundColor: `${deal.stage.color}20`,
                              color: deal.stage.color,
                            }}
                          >
                            {deal.stage.name}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Divider */}
            <div className="my-3 border-t border-border" />

            {/* Notes */}
            <div>
              <div className="flex items-center gap-2 px-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <StickyNote className="h-3 w-3" />
                {tSidebar("notes")}
              </div>
              <div className="mt-2">
                <div className="flex gap-2">
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder={tSidebar("addNotePlaceholder")}
                    rows={2}
                    className="flex-1 resize-none rounded-lg border border-border bg-muted px-3 py-2 text-xs text-foreground placeholder-muted-foreground outline-none focus:border-primary/50"
                  />
                  <Button
                    size="sm"
                    className="h-auto bg-primary px-2 hover:bg-primary/90"
                    onClick={handleAddNote}
                    disabled={!newNote.trim() || addingNote}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>

                <div className="mt-2 space-y-2">
                  {notes.map((note) => (
                    <div
                      key={note.id}
                      className="rounded-lg bg-muted px-3 py-2"
                    >
                      <p className="whitespace-pre-wrap text-xs text-muted-foreground">
                        {note.note_text}
                      </p>
                      <p className="mt-1 text-[10px] text-muted-foreground">
                        {format(new Date(note.created_at), "MMM d, yyyy HH:mm")}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* ──────────────────────────────────────────────
          BOTTOM: AI Assistant panel — takes all remaining space
          ────────────────────────────────────────────── */}
      <div
        className={cn(
          "flex min-h-0 flex-col border-t border-border transition-all duration-200",
          aiPanelOpen ? "flex-1" : "shrink-0",
        )}
      >
        {/* AI panel header — div row with two sibling buttons, never nested */}
        <div className="flex w-full shrink-0 items-center justify-between px-3 py-2">
          {/* Left: label — clicking this toggles the panel */}
          <button
            onClick={handleToggleAiPanel}
            className="flex flex-1 items-center gap-1.5 text-left"
          >
            <div className="flex h-5 w-5 items-center justify-center rounded-md bg-primary/10">
              <Sparkles className="h-3 w-3 text-primary" />
            </div>
            <span className="text-xs font-semibold text-foreground">
              AI Assistant
            </span>
            <span className="rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wider text-emerald-500">
              Live
            </span>
          </button>
          {/* Right: reset + chevron — siblings, NOT inside the toggle button */}
          <div className="flex items-center gap-0.5">
            <button
              onClick={handleAiReset}
              disabled={!canReset}
              title="Clear AI chat"
              className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
            >
              <RotateCcw className="h-3 w-3" />
            </button>
            <button
              onClick={handleToggleAiPanel}
              className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted"
            >
              {aiPanelOpen ? (
                <ChevronDown className="h-3.5 w-3.5" />
              ) : (
                <ChevronUp className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* AI chat — fills remaining space in this panel */}
        {aiPanelOpen && (
          <div className="min-h-0 flex-1 overflow-hidden">
            <InboxAiAssistant
              conversationKey={conversationId ?? null}
              resetRef={aiResetRef}
              onReset={setCanReset}
            />
          </div>
        )}
      </div>
    </div>
  );
}
