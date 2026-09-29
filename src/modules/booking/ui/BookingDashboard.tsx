"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar, Plus, Clock, User, Users, Trash2, CalendarX2, CheckCircle2,
  AlertCircle, Edit2, Search, SlidersHorizontal, MessageSquare,
  CalendarDays, List, XCircle, Loader2, ClipboardList, RotateCcw,
  ArrowUpRight, X, Phone, CalendarClock, Check, Copy, FileText
} from "lucide-react";
import { useBooking, type Provider, type Service, type Appointment } from "../hooks/useBooking"; // corrected hook path
import { MatrixPricingModal } from "./MatrixPricingModal";
import { PortfolioMediaManager } from "./PortfolioMediaManager";
import { CustomerAssetDrawer } from "./CustomerAssetDrawer";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import type { TimeSlot } from "../services/slotGenerator";
import { getMatrixRulesForService } from "../services/matrixPricingService";
import { getAssetsForContact, recordAssetServiceHistory } from "../services/customerAssetService";
import type { BookingServicePriceMatrix } from "@/types";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

function parseProviderName(rawName: string) {
  const match = rawName.match(/^(.*?)\s*\((.*?)\)$/);
  if (match) {
    return {
      mainName: match[1].trim(),
      role: match[2].trim(),
    };
  }
  return {
    mainName: rawName,
    role: null,
  };
}

