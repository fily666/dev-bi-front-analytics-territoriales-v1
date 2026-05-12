'use client';

import { cn } from '@/shared/ui/utils/cn';
import { X } from 'lucide-react';
import { ReactNode } from 'react';
import { Card } from './card';

const COL_GRID: Record<1 | 2 | 3 | 4 | 5 | 6, string> = {
  1: 'lg:grid-cols-1',
  2: 'lg:grid-cols-2',
  3: 'lg:grid-cols-3',
  4: 'lg:grid-cols-4',
  5: 'lg:grid-cols-5',
  6: 'lg:grid-cols-6',
};

export interface FiltrosCardProps {
  children: ReactNode;
  /** Cantidad de filtros activos. Si > 0 y onLimpiar definido, se muestra el botón. */
  filtrosActivos?: number;
  onLimpiar?: () => void;
  /** Columnas del grid en lg+. Default 4. En sm: 2, en mobile: 1. */
  cols?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
}

/**
 * Card de filtros compacta. Layout: [filtros en grid] + [botón Limpiar (N)] en la
 * misma fila, alineados al borde inferior. Se usa en páginas que necesitan
 * filtros propios (Poblacional, Socioeconómico).
 */
export function FiltrosCard({
  children,
  filtrosActivos = 0,
  onLimpiar,
  cols = 4,
  className,
}: FiltrosCardProps) {
  return (
    <Card className={cn(className)}>
      <div className="flex flex-wrap items-end gap-3 px-4 py-3.5">
        <div
          className={cn(
            'grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2',
            COL_GRID[cols],
          )}
        >
          {children}
        </div>
        {filtrosActivos > 0 && onLimpiar && (
          <button
            type="button"
            onClick={onLimpiar}
            className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-lg border border-border bg-surface px-3 text-xs font-medium text-foreground-muted transition-colors hover:border-danger/40 hover:bg-danger-muted/30 hover:text-danger"
            aria-label="Limpiar filtros"
          >
            <X size={13} />
            Limpiar ({filtrosActivos})
          </button>
        )}
      </div>
    </Card>
  );
}
