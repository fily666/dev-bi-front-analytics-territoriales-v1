'use client';

import { ResumenCorporacion } from '@/modules/electoral/domain/entities';
import { cn } from '@/shared/ui/utils/cn';
import {
  Award,
  Building2,
  Crown,
  Landmark,
  LucideIcon,
  ScrollText,
  Shield,
  UserCheck,
  Users,
  Vote,
} from 'lucide-react';

export type TonoCorporacion = 'brand' | 'success' | 'danger' | 'warning' | 'info' | 'neutral';

interface TonoConfig {
  /** Color principal del header e iconos */
  text: string;
  /** Fondo suave del header */
  headerBg: string;
  /** Borde inferior del header (acento) */
  headerBorder: string;
}

const TONOS: Record<TonoCorporacion, TonoConfig> = {
  brand:   { text: 'text-brand',   headerBg: 'bg-brand-muted',   headerBorder: 'border-brand/30' },
  success: { text: 'text-success', headerBg: 'bg-success-muted', headerBorder: 'border-success/30' },
  danger:  { text: 'text-danger',  headerBg: 'bg-danger-muted',  headerBorder: 'border-danger/30' },
  warning: { text: 'text-warning', headerBg: 'bg-warning-muted', headerBorder: 'border-warning/30' },
  info:    { text: 'text-info',    headerBg: 'bg-info-muted',    headerBorder: 'border-info/30' },
  neutral: { text: 'text-foreground-muted', headerBg: 'bg-surface-elevated', headerBorder: 'border-border-strong' },
};

/** Mapeo heurístico nombre de corporación → icono + tono */
export function visualParaCorporacion(
  nombre: string,
): { icon: LucideIcon; tono: TonoCorporacion } {
  const n = nombre.toUpperCase();
  if (n.includes('SENADO')) return { icon: Landmark, tono: 'brand' };
  if (n.includes('CÁMARA') || n.includes('CAMARA')) return { icon: ScrollText, tono: 'info' };
  if (n.includes('ASAMBLEA')) return { icon: Building2, tono: 'success' };
  if (n.includes('CONCEJO')) return { icon: Users, tono: 'warning' };
  if (n.includes('ALCALDÍA') || n.includes('ALCALDIA')) return { icon: Shield, tono: 'danger' };
  if (n.includes('GOBERNAC')) return { icon: Crown, tono: 'brand' };
  if (n.includes('JAL')) return { icon: Users, tono: 'info' };
  return { icon: Vote, tono: 'neutral' };
}

const fmt = new Intl.NumberFormat('es-CO');

export interface TarjetaCorporacionProps {
  resumen: ResumenCorporacion;
  seleccionada?: boolean;
  onClick?: () => void;
}

export function TarjetaCorporacion({
  resumen,
  seleccionada = false,
  onClick,
}: TarjetaCorporacionProps) {
  const { icon: Icon, tono } = visualParaCorporacion(resumen.nombreCorporacion);
  const t = TONOS[tono];

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group block w-full overflow-hidden rounded-xl border border-border bg-surface text-left shadow-soft transition-all duration-200',
        'hover:-translate-y-0.5 hover:border-border-strong hover:shadow-elevated',
        seleccionada &&
          'ring-2 ring-brand ring-offset-2 ring-offset-background border-brand',
      )}
    >
      {/* Header con título de la corporación */}
      <header
        className={cn(
          'flex items-center justify-center gap-2 border-b px-4 py-2.5',
          t.headerBg,
          t.headerBorder,
        )}
      >
        <Icon size={14} className={t.text} />
        <h3
          className={cn(
            'truncate text-[11px] font-bold uppercase tracking-[0.14em]',
            t.text,
          )}
        >
          {resumen.nombreCorporacion}
        </h3>
      </header>

      {/* Número grande centrado */}
      <div className="px-3 py-4 text-center sm:px-4 sm:py-5">
        <p
          className={cn(
            'truncate text-2xl font-extrabold tabular-nums tracking-tight text-foreground sm:text-3xl',
            'transition-transform duration-200 group-hover:scale-105',
          )}
        >
          {fmt.format(resumen.totalVotos)}
        </p>
        <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground-muted">
          Total votos
        </p>
      </div>

      {/* Footer split: candidatos + partidos */}
      <div className="grid grid-cols-2 divide-x divide-border border-t border-border bg-background/40">
        <div className="flex items-center justify-center gap-2 px-3 py-3">
          <UserCheck size={16} className={t.text} />
          <div className="leading-tight">
            <span className="block text-base font-bold tabular-nums text-foreground">
              {fmt.format(resumen.totalCandidatos)}
            </span>
            <span className="block text-[10px] font-medium uppercase tracking-wide text-foreground-muted">
              Candidatos
            </span>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 px-3 py-3">
          <Award size={16} className={t.text} />
          <div className="leading-tight">
            <span className="block text-base font-bold tabular-nums text-foreground">
              {fmt.format(resumen.totalPartidos)}
            </span>
            <span className="block text-[10px] font-medium uppercase tracking-wide text-foreground-muted">
              Partidos
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}
