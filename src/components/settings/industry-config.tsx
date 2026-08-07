'use client';

import React, { useState, useEffect } from 'react';
import {
  Car,
  Wrench,
  Stethoscope,
  Home,
  Scissors,
  Check,
  Sparkles,
  Building,
  Loader2,
  Info,
  Sliders,
  Pencil,
  Trash2,
  Plus,
} from 'lucide-react';
import {
  INDUSTRY_PRESETS,
  applyIndustryPreset,
  getActiveAssetType,
  updateActiveAssetTypeSchema,
  applyCustomIndustryPreset,
  type IndustryPreset,
  type SchemaField,
} from '@/modules/booking/services/industryPresetService';
import type { AssetType } from '@/types';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface IndustryConfigProps {
  accountId: string;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  car: Car,
  wrench: Wrench,
  stethoscope: Stethoscope,
  home: Home,
  scissors: Scissors,
};

export function IndustryConfig({ accountId }: IndustryConfigProps) {
  const [activeAssetType, setActiveAssetType] = useState<AssetType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [applyingKey, setApplyingKey] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Custom Industry State
  const [customIndustryOpen, setCustomIndustryOpen] = useState(false);
  const [customIndustryForm, setCustomIndustryForm] = useState({
    industryName: '',
    assetName: '',
    description: '',
  });

  // Attribute Editor State
  const [fieldEditorOpen, setFieldEditorOpen] = useState(false);
  const [editingField, setEditingField] = useState<SchemaField | null>(null);
  const [fieldForm, setFieldForm] = useState({
    label: '',
    key: '',
    type: 'text' as 'text' | 'number' | 'select' | 'date',
    required: false,
    options: '',
  });

  // Deletion State
  const [confirmDeleteField, setConfirmDeleteField] = useState<SchemaField | null>(null);

  useEffect(() => {
    async function loadActive() {
      setLoading(true);
      try {
        const active = await getActiveAssetType(accountId);
        setActiveAssetType(active);
        if (active) {
          const presetName = (active.schema_definition as any)?.preset_name || '';
          setCustomIndustryForm({
            industryName: presetName,
            assetName: active.name || '',
            description: active.description || '',
          });
        }
      } catch (err) {
        console.error('Failed to load active asset type:', err);
      } finally {
        setLoading(false);
      }
    }
    if (accountId) {
      loadActive();
    }
  }, [accountId]);

  const handleApplyPreset = async (preset: IndustryPreset) => {
    setApplyingKey(preset.key);
    setSuccessMessage(null);
    try {
      const updated = await applyIndustryPreset(accountId, preset.key);
      setActiveAssetType(updated);
      setSuccessMessage(`Applied "${preset.name}" preset! Asset type set to "${preset.assetTypeName}".`);
    } catch (err) {
      console.error('Failed to apply industry preset:', err);
      alert('Failed to apply industry preset. Please try again.');
    } finally {
      setApplyingKey(null);
    }
  };

  const handleSaveCustomIndustry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customIndustryForm.industryName.trim() || !customIndustryForm.assetName.trim()) return;

    setApplyingKey('custom');
    setCustomIndustryOpen(false);
    try {
      const currentFields = (activeAssetType?.schema_definition as any)?.fields || [];
      const fields = (activeAssetType?.schema_definition as any)?.preset_key === 'custom'
        ? currentFields
        : [
            { key: 'name', label: 'Name', type: 'text', required: true }
          ];

      const updated = await applyCustomIndustryPreset(accountId, {
        industryName: customIndustryForm.industryName.trim(),
        assetName: customIndustryForm.assetName.trim(),
        description: customIndustryForm.description.trim(),
        fields,
      });
      setActiveAssetType(updated);
      setSuccessMessage(`Custom Industry "${customIndustryForm.industryName}" configured! Asset type set to "${customIndustryForm.assetName}".`);
    } catch (err) {
      console.error('Failed to apply custom industry:', err);
      alert('Failed to configure custom industry.');
    } finally {
      setApplyingKey(null);
    }
  };

  const handleLabelChange = (val: string) => {
    setFieldForm(prev => {
      const next = { ...prev, label: val };
      if (!editingField) {
        next.key = val
          .toLowerCase()
          .replace(/[^a-z0-9_]/g, '_')
          .replace(/_+/g, '_')
          .replace(/^_+|_+$/g, '');
      }
      return next;
    });
  };

  const openAddField = () => {
    setEditingField(null);
    setFieldForm({
      label: '',
      key: '',
      type: 'text',
      required: false,
      options: '',
    });
    setFieldEditorOpen(true);
  };

  const openEditField = (field: SchemaField) => {
    setEditingField(field);
    setFieldForm({
      label: field.label,
      key: field.key,
      type: field.type,
      required: !!field.required,
      options: field.options ? field.options.join(', ') : '',
    });
    setFieldEditorOpen(true);
  };

  const handleSaveField = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fieldForm.label.trim() || !fieldForm.key.trim()) return;

    setLoading(true);
    setFieldEditorOpen(false);
    try {
      const currentFields: SchemaField[] = [...((activeAssetType?.schema_definition as any)?.fields || [])];
      const parsedOptions = fieldForm.type === 'select' && fieldForm.options
        ? fieldForm.options.split(',').map(o => o.trim()).filter(Boolean)
        : undefined;

      const newField: SchemaField = {
        key: fieldForm.key.trim(),
        label: fieldForm.label.trim(),
        type: fieldForm.type,
        required: fieldForm.required,
        ...(parsedOptions ? { options: parsedOptions } : {})
      };

      let updatedFields: SchemaField[];
      if (editingField) {
        updatedFields = currentFields.map(f => f.key === editingField.key ? newField : f);
      } else {
        if (currentFields.some(f => f.key === newField.key)) {
          alert(`An attribute with key "${newField.key}" already exists.`);
          return;
        }
        updatedFields = [...currentFields, newField];
      }

      const updated = await updateActiveAssetTypeSchema(accountId, updatedFields);
      setActiveAssetType(updated);
      setSuccessMessage(editingField ? `Attribute "${newField.label}" updated!` : `Attribute "${newField.label}" added!`);
    } catch (err) {
      console.error('Failed to save attribute:', err);
      alert('Failed to save attribute.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteField = async (fieldToDelete: SchemaField) => {
    setLoading(true);
    try {
      const currentFields: SchemaField[] = [...((activeAssetType?.schema_definition as any)?.fields || [])];
      const updatedFields = currentFields.filter(f => f.key !== fieldToDelete.key);

      const updated = await updateActiveAssetTypeSchema(accountId, updatedFields);
      setActiveAssetType(updated);
      setSuccessMessage(`Attribute "${fieldToDelete.label}" deleted.`);
    } catch (err) {
      console.error('Failed to delete attribute:', err);
      alert('Failed to delete attribute.');
    } finally {
      setLoading(false);
    }
  };

  const activePresetKey = (activeAssetType?.schema_definition as any)?.preset_key;

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header Banner */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Building className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold tracking-tight text-foreground">Industry & Customer Asset Classification</h2>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Classify your business vertical to automatically configure customer asset schemas (Vehicles, Patient Files, Properties) and vehicle matrix pricing rules.
            </p>
          </div>
          {activeAssetType && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
              <Check className="w-3.5 h-3.5" />
              Active: {activeAssetType.name}
            </span>
          )}
        </div>
      </div>

      {successMessage && (
        <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 text-sm flex items-center gap-2">
          <Sparkles className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Industry Presets Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
          <Sliders className="w-4 h-4 text-primary" />
          Select Business Industry Preset
        </h3>

        {loading ? (
          <div className="flex items-center justify-center p-8 bg-card border border-border rounded-xl">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {INDUSTRY_PRESETS.map((preset) => {
              const IconComp = ICON_MAP[preset.icon] || Building;
              const isSelected = activePresetKey === preset.key;
              const isApplying = applyingKey === preset.key;

              return (
                <div
                  key={preset.key}
                  className={`relative flex flex-col justify-between p-5 rounded-xl border transition-all duration-200 bg-card ${
                    isSelected
                      ? 'border-primary ring-2 ring-primary/20 shadow-md'
                      : 'border-border hover:border-primary/50 shadow-sm'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                        <IconComp className="w-6 h-6" />
                      </div>
                      {isSelected && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary text-primary-foreground">
                          Selected
                        </span>
                      )}
                    </div>

                    <h4 className="font-semibold text-foreground text-base">{preset.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">
                      {preset.description}
                    </p>

                    <div className="mt-4 pt-3 border-t border-border/60">
                      <span className="text-[11px] font-medium text-muted-foreground uppercase">Default Asset:</span>
                      <p className="text-xs font-semibold text-foreground mt-0.5">
                        {preset.assetTypeName} <span className="font-normal text-muted-foreground">({preset.schemaDefinition.fields.length} attributes)</span>
                      </p>
                    </div>
                  </div>

                  <div className="mt-5">
                    <button
                      onClick={() => handleApplyPreset(preset)}
                      disabled={applyingKey !== null || isSelected}
                      className={`w-full py-2 px-4 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5 ${
                        isSelected
                          ? 'bg-muted text-muted-foreground cursor-default'
                          : 'bg-primary text-primary-foreground hover:bg-primary/90'
                      }`}
                    >
                      {isApplying ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          Applying...
                        </>
                      ) : isSelected ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          Active Schema
                        </>
                      ) : (
                        `Apply ${preset.name}`
                      )}
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Custom Industry Option Card */}
            <div
              className={`relative flex flex-col justify-between p-5 rounded-xl border transition-all duration-200 bg-card ${
                activePresetKey === 'custom'
                  ? 'border-primary ring-2 ring-primary/20 shadow-md'
                  : 'border-border hover:border-primary/50 shadow-sm'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  {activePresetKey === 'custom' && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary text-primary-foreground">
                      Selected
                    </span>
                  )}
                </div>

                <h4 className="font-semibold text-foreground text-base">Custom Industry</h4>
                <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">
                  Configure your own business schema with custom asset names and dynamic attribute fields.
                </p>

                {activePresetKey === 'custom' && activeAssetType && (
                  <div className="mt-4 pt-3 border-t border-border/60">
                    <span className="text-[11px] font-medium text-muted-foreground uppercase">Current Custom Asset:</span>
                    <p className="text-xs font-semibold text-foreground mt-0.5">
                      {activeAssetType.name} <span className="font-normal text-muted-foreground">({(activeAssetType.schema_definition as any)?.fields?.length || 0} attributes)</span>
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-5">
                <button
                  onClick={() => {
                    setCustomIndustryOpen(true);
                  }}
                  disabled={applyingKey !== null}
                  className={`w-full py-2 px-4 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50`}
                >
                  {applyingKey === 'custom' ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Configuring...
                    </>
                  ) : activePresetKey === 'custom' ? (
                    'Reconfigure Industry'
                  ) : (
                    'Configure Custom Industry'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Active Schema Fields Preview */}
      {activeAssetType && (
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-foreground text-sm">
                Active Attribute Schema: <span className="text-primary">{activeAssetType.name}</span>
              </h3>
            </div>
            <button
              onClick={openAddField}
              className="text-xs text-primary hover:text-primary/80 font-medium flex items-center gap-1.5 transition-colors border border-primary/20 px-2.5 py-1 rounded-lg hover:bg-primary/5"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Attribute
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {((activeAssetType.schema_definition as any)?.fields || []).map((field: SchemaField) => (
              <div key={field.key} className="p-3 rounded-lg bg-muted/40 border border-border/80 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-foreground">{field.label}</span>
                    {field.required && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-red-500/10 text-red-500 font-medium">
                        Required
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] text-muted-foreground font-mono">key: {field.key}</span>
                    {field.options && field.options.length > 0 && (
                      <span className="text-[10px] text-muted-foreground max-w-[200px] truncate" title={field.options.join(', ')}>
                        ({field.options.length} options)
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-card text-muted-foreground border border-border capitalize">
                    {field.type}
                  </span>
                  <button
                    onClick={() => openEditField(field)}
                    className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setConfirmDeleteField(field)}
                    className="p-1 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dialog for Custom Industry Setup */}
      <Dialog open={customIndustryOpen} onOpenChange={setCustomIndustryOpen}>
        <DialogContent className="sm:max-w-[480px] p-6 bg-popover border-border">
          <form onSubmit={handleSaveCustomIndustry} className="space-y-4">
            <DialogHeader>
              <DialogTitle className="text-base font-semibold">Configure Custom Industry</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Set up a custom industry and default customer asset name (e.g. "Device" or "Appliance").
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="industryName" className="text-xs font-semibold">Industry Preset Name</Label>
                <Input
                  id="industryName"
                  placeholder="e.g. Music Lessons, Logistics, IT Services"
                  value={customIndustryForm.industryName}
                  onChange={(e) => setCustomIndustryForm(prev => ({ ...prev, industryName: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="assetName" className="text-xs font-semibold">Asset Singular Name</Label>
                <Input
                  id="assetName"
                  placeholder="e.g. Instrument, Container, Laptop"
                  value={customIndustryForm.assetName}
                  onChange={(e) => setCustomIndustryForm(prev => ({ ...prev, assetName: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="description" className="text-xs font-semibold">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe this industry's business tracking objectives..."
                  value={customIndustryForm.description}
                  onChange={(e) => setCustomIndustryForm(prev => ({ ...prev, description: e.target.value }))}
                  className="min-h-[80px]"
                />
              </div>
            </div>

            <DialogFooter>
              <button
                type="button"
                onClick={() => setCustomIndustryOpen(false)}
                className="px-4 py-2 text-xs font-medium bg-transparent hover:bg-muted rounded-lg text-muted-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition-colors"
              >
                Save Industry Preset
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog for Attribute Add / Edit */}
      <Dialog open={fieldEditorOpen} onOpenChange={setFieldEditorOpen}>
        <DialogContent className="sm:max-w-[480px] p-6 bg-popover border-border">
          <form onSubmit={handleSaveField} className="space-y-4">
            <DialogHeader>
              <DialogTitle className="text-base font-semibold">
                {editingField ? 'Edit Attribute' : 'Add New Attribute'}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Define the asset property's display label, internal database key, and input type.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="fieldLabel" className="text-xs font-semibold">Display Label</Label>
                <Input
                  id="fieldLabel"
                  placeholder="e.g. Frame Number, Patient ID"
                  value={fieldForm.label}
                  onChange={(e) => handleLabelChange(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="fieldKey" className="text-xs font-semibold">Database Key</Label>
                <Input
                  id="fieldKey"
                  placeholder="e.g. frame_number, patient_id"
                  value={fieldForm.key}
                  onChange={(e) => setFieldForm(prev => ({ ...prev, key: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '_') }))}
                  disabled={!!editingField}
                  required
                />
                {!editingField && (
                  <p className="text-[10px] text-muted-foreground">
                    Automatically generated from display label. Alphanumeric and underscores only.
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="fieldType" className="text-xs font-semibold">Input Type</Label>
                <Select
                  value={fieldForm.type}
                  onValueChange={(val: any) => setFieldForm(prev => ({ ...prev, type: val }))}
                >
                  <SelectTrigger id="fieldType">
                    <SelectValue placeholder="Select type..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text (Single Line)</SelectItem>
                    <SelectItem value="number">Number</SelectItem>
                    <SelectItem value="date">Date Picker</SelectItem>
                    <SelectItem value="select">Dropdown Menu (Select)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {fieldForm.type === 'select' && (
                <div className="space-y-1">
                  <Label htmlFor="fieldOptions" className="text-xs font-semibold">Select Options (comma-separated)</Label>
                  <Input
                    id="fieldOptions"
                    placeholder="e.g. Standard, Luxury, Premium"
                    value={fieldForm.options}
                    onChange={(e) => setFieldForm(prev => ({ ...prev, options: e.target.value }))}
                    required
                  />
                  <p className="text-[10px] text-muted-foreground">
                    Enter the dropdown options separated by commas (e.g. Option 1, Option 2).
                  </p>
                </div>
              )}

              <div className="flex items-center gap-2 pt-1">
                <Checkbox
                  id="fieldRequired"
                  checked={fieldForm.required}
                  onCheckedChange={(val) => setFieldForm(prev => ({ ...prev, required: val === true }))}
                />
                <Label htmlFor="fieldRequired" className="text-xs font-medium cursor-pointer">
                  Required field (validation checks on asset creation)
                </Label>
              </div>
            </div>

            <DialogFooter>
              <button
                type="button"
                onClick={() => setFieldEditorOpen(false)}
                className="px-4 py-2 text-xs font-medium bg-transparent hover:bg-muted rounded-lg text-muted-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition-colors"
              >
                {editingField ? 'Update Attribute' : 'Add Attribute'}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Field Confirm Dialog */}
      <ConfirmDialog
        isOpen={!!confirmDeleteField}
        title="Delete Attribute"
        variant="destructive"
        confirmText="Delete Field"
        description={
          confirmDeleteField ? (
            <div className="space-y-2 text-left">
              <p>Are you sure you want to delete the attribute <strong>{confirmDeleteField.label}</strong> (<code>{confirmDeleteField.key}</code>)?</p>
              <p className="text-xs text-muted-foreground bg-destructive/5 p-2.5 rounded border border-destructive/20">
                <strong>Warning:</strong> Existing customer records will keep their data, but this attribute will be hidden from customer profiles and search cards.
              </p>
            </div>
          ) : null
        }
        onClose={() => setConfirmDeleteField(null)}
        onConfirm={async () => {
          if (confirmDeleteField) {
            await handleDeleteField(confirmDeleteField);
          }
        }}
      />
    </div>
  );
}
