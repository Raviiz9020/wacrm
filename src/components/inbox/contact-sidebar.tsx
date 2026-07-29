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
  Pencil,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { useTranslations } from "next-intl";
import { InboxAiAssistant } from "@/components/inbox/inbox-ai-assistant";
import { CustomerAssetDrawer } from "@/modules/booking/ui/CustomerAssetDrawer";

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
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingNoteText, setEditingNoteText] = useState<string>("");
  const [updatingNote, setUpdatingNote] = useState<boolean>(false);

  const [infoOpen, setInfoOpen] = useState(true);
  const [notesOpen, setNotesOpen] = useState(false);

  /**
   * Whether the AI assistant panel is expanded.
   * Defaults to `false` (collapsed by default to give full space to contact details & assets)
   * and is restored from localStorage after mount to avoid hydration mismatches.
   */
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
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

  const handleDeleteNote = useCallback(async (noteId: string) => {
    if (!confirm("Are you sure you want to delete this internal note?")) return;
    const supabase = createClient();
    const { error } = await supabase.from("contact_notes").delete().eq("id", noteId);
    if (!error) {
      setNotes((prev) => prev.filter((n) => n.id !== noteId));
    } else {
      console.error("Failed to delete note:", error);
      alert("Failed to delete note.");
    }
  }, []);

  const handleUpdateNote = useCallback(async (noteId: string) => {
    if (!editingNoteText.trim()) return;
    setUpdatingNote(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("contact_notes")
      .update({ note_text: editingNoteText.trim() })
      .eq("id", noteId);

    if (!error) {
      setNotes((prev) =>
        prev.map((n) => (n.id === noteId ? { ...n, note_text: editingNoteText.trim() } : n))
      );
      setEditingNoteId(null);
      setEditingNoteText("");
    } else {
      console.error("Failed to update note:", error);
      alert("Failed to update note.");
    }
    setUpdatingNote(false);
  }, [editingNoteText]);

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
            "flex flex-col border-t border-border transition-all duration-200",
            aiPanelOpen ? "h-1/2 min-h-0" : "shrink-0",
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

  const displayName = contact.name || contact.phone || "Unknown";
  const initials = (displayName || "?").charAt(0).toUpperCase();

  return (
    <div className="flex h-full w-72 flex-col border-l border-border bg-card text-xs">
      {/* ──────────────────────────────────────────────
          TOP: Contact info, Notes & Customer Assets — scrollable area
          ────────────────────────────────────────────── */}
      <div className="min-h-0 flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-3 space-y-3">
            {/* 1. Contact Details Accordion */}
            <div className="rounded-lg border border-border bg-card overflow-hidden">
              <button
                onClick={() => setInfoOpen(!infoOpen)}
                className="flex w-full items-center justify-between bg-muted/40 px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted/70 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                    {initials}
                  </div>
                  <span className="truncate max-w-[140px] font-semibold">{displayName}</span>
                </div>
                {infoOpen ? (
                  <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                )}
              </button>

              {infoOpen && (
                <div className="p-3 space-y-3 border-t border-border/60">
                  {/* Contact Info — compact horizontal row */}
                  <div className="flex items-center gap-3 rounded-lg bg-muted/30 p-2">
                    <div className="min-w-0 flex-1">
                      {contact.company && (
                        <p className="truncate text-xs font-medium text-foreground">
                          {contact.company}
                        </p>
                      )}
                      <button
                        onClick={handleCopyPhone}
                        className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground mt-0.5"
                      >
                        <Phone className="h-3 w-3 shrink-0 text-primary" />
                        <span className="truncate font-mono">{contact.phone}</span>
                        {copied ? (
                          <Check className="h-3 w-3 text-primary" />
                        ) : (
                          <Copy className="h-3 w-3 opacity-60 hover:opacity-100" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Email (if present) */}
                  {contact.email && (
                    <div className="flex items-center gap-2 rounded-lg bg-muted/30 px-2.5 py-1.5 text-xs text-muted-foreground">
                      <Mail className="h-3.5 w-3.5 shrink-0 text-primary" />
                      <span className="truncate">{contact.email}</span>
                    </div>
                  )}

                  {/* Tags */}
                  <div>
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                      <TagIcon className="h-3 w-3" />
                      <span>{tSidebar("tags")}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {tags.length === 0 ? (
                        <p className="text-[11px] text-muted-foreground italic">
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

                  {/* Active Deals */}
                  <div>
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                      <DollarSign className="h-3 w-3" />
                      <span>{tSidebar("deals")}</span>
                    </div>
                    <div className="space-y-1.5">
                      {deals.length === 0 ? (
                        <p className="text-[11px] text-muted-foreground italic">
                          {tSidebar("noDeals")}
                        </p>
                      ) : (
                        deals.map((deal) => (
                          <div
                            key={deal.id}
                            className="rounded-lg bg-muted/50 px-2.5 py-1.5 border border-border/60"
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
                </div>
              )}
            </div>

            {/* 2. Internal Notes Accordion */}
            <div className="rounded-lg border border-border bg-card overflow-hidden">
              <button
                onClick={() => setNotesOpen(!notesOpen)}
                className="flex w-full items-center justify-between bg-muted/40 px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted/70 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <StickyNote className="h-3.5 w-3.5 text-primary" />
                  <span>Internal Notes ({notes.length})</span>
                </div>
                {notesOpen ? (
                  <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                )}
              </button>

              {notesOpen && (
                <div className="p-3 space-y-2 border-t border-border/60">
                  <div className="flex gap-2">
                    <textarea
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder={tSidebar("addNotePlaceholder")}
                      rows={2}
                      className="flex-1 resize-none rounded-lg border border-border bg-muted/40 px-2.5 py-1.5 text-xs text-foreground placeholder-muted-foreground outline-none focus:border-primary"
                    />
                    <Button
                      size="sm"
                      className="h-auto bg-primary px-2 hover:bg-primary/90 shrink-0"
                      onClick={handleAddNote}
                      disabled={!newNote.trim() || addingNote}
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </Button>
                  </div>

                  <div className="space-y-1.5 mt-2">
                    {notes.length === 0 ? (
                      <p className="text-[11px] text-muted-foreground italic">No internal notes added yet.</p>
                    ) : (
                      notes.map((note) => (
                        <div
                          key={note.id}
                          className="rounded-lg bg-muted/40 p-2 border border-border/60 text-xs space-y-1"
                        >
                          <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                            <span>
                              {(() => {
                                try {
                                  return note.created_at ? format(new Date(note.created_at), "MMM d, yyyy HH:mm") : "";
                                } catch {
                                  return "";
                                }
                              })()}
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingNoteId(note.id);
                                  setEditingNoteText(note.note_text);
                                }}
                                title="Edit Note"
                                className="p-0.5 text-muted-foreground hover:text-primary transition-colors"
                              >
                                <Pencil className="h-3 w-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteNote(note.id)}
                                title="Delete Note"
                                className="p-0.5 text-muted-foreground hover:text-red-500 transition-colors"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </div>

                          {editingNoteId === note.id ? (
                            <div className="space-y-1.5 pt-1">
                              <textarea
                                rows={2}
                                value={editingNoteText}
                                onChange={(e) => setEditingNoteText(e.target.value)}
                                className="w-full rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                              />
                              <div className="flex justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingNoteId(null);
                                    setEditingNoteText("");
                                  }}
                                  className="px-2 py-0.5 rounded text-[10px] bg-muted hover:bg-muted/80 text-muted-foreground font-medium"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateNote(note.id)}
                                  disabled={updatingNote}
                                  className="px-2 py-0.5 rounded text-[10px] bg-primary text-primary-foreground font-medium hover:bg-primary/90"
                                >
                                  {updatingNote ? "Saving..." : "Save"}
                                </button>
                              </div>
                            </div>
                          ) : (
                            <p className="whitespace-pre-wrap text-xs text-foreground leading-normal font-normal">
                              {note.note_text}
                            </p>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 3. Customer Assets (Vehicles / Patient Records / Properties) */}
            {accountId && contact && (
              <CustomerAssetDrawer contactId={contact.id} accountId={accountId} />
            )}
          </div>
        </ScrollArea>
      </div>

      {/* ──────────────────────────────────────────────
          BOTTOM: AI Assistant panel — takes all remaining space
          ────────────────────────────────────────────── */}
      <div
        className={cn(
          "flex flex-col border-t border-border transition-all duration-200",
          aiPanelOpen ? "h-1/2 min-h-0" : "shrink-0",
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
