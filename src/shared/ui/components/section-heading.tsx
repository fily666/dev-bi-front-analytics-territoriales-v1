import { cn } from '@/shared/ui/utils/cn';
import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

export interface SectionHeadingProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: ReactNode;
  className?: string;
}

/**
 * Encabezado ligero para secciones dentro de una página. Más compacto que
 * `CardHeader` y sin contorno: ideal para introducir grupos de tarjetas.
 */
export function SectionHeading({
  title,
  description,
  icon: Icon,
  action,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-end justify-between gap-3 px-1',
        className,
      )}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        {Icon && (
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-brand-muted text-brand">
            <Icon size={14} />
          </span>
        )}
        <div className="min-w-0">
          <h2 className="truncate text-sm font-semibold tracking-tight text-foreground">
            {title}
          </h2>
          {description && (
            <p className="truncate text-xs text-foreground-muted">{description}</p>
          )}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
