"use client"

import Link from 'next/link'
import { UserPlus, Briefcase, Radio, Zap } from 'lucide-react'
import type { ComponentType } from 'react'

import { useTranslations } from 'next-intl'

interface Action {
  labelKey: string
  href: string
  icon: ComponentType<{ className?: string }>
  bgTint: string
}

const ACTIONS: Action[] = [
  { labelKey: 'newContact', href: '/contacts', icon: UserPlus, bgTint: 'bg-primary/10 text-primary' },
  { labelKey: 'newDeal', href: '/pipelines', icon: Briefcase, bgTint: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
  { labelKey: 'newBroadcast', href: '/broadcasts/new', icon: Radio, bgTint: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' },
  { labelKey: 'newAutomation', href: '/automations/new', icon: Zap, bgTint: 'bg-rose-500/10 text-rose-600 dark:text-rose-400' },
]

export function QuickActions() {
  const t = useTranslations('Dashboard.quickActions')
  
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {ACTIONS.map((a) => {
        const Icon = a.icon
        return (
          <Link
            key={a.href}
            href={a.href}
            className="group flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 shadow-sm transition-all duration-300 hover:border-primary/20 hover:bg-card-2 hover:shadow-[0_8px_30px_rgb(0,0,0,0.03)] active:scale-[0.98]"
          >
            <div className={`flex h-9 w-9 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-110 ${a.bgTint}`}>
              <Icon className="h-4 w-4" />
            </div>
            <span className="text-sm font-semibold text-foreground transition-transform duration-300 group-hover:translate-x-0.5">{t(a.labelKey as string)}</span>
          </Link>
        )
      })}
    </div>
  )
}
