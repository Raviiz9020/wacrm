'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Car,
  Plus,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  History,
  Check,
  X,
  Loader2,
  Trash2,
  Pencil,
} from 'lucide-react';
import {
  getAssetsForContact,
  createOrUpdateCustomerAsset,
  deleteCustomerAsset,
  getAssetServiceHistory,
  recordAssetServiceHistory,
  updateAssetServiceHistory,
  deleteAssetServiceHistory,
  type CreateAssetInput,
} from '../services/customerAssetService';
import {
  getActiveAssetType,
  type SchemaField,
} from '../services/industryPresetService';
import type { CustomerAsset, CustomerAssetHistory, AssetType } from '@/types';

interface CustomerAssetDrawerProps {
  contactId: string;
  accountId: string;
}

export function CustomerAssetDrawer({ contactId, accountId }: CustomerAssetDrawerProps) {
  const [assets, setAssets] = useState<CustomerAsset[]>([]);
  const [activeAssetType, setActiveAssetType] = useState<AssetType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);

  // Selected asset for viewing history
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [historyList, setHistoryList] = useState<CustomerAssetHistory[]>([]);
  const [loadingHistory, setLoadingHistory] = useState<boolean>(false);

  // New visit log entry state
  const [showAddLogForm, setShowAddLogForm] = useState<boolean>(false);
  const [newLogNotes, setNewLogNotes] = useState<string>('');
  const [savingLog, setSavingLog] = useState<boolean>(false);

  // Edit visit log entry state
  const [editingHistoryId, setEditingHistoryId] = useState<string | null>(null);
  const [editingNotes, setEditingNotes] = useState<string>('');
  const [updatingHistory, setUpdatingHistory] = useState<boolean>(false);

  // Dynamic form state
  const [assetName, setAssetName] = useState<string>('');
  const [identifierCode, setIdentifierCode] = useState<string>('');
  const [formAttributes, setFormAttributes] = useState<Record<string, string>>({});
  const [isCustomTitle, setIsCustomTitle] = useState<boolean>(false);

  const loadData = useCallback(async () => {
    if (!contactId || !accountId) return;
    setLoading(true);
    try {
      const [fetchedAssets, activeType] = await Promise.all([
        getAssetsForContact(contactId, accountId),
        getActiveAssetType(accountId),
      ]);
      setAssets(fetchedAssets);
      setActiveAssetType(activeType);
    } catch (err) {
      console.error('Failed to load customer assets:', err);
    } finally {
      setLoading(false);
    }
  }, [contactId, accountId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSelectAsset = async (assetId: string) => {
    if (selectedAssetId === assetId) {
      setSelectedAssetId(null);
      setHistoryList([]);
      return;
    }
    setSelectedAssetId(assetId);
    setLoadingHistory(true);
    try {
      const history = await getAssetServiceHistory(assetId, accountId);
      setHistoryList(history);
    } catch (err) {
      console.error('Failed to load asset service history:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleDeleteAsset = async (e: React.MouseEvent, assetId: string, name: string) => {
    e.stopPropagation();
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      await deleteCustomerAsset(assetId, accountId);
      if (selectedAssetId === assetId) {
        setSelectedAssetId(null);
        setHistoryList([]);
      }
      await loadData();
    } catch (err) {
      console.error('Failed to delete asset:', err);
      alert('Failed to delete vehicle asset. Please try again.');
    }
  };

  const handleSaveLog = async (e: React.FormEvent, assetId: string) => {
    e.preventDefault();
    if (!newLogNotes.trim()) return;

    setSavingLog(true);
    try {
      await recordAssetServiceHistory({
        accountId,
        assetId,
        notes: newLogNotes.trim(),
      });
      setNewLogNotes('');
      setShowAddLogForm(false);
      const history = await getAssetServiceHistory(assetId, accountId);
      setHistoryList(history);
    } catch (err: any) {
      console.error('Failed to log visit history:', err);
      alert(err.message || 'Failed to log visit entry. Please try again.');
    } finally {
      setSavingLog(false);
    }
  };

  const handleDeleteLogEntry = async (historyId: string, assetId: string) => {
    if (!confirm('Are you sure you want to delete this log entry?')) return;
    try {
      await deleteAssetServiceHistory(historyId, accountId);
      const history = await getAssetServiceHistory(assetId, accountId);
      setHistoryList(history);
    } catch (err) {
      console.error('Failed to delete history log:', err);
      alert('Failed to delete log entry.');
    }
  };

  const handleUpdateLogEntry = async (e: React.FormEvent, historyId: string, assetId: string) => {
    e.preventDefault();
    if (!editingNotes.trim()) return;

    setUpdatingHistory(true);
    try {
      await updateAssetServiceHistory(historyId, accountId, editingNotes.trim());
      setEditingHistoryId(null);
      setEditingNotes('');
      const history = await getAssetServiceHistory(assetId, accountId);
      setHistoryList(history);
    } catch (err) {
      console.error('Failed to update history log:', err);
      alert('Failed to update log entry.');
    } finally {
      setUpdatingHistory(false);
    }
  };

  const handleAttributeChange = (key: string, value: string) => {
    setFormAttributes((prev) => {
      const next = { ...prev, [key]: value };
      // Auto-sync identifierCode if field is license_plate or patient_id or vin
      if (key === 'license_plate' || key === 'patient_id' || key === 'vin' || key === 'identifier_code') {
        setIdentifierCode(value);
      }
      // Auto-generate composite asset name if user hasn't manually customized title
      if (!isCustomTitle && (next.make || next.model)) {
        const autoName = [next.year, next.make, next.model, next.color ? `(${next.color})` : '']
          .filter(Boolean)
          .join(' ');
        setAssetName(autoName);
      }
      return next;
    });
  };

  const resetForm = () => {
    setAssetName('');
    setIdentifierCode('');
    setFormAttributes({});
    setIsCustomTitle(false);
  };

  const handleSaveAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assetName.trim()) return;

    setSaving(true);
    try {
      const input: CreateAssetInput = {
        accountId,
        contactId,
        assetTypeId: activeAssetType?.id || null,
        identifierCode: identifierCode.trim() || null,
        name: assetName.trim(),
        attributes: formAttributes,
      };

      await createOrUpdateCustomerAsset(input);
      setShowAddForm(false);
      resetForm();
      await loadData();
    } catch (err) {
      console.error('Failed to save asset:', err);
      alert('Failed to save customer asset. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const schemaFields: SchemaField[] = (activeAssetType?.schema_definition as any)?.fields || [
    { key: 'category', label: 'Category', type: 'text' },
    { key: 'color', label: 'Color', type: 'text' },
  ];

  const [drawerOpen, setDrawerOpen] = useState<boolean>(true);

  const assetTypeName = activeAssetType?.name || 'Customer Asset';

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      {/* Section Header Accordion */}
      <div className="flex items-center justify-between bg-muted/40 px-3 py-2 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setDrawerOpen(!drawerOpen)}
          className="flex items-center gap-2 text-foreground hover:text-primary transition-colors flex-1 text-left min-w-0"
        >
          <Car className="w-3.5 h-3.5 text-primary shrink-0" />
          <span className="truncate">{assetTypeName}s ({assets.length})</span>
        </button>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => {
              if (!drawerOpen) setDrawerOpen(true);
              if (showAddForm) resetForm();
              setShowAddForm(!showAddForm);
            }}
            className="text-xs text-primary hover:text-primary/80 font-medium flex items-center gap-1 transition-colors"
          >
            {showAddForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            {showAddForm ? 'Cancel' : 'Add'}
          </button>
          <button
            type="button"
            onClick={() => setDrawerOpen(!drawerOpen)}
            className="text-muted-foreground hover:text-foreground"
          >
            {drawerOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {drawerOpen && (
        <div className="p-3 border-t border-border/60">
          {/* Add Asset Form */}
      {showAddForm && (
        <form onSubmit={handleSaveAsset} className="mb-3 p-3 rounded-lg bg-muted/40 border border-border space-y-2.5 text-xs">
          <div>
            <label className="block text-[11px] font-medium text-muted-foreground mb-1">
              {assetTypeName} Title / Name *
            </label>
            <input
              type="text"
              required
              placeholder={assetTypeName === 'Vehicle' ? 'e.g. 2024 Tata Curvv EV' : `e.g. ${assetTypeName} Record`}
              value={assetName}
              onChange={(e) => {
                setAssetName(e.target.value);
                setIsCustomTitle(true);
              }}
              className="w-full px-2.5 py-1.5 rounded border border-border bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-primary text-xs"
            />
          </div>

          {/* Dynamic Schema Fields */}
          {schemaFields.map((field) => {
            const isTextarea =
              field.key.includes('history') ||
              field.key.includes('notes') ||
              field.key.includes('address') ||
              field.key.includes('description');

            return (
              <div key={field.key}>
                <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                  {field.label} {field.required && '*'}
                </label>
                {field.type === 'select' && field.options ? (
                  <select
                    value={formAttributes[field.key] || ''}
                    onChange={(e) => handleAttributeChange(field.key, e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded border border-border bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-primary text-xs"
                  >
                    <option value="">Select {field.label}...</option>
                    {field.options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : isTextarea ? (
                  <textarea
                    rows={3}
                    placeholder={`Enter ${field.label.toLowerCase()}...`}
                    value={formAttributes[field.key] || ''}
                    onChange={(e) => handleAttributeChange(field.key, e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded border border-border bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-primary text-xs resize-none"
                  />
                ) : (
                  <input
                    type={field.type === 'number' ? 'number' : 'text'}
                    placeholder={`Enter ${field.label.toLowerCase()}...`}
                    value={formAttributes[field.key] || ''}
                    onChange={(e) => handleAttributeChange(field.key, e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded border border-border bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-primary text-xs font-normal"
                  />
                )}
              </div>
            );
          })}

          <button
            type="submit"
            disabled={saving}
            className="w-full py-1.5 px-3 rounded bg-primary text-primary-foreground font-medium text-xs hover:bg-primary/90 transition-colors flex items-center justify-center gap-1.5 mt-2"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
            Save {assetTypeName}
          </button>
        </form>
      )}

      {/* Assets List */}
      {loading ? (
        <div className="flex items-center justify-center p-4">
          <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
        </div>
      ) : assets.length === 0 ? (
        <div className="p-3 text-center rounded-lg border border-dashed border-border/80 bg-muted/20">
          <p className="text-xs text-muted-foreground">No {assetTypeName.toLowerCase()}s recorded yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {assets.map((asset) => {
            const isSelected = selectedAssetId === asset.id;
            const attrs = (asset.attributes || {}) as Record<string, any>;
            const addedDate = asset.created_at
              ? new Date(asset.created_at).toLocaleDateString(undefined, {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })
              : null;

            return (
              <div
                key={asset.id}
                className={`rounded-lg border transition-all ${
                  isSelected ? 'border-primary bg-primary/5' : 'border-border bg-card'
                }`}
              >
                <div
                  onClick={() => handleSelectAsset(asset.id)}
                  className="p-3 cursor-pointer hover:bg-muted/30 transition-colors"
                >
                  {/* Top Row: Full Title + Actions */}
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold text-xs text-foreground leading-snug break-words flex-1">
                      {asset.name}
                    </h4>
                    <div className="flex items-center gap-1 shrink-0 -mr-1 -mt-0.5">
                      <button
                        type="button"
                        onClick={(e) => handleDeleteAsset(e, asset.id, asset.name)}
                        title="Delete Asset"
                        className="p-1 rounded text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <ChevronRight
                        className={`w-4 h-4 text-muted-foreground transition-transform ${isSelected ? 'rotate-90 text-primary' : ''}`}
                      />
                    </div>
                  </div>

                  {/* Bottom Row: Identifier Badge + Category / Blood Group + Added Date */}
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground mt-2">
                    {asset.identifier_code && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-primary/10 font-mono font-semibold text-primary border border-primary/20">
                        ID: {asset.identifier_code}
                      </span>
                    )}
                    {Boolean(attrs.category) && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-muted font-medium text-foreground border border-border">
                        {String(attrs.category)}
                      </span>
                    )}
                    {Boolean(attrs.blood_group) && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-red-500/10 text-red-500 font-semibold border border-red-500/20">
                        {String(attrs.blood_group)}
                      </span>
                    )}
                    {Boolean(attrs.color) && <span className="text-[11px]">• {String(attrs.color)}</span>}
                    {Boolean(attrs.year) && <span className="text-[11px]">• {String(attrs.year)}</span>}
                    {addedDate && <span className="text-[10px] text-muted-foreground font-normal">• Added {addedDate}</span>}
                  </div>
                </div>

                {/* Expanded Details & Service History */}
                {isSelected && (
                  <div className="p-3 border-t border-border/60 text-xs space-y-3 bg-muted/20">
                    {/* Record Attributes & Details */}
                    {Object.keys(attrs).filter((k) => attrs[k] !== undefined && attrs[k] !== null && attrs[k] !== '').length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                          Record Details & Notes
                        </span>
                        <div className="p-2.5 rounded-lg bg-card border border-border/80 space-y-1.5 text-xs">
                          {Object.entries(attrs).map(([key, val]) => {
                            if (val === undefined || val === null || val === '') return null;
                            const label = key
                              .replace(/_/g, ' ')
                              .replace(/\b\w/g, (l) => l.toUpperCase());

                            return (
                              <div key={key} className="flex flex-col text-[11px] pb-1 border-b border-border/40 last:border-0">
                                <span className="font-semibold text-muted-foreground">{label}:</span>
                                <span className="text-foreground whitespace-pre-wrap font-normal">{String(val)}</span>
                              </div>
                            );
                          })}
                          {addedDate && (
                            <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-border/40 text-muted-foreground">
                              <span className="font-semibold">Record Added On:</span>
                              <span className="font-medium text-foreground">{addedDate}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Service History Timeline */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-1 uppercase tracking-wider">
                          <History className="w-3 h-3 text-primary" /> Service History ({historyList.length})
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowAddLogForm(!showAddLogForm)}
                          className="text-[10px] text-primary hover:underline font-semibold flex items-center gap-0.5"
                        >
                          {showAddLogForm ? 'Cancel' : '+ Add Visit Note'}
                        </button>
                      </div>

                      {/* Inline Add Log Note Form */}
                      {showAddLogForm && (
                        <form onSubmit={(e) => handleSaveLog(e, asset.id)} className="space-y-2 p-2 rounded-lg bg-card border border-border">
                          <textarea
                            rows={2}
                            required
                            placeholder="Enter visit notes, treatment details or advice..."
                            value={newLogNotes}
                            onChange={(e) => setNewLogNotes(e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded border border-border bg-muted/40 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                          />
                          <button
                            type="submit"
                            disabled={savingLog || !newLogNotes.trim()}
                            className="w-full py-1 px-2.5 rounded bg-primary text-primary-foreground text-[11px] font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-1"
                          >
                            {savingLog ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                            Save Visit Entry
                          </button>
                        </form>
                      )}

                      {loadingHistory ? (
                        <div className="p-2 text-center">
                          <Loader2 className="w-3.5 h-3.5 animate-spin mx-auto text-muted-foreground" />
                        </div>
                      ) : historyList.length === 0 ? (
                        <p className="text-[11px] text-muted-foreground italic px-1">No prior service logs recorded.</p>
                      ) : (
                        <div className="space-y-1.5">
                          {historyList.map((item) => (
                            <div key={item.id} className="p-2 rounded bg-card border border-border text-[11px] space-y-1">
                              <div className="flex items-center justify-between font-medium">
                                <span className="text-foreground font-semibold">Visit Log</span>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[10px] text-muted-foreground">
                                    {(() => {
                                      try {
                                        return item.service_date ? new Date(item.service_date).toLocaleDateString(undefined, {
                                          day: 'numeric',
                                          month: 'short',
                                          year: 'numeric',
                                        }) : '';
                                      } catch {
                                        return '';
                                      }
                                    })()}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingHistoryId(item.id);
                                      setEditingNotes(item.notes || '');
                                    }}
                                    title="Edit Visit Note"
                                    className="p-0.5 text-muted-foreground hover:text-primary transition-colors"
                                  >
                                    <Pencil className="w-3 h-3" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteLogEntry(item.id, asset.id)}
                                    title="Delete Visit Note"
                                    className="p-0.5 text-muted-foreground hover:text-red-500 transition-colors"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>

                              {editingHistoryId === item.id ? (
                                <form onSubmit={(e) => handleUpdateLogEntry(e, item.id, asset.id)} className="space-y-1.5 pt-1">
                                  <textarea
                                    rows={2}
                                    required
                                    value={editingNotes}
                                    onChange={(e) => setEditingNotes(e.target.value)}
                                    className="w-full px-2 py-1 rounded border border-border bg-muted/40 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                                  />
                                  <div className="flex justify-end gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setEditingHistoryId(null);
                                        setEditingNotes('');
                                      }}
                                      className="px-2 py-0.5 rounded text-[10px] bg-muted hover:bg-muted/80 text-muted-foreground font-medium"
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      type="submit"
                                      disabled={updatingHistory}
                                      className="px-2 py-0.5 rounded text-[10px] bg-primary text-primary-foreground font-medium hover:bg-primary/90"
                                    >
                                      {updatingHistory ? 'Saving...' : 'Save'}
                                    </button>
                                  </div>
                                </form>
                              ) : (
                                item.notes && <p className="text-muted-foreground mt-1 leading-normal whitespace-pre-wrap">{item.notes}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  )}
</div>
  );
}
