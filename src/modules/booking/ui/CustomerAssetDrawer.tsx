'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Car,
  Plus,
  ChevronRight,
  History,
  ShieldAlert,
  Check,
  X,
  Loader2,
  Tag,
  Building,
} from 'lucide-react';
import {
  getAssetsForContact,
  createOrUpdateCustomerAsset,
  getAssetServiceHistory,
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

  // Dynamic form state
  const [assetName, setAssetName] = useState<string>('');
  const [identifierCode, setIdentifierCode] = useState<string>('');
  const [formAttributes, setFormAttributes] = useState<Record<string, string>>({});

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

  const handleAttributeChange = (key: string, value: string) => {
    setFormAttributes((prev) => {
      const next = { ...prev, [key]: value };
      // Auto-generate composite asset name if make & model exist
      if (next.make || next.model) {
        const autoName = [next.year, next.make, next.model, next.color ? `(${next.color})` : '']
          .filter(Boolean)
          .join(' ');
        setAssetName(autoName);
      }
      return next;
    });
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
      setAssetName('');
      setIdentifierCode('');
      setFormAttributes({});
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

  const assetTypeName = activeAssetType?.name || 'Customer Asset';

  return (
    <div className="border-t border-border pt-4 mt-4">
      {/* Section Header */}
      <div className="flex items-center justify-between px-1 mb-2">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <Car className="w-3.5 h-3.5 text-primary" />
          <span>{assetTypeName}s ({assets.length})</span>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="text-xs text-primary hover:text-primary/80 font-medium flex items-center gap-1 transition-colors"
        >
          {showAddForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          {showAddForm ? 'Cancel' : 'Add'}
        </button>
      </div>

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
              placeholder={`e.g. 2023 Porsche 911 GT3`}
              value={assetName}
              onChange={(e) => setAssetName(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded border border-border bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-primary text-xs"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-muted-foreground mb-1">
              Identifier Code / License Plate
            </label>
            <input
              type="text"
              placeholder="e.g. DETAIL-1 or VIN Code"
              value={identifierCode}
              onChange={(e) => setIdentifierCode(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded border border-border bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-primary text-xs font-mono"
            />
          </div>

          {/* Dynamic Schema Fields */}
          {schemaFields.map((field) => (
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
              ) : (
                <input
                  type={field.type === 'number' ? 'number' : 'text'}
                  placeholder={`Enter ${field.label.toLowerCase()}...`}
                  value={formAttributes[field.key] || ''}
                  onChange={(e) => handleAttributeChange(field.key, e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded border border-border bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-primary text-xs"
                />
              )}
            </div>
          ))}

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

            return (
              <div
                key={asset.id}
                className={`rounded-lg border transition-all ${
                  isSelected ? 'border-primary bg-primary/5' : 'border-border bg-card'
                }`}
              >
                <div
                  onClick={() => handleSelectAsset(asset.id)}
                  className="p-2.5 flex items-center justify-between cursor-pointer hover:bg-muted/30"
                >
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-xs text-foreground truncate">{asset.name}</span>
                      {asset.identifier_code && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-muted font-mono text-muted-foreground border border-border">
                          {asset.identifier_code}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-x-2 gap-y-0.5 text-[11px] text-muted-foreground mt-1">
                      {Boolean(attrs.category) && <span className="font-medium text-primary">{String(attrs.category)}</span>}
                      {Boolean(attrs.color) && <span>• {String(attrs.color)}</span>}
                      {Boolean(attrs.year) && <span>• {String(attrs.year)}</span>}
                    </div>
                  </div>

                  <ChevronRight
                    className={`w-4 h-4 text-muted-foreground transition-transform ${isSelected ? 'rotate-90 text-primary' : ''}`}
                  />
                </div>

                {/* Expanded Service History */}
                {isSelected && (
                  <div className="p-2.5 pt-0 border-t border-border/60 text-xs space-y-2 bg-muted/20">
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                        <History className="w-3 h-3 text-primary" /> Service History
                      </span>
                    </div>

                    {loadingHistory ? (
                      <div className="p-2 text-center">
                        <Loader2 className="w-3.5 h-3.5 animate-spin mx-auto text-muted-foreground" />
                      </div>
                    ) : historyList.length === 0 ? (
                      <p className="text-[11px] text-muted-foreground italic px-1">No prior service logs recorded.</p>
                    ) : (
                      <div className="space-y-1.5">
                        {historyList.map((item) => (
                          <div key={item.id} className="p-2 rounded bg-card border border-border text-[11px]">
                            <div className="flex items-center justify-between font-medium">
                              <span className="text-foreground">Service Log</span>
                              <span className="text-[10px] text-muted-foreground">
                                {new Date(item.service_date).toLocaleDateString()}
                              </span>
                            </div>
                            {item.notes && <p className="text-muted-foreground mt-0.5 leading-tight">{item.notes}</p>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
