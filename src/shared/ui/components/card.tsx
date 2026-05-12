import { cn } from '@/shared/ui/utils/cn';
import { LucideIcon } from 'lucide-react';
import { HTMLAttributes, ReactNode } from 'react';

export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** Si true, el card se comporta como un contenedor "flat" sin sombra. */
  flat?: boolean;
}

export function Card({ className, children, flat = false, ...rest }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-surface',
        flat ? 'shadow-none' : 'shadow-soft',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export interface CardHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: ReactNode;
  className?: string;
  /** Tamaño compacto para tarjetas pequeñas. */
  dense?: boolean;
}

export function CardHeader({
  title,
  description,
  icon: Icon,
  action,
  className,
  dense = false,
}: CardHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-start justify-between gap-3 border-b border-border',
        dense ? 'px-4 py-2.5' : 'px-5 py-3.5',
        className,
      )}
    >
      <div className="flex min-w-0 flex-1 items-start gap-3">
        {Icon && (
          <div
            className={cn(
              'mt-0.5 flex shrink-0 items-center justify-center rounded-lg bg-brand-muted text-brand',
              dense ? 'h-7 w-7' : 'h-8 w-8',
            )}
          >
            <Icon size={dense ? 14 : 16} />
          </div>
        )}
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold tracking-tight text-foreground">
            {title}
          </h3>
          {description && (
            <p className="mt-0.5 line-clamp-2 text-xs text-foreground-muted">
              {description}
            </p>
          )}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

const PADDING: Record<CardPadding, string> = {
  none: 'p-0',
  sm: 'p-3 sm:p-4',
  md: 'p-4 sm:p-5',
  lg: 'p-5 sm:p-6',
};

export interface CardBodyProps extends HTMLAttributes<HTMLDivElement> {
  padding?: CardPadding;
}

export function CardBody({
  children,
  className,
  padding = 'md',
  ...rest
}: CardBodyProps) {
  return (
    <div className={cn(PADDING[padding], className)} {...rest}>
      {children}
    </div>
  );
}
