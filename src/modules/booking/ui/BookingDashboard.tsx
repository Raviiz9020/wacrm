"use client";

import React, { useState, useEffect } from "react";
import { Calendar, Plus, Clock, User, Trash2, CalendarX2, CheckCircle2, AlertCircle } from "lucide-react";
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
  } = useBooking();

  const supabase = createClient();

  // Local state
  const [activeTab, setActiveTab] = useState("appointments");
  const [contacts, setContacts] = useState<{ id: string; name: string; phone: string }[]>([]);
  
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
                  <Select value={bookContactId} onValueChange={setBookContactId} required>
                    <SelectTrigger className="border-border">
                      <SelectValue placeholder="Choose a client..." />
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
                  <Select value={bookProviderId} onValueChange={setBookProviderId} required>
                    <SelectTrigger className="border-border">
                      <SelectValue placeholder="Choose staff/bay..." />
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
                  <Select value={bookServiceId} onValueChange={setBookServiceId} required>
                    <SelectTrigger className="border-border">
                      <SelectValue placeholder="Choose service..." />
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
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle>Appointments Calendar</CardTitle>
              <CardDescription>View, cancel, and manage client appointment bookings.</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="py-10 text-center text-muted-foreground animate-pulse">Loading appointments...</div>
              ) : appointments.length === 0 ? (
                <div className="py-10 text-center text-muted-foreground">
                  <CalendarX2 className="mx-auto h-8 w-8 text-muted-foreground/50 mb-3" />
                  No upcoming appointments booked.
                </div>
              ) : (
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
                    {appointments.map(appt => (
                      <TableRow key={appt.id} className="border-border hover:bg-muted/30">
                        <TableCell>
                          <div className="font-medium text-foreground">{appt.contact?.name || "Unknown"}</div>
                          <div className="text-xs text-muted-foreground">{appt.contact?.phone || "No phone"}</div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{appt.service?.name}</div>
                          <div className="text-xs text-muted-foreground">{appt.service?.duration_minutes} mins</div>
                        </TableCell>
                        <TableCell className="font-medium text-muted-foreground">
                          {appt.provider?.name}
                        </TableCell>
                        <TableCell className="font-medium">
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
                              className="text-muted-foreground hover:text-rose-400"
                              onClick={() => cancel(appt.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
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
                <Card key={p.id} className="border-border bg-card hover:bg-muted/10 transition-colors">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-semibold">{p.name}</CardTitle>
                    <User className="h-4 w-4 text-muted-foreground" />
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
                      <Label htmlFor="serv_price">Price (USD)</Label>
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
                <Card key={s.id} className="border-border bg-card hover:bg-muted/10 transition-colors">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-semibold">{s.name}</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground mb-3">{s.description || "No description set"}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{s.duration_minutes} mins</Badge>
                      {s.price && <Badge variant="outline" className="border-primary/20 text-primary">${s.price}</Badge>}
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
                <Select value={schedProviderId} onValueChange={setSchedProviderId}>
                  <SelectTrigger className="border-border">
                    <SelectValue placeholder="Select staff..." />
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
    </div>
  );
}
