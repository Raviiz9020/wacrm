"use client";

import React, { useState, useEffect } from "react";
import { Calendar, Plus, Clock, User, Trash2, CalendarX2, CheckCircle2, AlertCircle, Edit2, Search, SlidersHorizontal, MessageSquare, CalendarDays, List, XCircle } from "lucide-react";
import { useBooking, type Provider, type Service, type Appointment } from "../hooks/useBooking"; // corrected hook path
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import type { TimeSlot } from "../services/slotGenerator";

export function BookingDashboard() {
  const {
    providers,
    services,
    appointments,
    loading,
    error,
    addProvider,
    addService,
    mapProviderService,
    saveWeeklySchedule,
    saveScheduleOverride,
    getSlots,
    bookAppointment,
    cancel,
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
  
  // Edit States
  const [editingProvider, setEditingProvider] = useState<Provider | null>(null);
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

  // Scheduler Configuration States
  const [schedProviderId, setSchedProviderId] = useState("");
  const [weeklySchedules, setWeeklySchedules] = useState<{ [day: number]: { active: boolean; start: string; end: string } }>({
    1: { active: true, start: "09:00", end: "17:00" },
    2: { active: true, start: "09:00", end: "17:00" },
    3: { active: true, start: "09:00", end: "17:00" },
    4: { active: true, start: "09:00", end: "17:00" },
    5: { active: true, start: "09:00", end: "17:00" },
    0: { active: false, start: "09:00", end: "17:00" },
    6: { active: false, start: "09:00", end: "17:00" },
  });
  const [overrideDate, setOverrideDate] = useState("");
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
        .eq("provider_id", schedProviderId);

      const newWeekly = { ...weeklySchedules };
      // Reset all days to closed first
      for (let i = 0; i <= 6; i++) {
        newWeekly[i] = { active: false, start: "09:00", end: "17:00" };
      }
      
      // Populate active days
      if (weekly && weekly.length > 0) {
        weekly.forEach(w => {
          newWeekly[w.day_of_week] = {
            active: true,
            start: w.start_time.slice(0, 5),
            end: w.end_time.slice(0, 5),
          };
        });
      }
      setWeeklySchedules(newWeekly);
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
      setEditingProvider(null);
    } catch (err) {
      alert("Failed to update resource provider.");
    }
  };

  const handleDeleteProvider = async (id: string) => {
    if (!confirm("Are you sure you want to delete this provider? All their weekly schedules and overrides will be lost.")) return;
    try {
      await deleteProvider(id);
    } catch (err) {
      alert("Failed to delete provider.");
    }
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

  const handleDeleteService = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    try {
      await deleteService(id);
    } catch (err) {
      alert("Failed to delete service.");
    }
  };

  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookProviderId || !bookServiceId || !bookContactId || !bookDate || !bookSlot) return;
    try {
      await bookAppointment(bookProviderId, bookServiceId, bookContactId, bookDate, bookSlot, bookNotes);
      setBookProviderId("");
      setBookServiceId("");
      setBookContactId("");
      setBookDate("");
      setBookSlot("");
      setBookNotes("");
      setIsBookOpen(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Booking conflict occurred.");
    }
  };

  const handleSaveSchedules = async () => {
    if (!schedProviderId) return;
    try {
      const schedulesPayload = Object.keys(weeklySchedules)
        .map(Number)
        .filter(day => weeklySchedules[day].active)
        .map(day => ({
          day_of_week: day,
          start_time: `${weeklySchedules[day].start}:00`,
          end_time: `${weeklySchedules[day].end}:00`,
        }));
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
    } catch (err) {
      alert("Failed to save schedule override.");
    }
  };

  const formatDateTime = (isoStr: string) => {
    const d = new Date(isoStr);
    const dateStr = d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
    const timeStr = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    return `${dateStr} at ${timeStr}`;
  };

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Booking & Availability</h2>
          <p className="text-sm text-muted-foreground">
            Onboard resources, set business hours, manage availability, and schedule customer appointments.
          </p>
        </div>
        
        {/* Book Appointment Action */}
        <Dialog open={isBookOpen} onOpenChange={setIsBookOpen}>
          <DialogTrigger render={<Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground" />}>
            <Plus className="h-4 w-4" /> Book Appointment
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] border-border bg-card">
            <form onSubmit={handleBookAppointment}>
              <DialogHeader>
                <DialogTitle>Schedule Appointment</DialogTitle>
                <DialogDescription>
                  Manually book an appointment slot for a CRM contact.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="contact">Select Contact</Label>
                  <Select value={bookContactId} onValueChange={val => setBookContactId(val || "")} required>
                    <SelectTrigger className="border-border">
                      <span className="text-sm text-foreground">
                        {contacts.find(c => c.id === bookContactId)
                          ? `${contacts.find(c => c.id === bookContactId)?.name} (${contacts.find(c => c.id === bookContactId)?.phone})`
                          : "Choose a client..."}
                      </span>
                    </SelectTrigger>
                    <SelectContent className="border-border bg-card">
                      {contacts.map(c => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name} ({c.phone})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="provider">Resource Provider</Label>
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
                <div className="grid gap-2">
                  <Label htmlFor="service">Service</Label>
                  <Select value={bookServiceId} onValueChange={val => setBookServiceId(val || "")} required>
                    <SelectTrigger className="border-border">
                      <span className="text-sm text-foreground">
                        {services.find(s => s.id === bookServiceId)
                          ? `${services.find(s => s.id === bookServiceId)?.name} (${services.find(s => s.id === bookServiceId)?.duration_minutes}m)`
                          : "Choose service..."}
                      </span>
                    </SelectTrigger>
                    <SelectContent className="border-border bg-card">
                      {services.map(s => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.name} ({s.duration_minutes}m)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    type="date"
                    id="date"
                    className="border-border"
                    value={bookDate}
                    onChange={e => setBookDate(e.target.value)}
                    required
                  />
                </div>
                {bookProviderId && bookServiceId && bookDate && (
                  <div className="grid gap-2">
                    <Label>Select Time Slot</Label>
                    {slotsLoading ? (
                      <p className="text-xs text-muted-foreground animate-pulse">Calculating available slots...</p>
                    ) : availableSlots.length === 0 ? (
                      <p className="text-xs text-rose-300 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> No slots available for this resource.
                      </p>
                    ) : (
                      <div className="grid grid-cols-3 gap-2 max-h-[120px] overflow-y-auto p-1 border border-border rounded-md">
                        {availableSlots.map(slot => (
                          <Button
                            key={slot.start_time}
                            type="button"
                            variant={bookSlot === slot.start_time ? "default" : "outline"}
                            size="sm"
                            className="text-xs border-border"
                            onClick={() => setBookSlot(slot.start_time)}
                          >
                            {slot.formatted_time}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                <div className="grid gap-2">
                  <Label htmlFor="notes">Notes</Label>
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
                <Button type="submit" disabled={!bookSlot}>Confirm Booking</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="border border-border bg-muted">
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="availability">Availability Scheduler</TabsTrigger>
        </TabsList>

        {/* Tab 1: Appointments List */}
        <TabsContent value="appointments" className="space-y-4">
          {/* Filters & Search Control Bar */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-muted/20 p-4 border border-border rounded-lg">
            <div className="flex flex-1 flex-wrap gap-2 items-center">
              {/* Search Bar */}
              <div className="relative w-full sm:w-[240px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search customer, provider, service..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-8 border-border bg-card text-foreground"
                />
              </div>

              {/* Provider Selector */}
              <Select value={filterProviderId} onValueChange={val => setFilterProviderId(val || "all")}>
                <SelectTrigger className="w-[160px] border-border bg-card">
                  <span className="text-sm text-foreground">
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
                <SelectTrigger className="w-[140px] border-border bg-card">
                  <span className="text-sm text-foreground">
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
                <SelectTrigger className="w-[140px] border-border bg-card">
                  <span className="text-sm text-foreground">
                    {filterStatus === "all" ? "All Statuses" : filterStatus === "confirmed" ? "Confirmed" : "Cancelled"}
                  </span>
                </SelectTrigger>
                <SelectContent className="border-border bg-card">
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="all">All Statuses</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-muted p-1 border border-border rounded-lg self-start md:self-auto">
              <Button
                variant={viewMode === "agenda" ? "default" : "ghost"}
                size="sm"
                className="h-8 text-xs gap-1"
                onClick={() => setViewMode("agenda")}
              >
                <List className="h-3.5 w-3.5" /> Agenda
              </Button>
              <Button
                variant={viewMode === "timeline" ? "default" : "ghost"}
                size="sm"
                className="h-8 text-xs gap-1"
                onClick={() => setViewMode("timeline")}
              >
                <CalendarDays className="h-3.5 w-3.5" /> Daily Roster
              </Button>
              <Button
                variant={viewMode === "table" ? "default" : "ghost"}
                size="sm"
                className="h-8 text-xs gap-1"
                onClick={() => setViewMode("table")}
              >
                <SlidersHorizontal className="h-3.5 w-3.5" /> Table
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="py-20 text-center text-muted-foreground animate-pulse">Loading appointments...</div>
          ) : filteredAppointments.length === 0 ? (
            <div className="py-20 text-center text-muted-foreground border border-dashed border-border rounded-lg bg-card">
              <CalendarX2 className="mx-auto h-8 w-8 text-muted-foreground/40 mb-3" />
              No appointments match the selected filters.
            </div>
          ) : viewMode === "agenda" ? (
            /* Grouped Agenda View */
            <div className="space-y-6">
              {Object.keys(groupedAppts).map(dateStr => (
                <div key={dateStr} className="space-y-3">
                  {/* Daily Header */}
                  <div className="flex items-center gap-2 border-b border-border pb-1">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-foreground text-sm">
                      {formatDateHeader(groupedAppts[dateStr][0].start_time)}
                    </span>
                    <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full font-semibold">
                      {groupedAppts[dateStr].length} {groupedAppts[dateStr].length === 1 ? 'booking' : 'bookings'}
                    </span>
                  </div>

                  {/* Cards list */}
                  <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                    {groupedAppts[dateStr].map(appt => (
                      <Card key={appt.id} className="border-border bg-card hover:bg-muted/10 transition-all">
                        <CardContent className="p-4 flex justify-between items-start gap-4 h-full min-h-[140px]">
                          <div className="space-y-3 flex-1 flex flex-col justify-between h-full">
                            <div>
                              {/* Time & Provider row */}
                              <div className="flex flex-wrap items-center gap-1.5 mb-2">
                                <span className="text-[10px] font-bold text-primary bg-primary/15 px-2 py-0.5 rounded-md flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {formatTimeStr(appt.start_time)} - {formatTimeStr(appt.end_time)}
                                </span>
                                <span className="text-[10px] text-muted-foreground font-semibold bg-muted px-2 py-0.5 rounded-md">
                                  {appt.provider?.name}
                                </span>
                              </div>

                              {/* Customer name + chat icon */}
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="font-semibold text-foreground text-sm">{appt.contact?.name || "Unknown"}</h4>
                                  {appt.conversation_id && (
                                    <a
                                      href={`/inbox?c=${appt.conversation_id}`}
                                      className="text-primary hover:text-primary/80 transition-colors p-0.5 rounded hover:bg-primary/10"
                                      title="Open Chat in Inbox"
                                    >
                                      <MessageSquare className="h-3.5 w-3.5" />
                                    </a>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground">{appt.contact?.phone || "No phone"}</p>
                              </div>
                            </div>

                            {/* Service and Notes */}
                            <div className="space-y-1">
                              <div className="text-xs text-muted-foreground flex items-center gap-2">
                                <span className="font-medium text-foreground">{appt.service?.name}</span>
                                <span>•</span>
                                <span>{appt.service?.duration_minutes} mins</span>
                              </div>
                              {appt.notes && (
                                <p className="text-[11px] text-muted-foreground italic truncate max-w-[220px]" title={appt.notes}>
                                  "{appt.notes}"
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Status and Action Column */}
                          <div className="flex flex-col items-end justify-between h-full min-h-[110px]">
                            <Badge
                              variant={
                                appt.status === "confirmed"
                                  ? "default"
                                  : appt.status === "cancelled"
                                  ? "destructive"
                                  : "outline"
                              }
                              className={
                                appt.status === "confirmed"
                                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                  : ""
                              }
                            >
                              {appt.status}
                            </Badge>

                            {appt.status === "confirmed" && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10 rounded-lg"
                                onClick={() => {
                                  if (confirm("Are you sure you want to cancel this appointment?")) {
                                    cancel(appt.id);
                                  }
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
                                className="h-8 w-8 text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10 rounded-lg"
                                onClick={() => {
                                  if (confirm("Are you sure you want to permanently delete this cancelled appointment?")) {
                                    deleteAppointment(appt.id);
                                  }
                                }}
                                title="Delete Appointment permanently"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : viewMode === "timeline" ? (
            /* Roster Timeline View */
            <div className="space-y-4">
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

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {providers.filter(p => p.is_active).map(provider => {
                  const provAppts = sortedAppts.filter(appt => {
                    if (appt.provider?.id !== provider.id) return false;
                    const apptDate = new Date(appt.start_time);
                    const apptDateStr = apptDate.getFullYear() + "-" + String(apptDate.getMonth() + 1).padStart(2, "0") + "-" + String(apptDate.getDate()).padStart(2, "0");
                    return apptDateStr === selectedTimelineDate;
                  });

                  return (
                    <Card key={provider.id} className="border-border bg-card flex flex-col min-h-[300px]">
                      <CardHeader className="p-3.5 border-b border-border flex flex-row items-center justify-between space-y-0 bg-muted/10">
                        <div>
                          <CardTitle className="text-sm font-bold text-foreground">{provider.name}</CardTitle>
                          <CardDescription className="text-[11px] truncate max-w-[150px]">{provider.description || "General Provider"}</CardDescription>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-primary hover:bg-primary/10 rounded-md"
                          onClick={() => {
                            setBookProviderId(provider.id);
                            setBookDate(selectedTimelineDate);
                            setIsBookOpen(true);
                          }}
                          title="Book slot for this provider"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </CardHeader>
                      <CardContent className="p-3 flex-1 space-y-3 bg-card overflow-y-auto">
                        {provAppts.length === 0 ? (
                          <div className="h-full flex flex-col items-center justify-center text-muted-foreground/60 text-xs py-16 text-center">
                            <CalendarX2 className="h-6 w-6 mb-2 text-muted-foreground/30" />
                            No bookings today
                          </div>
                        ) : (
                          provAppts.map(appt => (
                            <Card key={appt.id} className="border-border bg-muted/20 hover:bg-muted/40 transition-colors">
                              <div className="p-3 space-y-2">
                                <div className="flex justify-between items-start gap-1">
                                  <span className="text-[9px] font-bold text-primary bg-primary/15 px-1.5 py-0.5 rounded">
                                    {formatTimeStr(appt.start_time)} - {formatTimeStr(appt.end_time)}
                                  </span>
                                  <Badge
                                    variant={appt.status === "confirmed" ? "default" : "destructive"}
                                    className={`text-[8px] px-1 py-0.5 ${appt.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : ''}`}
                                  >
                                    {appt.status}
                                  </Badge>
                                </div>
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-xs font-semibold text-foreground">{appt.contact?.name || "Unknown"}</span>
                                    {appt.conversation_id && (
                                      <a
                                        href={`/inbox?c=${appt.conversation_id}`}
                                        className="text-primary hover:text-primary/80"
                                      >
                                        <MessageSquare className="h-3 w-3" />
                                      </a>
                                    )}
                                  </div>
                                  <p className="text-[10px] text-muted-foreground">{appt.service?.name} ({appt.service?.duration_minutes}m)</p>
                                </div>
                                {appt.status === "confirmed" && (
                                  <div className="flex justify-end pt-1">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6 text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10 rounded-md"
                                      onClick={() => {
                                        if (confirm("Are you sure you want to cancel this appointment?")) {
                                          cancel(appt.id);
                                        }
                                      }}
                                      title="Cancel Appointment"
                                    >
                                      <XCircle className="h-3.5 w-3.5" />
                                    </Button>
                                  </div>
                                )}

                                {appt.status === "cancelled" && (
                                  <div className="flex justify-end pt-1">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6 text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10 rounded-md"
                                      onClick={() => {
                                        if (confirm("Are you sure you want to permanently delete this cancelled appointment?")) {
                                          deleteAppointment(appt.id);
                                        }
                                      }}
                                      title="Delete Appointment permanently"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </Card>
                          ))
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Traditional Table View (Original with improvements) */
            <Card className="border-border bg-card">
              <CardContent className="p-0">
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
                    {sortedAppts.map(appt => (
                      <TableRow key={appt.id} className="border-border hover:bg-muted/30">
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <span className="font-medium text-foreground text-sm">{appt.contact?.name || "Unknown"}</span>
                            {appt.conversation_id && (
                              <a
                                href={`/inbox?c=${appt.conversation_id}`}
                                className="text-primary hover:text-primary/80 transition-colors"
                              >
                                <MessageSquare className="h-3.5 w-3.5" />
                              </a>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">{appt.contact?.phone || "No phone"}</div>
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
                          <Badge
                            variant={
                              appt.status === "confirmed"
                                ? "default"
                                : appt.status === "cancelled"
                                ? "destructive"
                                : "outline"
                            }
                            className={
                              appt.status === "confirmed"
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                : ""
                            }
                          >
                            {appt.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {appt.status === "confirmed" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-muted-foreground hover:text-rose-400 rounded-lg h-8 w-8 hover:bg-rose-500/10"
                              onClick={() => {
                                if (confirm("Are you sure you want to cancel this appointment?")) {
                                  cancel(appt.id);
                                }
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
                                if (confirm("Are you sure you want to permanently delete this cancelled appointment?")) {
                                  deleteAppointment(appt.id);
                                }
                              }}
                              title="Delete Appointment permanently"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => {
                          setEditingProvider(p);
                          setEditProvName(p.name);
                          setEditProvDesc(p.description || "");
                          setEditProvActive(p.is_active);
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
                    <div className="mt-4">
                      <Badge variant="outline" className={p.is_active ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10" : ""}>
                        {p.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
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
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{s.duration_minutes} mins</Badge>
                      {s.price && <Badge variant="outline" className="border-primary/20 text-primary">₹{s.price}</Badge>}
                      <Badge variant="outline" className={s.is_active ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10" : ""}>
                        {s.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Tab 4: Availability Scheduler Configuration */}
        <TabsContent value="availability" className="space-y-4">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle>Availability Settings</CardTitle>
              <CardDescription>Select a resource provider to configure active schedules and vacations.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-2 max-w-[280px]">
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
                <div className="grid gap-6 md:grid-cols-2 pt-4 border-t border-border">
                  {/* Weekly Schedules */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-foreground">Weekly Recurring Schedule</h4>
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
                        <div key={day} className="flex items-center justify-between gap-4 p-2 border border-border rounded-md bg-muted/20">
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={weeklySchedules[day]?.active || false}
                              onCheckedChange={checked => {
                                setWeeklySchedules(prev => ({
                                  ...prev,
                                  [day]: { ...prev[day], active: checked },
                                }));
                              }}
                            />
                            <span className="text-sm font-medium">{label}</span>
                          </div>
                          
                          {weeklySchedules[day]?.active && (
                            <div className="flex items-center gap-2">
                              <Input
                                type="time"
                                className="w-[100px] border-border h-8 text-xs"
                                value={weeklySchedules[day].start}
                                onChange={e => {
                                  setWeeklySchedules(prev => ({
                                    ...prev,
                                    [day]: { ...prev[day], start: e.target.value },
                                  }));
                                }}
                              />
                              <span className="text-xs text-muted-foreground">to</span>
                              <Input
                                type="time"
                                className="w-[100px] border-border h-8 text-xs"
                                value={weeklySchedules[day].end}
                                onChange={e => {
                                  setWeeklySchedules(prev => ({
                                    ...prev,
                                    [day]: { ...prev[day], end: e.target.value },
                                  }));
                                }}
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    <Button onClick={handleSaveSchedules} size="sm">Save Business Hours</Button>
                  </div>

                  {/* Schedule Overrides */}
                  <div className="space-y-4 p-4 border border-border rounded-md bg-muted/10 h-fit">
                    <h4 className="text-sm font-bold text-foreground">Schedule Overrides & Time Off</h4>
                    <p className="text-xs text-muted-foreground">Define vacations, leaves, or temporary hours.</p>
                    <div className="grid gap-3 pt-2">
                      <div className="grid gap-1">
                        <Label htmlFor="ov_date">Select Date</Label>
                        <Input
                          type="date"
                          id="ov_date"
                          className="border-border"
                          value={overrideDate}
                          onChange={e => setOverrideDate(e.target.value)}
                        />
                      </div>
                      <div className="flex items-center justify-between p-2 border border-border rounded bg-card mt-2">
                        <span className="text-xs font-semibold">Available for Booking?</span>
                        <Switch
                          checked={overrideAvailable}
                          onCheckedChange={setOverrideAvailable}
                        />
                      </div>
                      {overrideAvailable && (
                        <div className="grid grid-cols-2 gap-2 pt-2">
                          <div className="grid gap-1">
                            <Label htmlFor="ov_start" className="text-xs">Start Time</Label>
                            <Input
                              type="time"
                              id="ov_start"
                              className="border-border h-8 text-xs"
                              value={overrideStart}
                              onChange={e => setOverrideStart(e.target.value)}
                            />
                          </div>
                          <div className="grid gap-1">
                            <Label htmlFor="ov_end" className="text-xs">End Time</Label>
                            <Input
                              type="time"
                              id="ov_end"
                              className="border-border h-8 text-xs"
                              value={overrideEnd}
                              onChange={e => setOverrideEnd(e.target.value)}
                            />
                          </div>
                        </div>
                      )}
                      <Button onClick={handleSaveOverride} variant="secondary" size="sm" className="mt-2" disabled={!overrideDate}>
                        Set Override
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
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
    </div>
  );
}
