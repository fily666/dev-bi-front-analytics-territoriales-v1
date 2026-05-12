import { cn } from '@/shared/ui/utils/cn';
import { ArrowDownRight, ArrowUpRight, LucideIcon, Minus } from 'lucide-react';
import { ReactNode } from 'react';

export type KpiTone = 'brand' | 'success' | 'danger' | 'warning' | 'info' | 'neutral';

const TONE_STYLES: Record<KpiTone, string> = {
  brand: 'bg-brand-muted text-brand',
  success: 'bg-success-muted text-success',
  danger: 'bg-danger-muted text-danger',
  warning: 'bg-warning-muted text-warning',
  info: 'bg-info-muted text-info',
  neutral: 'bg-surface-elevated text-foreground-muted',
};

export interface KpiCardProps {
  label: string;
  value: ReactNode;
  hint?: string;
  /** Variación porcentual respecto al período anterior. Positiva = crecimiento. */
  trendPct?: number | null;
  /** Texto descriptivo del trend (ej: "vs período anterior") */
  trendLabel?: string;
  icon?: LucideIcon;
  tone?: KpiTone;
  className?: string;
}

export function KpiCard({
  label,
  value,
  hint,
  trendPct,
  trendLabel,
  icon: Icon,
  tone = 'brand',
  className,
}: KpiCardProps) {
  const showTrend = trendPct !== undefined && trendPct !== null;
  const trendIsUp = (trendPct ?? 0) > 0;
  const trendIsDown = (trendPct ?? 0) < 0;

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-xl border border-border bg-surface p-4 shadow-soft transition-all duration-200 hover:border-border-strong hover:shadow-elevated sm:p-5',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2 sm:gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[11px] font-semibold uppercase tracking-wide text-foreground-muted">
            {label}
          </p>
          <p className="mt-2 truncate text-xl font-semibold tracking-tight text-foreground sm:mt-2.5 sm:text-2xl">
            {value}
          </p>
          {hint && (
            <p className="mt-1 truncate text-xs text-foreground-muted">{hint}</p>
          )}
        </div>
        {Icon && (
          <div
            className={cn(
              'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-105 sm:h-9 sm:w-9',
              TONE_STYLES[tone],
            )}
          >
            <Icon size={16} className="sm:hidden" />
            <Icon size={18} className="hidden sm:block" />
          </div>
        )}
      </div>

      {showTrend && (
        <div className="mt-3 flex items-center gap-2">
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-semibold',
              trendIsUp && 'bg-success-muted text-success',
              trendIsDown && 'bg-danger-muted text-danger',
              !trendIsUp && !trendIsDown && 'bg-surface-elevated text-foreground-muted',
            )}
          >
            {trendIsUp ? (
              <ArrowUpRight size={12} />
            ) : trendIsDown ? (
              <ArrowDownRight size={12} />
            ) : (
              <Minus size={12} />
            )}
            {Math.abs(trendPct ?? 0).toFixed(1)}%
          </span>
          {trendLabel && (
            <span className="text-[11px] text-foreground-subtle">{trendLabel}</span>
          )}
        </div>
      )}
    </div>
  );
}
