'use client';

import { cn } from '@/shared/ui/utils/cn';
import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

export interface TabOption {
  value: string;
  label: string;
  icon?: LucideIcon;
  badge?: ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  value: string;
  onChange: (value: string) => void;
  options: TabOption[];
  className?: string;
  /** Render como pills (default) o segmented (todo en un solo bloque continuo) */
  variant?: 'pills' | 'segmented';
}

export function Tabs({
  value,
  onChange,
  options,
  className,
  variant = 'pills',
}: TabsProps) {
  return (
    <div
      role="tablist"
      className={cn(
        'flex items-center gap-1 overflow-x-auto rounded-xl border border-border bg-surface p-1.5 shadow-soft',
        '[scrollbar-width:thin]',
        className,
      )}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        const Icon = opt.icon;
        return (
          <button
            key={opt.value}
            role="tab"
            type="button"
            aria-selected={active}
            disabled={opt.disabled}
            onClick={() => !opt.disabled && onChange(opt.value)}
            className={cn(
              'flex shrink-0 items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-150',
              variant === 'segmented' && 'rounded-md',
              active
                ? 'bg-brand text-brand-foreground shadow-soft'
                : 'text-foreground-muted hover:bg-surface-elevated hover:text-foreground',
              opt.disabled && 'cursor-not-allowed opacity-40 hover:bg-transparent hover:text-foreground-muted',
            )}
          >
            {Icon && <Icon size={15} className="shrink-0" />}
            <span className="whitespace-nowrap">{opt.label}</span>
            {opt.badge && (
              <span
                className={cn(
                  'rounded-full px-1.5 py-0.5 text-[10px] font-semibold',
                  active
                    ? 'bg-brand-foreground/15 text-brand-foreground'
                    : 'bg-surface-elevated text-foreground-muted',
                )}
              >
                {opt.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