export function BookingDashboard() {
  const { account } = useAuth();
  const {
    providers,
    services,
    appointments,
    loading,
    error,
    addProvider,
    addService,
    mapProviderService,
    updateProviderServices,
    saveWeeklySchedule,
    saveScheduleOverride,
    getSlots,
    bookAppointment,
    cancel,
    reschedule,
    updateStatus,
    updateNotes,
    deleteAppointment,
    deleteProvider,
    updateProvider,
    deleteService,
    updateService,
  } = useBooking();

  const supabase = createClient();

  // Local state
  const [activeTab, setActiveTab] = useState("appointments");
  const [contacts, setContacts] = useState<{ id: string; name: string; phone: string }[]>([]);
  const [selectedAssetContact, setSelectedAssetContact] = useState<{ id: string; name: string } | null>(null);

  // Confirmation Dialog State
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    description: React.ReactNode;
    confirmText?: string;
    variant?: "default" | "destructive";
    onConfirm: () => void | Promise<void>;
  }>({
    isOpen: false,
    title: "",
    description: "",
    onConfirm: () => {},
  });

  const triggerConfirm = (config: {
    title: string;
    description: React.ReactNode;
    confirmText?: string;
    variant?: "default" | "destructive";
    onConfirm: () => void | Promise<void>;
  }) => {
    setConfirmDialog({
      isOpen: true,
      ...config,
    });
  };

  // Edit States
  const [editingProvider, setEditingProvider] = useState<Provider | null>(null);
  const [editProvServices, setEditProvServices] = useState<string[]>([]);
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Edit form inputs
  const [editProvName, setEditProvName] = useState("");
  const [editProvDesc, setEditProvDesc] = useState("");
  const [editProvActive, setEditProvActive] = useState(true);

  const [editServName, setEditServName] = useState("");
  const [editServDuration, setEditServDuration] = useState(30);
  const [editServPrice, setEditServPrice] = useState("");
  const [editServDesc, setEditServDesc] = useState("");
  const [editServActive, setEditServActive] = useState(true);

  // Dialog Open States
  const [isBookOpen, setIsBookOpen] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [isProviderOpen, setIsProviderOpen] = useState(false);
  const [isServiceOpen, setIsServiceOpen] = useState(false);

  // New Resource Form States
  const [newProvName, setNewProvName] = useState("");
  const [newProvDesc, setNewProvDesc] = useState("");

  // New Service Form States
  const [newServName, setNewServName] = useState("");
  const [newServDuration, setNewServDuration] = useState(30);
  const [newServPrice, setNewServPrice] = useState("");
  const [newServDesc, setNewServDesc] = useState("");

  // New Booking Form States
  const [bookContactId, setBookContactId] = useState("");
  const [bookProviderId, setBookProviderId] = useState("");
  const [bookServiceId, setBookServiceId] = useState("");
  const [bookDate, setBookDate] = useState("");
  const [bookSlot, setBookSlot] = useState("");
  const [bookNotes, setBookNotes] = useState("");
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [bookMatrixRules, setBookMatrixRules] = useState<BookingServicePriceMatrix[]>([]);
  const [selectedMatrixRuleId, setSelectedMatrixRuleId] = useState<string>("");
  const [contactSearch, setContactSearch] = useState("");

  useEffect(() => {
    if (!bookServiceId || !account?.id) {
      setBookMatrixRules([]);
      setSelectedMatrixRuleId("");
      return;
    }
    getMatrixRulesForService(account.id, bookServiceId)
      .then((rules) => {
        setBookMatrixRules(rules || []);
        setSelectedMatrixRuleId("");
      })
      .catch((err) => {
        console.error("Failed to load service matrix rules:", err);
        setBookMatrixRules([]);
        setSelectedMatrixRuleId("");
      });
  }, [bookServiceId, account?.id]);

  // Reschedule Dialog States
  const [rescheduleAppt, setRescheduleAppt] = useState<Appointment | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleSlot, setRescheduleSlot] = useState("");
  const [rescheduleSlots, setRescheduleSlots] = useState<TimeSlot[]>([]);
  const [rescheduleSlotsLoading, setRescheduleSlotsLoading] = useState(false);
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [sendRescheduleWhatsApp, setSendRescheduleWhatsApp] = useState(true);

  // Appointment Details Sheet States
  const [detailAppt, setDetailAppt] = useState<Appointment | null>(null);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [editNotesValue, setEditNotesValue] = useState("");
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  // New Booking WhatsApp Option State
  const [sendBookingWhatsApp, setSendBookingWhatsApp] = useState(true);

  // Auto-fetch slots when provider, service, and date are selected for reschedule
  useEffect(() => {
    if (rescheduleAppt && rescheduleDate) {
      setRescheduleSlotsLoading(true);
      getSlots(
        rescheduleAppt.provider.id,
        rescheduleAppt.service.id,
        rescheduleDate,
        rescheduleAppt.service.duration_minutes
      )
        .then((slots) => setRescheduleSlots(slots))
        .catch(() => setRescheduleSlots([]))
        .finally(() => setRescheduleSlotsLoading(false));
    } else {
      setRescheduleSlots([]);
    }
  }, [rescheduleAppt, rescheduleDate]);

  // Scheduler Configuration States
  const [schedProviderId, setSchedProviderId] = useState("");
  const [weeklySchedules, setWeeklySchedules] = useState<{ [day: number]: { active: boolean; shifts: { start: string; end: string }[] } }>({
    1: { active: true, shifts: [{ start: "09:00", end: "17:00" }] },
    2: { active: true, shifts: [{ start: "09:00", end: "17:00" }] },
    3: { active: true, shifts: [{ start: "09:00", end: "17:00" }] },
    4: { active: true, shifts: [{ start: "09:00", end: "17:00" }] },
    5: { active: true, shifts: [{ start: "09:00", end: "17:00" }] },
    0: { active: false, shifts: [{ start: "09:00", end: "17:00" }] },
    6: { active: false, shifts: [{ start: "09:00", end: "17:00" }] },
  });
  const [overrideDate, setOverrideDate] = useState("");
  const [overrideList, setOverrideList] = useState<any[]>([]);
  const [overrideAvailable, setOverrideAvailable] = useState(false);
  const [overrideStart, setOverrideStart] = useState("09:00");
  const [overrideEnd, setOverrideEnd] = useState("17:00");

  // Fetch CRM contacts for manual appointment picker
  useEffect(() => {
    async function fetchContacts() {
      const { data } = await supabase
        .from("contacts")
        .select("id, name, phone")
        .order("name", { ascending: true })
        .limit(200);
      if (data) setContacts(data);
    }
    fetchContacts();
  }, []);

  // Local filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [filterProviderId, setFilterProviderId] = useState("all");
  const [filterDateRange, setFilterDateRange] = useState("all");
  const [filterStatus, setFilterStatus] = useState("confirmed"); // default to confirmed
  const [viewMode, setViewMode] = useState<"agenda" | "timeline" | "table">("agenda");
  const [selectedTimelineDate, setSelectedTimelineDate] = useState(() => {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, "0");
    const d = String(today.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  });

  const formatDateHeader = (isoStr: string) => {
    const d = new Date(isoStr);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    const isSameDay = (d1: Date, d2: Date) =>
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear();

    if (isSameDay(d, today)) return "Today";
    if (isSameDay(d, tomorrow)) return "Tomorrow";

    return d.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", year: "numeric" });
  };

  const formatTimeStr = (isoStr: string) => {
    const d = new Date(isoStr);
    return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  };

  const filteredAppointments = appointments.filter(appt => {
    // 1. Search term
    const term = searchTerm.trim().toLowerCase();
    if (term) {
      const contactName = (appt.contact?.name || "").toLowerCase();
      const contactPhone = (appt.contact?.phone || "").toLowerCase();
      const providerName = (appt.provider?.name || "").toLowerCase();
      const serviceName = (appt.service?.name || "").toLowerCase();
      if (!contactName.includes(term) && !contactPhone.includes(term) && !providerName.includes(term) && !serviceName.includes(term)) {
        return false;
      }
    }

    // 2. Provider filter
    if (filterProviderId !== "all" && appt.provider?.id !== filterProviderId) {
      return false;
    }

    // 3. Status filter
    if (filterStatus !== "all" && appt.status !== filterStatus) {
      return false;
    }

    // 4. Date Range filter
    if (filterDateRange !== "all") {
      const apptDate = new Date(appt.start_time);
      const today = new Date();

      const startOfDay = (d: Date) => {
        const copy = new Date(d);
        copy.setHours(0, 0, 0, 0);
        return copy;
      };

      const endOfDay = (d: Date) => {
        const copy = new Date(d);
        copy.setHours(23, 59, 59, 999);
        return copy;
      };

      const todayStart = startOfDay(today);
      const todayEnd = endOfDay(today);

      if (filterDateRange === "today") {
        if (apptDate < todayStart || apptDate > todayEnd) return false;
      } else if (filterDateRange === "tomorrow") {
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        if (apptDate < startOfDay(tomorrow) || apptDate > endOfDay(tomorrow)) return false;
      } else if (filterDateRange === "week") {
        const weekEnd = new Date(today);
        weekEnd.setDate(today.getDate() + 7);
        if (apptDate < todayStart || apptDate > endOfDay(weekEnd)) return false;
      }
    }

    return true;
  });

  const hasActiveFilters = Boolean(
    searchTerm.trim() ||
    filterProviderId !== "all" ||
    filterDateRange !== "all" ||
    filterStatus !== "confirmed"
  );

  const resetFilters = () => {
    setSearchTerm("");
    setFilterProviderId("all");
    setFilterDateRange("all");
    setFilterStatus("confirmed");
  };

  // Sort appointments by start_time ascending
  const sortedAppts = [...filteredAppointments].sort((a, b) =>
    new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
  );

  // Group by Date for Agenda View
  const groupedAppts: { [dateStr: string]: Appointment[] } = {};
  sortedAppts.forEach(appt => {
    const dateObj = new Date(appt.start_time);
    const dateStr = dateObj.getFullYear() + "-" + String(dateObj.getMonth() + 1).padStart(2, "0") + "-" + String(dateObj.getDate()).padStart(2, "0");
    if (!groupedAppts[dateStr]) {
      groupedAppts[dateStr] = [];
    }
    groupedAppts[dateStr].push(appt);
  });

  // Client-side stats and loads calculations for operational dashboard
  const today = new Date();
  const tStart = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
  const tEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);

  const todayAppts = appointments.filter(appt => {
    const d = new Date(appt.start_time);
    return d >= tStart && d <= tEnd;
  });

  const confirmedToday = todayAppts.filter(appt => appt.status === "confirmed");
  const cancelledToday = todayAppts.filter(appt => appt.status === "cancelled");
  const passedToday = todayAppts.filter(appt => {
    return appt.status === "confirmed" && new Date(appt.end_time).getTime() < Date.now();
  });
  const remainingTodayCount = confirmedToday.length - passedToday.length;

  const totalActiveProviders = providers.filter(p => p.is_active).length;

  const providerLoads = providers
    .filter(p => p.is_active)
    .map(p => {
      const count = confirmedToday.filter(appt => appt.provider?.id === p.id).length;
      return { provider: p, count };
    })
    .sort((a, b) => b.count - a.count);

  const upcomingFutureBookings = appointments
    .filter(appt => appt.status === "confirmed" && new Date(appt.start_time).getTime() > Date.now())
    .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
    .slice(0, 5);

  // Peak demand hours calculation
  const hourCounts: { [hour: number]: number } = {};
  appointments
    .filter(a => a.status === 'confirmed')
    .forEach(a => {
      const date = new Date(a.start_time);
      const hour = date.getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });

  const peakHours = Object.keys(hourCounts)
    .map(h => {
      const hour = parseInt(h);
      const label = hour >= 12 ? `${hour === 12 ? 12 : hour - 12}:00 PM` : `${hour}:00 AM`;
      return { label, count: hourCounts[hour] };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);
  const getSimulatedStatusBadge = (appt: Appointment) => {
    if (appt.status === "cancelled") {
      return (
        <Badge variant="outline" className="bg-rose-500/10 text-rose-500 border-rose-500/20 text-[10px] font-semibold flex items-center gap-1 shrink-0">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
          cancelled
        </Badge>
      );
    }

    const now = Date.now();
    const start = new Date(appt.start_time).getTime();
    const end = new Date(appt.end_time).getTime();

    if (end < now) {
      return (
        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[10px] font-semibold flex items-center gap-1 shrink-0">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          completed
        </Badge>
      );
    }

    if (start <= now && end >= now) {
      return (
        <Badge variant="default" className="bg-emerald-600 text-white border-none flex items-center gap-1 text-[10px] font-semibold shrink-0">
          <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping" />
          in session
        </Badge>
      );
    }

    if (start - now > 0 && start - now <= 30 * 60 * 1000) {
      return (
        <Badge variant="outline" className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 flex items-center gap-1 text-[10px] font-semibold shrink-0">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
          arriving soon
        </Badge>
      );
    }

    return (
      <Badge variant="outline" className="bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20 text-[10px] font-semibold flex items-center gap-1 shrink-0">
        <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
        confirmed
      </Badge>
    );
  };
  // Fetch slots dynamically when booking details change
  useEffect(() => {
    async function updateSlots() {
      if (!bookProviderId || !bookServiceId || !bookDate) {
        setAvailableSlots([]);
        return;
      }
      setSlotsLoading(true);
      try {
        const slots = await getSlots(bookProviderId, bookServiceId, bookDate);
        setAvailableSlots(slots);
      } catch (err) {
        console.error("Error fetching slots:", err);
      } finally {
        setSlotsLoading(false);
      }
    }
    updateSlots();
  }, [bookProviderId, bookServiceId, bookDate]);

  // Load scheduler configurations when active provider changes
  useEffect(() => {
    async function loadProviderSchedule() {
      if (!schedProviderId) return;

      // Load weekly schedule
      const { data: weekly } = await supabase
        .from("booking_schedules")
        .select("day_of_week, start_time, end_time")
        .eq("provider_id", schedProviderId)
        .order("start_time", { ascending: true });

      const newWeekly: { [day: number]: { active: boolean; shifts: { start: string; end: string }[] } } = {};
      // Reset all days to closed first
      for (let i = 0; i <= 6; i++) {
        newWeekly[i] = { active: false, shifts: [] };
      }

      // Populate active days and shifts
      if (weekly && weekly.length > 0) {
        weekly.forEach(w => {
          newWeekly[w.day_of_week].active = true;
          newWeekly[w.day_of_week].shifts.push({
            start: w.start_time.slice(0, 5),
            end: w.end_time.slice(0, 5),
          });
        });
      }
      // Ensure all days have at least one shift to edit
      for (let i = 0; i <= 6; i++) {
        if (newWeekly[i].shifts.length === 0) {
          newWeekly[i].shifts.push({ start: "09:00", end: "17:00" });
        }
      }
      setWeeklySchedules(newWeekly);

      // Load overrides
      const { data: overrides } = await supabase
        .from("booking_schedule_overrides")
        .select("*")
        .eq("provider_id", schedProviderId)
        .order("override_date", { ascending: true });
      setOverrideList(overrides || []);
    }
    loadProviderSchedule();
  }, [schedProviderId]);

  // Form submission handlers
  const handleAddProvider = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProvName) return;
    try {
      await addProvider(newProvName, newProvDesc);
      setNewProvName("");
      setNewProvDesc("");
      setIsProviderOpen(false);
    } catch (err) {
      alert("Failed to onboard resource provider.");
    }
  };

  const handleEditProvider = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProvider || !editProvName) return;
    try {
      await updateProvider(editingProvider.id, editProvName, editProvDesc, editProvActive);
      await updateProviderServices(editingProvider.id, editProvServices);
      setEditingProvider(null);
    } catch (err) {
      alert("Failed to update resource provider.");
    }
  };

  const handleDeleteProvider = (id: string) => {
    triggerConfirm({
      title: "Delete Provider",
      description: "Are you sure you want to delete this provider? All their weekly schedules and overrides will be lost.",
      confirmText: "Delete",
      variant: "destructive",
      onConfirm: async () => {
        try {
          await deleteProvider(id);
        } catch (err) {
          alert("Failed to delete provider.");
        }
      },
    });
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServName || !newServDuration) return;
    try {
      const price = newServPrice ? parseFloat(newServPrice) : undefined;
      await addService(newServName, newServDuration, price, newServDesc);
      setNewServName("");
      setNewServDuration(30);
      setNewServPrice("");
      setNewServDesc("");
      setIsServiceOpen(false);
    } catch (err) {
      alert("Failed to create service.");
    }
  };

  const handleEditService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService || !editServName || !editServDuration) return;
    try {
      const price = editServPrice ? parseFloat(editServPrice) : undefined;
      await updateService(editingService.id, editServName, editServDuration, price, editServDesc, editServActive);
      setEditingService(null);
    } catch (err) {
      alert("Failed to update service.");
    }
  };

  const handleDeleteService = (id: string) => {
    triggerConfirm({
      title: "Delete Service",
      description: "Are you sure you want to delete this service?",
      confirmText: "Delete",
      variant: "destructive",
      onConfirm: async () => {
        try {
          const res = await deleteService(id);
          if (res?.deactivated) {
            alert("This service is linked to existing customer asset/maintenance history and cannot be deleted. It has been marked as Inactive instead.");
          }
        } catch (err: any) {
          alert(err?.message ? `Failed to delete service: ${err.message}` : "Failed to delete service.");
        }
      },
    });
  };

  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookProviderId || !bookServiceId || !bookContactId || !bookDate || !bookSlot) return;
    setIsBooking(true);
    try {
      let finalNotes = bookNotes;
      const selectedRule = bookMatrixRules.find((r) => r.id === selectedMatrixRuleId);
      if (selectedRule) {
        const variantTag = `[Variant: ${selectedRule.attribute_value}]`;
        finalNotes = finalNotes ? `${variantTag} ${finalNotes}` : variantTag;
      }

      await bookAppointment(bookProviderId, bookServiceId, bookContactId, bookDate, bookSlot, finalNotes);

      // WhatsApp confirmation trigger/link
      if (sendBookingWhatsApp) {
        const contact = contacts.find((c) => c.id === bookContactId);
        const service = services.find((s) => s.id === bookServiceId);
        const provider = providers.find((p) => p.id === bookProviderId);
        if (contact?.phone) {
          const cleanPhone = contact.phone.replace(/[^0-9]/g, "");
          const formattedDate = new Date(`${bookDate}T00:00:00`).toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          });
          const timeFormatted = getFriendlyTime12Hour(bookSlot);
          const msg = encodeURIComponent(
            `Hi ${contact.name}, your appointment for ${service?.name || "Service"} with ${provider?.name || "our team"} on ${formattedDate} at ${timeFormatted} is confirmed! We look forward to seeing you.`
          );
          window.open(`https://wa.me/${cleanPhone}?text=${msg}`, "_blank");
        }
      }

      setBookProviderId("");
      setBookServiceId("");
      setBookContactId("");
      setBookDate("");
      setBookSlot("");
      setBookNotes("");
      setSelectedMatrixRuleId("");
      setContactSearch("");
      setIsBookOpen(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Booking conflict occurred.");
    } finally {
      setIsBooking(false);
    }
  };

  const handleOpenReschedule = (appt: Appointment) => {
    setRescheduleAppt(appt);
    const apptDate = new Date(appt.start_time);
    const y = apptDate.getFullYear();
    const m = String(apptDate.getMonth() + 1).padStart(2, "0");
    const d = String(apptDate.getDate()).padStart(2, "0");
    setRescheduleDate(`${y}-${m}-${d}`);
    setRescheduleSlot("");
  };

  const handleConfirmReschedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduleAppt || !rescheduleDate || !rescheduleSlot) return;
    setIsRescheduling(true);
    try {
      await reschedule(rescheduleAppt.id, rescheduleDate, rescheduleSlot);

      if (sendRescheduleWhatsApp && rescheduleAppt.contact?.phone && !rescheduleAppt.conversation_id) {
        const cleanPhone = rescheduleAppt.contact.phone.replace(/[^0-9]/g, "");
        const formattedDate = new Date(`${rescheduleDate}T00:00:00`).toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        });
        const msg = encodeURIComponent(
          `Hi ${rescheduleAppt.contact.name}, your appointment for ${rescheduleAppt.service.name} has been rescheduled to ${formattedDate} at ${getFriendlyTime12Hour(rescheduleSlot)}.`
        );
        window.open(`https://wa.me/${cleanPhone}?text=${msg}`, "_blank");
      }

      setRescheduleAppt(null);
      setRescheduleDate("");
      setRescheduleSlot("");
      if (detailAppt?.id === rescheduleAppt.id) {
        setDetailAppt(null);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to reschedule appointment.");
    } finally {
      setIsRescheduling(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!detailAppt) return;
    setIsSavingNotes(true);
    try {
      await updateNotes(detailAppt.id, editNotesValue);
      setDetailAppt((prev) => (prev ? { ...prev, notes: editNotesValue } : null));
      setIsEditingNotes(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update notes.");
    } finally {
      setIsSavingNotes(false);
    }
  };

  const handleStatusChange = async (newStatus: "confirmed" | "cancelled" | "noshow") => {
    if (!detailAppt) return;
    try {
      await updateStatus(detailAppt.id, newStatus);
      setDetailAppt((prev) => (prev ? { ...prev, status: newStatus } : null));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update status.");
    }
  };

  const handleSaveSchedules = async () => {
    if (!schedProviderId) return;
    try {
      const schedulesPayload: { day_of_week: number; start_time: string; end_time: string }[] = [];
      Object.keys(weeklySchedules).forEach(dayKey => {
        const day = Number(dayKey);
        const sched = weeklySchedules[day];
        if (sched.active) {
          sched.shifts.forEach(shift => {
            if (shift.start && shift.end) {
              schedulesPayload.push({
                day_of_week: day,
                start_time: `${shift.start}:00`,
                end_time: `${shift.end}:00`,
              });
            }
          });
        }
      });
      await saveWeeklySchedule(schedProviderId, schedulesPayload);
      alert("Weekly schedule saved successfully!");
    } catch (err) {
      alert("Failed to save schedule settings.");
    }
  };

  const handleSaveOverride = async () => {
    if (!schedProviderId || !overrideDate) return;
    try {
      await saveScheduleOverride(
        schedProviderId,
        overrideDate,
        overrideAvailable,
        overrideAvailable ? `${overrideStart}:00` : undefined,
        overrideAvailable ? `${overrideEnd}:00` : undefined
      );
      alert("Schedule override date saved!");
      setOverrideDate("");

      // Refetch overrides
      const { data: overrides } = await supabase
        .from("booking_schedule_overrides")
        .select("*")
        .eq("provider_id", schedProviderId)
        .order("override_date", { ascending: true });
      setOverrideList(overrides || []);
    } catch (err) {
      alert("Failed to save schedule override.");
    }
  };

  const handleDeleteOverride = (overrideId: string) => {
    triggerConfirm({
      title: "Remove Override",
      description: "Are you sure you want to remove this schedule override?",
      confirmText: "Remove",
      variant: "destructive",
      onConfirm: async () => {
        try {
          const { error } = await supabase
            .from("booking_schedule_overrides")
            .delete()
            .eq("id", overrideId);
          if (error) throw error;

          // Refetch overrides
          const { data: overrides } = await supabase
            .from("booking_schedule_overrides")
            .select("*")
            .eq("provider_id", schedProviderId)
            .order("override_date", { ascending: true });
          setOverrideList(overrides || []);
        } catch (err) {
          alert("Failed to delete schedule override.");
        }
      },
    });
  };

  const formatDateTime = (isoStr: string) => {
    const d = new Date(isoStr);
    const dateStr = d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
    const timeStr = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    return `${dateStr} at ${timeStr}`;
  };

  const getFriendlyTime12Hour = (time24: string) => {
    if (!time24) return "";
    const [hStr, mStr] = time24.split(":");
    const h = Number(hStr);
    const m = Number(mStr);
    if (isNaN(h) || isNaN(m)) return "";
    const ampm = h >= 12 ? "PM" : "AM";
    const displayHour = h % 12 === 0 ? 12 : h % 12;
    return `${displayHour}:${String(m).padStart(2, "0")} ${ampm}`;
  };

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Booking & Availability</h2>
          <p className="text-sm text-muted-foreground">
            Onboard resources, set business hours, manage availability, and schedule customer appointments.
          </p>
        </div>

        {/* Book Appointment Action */}
        <Dialog open={isBookOpen} onOpenChange={setIsBookOpen}>
          <DialogTrigger render={<Button className="w-full sm:w-auto gap-2 bg-primary hover:bg-primary/90 text-primary-foreground" />}>
            <Plus className="h-4 w-4" /> Book Appointment
          </DialogTrigger>
          <DialogContent className="sm:max-w-[520px] border-border bg-card max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleBookAppointment}>
              <DialogHeader>
                <DialogTitle>Schedule Appointment</DialogTitle>
                <DialogDescription>
                  Manually book an appointment slot for a CRM contact.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {/* 1. Contact Selector */}
                <div className="grid gap-1.5">
                  <Label className="text-xs font-semibold">Select Contact *</Label>
                  {bookContactId ? (
                    <div className="flex items-center justify-between p-2.5 rounded-lg border border-primary/30 bg-primary/5">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="h-8 w-8 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0 border border-primary/20">
                          {(contacts.find(c => c.id === bookContactId)?.name || "C").slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-xs text-foreground truncate">
                            {contacts.find(c => c.id === bookContactId)?.name}
                          </p>
                          <p className="text-[11px] text-muted-foreground font-mono">
                            {contacts.find(c => c.id === bookContactId)?.phone || "No phone"}
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs text-muted-foreground hover:text-foreground"
                        onClick={() => {
                          setBookContactId("");
                          setContactSearch("");
                        }}
                      >
                        Change
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                        <Input
                          placeholder="Search contact by name or phone..."
                          value={contactSearch}
                          onChange={e => setContactSearch(e.target.value)}
                          className="pl-8 h-8 text-xs border-border bg-background"
                        />
                      </div>
                      <div className="max-h-[140px] overflow-y-auto border border-border rounded-lg divide-y divide-border/60 bg-muted/10">
                        {contacts
                          .filter(c => {
                            const q = contactSearch.toLowerCase();
                            return !q || c.name?.toLowerCase().includes(q) || c.phone?.toLowerCase().includes(q);
                          })
                          .slice(0, 8)
                          .map(c => (
                            <button
                              key={c.id}
                              type="button"
                              onClick={() => {
                                setBookContactId(c.id);
                                setContactSearch("");
                              }}
                              className="w-full px-3 py-2 text-left hover:bg-primary/5 flex items-center justify-between text-xs transition-colors"
                            >
                              <div className="min-w-0">
                                <p className="font-semibold text-foreground truncate">{c.name}</p>
                                <p className="text-[10px] text-muted-foreground font-mono">{c.phone}</p>
                              </div>
                              <Plus className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                            </button>
                          ))}
                        {contacts.filter(c => {
                          const q = contactSearch.toLowerCase();
                          return !q || c.name?.toLowerCase().includes(q) || c.phone?.toLowerCase().includes(q);
                        }).length === 0 && (
                          <p className="text-xs text-muted-foreground text-center py-4">No contacts found</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Provider Selector */}
                <div className="grid gap-1.5">
                  <Label htmlFor="provider" className="text-xs font-semibold">Resource Provider *</Label>
                  <Select value={bookProviderId} onValueChange={val => setBookProviderId(val || "")} required>
                    <SelectTrigger className="border-border">
                      <span className="text-sm text-foreground">
                        {providers.find(p => p.id === bookProviderId)?.name || "Choose staff/bay..."}
                      </span>
                    </SelectTrigger>
                    <SelectContent className="border-border bg-card">
                      {providers.map(p => (
                        <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 3. Service Selector */}
                <div className="grid gap-1.5">
                  <Label htmlFor="service" className="text-xs font-semibold">Service *</Label>
                  <Select value={bookServiceId} onValueChange={val => setBookServiceId(val || "")} required>
                    <SelectTrigger className="border-border">
                      <span className="text-sm text-foreground">
                        {services.find(s => s.id === bookServiceId)
                          ? `${services.find(s => s.id === bookServiceId)?.name} (${services.find(s => s.id === bookServiceId)?.duration_minutes}m)`
                          : "Choose service..."}
                      </span>
                    </SelectTrigger>
                    <SelectContent className="border-border bg-card">
                      {(() => {
                        const selectedProvider = providers.find((p) => p.id === bookProviderId);
                        const providerServiceIds = selectedProvider?.services?.map((s) => s.service_id) || [];
                        const availableServices = bookProviderId && providerServiceIds.length > 0
                          ? services.filter((s) => providerServiceIds.includes(s.id))
                          : services;

                        return availableServices.map(s => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.name} ({s.duration_minutes}m) {s.price ? `— ₹${s.price}` : ''}
                          </SelectItem>
                        ));
                      })()}
                    </SelectContent>
                  </Select>
                </div>

                {/* Optional Matrix Pricing Variant */}
                {bookMatrixRules.length > 0 && (
                  <div className="grid gap-1.5 p-2.5 rounded-lg bg-primary/10 border border-primary/20">
                    <Label htmlFor="matrixVariant" className="text-xs font-semibold text-primary flex items-center gap-1.5">
                      <SlidersHorizontal className="h-3.5 w-3.5 shrink-0" />
                      Select Pricing Variant / Attribute (e.g. Gold Crown)
                    </Label>
                    <Select
                      value={selectedMatrixRuleId}
                      onValueChange={(val) => setSelectedMatrixRuleId(val || "")}
                    >
                      <SelectTrigger className="border-primary/30 bg-card text-xs">
                        <span className="text-xs font-medium text-foreground">
                          {selectedMatrixRuleId
                            ? `${bookMatrixRules.find((r) => r.id === selectedMatrixRuleId)?.attribute_value} — ₹${bookMatrixRules.find((r) => r.id === selectedMatrixRuleId)?.price}`
                            : "Choose variant (Gold Crown / Silver Crown)..."}
                        </span>
                      </SelectTrigger>
                      <SelectContent className="border-border bg-card">
                        {bookMatrixRules.map((rule) => (
                          <SelectItem key={rule.id} value={rule.id}>
                            {rule.attribute_value} — ₹{rule.price} {rule.duration_minutes ? `(${rule.duration_minutes}m)` : ''}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* 4. Date Picker */}
                <div className="grid gap-1.5">
                  <Label htmlFor="date" className="text-xs font-semibold">Date *</Label>
                  <Input
                    type="date"
                    id="date"
                    className="border-border cursor-pointer"
                    value={bookDate}
                    onChange={e => setBookDate(e.target.value)}
                    onClick={e => {
                      try {
                        e.currentTarget.showPicker?.();
                      } catch {}
                    }}
                    onFocus={e => {
                      try {
                        e.currentTarget.showPicker?.();
                      } catch {}
                    }}
                    required
                  />
                </div>

                {/* 5. Grouped Available Time Slots */}
                {bookProviderId && bookServiceId && bookDate && (
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-semibold">Select Time Slot *</Label>
                      {availableSlots.length > 0 && (
                        <span className="text-[11px] text-muted-foreground font-medium">
                          {availableSlots.length} available slots
                        </span>
                      )}
                    </div>
                    {slotsLoading ? (
                      <div className="p-4 rounded-lg border border-dashed border-border bg-muted/20 text-center">
                        <Loader2 className="h-4 w-4 animate-spin mx-auto text-primary mb-1.5" />
                        <p className="text-xs text-muted-foreground">Calculating available slots for this provider...</p>
                      </div>
                    ) : availableSlots.length === 0 ? (
                      <div className="p-3.5 rounded-lg border border-dashed border-rose-500/30 bg-rose-500/5 text-center text-xs text-rose-500 flex items-center justify-center gap-1.5">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <span>No slots available on this date for this provider.</span>
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-[200px] overflow-y-auto pr-1 border border-border/60 rounded-lg p-2.5 bg-muted/10">
                        {(() => {
                          const morning = availableSlots.filter(s => parseInt(s.start_time.split(':')[0], 10) < 12);
                          const afternoon = availableSlots.filter(s => {
                            const h = parseInt(s.start_time.split(':')[0], 10);
                            return h >= 12 && h < 17;
                          });
                          const evening = availableSlots.filter(s => parseInt(s.start_time.split(':')[0], 10) >= 17);

                          return (
                            <>
                              {morning.length > 0 && (
                                <div className="space-y-1.5">
                                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                                    🌅 Morning ({morning.length})
                                  </span>
                                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
                                    {morning.map(slot => {
                                      const isSelected = bookSlot === slot.start_time;
                                      return (
                                        <button
                                          key={slot.start_time}
                                          type="button"
                                          onClick={() => setBookSlot(slot.start_time)}
                                          className={cn(
                                            "px-2 py-1.5 rounded-md text-xs font-medium border text-center transition-all",
                                            isSelected
                                              ? "bg-primary text-primary-foreground border-primary shadow-xs"
                                              : "bg-card border-border hover:bg-muted text-foreground"
                                          )}
                                        >
                                          {slot.formatted_time}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}

                              {afternoon.length > 0 && (
                                <div className="space-y-1.5">
                                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                                    ☀️ Afternoon ({afternoon.length})
                                  </span>
                                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
                                    {afternoon.map(slot => {
                                      const isSelected = bookSlot === slot.start_time;
                                      return (
                                        <button
                                          key={slot.start_time}
                                          type="button"
                                          onClick={() => setBookSlot(slot.start_time)}
                                          className={cn(
                                            "px-2 py-1.5 rounded-md text-xs font-medium border text-center transition-all",
                                            isSelected
                                              ? "bg-primary text-primary-foreground border-primary shadow-xs"
                                              : "bg-card border-border hover:bg-muted text-foreground"
                                          )}
                                        >
                                          {slot.formatted_time}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}

                              {evening.length > 0 && (
                                <div className="space-y-1.5">
                                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                                    🌙 Evening ({evening.length})
                                  </span>
                                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
                                    {evening.map(slot => {
                                      const isSelected = bookSlot === slot.start_time;
                                      return (
                                        <button
                                          key={slot.start_time}
                                          type="button"
                                          onClick={() => setBookSlot(slot.start_time)}
                                          className={cn(
                                            "px-2 py-1.5 rounded-md text-xs font-medium border text-center transition-all",
                                            isSelected
                                              ? "bg-primary text-primary-foreground border-primary shadow-xs"
                                              : "bg-card border-border hover:bg-muted text-foreground"
                                          )}
                                        >
                                          {slot.formatted_time}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                            </>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                )}

                {/* Booking Summary & WhatsApp Toggle */}
                {bookContactId && bookProviderId && bookServiceId && bookDate && bookSlot && (
                  <div className="rounded-lg border border-primary/20 bg-primary/5 p-3.5 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-primary flex items-center gap-1.5">
                        <CheckCircle2 className="h-4 w-4 text-primary" /> Booking Summary
                      </span>
                      {(() => {
                        const rule = bookMatrixRules.find((r) => r.id === selectedMatrixRuleId);
                        const s = services.find((srv) => srv.id === bookServiceId);
                        const price = rule?.price || s?.price;
                        return price ? (
                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 font-bold text-xs">
                            ₹{price}
                          </Badge>
                        ) : null;
                      })()}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">Customer</span>
                        <span className="font-semibold text-foreground truncate block">
                          {contacts.find((c) => c.id === bookContactId)?.name}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {contacts.find((c) => c.id === bookContactId)?.phone || "No phone"}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">Service & Staff</span>
                        <span className="font-semibold text-foreground truncate block">
                          {services.find((s) => s.id === bookServiceId)?.name}
                        </span>
                        <span className="text-[10px] text-muted-foreground truncate block">
                          {providers.find((p) => p.id === bookProviderId)?.name} ({services.find((s) => s.id === bookServiceId)?.duration_minutes}m)
                        </span>
                      </div>
                      <div className="col-span-2 pt-1.5 border-t border-primary/10 flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Scheduled Slot:</span>
                        <span className="font-semibold text-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3 text-primary" />
                          {new Date(`${bookDate}T00:00:00`).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} at {getFriendlyTime12Hour(bookSlot)}
                        </span>
                      </div>
                    </div>

                    {/* WhatsApp Confirmation Checkbox */}
                    <div className="pt-2 border-t border-primary/10 flex items-start gap-2">
                      <input
                        type="checkbox"
                        id="sendBookingWhatsApp"
                        checked={sendBookingWhatsApp}
                        onChange={(e) => setSendBookingWhatsApp(e.target.checked)}
                        className="mt-0.5 rounded border-primary/40 text-primary focus:ring-primary h-3.5 w-3.5 cursor-pointer"
                      />
                      <label htmlFor="sendBookingWhatsApp" className="text-[11px] text-muted-foreground cursor-pointer select-none">
                        <span className="font-semibold text-foreground flex items-center gap-1">
                          <MessageSquare className="h-3 w-3 text-emerald-500" /> Send WhatsApp confirmation to client
                        </span>
                        <span>Prepares confirmation message with date, time, and service details.</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* 6. Notes */}
                <div className="grid gap-1.5">
                  <Label htmlFor="notes" className="text-xs font-semibold">Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Describe specific booking needs..."
                    className="border-border min-h-[60px]"
                    value={bookNotes}
                    onChange={e => setBookNotes(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={!bookSlot || isBooking} className="min-w-[130px]">
                  {isBooking ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                      Booking...
                    </>
                  ) : (
                    "Confirm Booking"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="w-full justify-start overflow-x-auto h-10 flex-nowrap border border-border bg-muted p-1 scrollbar-none">
          <TabsTrigger value="appointments" className="shrink-0">Appointments</TabsTrigger>
          <TabsTrigger value="resources" className="shrink-0">Resources</TabsTrigger>
          <TabsTrigger value="services" className="shrink-0">Services</TabsTrigger>
          <TabsTrigger value="portfolio" className="shrink-0">Portfolio Gallery</TabsTrigger>
          <TabsTrigger value="availability" className="shrink-0">Availability Scheduler</TabsTrigger>
        </TabsList>

        {/* Tab 1: Appointments List */}
        <TabsContent value="appointments" className="space-y-4">
          {/* Filters & Search Control Bar */}
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between bg-card p-3 sm:p-4 border border-border rounded-xl shadow-xs">
            <div className="flex flex-1 flex-col sm:flex-row flex-wrap gap-2.5 items-stretch sm:items-center w-full">
              {/* Search Bar */}
              <div className="relative flex-1 min-w-[200px] max-w-full sm:max-w-[280px]">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  placeholder="Search customer, phone, staff, service..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-9 pr-8 h-9 text-xs sm:text-sm border-border bg-background"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm("")}
                    className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
                    title="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Provider Selector */}
              <Select value={filterProviderId} onValueChange={val => setFilterProviderId(val || "all")}>
                <SelectTrigger className="w-full sm:w-[160px] h-9 text-xs sm:text-sm border-border bg-background">
                  <span className="truncate">
                    {filterProviderId === "all" ? "All Providers" : providers.find(p => p.id === filterProviderId)?.name || "All Providers"}
                  </span>
                </SelectTrigger>
                <SelectContent className="border-border bg-card">
                  <SelectItem value="all">All Providers</SelectItem>
                  {providers.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Date Range Selector */}
              <Select value={filterDateRange} onValueChange={val => setFilterDateRange(val || "all")}>
                <SelectTrigger className="w-full sm:w-[140px] h-9 text-xs sm:text-sm border-border bg-background">
                  <span className="truncate">
                    {filterDateRange === "all" ? "All Dates" : filterDateRange === "today" ? "Today" : filterDateRange === "tomorrow" ? "Tomorrow" : "Next 7 Days"}
                  </span>
                </SelectTrigger>
                <SelectContent className="border-border bg-card">
                  <SelectItem value="all">All Dates</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="tomorrow">Tomorrow</SelectItem>
                  <SelectItem value="week">Next 7 Days</SelectItem>
                </SelectContent>
              </Select>

              {/* Status Selector */}
              <Select value={filterStatus} onValueChange={val => setFilterStatus(val || "confirmed")}>
                <SelectTrigger className="w-full sm:w-[140px] h-9 text-xs sm:text-sm border-border bg-background">
                  <span className="truncate">
                    {filterStatus === "all" ? "All Statuses" : filterStatus === "confirmed" ? "Confirmed" : "Cancelled"}
                  </span>
                </SelectTrigger>
                <SelectContent className="border-border bg-card">
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="all">All Statuses</SelectItem>
                </SelectContent>
              </Select>

              {/* Reset Filters button */}
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                  className="h-9 px-2.5 text-xs text-muted-foreground hover:text-foreground gap-1.5 self-start sm:self-auto"
                  title="Reset all filters"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Reset</span>
                </Button>
              )}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-muted/60 p-1 border border-border rounded-lg self-stretch sm:self-auto justify-center">
              <Button
                variant={viewMode === "agenda" ? "default" : "ghost"}
                size="sm"
                className="h-8 text-xs gap-1.5 flex-1 sm:flex-initial"
                onClick={() => setViewMode("agenda")}
              >
                <List className="h-3.5 w-3.5" />
                <span>Agenda</span>
              </Button>
              <Button
                variant={viewMode === "timeline" ? "default" : "ghost"}
                size="sm"
                className="h-8 text-xs gap-1.5 flex-1 sm:flex-initial"
                onClick={() => setViewMode("timeline")}
              >
                <CalendarDays className="h-3.5 w-3.5" />
                <span>Daily Roster</span>
              </Button>
              <Button
                variant={viewMode === "table" ? "default" : "ghost"}
                size="sm"
                className="h-8 text-xs gap-1.5 flex-1 sm:flex-initial"
                onClick={() => setViewMode("table")}
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                <span>Table</span>
              </Button>
            </div>
          </div>

          {/* KPI metrics cards row - Styled to match WaCRM MetricCard design */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-2">
            {/* Card 1: Today's Bookings */}
            <div className="group rounded-xl border border-border bg-card p-5 shadow-xs transition-all duration-200 hover:border-primary/20 hover:shadow-sm hover:-translate-y-0.5">
              <div className="flex items-start justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Today's Bookings</p>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 transition-transform duration-200 group-hover:scale-110">
                  <CalendarDays className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-3 text-3xl font-semibold font-mono tracking-tight text-foreground">
                {todayAppts.length}
              </p>
              <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  {confirmedToday.length} confirmed
                </span>
                {cancelledToday.length > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-rose-500/20 bg-rose-500/10 px-2 py-0.5 text-[11px] font-medium text-rose-600 dark:text-rose-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                    {cancelledToday.length} cancelled
                  </span>
                )}
              </div>
            </div>

            {/* Card 2: Completed Today */}
            <div className="group rounded-xl border border-border bg-card p-5 shadow-xs transition-all duration-200 hover:border-primary/20 hover:shadow-sm hover:-translate-y-0.5">
              <div className="flex items-start justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Completed Today</p>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 transition-transform duration-200 group-hover:scale-110">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-3 text-3xl font-semibold font-mono tracking-tight text-foreground">
                {passedToday.length}
              </p>
              <p className="mt-3 text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-muted-foreground/70" />
                <span>{remainingTodayCount} remaining today</span>
              </p>
            </div>

            {/* Card 3: Providers Active */}
            <div className="group rounded-xl border border-border bg-card p-5 shadow-xs transition-all duration-200 hover:border-primary/20 hover:shadow-sm hover:-translate-y-0.5">
              <div className="flex items-start justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Active Providers</p>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 transition-transform duration-200 group-hover:scale-110">
                  <User className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-3 text-3xl font-semibold font-mono tracking-tight text-foreground">
                {totalActiveProviders}
              </p>
              <p className="mt-3 text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-sky-500" />
                <span>{providers.length} total staff onboarded</span>
              </p>
            </div>

            {/* Card 4: Future Queue */}
            <div className="group rounded-xl border border-border bg-card p-5 shadow-xs transition-all duration-200 hover:border-primary/20 hover:shadow-sm hover:-translate-y-0.5">
              <div className="flex items-start justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Future Queue</p>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-400 transition-transform duration-200 group-hover:scale-110">
                  <Clock className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-3 text-3xl font-semibold font-mono tracking-tight text-foreground">
                {upcomingFutureBookings.length}
              </p>
              <p className="mt-3 text-xs text-muted-foreground font-medium">
                Upcoming confirmed bookings
              </p>
            </div>
          </div>

          {loading ? (
            <div className="py-20 text-center text-muted-foreground animate-pulse">Loading appointments...</div>
          ) : filteredAppointments.length === 0 ? (
            <div className="py-16 text-center border border-dashed border-border/80 rounded-2xl bg-card/50 p-6 space-y-4">
              <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <CalendarX2 className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-foreground text-sm sm:text-base">No appointments found</p>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  No bookings match your current search and filter settings. Try adjusting your filters or schedule a new appointment.
                </p>
              </div>
              <Button
                size="sm"
                onClick={() => setIsBookOpen(true)}
                className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground text-xs"
              >
                <Plus className="h-3.5 w-3.5" /> Book Appointment
              </Button>
            </div>
          ) : viewMode === "agenda" ? (
            /* Grouped Agenda View */
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
              {/* Left Column: Grouped Daily Agenda (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                {Object.keys(groupedAppts).map(dateStr => (
                  <div key={dateStr} className="space-y-3">
                    {/* Daily Header */}
                    <div className="flex items-center gap-2 border-b border-border pb-1.5">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span className="font-semibold text-foreground text-sm">
                        {formatDateHeader(groupedAppts[dateStr][0].start_time)}
                      </span>
                      <span className="text-[11px] text-muted-foreground bg-muted px-2.5 py-0.5 rounded-full font-semibold">
                        {groupedAppts[dateStr].length} {groupedAppts[dateStr].length === 1 ? 'booking' : 'bookings'}
                      </span>
                    </div>

                    {/* Cards list */}
                    <div className="grid gap-3.5 md:grid-cols-2">
                      {groupedAppts[dateStr].map(appt => {
                        const isPast = new Date(appt.end_time).getTime() < Date.now();
                        const contactName = appt.contact?.name || "Client";
                        const contactPhone = appt.contact?.phone || "";
                        const cleanPhone = contactPhone.replace(/[^0-9]/g, "");
                        const initials = contactName
                          .split(" ")
                          .map(p => p[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase() || "C";

                        const now = Date.now();
                        const start = new Date(appt.start_time).getTime();
                        const end = new Date(appt.end_time).getTime();

                        let borderAccent = "border-l-sky-500";
                        if (appt.status === "cancelled") borderAccent = "border-l-rose-500";
                        else if (end < now) borderAccent = "border-l-slate-400 dark:border-l-slate-600";
                        else if (start <= now && end >= now) borderAccent = "border-l-emerald-500";
                        else if (start - now > 0 && start - now <= 30 * 60 * 1000) borderAccent = "border-l-amber-500";

                        return (
                          <Card
                            key={appt.id}
                            className={cn(
                              "group relative border-border bg-card border-l-4 transition-all duration-200 hover:shadow-md hover:border-border/80 flex flex-col justify-between overflow-hidden",
                              borderAccent,
                              isPast && appt.status !== "cancelled" ? "opacity-75" : "",
                              appt.status === "cancelled" ? "opacity-60 bg-muted/20" : ""
                            )}
                          >
                            <CardContent className="p-4 flex flex-col gap-3">
                              {/* Top Row: Client Info + Status Badge */}
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className="h-9 w-9 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0 border border-primary/20">
                                    {initials}
                                  </div>
                                  <div className="min-w-0">
                                    <h4 className="font-semibold text-sm text-foreground truncate">
                                      {contactName}
                                    </h4>
                                    <p className="text-xs text-muted-foreground truncate font-mono">
                                      {contactPhone || "No phone recorded"}
                                    </p>
                                  </div>
                                </div>
                                {getSimulatedStatusBadge(appt)}
                              </div>

                              {/* Middle Details Grid */}
                              <div className="grid grid-cols-2 gap-2 text-xs bg-muted/30 rounded-lg p-2.5 border border-border/50">
                                <div className="space-y-1">
                                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block">
                                    Time & Duration
                                  </span>
                                  <div className="font-medium text-foreground flex items-center gap-1.5">
                                    <Clock className="h-3.5 w-3.5 text-primary shrink-0" />
                                    <span>{formatTimeStr(appt.start_time)} - {formatTimeStr(appt.end_time)}</span>
                                  </div>
                                  <span className="text-[10px] text-muted-foreground">({appt.service?.duration_minutes || 30} mins)</span>
                                </div>

                                <div className="space-y-1">
                                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block">
                                    Service & Staff
                                  </span>
                                  <div className="font-medium text-foreground truncate">
                                    {appt.service?.name}
                                  </div>
                                  <div className="text-[11px] text-muted-foreground flex items-center gap-1 truncate">
                                    <User className="h-3 w-3 text-muted-foreground/70 shrink-0" />
                                    <span className="truncate">{appt.provider?.name}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Optional Notes */}
                              {appt.notes && (
                                <div className="bg-primary/5 border border-primary/15 rounded-md px-2.5 py-1.5 text-xs text-muted-foreground italic flex items-start gap-1.5">
                                  <span className="text-primary font-bold text-xs">“</span>
                                  <span className="truncate flex-1">{appt.notes}</span>
                                  <span className="text-primary font-bold text-xs">”</span>
                                </div>
                              )}

                              {/* Card Footer: WhatsApp-First Action Toolbar */}
                              <div className="pt-2 border-t border-border/60 flex items-center justify-between gap-2 mt-auto">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  {appt.conversation_id ? (
                                    <a
                                      href={`/inbox?c=${appt.conversation_id}`}
                                      className={buttonVariants({
                                        variant: "outline",
                                        size: "sm",
                                        className: "h-7 px-2 text-xs gap-1 border-primary/30 text-primary hover:bg-primary/10",
                                      })}
                                    >
                                      <MessageSquare className="h-3.5 w-3.5" />
                                      <span>Chat in Inbox</span>
                                    </a>
                                  ) : cleanPhone ? (
                                    <a
                                      href={`https://wa.me/${cleanPhone}`}
                                      target="_blank"
                                      rel="noreferrer noopener"
                                      className={buttonVariants({
                                        variant: "outline",
                                        size: "sm",
                                        className: "h-7 px-2 text-xs gap-1 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10",
                                      })}
                                    >
                                      <MessageSquare className="h-3.5 w-3.5" />
                                      <span>WhatsApp</span>
                                      <ArrowUpRight className="h-3 w-3 opacity-70" />
                                    </a>
                                  ) : null}

                                  {/* Reschedule Button */}
                                  {appt.status !== "cancelled" && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-7 px-2 text-xs gap-1 text-muted-foreground hover:text-primary hover:bg-primary/10"
                                      onClick={() => handleOpenReschedule(appt)}
                                      title="Reschedule this appointment"
                                    >
                                      <CalendarClock className="h-3.5 w-3.5 text-primary" />
                                      <span>Reschedule</span>
                                    </Button>
                                  )}

                                  {/* View Records / Assets Drawer Button */}
                                  {appt.contact?.id && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-7 px-2 text-xs gap-1 text-muted-foreground hover:text-foreground hover:bg-muted"
                                      onClick={() => setSelectedAssetContact({ id: appt.contact!.id, name: contactName })}
                                      title="View customer assets and records"
                                    >
                                      <ClipboardList className="h-3.5 w-3.5" />
                                      <span>Records</span>
                                    </Button>
                                  )}

                                  {/* Full Details Button */}
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 px-2 text-xs gap-1 text-muted-foreground hover:text-foreground hover:bg-muted"
                                    onClick={() => setDetailAppt(appt)}
                                    title="View full appointment details & notes"
                                  >
                                    <FileText className="h-3.5 w-3.5" />
                                    <span>Details</span>
                                  </Button>
                                </div>

                                {/* Destructive / Status Actions */}
                                <div className="flex items-center gap-1 shrink-0">
                                  {appt.status === "confirmed" && (
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 rounded-md"
                                      onClick={() => {
                                        triggerConfirm({
                                          title: "Cancel Appointment",
                                          description: `Are you sure you want to cancel ${contactName}'s appointment for ${appt.service?.name}?`,
                                          confirmText: "Cancel Appointment",
                                          variant: "destructive",
                                          onConfirm: () => cancel(appt.id),
                                        });
                                      }}
                                      title="Cancel Appointment"
                                    >
                                      <XCircle className="h-4 w-4" />
                                    </Button>
                                  )}

                                  {appt.status === "cancelled" && (
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 rounded-md"
                                      onClick={() => {
                                        triggerConfirm({
                                          title: "Delete Appointment",
                                          description: "Are you sure you want to permanently delete this cancelled appointment?",
                                          confirmText: "Delete",
                                          variant: "destructive",
                                          onConfirm: () => deleteAppointment(appt.id),
                                        });
                                      }}
                                      title="Delete Appointment permanently"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Column: Sidebar Operational Widgets (3 cols) */}
              <div className="lg:col-span-3 space-y-6">
                {/* Provider Load Widget */}
                <Card className="border border-border bg-card">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <User className="h-4 w-4 text-primary" /> Provider Load (Today)
                    </CardTitle>
                    <CardDescription className="text-xs text-muted-foreground">Active appointments per doctor today</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {providerLoads.map(({ provider, count }) => (
                      <div key={provider.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/20 border border-border">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                            {provider.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
                          </div>
                          <div className="text-xs">
                            <p className="font-semibold text-foreground">{provider.name}</p>
                            <p className="text-[10px] text-muted-foreground">Available today</p>
                          </div>
                        </div>
                        <Badge variant="secondary" className="bg-primary/15 text-primary text-xs font-bold px-2 py-0.5 rounded-full border-none">
                          {count} {count === 1 ? 'booking' : 'bookings'}
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Upcoming Bookings Widget */}
                <Card className="border border-border bg-card">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" /> Upcoming Schedule
                    </CardTitle>
                    <CardDescription className="text-xs text-muted-foreground">Next 5 upcoming appointments</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {upcomingFutureBookings.length === 0 ? (
                      <p className="text-xs text-muted-foreground text-center py-4">No upcoming bookings</p>
                    ) : (
                      upcomingFutureBookings.map((appt: any) => (
                        <div key={appt.id} className="p-2.5 rounded-lg bg-muted/20 border border-border space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-foreground bg-muted px-2 py-0.5 rounded">
                              {formatDateHeader(appt.start_time)}
                            </span>
                            <span className="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                              {formatTimeStr(appt.start_time)}
                            </span>
                          </div>
                          <div className="text-xs">
                            <p className="font-semibold text-foreground">{appt.contact?.name || "Unknown"}</p>
                            <p className="text-[10px] text-muted-foreground">
                              {appt.service?.name} with {appt.provider?.name}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : viewMode === "timeline" ? (
            /* Roster Timeline View */
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-muted/10 p-3 border border-border rounded-lg justify-between">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4.5 w-4.5 text-primary" />
                  <span className="font-semibold text-sm text-foreground">Schedule Roster for</span>
                  <Input
                    type="date"
                    value={selectedTimelineDate}
                    onChange={e => setSelectedTimelineDate(e.target.value)}
                    className="w-[160px] border-border bg-card h-8 py-0.5 text-sm font-semibold"
                  />
                </div>
                <div className="flex gap-1.5 self-end sm:self-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 border-border text-xs"
                    onClick={() => {
                      const prev = new Date(selectedTimelineDate);
                      prev.setDate(prev.getDate() - 1);
                      const y = prev.getFullYear();
                      const m = String(prev.getMonth() + 1).padStart(2, "0");
                      const d = String(prev.getDate()).padStart(2, "0");
                      setSelectedTimelineDate(`${y}-${m}-${d}`);
                    }}
                  >
                    Previous Day
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 border-border text-xs"
                    onClick={() => {
                      const today = new Date();
                      const y = today.getFullYear();
                      const m = String(today.getMonth() + 1).padStart(2, "0");
                      const d = String(today.getDate()).padStart(2, "0");
                      setSelectedTimelineDate(`${y}-${m}-${d}`);
                    }}
                  >
                    Today
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 border-border text-xs"
                    onClick={() => {
                      const next = new Date(selectedTimelineDate);
                      next.setDate(next.getDate() + 1);
                      const y = next.getFullYear();
                      const m = String(next.getMonth() + 1).padStart(2, "0");
                      const d = String(next.getDate()).padStart(2, "0");
                      setSelectedTimelineDate(`${y}-${m}-${d}`);
                    }}
                  >
                    Next Day
                  </Button>
                </div>
              </div>

              {/* Quick Resource Filter Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                <span className="text-xs font-semibold text-muted-foreground mr-1 flex items-center gap-1 shrink-0 select-none">
                  <Users className="h-3.5 w-3.5 text-primary" /> Resource:
                </span>

                {/* "All Resources" pill */}
                <button
                  type="button"
                  onClick={() => setFilterProviderId("all")}
                  className={cn(
                    "h-7 px-3 rounded-full text-xs font-medium transition-all shrink-0 flex items-center gap-1.5 border",
                    filterProviderId === "all"
                      ? "bg-primary text-primary-foreground border-primary shadow-xs font-semibold"
                      : "bg-card hover:bg-muted/60 text-muted-foreground hover:text-foreground border-border"
                  )}
                >
                  <span>All Resources</span>
                  <span
                    className={cn(
                      "text-[10px] px-1.5 py-0.2 rounded-full font-mono",
                      filterProviderId === "all"
                        ? "bg-primary-foreground/20 text-primary-foreground font-bold"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {providers.filter(p => p.is_active).length}
                  </span>
                </button>

                {/* Individual Resource pills */}
                {providers.filter(p => p.is_active).map(provider => {
                  const { mainName, role } = parseProviderName(provider.name);
                  const isSelected = filterProviderId === provider.id;
                  const dayApptCount = sortedAppts.filter(appt => {
                    const d = new Date(appt.start_time);
                    const y = d.getFullYear();
                    const m = String(d.getMonth() + 1).padStart(2, "0");
                    const day = String(d.getDate()).padStart(2, "0");
                    return `${y}-${m}-${day}` === selectedTimelineDate && appt.provider?.id === provider.id && appt.status !== "cancelled";
                  }).length;

                  return (
                    <button
                      key={provider.id}
                      type="button"
                      onClick={() => setFilterProviderId(isSelected ? "all" : provider.id)}
                      className={cn(
                        "h-7 px-3 rounded-full text-xs font-medium transition-all shrink-0 flex items-center gap-1.5 border",
                        isSelected
                          ? "bg-primary text-primary-foreground border-primary shadow-xs font-semibold ring-1 ring-primary/30"
                          : "bg-card hover:bg-muted/60 text-muted-foreground hover:text-foreground border-border"
                      )}
                      title={`Filter to ${provider.name}`}
                    >
                      <span className="truncate max-w-[200px]">
                        {role ? `${mainName} (${role})` : mainName}
                      </span>
                      {dayApptCount > 0 && (
                        <span
                          className={cn(
                            "text-[10px] px-1.5 py-0.2 rounded-full font-mono font-semibold",
                            isSelected
                              ? "bg-primary-foreground/25 text-primary-foreground"
                              : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                          )}
                        >
                          {dayApptCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Active Single Resource Isolation Banner */}
              {filterProviderId !== "all" && (
                <div className="flex items-center justify-between bg-primary/5 border border-primary/20 px-3.5 py-2 rounded-lg text-xs">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary font-semibold text-[11px] px-2 py-0.5">
                      Single Resource View
                    </Badge>
                    <span className="text-foreground font-medium">
                      Showing dedicated schedule for <span className="font-bold">{providers.find(p => p.id === filterProviderId)?.name}</span>
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 text-xs text-primary hover:text-primary/90 px-2.5 font-medium"
                    onClick={() => setFilterProviderId("all")}
                  >
                    Show All Resources
                  </Button>
                </div>
              )}

              {/* Interactive Hourly Multi-Provider Calendar Grid */}
              {(() => {
                const visibleProviders = providers.filter(
                  p => p.is_active && (filterProviderId === "all" || p.id === filterProviderId)
                );

                const timelineDayAppts = sortedAppts.filter(appt => {
                  const d = new Date(appt.start_time);
                  const y = d.getFullYear();
                  const m = String(d.getMonth() + 1).padStart(2, "0");
                  const day = String(d.getDate()).padStart(2, "0");
                  return `${y}-${m}-${day}` === selectedTimelineDate;
                });

                // Calculate timeline operating hours
                let timelineStartHour = 8;  // default 08:00 AM
                let timelineEndHour = 20;   // default 08:00 PM

                timelineDayAppts.forEach(a => {
                  const sHour = new Date(a.start_time).getHours();
                  const eHour = new Date(a.end_time).getHours() + 1;
                  if (sHour < timelineStartHour) timelineStartHour = Math.max(0, sHour);
                  if (eHour > timelineEndHour) timelineEndHour = Math.min(24, eHour);
                });

                const hours: number[] = [];
                for (let h = timelineStartHour; h < timelineEndHour; h++) {
                  hours.push(h);
                }

                const ROW_HEIGHT = 80; // px per hour
                const totalGridHeight = hours.length * ROW_HEIGHT;

                // Live "Now" line calculations
                const today = new Date();
                const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
                const isToday = selectedTimelineDate === todayStr;
                const currentMinutes = today.getHours() * 60 + today.getMinutes();
                const isNowVisible = isToday && currentMinutes >= timelineStartHour * 60 && currentMinutes <= timelineEndHour * 60;
                const nowTopPx = ((currentMinutes - timelineStartHour * 60) / 60) * ROW_HEIGHT;

                const getTimelineTop = (startIso: string) => {
                  const d = new Date(startIso);
                  const mins = d.getHours() * 60 + d.getMinutes();
                  const diffMinutes = Math.max(0, mins - timelineStartHour * 60);
                  return (diffMinutes / 60) * ROW_HEIGHT;
                };

                const getTimelineHeight = (startIso: string, endIso: string, durationMin = 30) => {
                  const start = new Date(startIso).getTime();
                  const end = new Date(endIso).getTime();
                  const duration = Math.max(15, (end - start) / (1000 * 60) || durationMin);
                  return Math.max(38, (duration / 60) * ROW_HEIGHT);
                };

                const handleEmptySlotClick = (providerId: string, hour: number) => {
                  setBookProviderId(providerId);
                  setBookDate(selectedTimelineDate);
                  const timeFormatted = `${String(hour).padStart(2, "0")}:00:00`;
                  setBookSlot(timeFormatted);
                  setIsBookOpen(true);
                };

                if (visibleProviders.length === 0) {
                  return (
                    <div className="py-16 text-center border border-dashed border-border rounded-xl bg-card p-6">
                      <User className="h-8 w-8 mx-auto text-muted-foreground/40 mb-2" />
                      <p className="font-semibold text-sm text-foreground">No active providers found</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Please onboard or activate resource providers in the Resources tab.
                      </p>
                    </div>
                  );
                }

                const isSingleProvider = visibleProviders.length === 1;
                const colWidthClass = isSingleProvider ? "min-w-[360px] flex-1" : "w-[280px] sm:w-[320px] shrink-0";

                return (
                  <div className="border border-border rounded-xl bg-card shadow-xs overflow-hidden">
                    {/* Unified Single-Canvas Scroll Container */}
                    <div className="overflow-auto max-h-[750px] relative scrollbar-thin">
                      <div className="min-w-max relative">
                        {/* Pinned Sticky Provider Header Row */}
                        <div className="sticky top-0 z-20 flex border-b border-border bg-card/95 backdrop-blur-md divide-x divide-border shadow-2xs">
                          {/* Sticky Top-Left Corner (Time) */}
                          <div className="sticky left-0 z-30 w-16 sm:w-20 shrink-0 p-3 text-center text-xs font-semibold text-muted-foreground flex items-center justify-center bg-muted/90 backdrop-blur-md select-none border-r border-border shadow-[2px_0_4px_-2px_rgba(0,0,0,0.1)]">
                            <Clock className="h-3.5 w-3.5 mr-1 text-primary" /> Time
                          </div>

                          {/* Provider Column Headers */}
                          {visibleProviders.map(provider => {
                            const count = timelineDayAppts.filter(a => a.provider?.id === provider.id && a.status !== "cancelled").length;
                            const initials = provider.name.split(" ").map(p => p[0]).join("").slice(0, 2).toUpperCase() || "P";
                            const { mainName, role } = parseProviderName(provider.name);

                            return (
                              <div
                                key={provider.id}
                                className={cn(
                                  "p-3 flex items-center justify-between gap-2.5 bg-card/95 hover:bg-muted/10 transition-colors",
                                  colWidthClass
                                )}
                              >
                                <div
                                  className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer group"
                                  onClick={() => setFilterProviderId(filterProviderId === provider.id ? "all" : provider.id)}
                                  title={filterProviderId === provider.id ? "Click to view all resources" : `Click to isolate ${provider.name}`}
                                >
                                  <div className="h-9 w-9 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0 border border-primary/20 group-hover:ring-2 group-hover:ring-primary/40 transition-all">
                                    {initials}
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <h4 className="text-xs font-bold text-foreground truncate group-hover:text-primary transition-colors" title={provider.name}>
                                      {mainName}
                                    </h4>
                                    {role && (
                                      <p className="text-[11px] font-medium text-primary/80 truncate leading-tight mt-0.5" title={role}>
                                        {role}
                                      </p>
                                    )}
                                    <p className="text-[10px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
                                      <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", count > 0 ? "bg-emerald-500" : "bg-muted-foreground/40")} />
                                      {count === 0 ? "Free today" : `${count} ${count === 1 ? "booking" : "bookings"}`}
                                    </p>
                                  </div>
                                </div>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-7 w-7 border-border text-muted-foreground hover:text-primary hover:border-primary/40 shrink-0"
                                  onClick={() => {
                                    setBookProviderId(provider.id);
                                    setBookDate(selectedTimelineDate);
                                    setIsBookOpen(true);
                                  }}
                                  title={`Schedule slot with ${provider.name}`}
                                >
                                  <Plus className="h-3.5 w-3.5" />
                                  <span className="sr-only">Book slot</span>
                                </Button>
                              </div>
                            );
                          })}
                        </div>

                        {/* Hourly Time Grid Body */}
                        <div
                          className="flex divide-x divide-border relative"
                          style={{ height: `${totalGridHeight}px` }}
                        >
                          {/* Live "Now" horizontal indicator */}
                          {isNowVisible && (
                            <div
                              className="absolute left-0 right-0 z-15 pointer-events-none flex items-center"
                              style={{ top: `${nowTopPx}px` }}
                            >
                              <div className="sticky left-0 w-16 sm:w-20 pr-2 text-right z-25">
                                <span className="bg-rose-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs uppercase tracking-wider">
                                  Now
                                </span>
                              </div>
                              <div className="flex-1 relative flex items-center">
                                <div className="h-2 w-2 rounded-full bg-rose-500 ring-4 ring-rose-500/20 -ml-1" />
                                <div className="flex-1 border-t-2 border-rose-500/80" />
                              </div>
                            </div>
                          )}

                          {/* 1. Sticky Left Time Axis Column */}
                          <div className="sticky left-0 z-10 w-16 sm:w-20 shrink-0 bg-card/95 backdrop-blur-md relative select-none border-r border-border shadow-[2px_0_4px_-2px_rgba(0,0,0,0.1)]">
                            {hours.map(hour => {
                              const ampm = hour >= 12 ? "PM" : "AM";
                              const displayHour = hour % 12 === 0 ? 12 : hour % 12;
                              return (
                                <div
                                  key={hour}
                                  className="relative border-b border-border/70 text-right pr-2 text-[11px] font-semibold text-muted-foreground"
                                  style={{ height: `${ROW_HEIGHT}px` }}
                                >
                                  <span className="absolute -top-2.5 right-2 bg-card/90 px-1 rounded text-muted-foreground/80 font-mono text-[10px]">
                                    {displayHour} {ampm}
                                  </span>
                                  {/* Mid-hour subtle dotted marker */}
                                  <div
                                    className="absolute left-0 right-0 border-b border-dashed border-border/40 pointer-events-none"
                                    style={{ top: `${ROW_HEIGHT / 2}px` }}
                                  />
                                </div>
                              );
                            })}
                          </div>

                          {/* 2. Provider Columns */}
                          {visibleProviders.map(provider => {
                            const provAppts = timelineDayAppts.filter(a => a.provider?.id === provider.id);

                            return (
                              <div
                                key={provider.id}
                                className={cn("relative bg-card/60", colWidthClass)}
                              >
                                {/* Background Hour Rows (Clickable empty slots) */}
                                {hours.map(hour => {
                                  const ampm = hour >= 12 ? "PM" : "AM";
                                  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
                                  return (
                                    <div
                                      key={hour}
                                      onClick={() => handleEmptySlotClick(provider.id, hour)}
                                      className="group/slot relative border-b border-border/60 hover:bg-primary/5 cursor-pointer transition-colors"
                                      style={{ height: `${ROW_HEIGHT}px` }}
                                      title={`Click to book ${displayHour}:00 ${ampm} with ${provider.name}`}
                                    >
                                      {/* Mid-hour divider line */}
                                      <div
                                        className="absolute left-0 right-0 border-b border-dashed border-border/30 pointer-events-none"
                                        style={{ top: `${ROW_HEIGHT / 2}px` }}
                                      />

                                      {/* Subtle hover prompt to book */}
                                      <div className="opacity-0 group-hover/slot:opacity-100 transition-opacity absolute inset-1 flex items-center justify-center pointer-events-none">
                                        <span className="bg-primary/10 border border-primary/20 text-primary text-[10px] font-semibold px-2 py-0.5 rounded flex items-center gap-1 shadow-2xs">
                                          <Plus className="h-3 w-3" /> Book {displayHour}:00 {ampm}
                                        </span>
                                      </div>
                                    </div>
                                  );
                                })}

                                {/* Scheduled Appointment Blocks placed on top */}
                                {provAppts.map(appt => {
                                  const topPx = getTimelineTop(appt.start_time);
                                  const heightPx = getTimelineHeight(appt.start_time, appt.end_time, appt.service?.duration_minutes);
                                  const isPast = new Date(appt.end_time).getTime() < Date.now();
                                  const contactName = appt.contact?.name || "Client";
                                  const cleanPhone = appt.contact?.phone ? appt.contact.phone.replace(/[^0-9]/g, "") : "";

                                  let borderAccent = "border-l-sky-500 bg-sky-500/10 border-sky-500/30 text-sky-950 dark:text-sky-100";
                                  let dotColor = "bg-sky-500";
                                  let statusLabel = "Confirmed";

                                  if (appt.status === "cancelled") {
                                    borderAccent = "border-l-rose-500 bg-rose-500/10 border-rose-500/30 text-rose-950 dark:text-rose-200 opacity-60";
                                    dotColor = "bg-rose-500";
                                    statusLabel = "Cancelled";
                                  } else {
                                    const now = Date.now();
                                    const start = new Date(appt.start_time).getTime();
                                    const end = new Date(appt.end_time).getTime();
                                    if (end < now) {
                                      borderAccent = "border-l-slate-400 bg-muted/40 border-border text-foreground opacity-75";
                                      dotColor = "bg-slate-400";
                                      statusLabel = "Completed";
                                    } else if (start <= now && end >= now) {
                                      borderAccent = "border-l-emerald-500 bg-emerald-500/15 border-emerald-500/40 text-emerald-950 dark:text-emerald-100 ring-1 ring-emerald-500/30";
                                      dotColor = "bg-emerald-500 animate-pulse";
                                      statusLabel = "In Session";
                                    } else if (start - now > 0 && start - now <= 30 * 60 * 1000) {
                                      borderAccent = "border-l-amber-500 bg-amber-500/15 border-amber-500/40 text-amber-950 dark:text-amber-100";
                                      dotColor = "bg-amber-500";
                                      statusLabel = "Arriving Soon";
                                    }
                                  }

                                  return (
                                    <div
                                      key={appt.id}
                                      style={{
                                       top: `${topPx}px`,
                                       height: `${heightPx}px`,
                                       left: "4px",
                                       right: "4px",
                                      }}
                                      onClick={e => {
                                        e.stopPropagation();
                                        setDetailAppt(appt);
                                      }}
                                      className={cn(
                                        "absolute border-l-4 rounded-lg p-2 flex flex-col justify-between shadow-xs transition-all hover:shadow-md hover:z-20 cursor-pointer overflow-hidden border",
                                        borderAccent,
                                        isPast && appt.status !== "cancelled" ? "opacity-80" : ""
                                      )}
                                      title={`${contactName} — ${appt.service?.name} (${formatTimeStr(appt.start_time)} - ${formatTimeStr(appt.end_time)})`}
                                    >
                                      {/* Top row: Time + Status Dot */}
                                      <div className="flex items-center justify-between gap-1 text-[10px] font-semibold leading-tight">
                                        <span className="truncate flex items-center gap-1 font-mono">
                                          <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", dotColor)} />
                                          {formatTimeStr(appt.start_time)} - {formatTimeStr(appt.end_time)}
                                        </span>
                                        <span className="text-[9px] uppercase tracking-wider opacity-80 shrink-0">
                                          {statusLabel}
                                        </span>
                                      </div>

                                      {/* Middle row: Customer Name & Service */}
                                      <div className="min-w-0 my-0.5">
                                        <p className="font-bold text-xs truncate leading-tight">
                                          {contactName}
                                        </p>
                                        <p className="text-[11px] truncate opacity-90 leading-tight">
                                          {appt.service?.name} ({appt.service?.duration_minutes}m)
                                        </p>
                                      </div>

                                      {/* Bottom action toolbar (visible on hover / ample height) */}
                                      {heightPx >= 58 && (
                                        <div className="pt-1 border-t border-current/10 flex items-center justify-between gap-1 mt-auto">
                                          <div className="flex items-center gap-1">
                                            {appt.conversation_id ? (
                                              <a
                                                href={`/inbox?c=${appt.conversation_id}`}
                                                onClick={e => e.stopPropagation()}
                                                className="p-1 rounded hover:bg-current/10 transition-colors"
                                                title="Chat in Inbox"
                                              >
                                                <MessageSquare className="h-3 w-3" />
                                              </a>
                                            ) : cleanPhone ? (
                                              <a
                                                href={`https://wa.me/${cleanPhone}`}
                                                target="_blank"
                                                rel="noreferrer noopener"
                                                onClick={e => e.stopPropagation()}
                                                className="p-1 rounded hover:bg-current/10 transition-colors"
                                                title="WhatsApp"
                                              >
                                                <MessageSquare className="h-3 w-3" />
                                              </a>
                                            ) : null}

                                            {appt.status !== "cancelled" && (
                                              <button
                                                type="button"
                                                onClick={e => {
                                                  e.stopPropagation();
                                                  handleOpenReschedule(appt);
                                                }}
                                                className="p-1 rounded hover:bg-current/10 transition-colors"
                                                title="Reschedule"
                                              >
                                                <CalendarClock className="h-3 w-3" />
                                              </button>
                                            )}
                                          </div>

                                          <span className="text-[9px] opacity-75 font-mono">
                                            {appt.service?.duration_minutes}m
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          ) : (
            /* Traditional Table View (Original with improvements) */
            <Card className="border-border bg-card">
              <CardContent className="p-0">
                <div className="w-full overflow-x-auto">
                  <Table>
                    <TableHeader className="border-border">
                      <TableRow className="border-border hover:bg-transparent">
                        <TableHead>Customer</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead>Provider</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedAppts.map(appt => {
                        const isPast = new Date(appt.end_time).getTime() < Date.now();
                        return (
                          <TableRow key={appt.id} className={`border-border hover:bg-muted/30 ${isPast ? 'opacity-50 grayscale-[10%]' : ''}`}>
                            <TableCell>
                              <div className="flex items-center gap-2.5">
                                <div className="h-8 w-8 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0 border border-primary/20">
                                  {(appt.contact?.name || "C").slice(0, 2).toUpperCase()}
                                </div>
                                <div>
                                  <div className="flex items-center gap-1.5 font-medium text-foreground text-sm">
                                    <span>{appt.contact?.name || "Unknown"}</span>
                                    {appt.conversation_id ? (
                                      <a
                                        href={`/inbox?c=${appt.conversation_id}`}
                                        className="text-primary hover:text-primary/80 transition-colors p-0.5 rounded hover:bg-primary/10"
                                        title="Open Chat in Inbox"
                                      >
                                        <MessageSquare className="h-3.5 w-3.5" />
                                      </a>
                                    ) : appt.contact?.phone ? (
                                      <a
                                        href={`https://wa.me/${appt.contact.phone.replace(/[^0-9]/g, '')}`}
                                        target="_blank"
                                        rel="noreferrer noopener"
                                        className="text-emerald-500 hover:text-emerald-400 transition-colors p-0.5 rounded hover:bg-emerald-500/10"
                                        title="Chat on WhatsApp"
                                      >
                                        <MessageSquare className="h-3.5 w-3.5" />
                                      </a>
                                    ) : null}
                                  </div>
                                  <div className="text-xs text-muted-foreground font-mono">{appt.contact?.phone || "No phone"}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="font-medium text-sm">{appt.service?.name}</div>
                              <div className="text-xs text-muted-foreground">{appt.service?.duration_minutes} mins</div>
                            </TableCell>
                            <TableCell className="font-medium text-muted-foreground text-sm">
                              {appt.provider?.name}
                            </TableCell>
                            <TableCell className="font-medium text-sm">
                              {formatDateTime(appt.start_time)}
                            </TableCell>
                            <TableCell>
                              {getSimulatedStatusBadge(appt)}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                {appt.status !== "cancelled" && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md"
                                    onClick={() => handleOpenReschedule(appt)}
                                    title="Reschedule Appointment"
                                  >
                                    <CalendarClock className="h-4 w-4" />
                                  </Button>
                                )}

                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md"
                                  onClick={() => setDetailAppt(appt)}
                                  title="View Details & Notes"
                                >
                                  <FileText className="h-4 w-4" />
                                </Button>

                                {appt.contact?.id && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md"
                                    onClick={() => setSelectedAssetContact({ id: appt.contact!.id, name: appt.contact?.name || "Client" })}
                                    title="View customer records & assets"
                                  >
                                    <ClipboardList className="h-4 w-4" />
                                  </Button>
                                )}
                                {appt.status === "confirmed" && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-muted-foreground hover:text-rose-400 rounded-lg h-8 w-8 hover:bg-rose-500/10"
                                    onClick={() => {
                                      triggerConfirm({
                                        title: "Cancel Appointment",
                                        description: `Are you sure you want to cancel ${appt.contact?.name || "this"}'s appointment?`,
                                        confirmText: "Cancel Appointment",
                                        variant: "destructive",
                                        onConfirm: () => cancel(appt.id),
                                      });
                                    }}
                                    title="Cancel Appointment"
                                  >
                                    <XCircle className="h-4 w-4" />
                                  </Button>
                                )}

                                {appt.status === "cancelled" && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-muted-foreground hover:text-rose-400 rounded-lg h-8 w-8 hover:bg-rose-500/10"
                                    onClick={() => {
                                      triggerConfirm({
                                        title: "Delete Appointment",
                                        description: "Are you sure you want to permanently delete this cancelled appointment?",
                                        confirmText: "Delete",
                                        variant: "destructive",
                                        onConfirm: () => deleteAppointment(appt.id),
                                      });
                                    }}
                                    title="Delete Appointment permanently"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Tab 2: Resources List */}
        <TabsContent value="resources" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-foreground">Onboarded Providers & Resources</h3>
            <Dialog open={isProviderOpen} onOpenChange={setIsProviderOpen}>
              <DialogTrigger render={<Button size="sm" className="gap-1" />}>
                <Plus className="h-4 w-4" /> Add Provider
              </DialogTrigger>
              <DialogContent className="border-border bg-card">
                <form onSubmit={handleAddProvider}>
                  <DialogHeader>
                    <DialogTitle>Add Resource Provider</DialogTitle>
                    <DialogDescription>Onboard a new dentist, specialist, or service bay.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="prov_name">Provider Name</Label>
                      <Input
                        id="prov_name"
                        className="border-border"
                        placeholder="e.g. Dr. Sarah"
                        value={newProvName}
                        onChange={e => setNewProvName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="prov_desc">Description / Specialty</Label>
                      <Input
                        id="prov_desc"
                        className="border-border"
                        placeholder="e.g. Orthodontist"
                        value={newProvDesc}
                        onChange={e => setNewProvDesc(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Onboard Resource</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {providers.length === 0 ? (
              <div className="col-span-3 py-10 text-center text-muted-foreground border border-dashed border-border rounded-lg">
                No providers registered yet.
              </div>
            ) : (
              providers.map(p => (
                <Card key={p.id} className="border-border bg-card hover:bg-muted/10 transition-colors relative group">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-semibold">{p.name}</CardTitle>
                    <div className="flex items-center gap-1 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => {
                          setEditingProvider(p);
                          setEditProvName(p.name);
                          setEditProvDesc(p.description || "");
                          setEditProvActive(p.is_active);
                          setEditProvServices(p.services?.map((s: any) => s.service_id) || []);
                        }}
                        className="h-7 w-7 text-muted-foreground hover:text-foreground"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleDeleteProvider(p.id)}
                        className="h-7 w-7 text-muted-foreground hover:text-rose-400"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">{p.description || "No description set"}</p>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {services.filter(s => p.services?.some((ps: any) => ps.service_id === s.id)).map(s => (
                        <Badge key={s.id} variant="secondary" className="text-[10px] py-0 px-1.5 border border-primary/10 bg-primary/5 text-primary">
                          {s.name}
                        </Badge>
                      ))}
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2 items-center justify-between">
                      <Badge variant="outline" className={p.is_active ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10" : ""}>
                        {p.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    {(() => {
                      const totalApptsCount = appointments.filter(a => a.provider?.id === p.id && a.status === 'confirmed').length;
                      const totalRevenue = appointments
                        .filter(a => a.provider?.id === p.id && a.status === 'confirmed')
                        .reduce((acc, a) => {
                          const srv = services.find(s => s.id === a.service?.id);
                          return acc + (srv?.price || 0);
                        }, 0);

                      return (
                        <div className="mt-4 pt-3 border-t border-border/60 grid grid-cols-2 gap-2 text-center text-[10px] w-full">
                          <div className="bg-muted/30 p-2 rounded-lg border border-border/40">
                            <span className="block text-muted-foreground font-medium">Total Bookings</span>
                            <span className="font-bold text-foreground text-xs">{totalApptsCount}</span>
                          </div>
                          <div className="bg-muted/30 p-2 rounded-lg border border-border/40">
                            <span className="block text-muted-foreground font-medium">Est. Revenue</span>
                            <span className="font-bold text-emerald-450 text-xs">₹{totalRevenue}</span>
                          </div>
                        </div>
                      );
                    })()}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Tab 3: Services List */}
        <TabsContent value="services" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-foreground">Configured Services</h3>
            <Dialog open={isServiceOpen} onOpenChange={setIsServiceOpen}>
              <DialogTrigger render={<Button size="sm" className="gap-1" />}>
                <Plus className="h-4 w-4" /> Add Service
              </DialogTrigger>
              <DialogContent className="border-border bg-card">
                <form onSubmit={handleAddService}>
                  <DialogHeader>
                    <DialogTitle>Add Service</DialogTitle>
                    <DialogDescription>Define a new service type, duration, and price.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="serv_name">Service Name</Label>
                      <Input
                        id="serv_name"
                        className="border-border"
                        placeholder="e.g. Tooth Extraction"
                        value={newServName}
                        onChange={e => setNewServName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="serv_dur">Duration (Minutes)</Label>
                      <Input
                        type="number"
                        id="serv_dur"
                        className="border-border"
                        value={newServDuration}
                        onChange={e => setNewServDuration(parseInt(e.target.value))}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="serv_price">Price (INR)</Label>
                      <Input
                        type="number"
                        id="serv_price"
                        className="border-border"
                        placeholder="e.g. 150"
                        value={newServPrice}
                        onChange={e => setNewServPrice(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="serv_desc">Description</Label>
                      <Input
                        id="serv_desc"
                        className="border-border"
                        placeholder="e.g. Routine extraction under local anesthesia"
                        value={newServDesc}
                        onChange={e => setNewServDesc(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Create Service</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {services.length === 0 ? (
              <div className="col-span-3 py-10 text-center text-muted-foreground border border-dashed border-border rounded-lg">
                No services registered yet.
              </div>
            ) : (
              services.map(s => (
                <Card key={s.id} className="border-border bg-card hover:bg-muted/10 transition-colors relative group">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-semibold">{s.name}</CardTitle>
                    <div className="flex items-center gap-1 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => {
                          setEditingService(s);
                          setEditServName(s.name);
                          setEditServDuration(s.duration_minutes);
                          setEditServPrice(s.price ? String(s.price) : "");
                          setEditServDesc(s.description || "");
                          setEditServActive(s.is_active);
                        }}
                        className="h-7 w-7 text-muted-foreground hover:text-foreground"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleDeleteService(s.id)}
                        className="h-7 w-7 text-muted-foreground hover:text-rose-400"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground mb-3">{s.description || "No description set"}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="secondary">{s.duration_minutes} mins</Badge>
                      {s.price && <Badge variant="outline" className="border-primary/20 text-primary">₹{s.price}</Badge>}
                      <Badge variant="outline" className={s.is_active ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10" : ""}>
                        {s.is_active ? "Active" : "Inactive"}
                      </Badge>
                      <MatrixPricingModal
                        accountId={account?.id || ""}
                        serviceId={s.id}
                        serviceName={s.name}
                        basePrice={s.price || 0}
                        currency={s.currency || "INR"}
                      />
                    </div>
                    {(() => {
                      const totalBookings = appointments.filter(a => a.service?.id === s.id && a.status === 'confirmed').length;
                      const totalRev = totalBookings * (s.price || 0);

                      return (
                        <div className="mt-4 pt-3 border-t border-border/60 grid grid-cols-2 gap-2 text-center text-[10px] w-full">
                          <div className="bg-muted/30 p-2 rounded-lg border border-border/40">
                            <span className="block text-muted-foreground font-medium">Total Booked</span>
                            <span className="font-bold text-foreground text-xs">{totalBookings}</span>
                          </div>
                          <div className="bg-muted/30 p-2 rounded-lg border border-border/40">
                            <span className="block text-muted-foreground font-medium">Revenue</span>
                            <span className="font-bold text-emerald-450 text-xs">₹{totalRev}</span>
                          </div>
                        </div>
                      );
                    })()}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Tab 4: Portfolio Gallery Showcase */}
        <TabsContent value="portfolio" className="space-y-4">
          <PortfolioMediaManager accountId={account?.id || ""} />
        </TabsContent>

        {/* Tab 4: Availability Scheduler Configuration */}
        <TabsContent value="availability" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Main Card: Resource Provider Selector & Weekly Schedule */}
            <Card className="border-border bg-card lg:col-span-2">
              <CardHeader>
                <CardTitle>Availability Settings</CardTitle>
                <CardDescription>Select a resource provider to configure weekly recurring schedules.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-2 max-w-[400px]">
                  <Label htmlFor="sched_provider">Resource Provider</Label>
                  <Select value={schedProviderId} onValueChange={val => setSchedProviderId(val || "")}>
                    <SelectTrigger className="border-border">
                      <span className="text-sm text-foreground">
                        {providers.find(p => p.id === schedProviderId)?.name || "Select staff..."}
                      </span>
                    </SelectTrigger>
                    <SelectContent className="border-border bg-card">
                      {providers.map(p => (
                        <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {schedProviderId && (
                  <div className="space-y-4 pt-4 border-t border-border">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-foreground">Weekly Recurring Schedule</h4>
                      <Button onClick={handleSaveSchedules} size="sm" className="gap-1">
                        Save Business Hours
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {[
                        { day: 1, label: "Monday" },
                        { day: 2, label: "Tuesday" },
                        { day: 3, label: "Wednesday" },
                        { day: 4, label: "Thursday" },
                        { day: 5, label: "Friday" },
                        { day: 6, label: "Saturday" },
                        { day: 0, label: "Sunday" },
                      ].map(({ day, label }) => (
                        <div key={day} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 border border-border/80 rounded-xl bg-muted/20">
                          <div className="flex items-center gap-3 shrink-0">
                            <Switch
                              checked={weeklySchedules[day]?.active || false}
                              onCheckedChange={checked => {
                                setWeeklySchedules(prev => ({
                                  ...prev,
                                  [day]: { ...prev[day], active: checked },
                                }));
                              }}
                            />
                            <span className="text-sm font-semibold text-foreground min-w-[90px]">{label}</span>
                          </div>

                          {weeklySchedules[day]?.active ? (
                            <div className="flex flex-col gap-2 min-w-0 flex-1 sm:max-w-[340px]">
                              {(weeklySchedules[day].shifts || []).map((shift, idx) => (
                                <div key={idx} className="flex flex-wrap items-center gap-2 justify-start sm:justify-end">
                                  <div className="flex items-center gap-1.5 bg-card p-1 px-2 rounded-md border border-border">
                                    <div className="flex flex-col items-center">
                                      <Input
                                        type="time"
                                        className="w-[105px] border-border h-7 text-xs px-1"
                                        value={shift.start}
                                        onChange={e => {
                                          const newShifts = [...weeklySchedules[day].shifts];
                                          newShifts[idx] = { ...shift, start: e.target.value };
                                          setWeeklySchedules(prev => ({
                                            ...prev,
                                            [day]: { ...prev[day], shifts: newShifts },
                                          }));
                                        }}
                                      />
                                      <span className="text-[9px] text-muted-foreground font-mono mt-0.5">{getFriendlyTime12Hour(shift.start)}</span>
                                    </div>
                                    <span className="text-[10px] text-muted-foreground font-medium">to</span>
                                    <div className="flex flex-col items-center">
                                      <Input
                                        type="time"
                                        className="w-[105px] border-border h-7 text-xs px-1"
                                        value={shift.end}
                                        onChange={e => {
                                          const newShifts = [...weeklySchedules[day].shifts];
                                          newShifts[idx] = { ...shift, end: e.target.value };
                                          setWeeklySchedules(prev => ({
                                            ...prev,
                                            [day]: { ...prev[day], shifts: newShifts },
                                          }));
                                        }}
                                      />
                                      <span className="text-[9px] text-muted-foreground font-mono mt-0.5">{getFriendlyTime12Hour(shift.end)}</span>
                                    </div>
                                  </div>

                                  {weeklySchedules[day].shifts.length > 1 && (
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => {
                                        const newShifts = weeklySchedules[day].shifts.filter((_, sIdx) => sIdx !== idx);
                                        setWeeklySchedules(prev => ({
                                          ...prev,
                                          [day]: { ...prev[day], shifts: newShifts },
                                        }));
                                      }}
                                      className="h-7 w-7 text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10 shrink-0"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                  )}
                                </div>
                              ))}
                              <div className="flex justify-end pr-1">
                                <Button
                                  variant="link"
                                  size="sm"
                                  onClick={() => {
                                    const newShifts = [...(weeklySchedules[day].shifts || []), { start: "09:00", end: "17:00" }];
                                    setWeeklySchedules(prev => ({
                                      ...prev,
                                      [day]: { ...prev[day], shifts: newShifts },
                                    }));
                                  }}
                                  className="h-5 text-[10px] p-0 text-primary hover:text-primary/80"
                                >
                                  + Add Shift
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground font-medium italic">Closed</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Right Column: Schedule Overrides & Peak Hours */}
            <div className="space-y-6">
              {schedProviderId && (
                <Card className="border border-border bg-card">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold text-foreground">
                      Schedule Overrides & Time Off
                    </CardTitle>
                    <CardDescription className="text-xs text-muted-foreground">
                      Define vacations, leaves, or temporary hours for this provider.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-1.5">
                      <Label htmlFor="ov_date" className="text-xs">Select Date</Label>
                      <Input
                        type="date"
                        id="ov_date"
                        className="border-border text-xs"
                        value={overrideDate}
                        onChange={e => setOverrideDate(e.target.value)}
                      />
                    </div>
                    <div className="flex items-center justify-between p-2.5 border border-border rounded-lg bg-muted/20">
                      <span className="text-xs font-semibold">Available for Booking?</span>
                      <Switch
                        checked={overrideAvailable}
                        onCheckedChange={setOverrideAvailable}
                      />
                    </div>
                    {overrideAvailable && (
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <div className="grid gap-1">
                          <Label htmlFor="ov_start" className="text-xs">Start Time</Label>
                          <Input
                            type="time"
                            id="ov_start"
                            className="border-border h-8 text-xs px-1.5"
                            value={overrideStart}
                            onChange={e => setOverrideStart(e.target.value)}
                          />
                          <span className="text-[9px] text-muted-foreground font-mono">{getFriendlyTime12Hour(overrideStart)}</span>
                        </div>
                        <div className="grid gap-1">
                          <Label htmlFor="ov_end" className="text-xs">End Time</Label>
                          <Input
                            type="time"
                            id="ov_end"
                            className="border-border h-8 text-xs px-1.5"
                            value={overrideEnd}
                            onChange={e => setOverrideEnd(e.target.value)}
                          />
                          <span className="text-[9px] text-muted-foreground font-mono">{getFriendlyTime12Hour(overrideEnd)}</span>
                        </div>
                      </div>
                    )}
                    <Button onClick={handleSaveOverride} variant="secondary" size="sm" className="w-full text-xs" disabled={!overrideDate}>
                      Set Override
                    </Button>

                    {/* Active overrides list */}
                    {overrideList.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-border space-y-2">
                        <h5 className="text-xs font-bold text-foreground">Current Overrides & Time Off:</h5>
                        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                          {overrideList.map(ov => {
                            const [yStr, mStr, dStr] = ov.override_date.split("-").map(Number);
                            const dateObj = new Date(yStr, mStr - 1, dStr);
                            const formattedDate = dateObj.toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            });
                            return (
                              <div key={ov.id} className="flex items-center justify-between text-xs p-2 border border-border rounded bg-card hover:bg-muted/5 transition-colors">
                                <div className="flex flex-col gap-0.5">
                                  <span className="font-semibold">{formattedDate}</span>
                                  <span>
                                    {ov.is_available ? (
                                      <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 py-0.5 px-1.5 rounded">
                                        {ov.start_time.slice(0, 5)} - {ov.end_time.slice(0, 5)}
                                      </span>
                                    ) : (
                                      <span className="text-[10px] text-rose-400 bg-rose-500/10 border border-rose-500/20 py-0.5 px-1.5 rounded">
                                        Time Off (Closed)
                                      </span>
                                    )}
                                  </span>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteOverride(ov.id)}
                                  className="h-6 w-6 text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Peak Booking Hours Widget */}
              <Card className="border border-border bg-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" /> Peak Booking Hours
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">Times of day with highest booking volume</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {peakHours.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center py-4">No booking data available</p>
                  ) : (
                    peakHours.map(({ label, count }) => (
                      <div key={label} className="p-3 rounded-lg bg-muted/20 border border-border flex items-center justify-between">
                        <span className="text-xs font-bold text-foreground">{label}</span>
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-none text-xs font-bold px-2 py-0.5 rounded-full">
                          {count} {count === 1 ? 'appt' : 'appts'}
                        </Badge>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Provider Modal */}
      {editingProvider && (
        <Dialog open={!!editingProvider} onOpenChange={(open) => !open && setEditingProvider(null)}>
          <DialogContent className="border-border bg-card">
            <form onSubmit={handleEditProvider}>
              <DialogHeader>
                <DialogTitle>Edit Provider</DialogTitle>
                <DialogDescription>Modify settings for {editingProvider.name}.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit_prov_name">Provider Name</Label>
                  <Input
                    id="edit_prov_name"
                    className="border-border"
                    value={editProvName}
                    onChange={e => setEditProvName(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit_prov_desc">Description / Specialty</Label>
                  <Input
                    id="edit_prov_desc"
                    className="border-border"
                    value={editProvDesc}
                    onChange={e => setEditProvDesc(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Services Offered</Label>
                  <div className="grid grid-cols-2 gap-2 border border-border p-3 rounded bg-muted/5 max-h-40 overflow-y-auto">
                    {services.length === 0 ? (
                      <span className="text-xs text-muted-foreground col-span-2">No services configured yet.</span>
                    ) : (
                      services.map(s => {
                        const isChecked = editProvServices.includes(s.id);
                        return (
                          <label key={s.id} className="flex items-center gap-2 text-xs cursor-pointer select-none text-foreground">
                            <input
                              type="checkbox"
                              className="rounded border-border bg-background text-primary focus:ring-ring"
                              checked={isChecked}
                              onChange={() => {
                                if (isChecked) {
                                  setEditProvServices(prev => prev.filter(id => id !== s.id));
                                } else {
                                  setEditProvServices(prev => [...prev, s.id]);
                                }
                              }}
                            />
                            <span>{s.name}</span>
                          </label>
                        );
                      })
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between p-2 border border-border rounded bg-muted/10 mt-2">
                  <span className="text-xs font-semibold">Active Status</span>
                  <Switch
                    checked={editProvActive}
                    onCheckedChange={setEditProvActive}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Service Modal */}
      {editingService && (
        <Dialog open={!!editingService} onOpenChange={(open) => !open && setEditingService(null)}>
          <DialogContent className="border-border bg-card">
            <form onSubmit={handleEditService}>
              <DialogHeader>
                <DialogTitle>Edit Service</DialogTitle>
                <DialogDescription>Modify settings for {editingService.name}.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit_serv_name">Service Name</Label>
                  <Input
                    id="edit_serv_name"
                    className="border-border"
                    value={editServName}
                    onChange={e => setEditServName(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit_serv_dur">Duration (Minutes)</Label>
                  <Input
                    type="number"
                    id="edit_serv_dur"
                    className="border-border"
                    value={editServDuration}
                    onChange={e => setEditServDuration(parseInt(e.target.value))}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit_serv_price">Price (INR)</Label>
                  <Input
                    type="number"
                    id="edit_serv_price"
                    className="border-border"
                    value={editServPrice}
                    onChange={e => setEditServPrice(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit_serv_desc">Description</Label>
                  <Input
                    id="edit_serv_desc"
                    className="border-border"
                    value={editServDesc}
                    onChange={e => setEditServDesc(e.target.value)}
                  />
                </div>
                <div className="flex items-center justify-between p-2 border border-border rounded bg-muted/10 mt-2">
                  <span className="text-xs font-semibold">Active Status</span>
                  <Switch
                    checked={editServActive}
                    onCheckedChange={setEditServActive}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Customer Asset & Medical/Service Records Slide-over Sheet */}
      <Sheet open={!!selectedAssetContact} onOpenChange={(open) => !open && setSelectedAssetContact(null)}>
        <SheetContent side="right" className="w-full sm:max-w-xl p-0 overflow-y-auto bg-card">
          <SheetHeader className="p-5 border-b border-border bg-card">
            <SheetTitle className="text-base font-semibold flex items-center gap-2">
              <ClipboardList className="h-4.5 w-4.5 text-primary" />
              {selectedAssetContact?.name || "Client"} — Records & History
            </SheetTitle>
            <SheetDescription className="text-xs">
              Inspect custom customer assets (e.g. dental teeth chart, vehicle records, pet logs), visit notes, and service history.
            </SheetDescription>
          </SheetHeader>
          <div className="p-5">
            {selectedAssetContact && account?.id && (
              <CustomerAssetDrawer
                contactId={selectedAssetContact.id}
                accountId={account.id}
                isOpen={true}
              />
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Reschedule Appointment Modal */}
      <Dialog open={!!rescheduleAppt} onOpenChange={(open) => !open && setRescheduleAppt(null)}>
        <DialogContent className="sm:max-w-[500px] border-border bg-card max-h-[90vh] overflow-y-auto">
          {rescheduleAppt && (
            <form onSubmit={handleConfirmReschedule}>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-foreground text-base">
                  <CalendarClock className="h-5 w-5 text-primary" />
                  Reschedule Appointment
                </DialogTitle>
                <DialogDescription className="text-xs">
                  Select a new date and time slot for {rescheduleAppt.contact?.name || "this client"}.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                {/* Current Booking Pill */}
                <div className="p-3 rounded-lg border border-border bg-muted/20 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Current Schedule:</span>
                    <span className="font-semibold text-rose-500/90 line-through">
                      {formatDateTime(rescheduleAppt.start_time)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>Service:</span>
                    <span className="font-medium text-foreground">{rescheduleAppt.service?.name} ({rescheduleAppt.service?.duration_minutes}m)</span>
                  </div>
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>Staff / Resource:</span>
                    <span className="font-medium text-foreground">{rescheduleAppt.provider?.name}</span>
                  </div>
                </div>

                {/* New Date Picker */}
                <div className="grid gap-1.5">
                  <Label htmlFor="rescheduleDate" className="text-xs font-semibold">New Date *</Label>
                  <Input
                    type="date"
                    id="rescheduleDate"
                    value={rescheduleDate}
                    onChange={(e) => {
                      setRescheduleDate(e.target.value);
                      setRescheduleSlot("");
                    }}
                    min={new Date().toISOString().split("T")[0]}
                    className="border-border cursor-pointer bg-background"
                    onClick={(e) => {
                      try {
                        e.currentTarget.showPicker?.();
                      } catch {}
                    }}
                    onFocus={(e) => {
                      try {
                        e.currentTarget.showPicker?.();
                      } catch {}
                    }}
                    required
                  />
                </div>

                {/* Slots Selector */}
                {rescheduleDate && (
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-semibold">Select New Time Slot *</Label>
                      {rescheduleSlots.length > 0 && (
                        <span className="text-[11px] text-muted-foreground font-medium">
                          {rescheduleSlots.length} available slots
                        </span>
                      )}
                    </div>

                    {rescheduleSlotsLoading ? (
                      <div className="p-4 rounded-lg border border-dashed border-border bg-muted/20 text-center">
                        <Loader2 className="h-4 w-4 animate-spin mx-auto text-primary mb-1.5" />
                        <p className="text-xs text-muted-foreground">Calculating available slots...</p>
                      </div>
                    ) : rescheduleSlots.length === 0 ? (
                      <div className="p-3.5 rounded-lg border border-dashed border-rose-500/30 bg-rose-500/5 text-center text-xs text-rose-500 flex items-center justify-center gap-1.5">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <span>No available slots for {rescheduleAppt.provider?.name} on this date.</span>
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-[180px] overflow-y-auto pr-1 border border-border/60 rounded-lg p-2.5 bg-muted/10">
                        {(() => {
                          const morning = rescheduleSlots.filter(s => parseInt(s.start_time.split(':')[0], 10) < 12);
                          const afternoon = rescheduleSlots.filter(s => {
                            const h = parseInt(s.start_time.split(':')[0], 10);
                            return h >= 12 && h < 17;
                          });
                          const evening = rescheduleSlots.filter(s => parseInt(s.start_time.split(':')[0], 10) >= 17);

                          return (
                            <>
                              {morning.length > 0 && (
                                <div className="space-y-1.5">
                                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                                    🌅 Morning ({morning.length})
                                  </span>
                                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
                                    {morning.map(slot => {
                                      const isSelected = rescheduleSlot === slot.start_time;
                                      return (
                                        <button
                                          key={slot.start_time}
                                          type="button"
                                          onClick={() => setRescheduleSlot(slot.start_time)}
                                          className={cn(
                                            "px-2 py-1.5 rounded-md text-xs font-medium border text-center transition-all",
                                            isSelected
                                              ? "bg-primary text-primary-foreground border-primary shadow-xs"
                                              : "bg-card border-border hover:bg-muted text-foreground"
                                          )}
                                        >
                                          {slot.formatted_time}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}

                              {afternoon.length > 0 && (
                                <div className="space-y-1.5">
                                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                                    ☀️ Afternoon ({afternoon.length})
                                  </span>
                                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
                                    {afternoon.map(slot => {
                                      const isSelected = rescheduleSlot === slot.start_time;
                                      return (
                                        <button
                                          key={slot.start_time}
                                          type="button"
                                          onClick={() => setRescheduleSlot(slot.start_time)}
                                          className={cn(
                                            "px-2 py-1.5 rounded-md text-xs font-medium border text-center transition-all",
                                            isSelected
                                              ? "bg-primary text-primary-foreground border-primary shadow-xs"
                                              : "bg-card border-border hover:bg-muted text-foreground"
                                          )}
                                        >
                                          {slot.formatted_time}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}

                              {evening.length > 0 && (
                                <div className="space-y-1.5">
                                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                                    🌙 Evening ({evening.length})
                                  </span>
                                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
                                    {evening.map(slot => {
                                      const isSelected = rescheduleSlot === slot.start_time;
                                      return (
                                        <button
                                          key={slot.start_time}
                                          type="button"
                                          onClick={() => setRescheduleSlot(slot.start_time)}
                                          className={cn(
                                            "px-2 py-1.5 rounded-md text-xs font-medium border text-center transition-all",
                                            isSelected
                                              ? "bg-primary text-primary-foreground border-primary shadow-xs"
                                              : "bg-card border-border hover:bg-muted text-foreground"
                                          )}
                                        >
                                          {slot.formatted_time}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                            </>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                )}

                {/* New Schedule Preview */}
                {rescheduleSlot && (
                  <div className="p-3 rounded-lg border border-emerald-500/30 bg-emerald-500/5 text-xs flex items-center justify-between text-emerald-600 dark:text-emerald-400">
                    <span className="font-semibold flex items-center gap-1.5">
                      <Check className="h-4 w-4" /> New Slot:
                    </span>
                    <span className="font-bold">
                      {new Date(`${rescheduleDate}T00:00:00`).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} at {getFriendlyTime12Hour(rescheduleSlot)}
                    </span>
                  </div>
                )}

                {/* WhatsApp Notification Toggle */}
                <div className="pt-2 border-t border-border flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="sendRescheduleWhatsApp"
                    checked={sendRescheduleWhatsApp}
                    onChange={(e) => setSendRescheduleWhatsApp(e.target.checked)}
                    className="mt-0.5 rounded border-border text-primary focus:ring-primary h-3.5 w-3.5 cursor-pointer"
                  />
                  <label htmlFor="sendRescheduleWhatsApp" className="text-[11px] text-muted-foreground cursor-pointer select-none">
                    <span className="font-semibold text-foreground flex items-center gap-1">
                      <MessageSquare className="h-3 w-3 text-emerald-500" /> Send WhatsApp reschedule notification to client
                    </span>
                    <span>Automatically updates the client with their new appointment timing.</span>
                  </label>
                </div>
              </div>

              <DialogFooter className="gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setRescheduleAppt(null)}
                  className="border-border text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!rescheduleSlot || isRescheduling}
                  className="text-xs min-w-[140px] bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {isRescheduling ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                      Rescheduling...
                    </>
                  ) : (
                    "Confirm Reschedule"
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Appointment Details & Action Slide-over Sheet */}
      <Sheet
        open={!!detailAppt}
        onOpenChange={(open) => {
          if (!open) {
            setDetailAppt(null);
            setIsEditingNotes(false);
          }
        }}
      >
        <SheetContent side="right" className="w-full sm:max-w-md p-0 overflow-y-auto bg-card flex flex-col justify-between">
          {detailAppt && (
            <>
              <div>
                {/* Sheet Header */}
                <SheetHeader className="p-5 border-b border-border bg-card">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-11 w-11 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center shrink-0 border border-primary/20">
                        {(detailAppt.contact?.name || "C").slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <SheetTitle className="text-base font-bold text-foreground truncate">
                          {detailAppt.contact?.name || "Customer"}
                        </SheetTitle>
                        <p className="text-xs text-muted-foreground font-mono">
                          {detailAppt.contact?.phone || "No phone recorded"}
                        </p>
                      </div>
                    </div>
                    <div>{getSimulatedStatusBadge(detailAppt)}</div>
                  </div>
                  <SheetDescription className="text-xs pt-1">
                    Booking ID: <span className="font-mono text-[11px]">{detailAppt.id.slice(0, 8)}</span>
                  </SheetDescription>
                </SheetHeader>

                {/* Sheet Body Content */}
                <div className="p-5 space-y-5">
                  {/* Quick WhatsApp & Phone Bar */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {detailAppt.conversation_id ? (
                      <a
                        href={`/inbox?c=${detailAppt.conversation_id}`}
                        className={buttonVariants({
                          variant: "outline",
                          size: "sm",
                          className: "flex-1 h-8 text-xs gap-1.5 border-primary/30 text-primary hover:bg-primary/10",
                        })}
                      >
                        <MessageSquare className="h-3.5 w-3.5" />
                        <span>Chat in Inbox</span>
                      </a>
                    ) : detailAppt.contact?.phone ? (
                      <a
                        href={`https://wa.me/${detailAppt.contact.phone.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noreferrer noopener"
                        className={buttonVariants({
                          variant: "outline",
                          size: "sm",
                          className: "flex-1 h-8 text-xs gap-1.5 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10",
                        })}
                      >
                        <MessageSquare className="h-3.5 w-3.5" />
                        <span>WhatsApp</span>
                        <ArrowUpRight className="h-3 w-3 opacity-70" />
                      </a>
                    ) : null}

                    {detailAppt.contact?.phone && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs gap-1.5 border-border text-muted-foreground hover:text-foreground"
                        onClick={() => {
                          navigator.clipboard.writeText(detailAppt.contact.phone);
                          setCopiedPhone(true);
                          setTimeout(() => setCopiedPhone(false), 2000);
                        }}
                        title="Copy Phone Number"
                      >
                        {copiedPhone ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                        <span>{copiedPhone ? "Copied" : "Copy"}</span>
                      </Button>
                    )}
                  </div>

                  {/* Appointment Details Grid */}
                  <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Appointment Schedule
                    </h4>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-[10px] text-muted-foreground uppercase block">Date & Time</span>
                        <span className="font-semibold text-foreground flex items-center gap-1 mt-0.5">
                          <Clock className="h-3.5 w-3.5 text-primary" />
                          {formatDateTime(detailAppt.start_time)}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] text-muted-foreground uppercase block">Duration</span>
                        <span className="font-semibold text-foreground block mt-0.5">
                          {detailAppt.service?.duration_minutes || 30} minutes
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] text-muted-foreground uppercase block">Service</span>
                        <span className="font-semibold text-foreground block mt-0.5 truncate">
                          {detailAppt.service?.name}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] text-muted-foreground uppercase block">Resource / Provider</span>
                        <span className="font-semibold text-foreground block mt-0.5 truncate">
                          {detailAppt.provider?.name}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status Transition Control */}
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-foreground">Update Status</Label>
                    <div className="grid grid-cols-3 gap-1.5">
                      <Button
                        type="button"
                        variant={detailAppt.status === "confirmed" ? "default" : "outline"}
                        size="sm"
                        className={cn(
                          "h-8 text-xs font-medium border-border",
                          detailAppt.status === "confirmed" ? "bg-sky-600 hover:bg-sky-500 text-white" : ""
                        )}
                        onClick={() => handleStatusChange("confirmed")}
                      >
                        Confirmed
                      </Button>
                      <Button
                        type="button"
                        variant={detailAppt.status === "noshow" ? "default" : "outline"}
                        size="sm"
                        className={cn(
                          "h-8 text-xs font-medium border-border",
                          detailAppt.status === "noshow" ? "bg-amber-600 hover:bg-amber-500 text-white" : ""
                        )}
                        onClick={() => handleStatusChange("noshow")}
                      >
                        No-Show
                      </Button>
                      <Button
                        type="button"
                        variant={detailAppt.status === "cancelled" ? "default" : "outline"}
                        size="sm"
                        className={cn(
                          "h-8 text-xs font-medium border-border",
                          detailAppt.status === "cancelled" ? "bg-rose-600 hover:bg-rose-500 text-white" : ""
                        )}
                        onClick={() => handleStatusChange("cancelled")}
                      >
                        Cancelled
                      </Button>
                    </div>
                  </div>

                  {/* Notes Section with Inline Edit */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                        <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                        Appointment Notes
                      </Label>
                      {!isEditingNotes && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-6 text-xs text-primary hover:text-primary/90"
                          onClick={() => {
                            setEditNotesValue(detailAppt.notes || "");
                            setIsEditingNotes(true);
                          }}
                        >
                          <Edit2 className="h-3 w-3 mr-1" />
                          {detailAppt.notes ? "Edit" : "Add Note"}
                        </Button>
                      )}
                    </div>

                    {isEditingNotes ? (
                      <div className="space-y-2">
                        <Textarea
                          value={editNotesValue}
                          onChange={(e) => setEditNotesValue(e.target.value)}
                          placeholder="Enter notes for this appointment..."
                          className="text-xs border-border min-h-[70px]"
                        />
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() => setIsEditingNotes(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            disabled={isSavingNotes}
                            className="h-7 text-xs bg-primary text-primary-foreground"
                            onClick={handleSaveNotes}
                          >
                            {isSavingNotes ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : null}
                            Save Note
                          </Button>
                        </div>
                      </div>
                    ) : detailAppt.notes ? (
                      <div className="bg-primary/5 border border-primary/15 rounded-lg p-3 text-xs text-foreground italic">
                        “{detailAppt.notes}”
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground italic py-1">No notes recorded for this appointment.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Sheet Footer Actions */}
              <div className="p-4 border-t border-border bg-card space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-9 text-xs gap-1.5 border-border"
                    onClick={() => {
                      handleOpenReschedule(detailAppt);
                    }}
                  >
                    <CalendarClock className="h-3.5 w-3.5 text-primary" />
                    <span>Reschedule</span>
                  </Button>

                  {detailAppt.contact?.id && (
                    <Button
                      type="button"
                      variant="outline"
                      className="h-9 text-xs gap-1.5 border-border"
                      onClick={() => {
                        setSelectedAssetContact({ id: detailAppt.contact!.id, name: detailAppt.contact?.name || "Client" });
                      }}
                    >
                      <ClipboardList className="h-3.5 w-3.5 text-primary" />
                      <span>View Records</span>
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        description={confirmDialog.description}
        confirmText={confirmDialog.confirmText}
        variant={confirmDialog.variant}
      />
    </div>
  );
}
