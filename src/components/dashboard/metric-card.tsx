import { ArrowDown, ArrowUp, Minus, MessageSquare, UserPlus, DollarSign, Send } from 'lucide-react'
import type { ComponentType } from 'react'
import { cn } from '@/lib/utils'

interface MetricCardProps {
  title: string
  /** Pre-formatted value for display (e.g. "42" or "$1,250"). */
  value: string
  icon: ComponentType<{ className?: string }>
  /**
   * Delta-mode secondary row: arrow + delta text. Omit when the metric
   * doesn't have a sensible comparison (e.g. total pipeline value).
   */
  delta?: {
    /** Positive / negative / zero drives arrow + color. */
    sign: number
    /** Pre-formatted delta, e.g. "+3 vs yesterday". */
    label: string
  }
  /** Used instead of `delta` when the metric has a static subtitle. */
  subtitle?: string
}

export function MetricCard({ title, value, icon: Icon, delta, subtitle }: MetricCardProps) {
  // Map icons to soft low-saturation custom category tints
  let iconColor = 'bg-muted text-muted-foreground'
  if (Icon === MessageSquare) {
    iconColor = 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
  } else if (Icon === UserPlus) {
    iconColor = 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
  } else if (Icon === DollarSign) {
    iconColor = 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
  } else if (Icon === Send) {
    iconColor = 'bg-violet-500/10 text-violet-600 dark:text-violet-400'
  }

  return (
    <div className="group rounded-xl border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:border-primary/20 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-0.5 active:scale-[0.99]">
      <div className="flex items-start justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</p>
        <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-110", iconColor)}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="mt-3 text-3xl font-semibold font-mono tracking-tight text-foreground">
        {value}
      </p>
      {delta ? <DeltaRow sign={delta.sign} label={delta.label} /> : subtitle ? (
        <p className="mt-2.5 text-xs text-muted-foreground font-medium">{subtitle}</p>
      ) : null}
    </div>
  )
}

function DeltaRow({ sign, label }: { sign: number; label: string }) {
  const tone =
    sign > 0
      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
      : sign < 0
      ? 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400'
      : 'bg-muted border-border/40 text-muted-foreground'
  const Arrow = sign > 0 ? ArrowUp : sign < 0 ? ArrowDown : Minus
  return (
    <div className="mt-3 flex">
      <div className={cn('inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium tabular-nums shadow-sm', tone)}>
        <Arrow className="h-3 w-3" aria-hidden />
        <span>{label}</span>
      </div>
    </div>
  )
}
