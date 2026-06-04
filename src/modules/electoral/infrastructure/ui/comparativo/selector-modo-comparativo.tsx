'use client';

import { cn } from '@/shared/ui/utils/cn';
import { BarChart3, Building2, UserCheck } from 'lucide-react';

/**
 * Opción activa del selector de tipos de comparación. Las dos primeras son
 * dimensiones del comparativo pairwise (A vs B); la tercera activa el
 * comparativo estadístico multi-candidato.
 */
export type ModoComparativo = 'candidato' | 'partido' | 'estadistico';

export interface SelectorModoComparativoProps {
  activo: ModoComparativo;
  onSelect: (modo: ModoComparativo) => void;
}

export function SelectorModoComparativo({ activo, onSelect }: SelectorModoComparativoProps) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-foreground-muted">
        Tipo de comparación
      </span>
      <div className="inline-flex flex-wrap rounded-lg border border-border bg-surface-elevated p-0.5">
        <Boton
          activo={activo === 'candidato'}
          onClick={() => onSelect('candidato')}
          icon={<UserCheck size={13} />}
          label="Por candidato"
        />
        <Boton
          activo={activo === 'partido'}
          onClick={() => onSelect('partido')}
          icon={<Building2 size={13} />}
          label="Por partido"
        />
        <Boton
          activo={activo === 'estadistico'}
          onClick={() => onSelect('estadistico')}
          icon={<BarChart3 size={13} />}
          label="Estadístico"
        />
      </div>
    </div>
  );
}

function Boton({
  activo,
  onClick,
  icon,
  label,
}: {
  activo: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
        activo
          ? 'bg-brand text-brand-foreground shadow-soft'
          : 'text-foreground-muted hover:bg-surface hover:text-foreground',
      )}
    >
      {icon}
      {label}
    </button>
  );
}
