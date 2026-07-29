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
} from 'lucide-react';
import {
  INDUSTRY_PRESETS,
  applyIndustryPreset,
  getActiveAssetType,
  type IndustryPreset,
} from '@/modules/booking/services/industryPresetService';
import type { AssetType } from '@/types';

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

  useEffect(() => {
    async function loadActive() {
      setLoading(true);
      try {
        const active = await getActiveAssetType(accountId);
        setActiveAssetType(active);
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
                      disabled={isApplying || isSelected}
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
          </div>
        )}
      </div>

      {/* Active Schema Fields Preview */}
      {activeAssetType && (
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <Info className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-foreground text-sm">
              Active Attribute Schema: <span className="text-primary">{activeAssetType.name}</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {((activeAssetType.schema_definition as any)?.fields || []).map((field: any) => (
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
                  <span className="text-[11px] text-muted-foreground font-mono">key: {field.key}</span>
                </div>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-card text-muted-foreground border border-border">
                  {field.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
