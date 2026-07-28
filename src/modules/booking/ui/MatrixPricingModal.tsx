"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SlidersHorizontal, Plus, Trash2, Tag, Clock, IndianRupee } from "lucide-react";
import { getMatrixRulesForService, upsertMatrixRule, deleteMatrixRule } from "../services/matrixPricingService";
import type { BookingServicePriceMatrix } from "@/types";

interface MatrixPricingModalProps {
  accountId: string;
  serviceId: string;
  serviceName: string;
  basePrice: number;
  currency: string;
}

export function MatrixPricingModal({
  accountId,
  serviceId,
  serviceName,
  basePrice,
  currency = "INR",
}: MatrixPricingModalProps) {
  const currencySymbol = currency === "USD" ? "$" : (currency === "INR" || currency === "₹" ? "₹" : currency);
  const [open, setOpen] = useState(false);
  const [rules, setRules] = useState<BookingServicePriceMatrix[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Form inputs
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState<number>(basePrice);
  const [duration, setDuration] = useState<number | "">("");

  const loadRules = async () => {
    if (!accountId || !serviceId) return;
    setLoading(true);
    try {
      const data = await getMatrixRulesForService(accountId, serviceId);
      setRules(data);
    } catch (err) {
      console.error("Failed to load matrix rules:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      loadRules();
    }
  }, [open, accountId, serviceId]);

  const handleAddRule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category.trim() || price < 0) return;

    try {
      await upsertMatrixRule({
        accountId,
        serviceId,
        attributeKey: "service_variant",
        attributeValue: category.trim(),
        price,
        durationMinutes: duration ? Number(duration) : null,
      });
      setCategory("");
      setPrice(basePrice);
      setDuration("");
      await loadRules();
    } catch (err) {
      console.error("Failed to save matrix rule:", err);
    }
  };

  const handleDeleteRule = async (ruleId: string) => {
    try {
      await deleteMatrixRule(accountId, ruleId);
      await loadRules();
    } catch (err) {
      console.error("Failed to delete matrix rule:", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" size="sm" className="gap-1.5 text-xs font-medium" />}>
        <SlidersHorizontal className="w-3.5 h-3.5 text-primary" />
        Matrix Prices {rules.length > 0 && <Badge variant="secondary" className="px-1.5 py-0 text-[10px] ml-0.5">{rules.length}</Badge>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl w-full max-w-2xl p-6">
        <DialogHeader className="pb-2">
          <DialogTitle className="flex items-center gap-2 text-base font-semibold">
            <SlidersHorizontal className="w-4 h-4 text-primary" />
            Dynamic Service Matrix Pricing — {serviceName}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Configure variant pricing rules based on service tier, asset size, or case complexity. Default Base Service Price: <strong className="text-foreground">{currencySymbol}{basePrice}</strong>.
          </DialogDescription>
        </DialogHeader>

        {/* Add Rule Form */}
        <form onSubmit={handleAddRule} className="bg-muted/40 p-3.5 rounded-xl border space-y-3">
          <p className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5 text-primary" /> Add Price Rule / Variant
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label className="text-[11px] font-medium text-muted-foreground">Category / Variant Name</Label>
              <Input
                placeholder="e.g. Standard / Premium / Variant Name"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="h-9 text-xs bg-background"
                required
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[11px] font-medium text-muted-foreground">Price ({currencySymbol})</Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="h-9 text-xs bg-background font-medium"
                required
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[11px] font-medium text-muted-foreground">Duration Override (mins)</Label>
              <Input
                type="number"
                placeholder="Optional"
                value={duration}
                onChange={(e) => setDuration(e.target.value === "" ? "" : Number(e.target.value))}
                className="h-9 text-xs bg-background"
              />
            </div>
          </div>
          <div className="flex justify-end pt-1">
            <Button type="submit" size="sm" className="h-8 text-xs gap-1.5 px-4">
              <Plus className="w-3.5 h-3.5" /> Save Rule
            </Button>
          </div>
        </form>

        {/* Active Rules List */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5" /> Configured Variant Prices ({rules.length})
          </p>
          <div className="rounded-xl border max-h-64 overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="text-xs font-semibold">Variant / Category</TableHead>
                  <TableHead className="text-xs font-semibold">Price ({currencySymbol})</TableHead>
                  <TableHead className="text-xs font-semibold">Duration Override</TableHead>
                  <TableHead className="text-xs font-semibold text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-xs py-6 text-muted-foreground">
                      Loading matrix rules...
                    </TableCell>
                  </TableRow>
                ) : rules.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-xs py-6 text-muted-foreground">
                      No custom price rules created yet. Base price ({currencySymbol}{basePrice}) applies to all bookings.
                    </TableCell>
                  </TableRow>
                ) : (
                  rules.map((r) => (
                    <TableRow key={r.id} className="hover:bg-muted/20">
                      <TableCell className="font-medium text-xs">
                        <Badge variant="outline" className="font-semibold text-xs border-primary/30 text-foreground bg-primary/5">
                          {r.attribute_value}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        {currencySymbol}{r.price}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {r.duration_minutes ? (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-muted-foreground" /> {r.duration_minutes} mins
                          </span>
                        ) : (
                          <span className="text-muted-foreground/60 italic">Default</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-destructive"
                          onClick={() => handleDeleteRule(r.id)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <DialogFooter className="pt-2">
          <Button variant="outline" size="sm" onClick={() => setOpen(false)} className="text-xs">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
