'use client';

import { BarChart } from '@/shared/ui/components/bar-chart';
import { EmptyState } from '@/shared/ui/components/empty-state';
import { Skeleton } from '@/shared/ui/components/skeleton';
import { cn } from '@/shared/ui/utils/cn';
import {
  ActivitySquare,
  ArrowDownCircle,
  ArrowUpCircle,
  BarChart3,
  Globe2,
  Info,
  Layers,
  type LucideIcon,
  Sigma,
} from 'lucide-react';
import { useMemo } from 'react';
import { useIndicadoresPorDepartamentoSocioeconomico } from '../../application/hooks';
import { FiltroSocioeconomico, IndicadorPorDepartamento } from '../../domain/entities';
import { badgeNivelRiesgoClass, configNivelRiesgo } from './calificacion-utils';

const fmt = new Intl.NumberFormat('es-CO', { maximumFractionDigits: 2 });

export interface PanelNacionalSocioProps {
  /** Filtro completo. Debe traer `nivelGeografico` distinto a "Departamental" (típicamente "Nacional"). */
  filtro: FiltroSocioeconomico;
  /**
   * Cuando se renderiza dentro del dashboard Home conviene ocultar la grilla
   * de tarjetas por criterio para no saturar el panel resumen. Por defecto
   * (`true`) se muestra la sección completa, como en /socioeconomico.
   */
  mostrarDetalleCriterios?: boolean;
}

/**
 * Vista alternativa al mapa cuando el indicador es nacional. En lugar de
 * coroplética o evolución temporal (esa vive en el panel inferior de
 * "Tendencia histórica"), se ofrece un análisis enfocado en los criterios
 * (serie_estadistica) asociados a la referencia seleccionada: KPIs
 * destacados, comparativa entre series y observaciones por criterio.
 */
export function PanelNacionalSocio({
  filtro,
  mostrarDetalleCriterios = true,
}: PanelNacionalSocioProps) {
  const { data: registros, isLoading } =
    useIndicadoresPorDepartamentoSocioeconomico(filtro);

  // Para nacional, cada fila típicamente representa un criterio
  // (`serie_estadistica`) distinto asociado a la referencia. Si no hay
  // serie_estadistica usamos el departamento como etiqueta de respaldo.
  const criterios = useMemo(() => {
    if (!registros || registros.length === 0) return [] as CriterioVista[];
    return registros.map((r, idx) => ({
      key: r.serieEstadistica ?? r.departamento ?? `criterio-${idx}`,
      etiqueta: r.serieEstadistica ?? r.departamento ?? 'Sin nombre',
      valor: r.valor,
      nivelRiesgo: r.nivelRiesgo,
      observacion: r.observacion,
      periodo: r.periodo,
    } satisfies CriterioVista));
  }, [registros]);

  const destacados = useMemo(() => calcularDestacados(criterios), [criterios]);
  const principal = registros?.[0] ?? null;
  const nivelRiesgoPredominante = useMemo(
    () => calcularNivelPredominante(registros ?? []),
    [registros],
  );

  if (!filtro.dimension) {
    return (
      <EmptyState
        size="md"
        description="Seleccione una dimensión para visualizar el indicador nacional."
      />
    );
  }

  if (isLoading) {
    return <Skeleton className="h-[420px] w-full" />;
  }

  if (!principal || criterios.length === 0) {
    return (
      <EmptyState
        size="md"
        description="Sin datos disponibles para esta combinación."
      />
    );
  }

  const datosBarras = ordenarParaBarras(criterios).slice(0, 12);

  return (
    <div className="space-y-5">
      {/* Header — identidad nacional */}
      <header className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-info/30 bg-info-muted/40 px-3 py-3 sm:px-4">
        <div className="flex min-w-0 flex-1 items-start gap-2.5 sm:gap-3">
          <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-info-muted text-info sm:h-8 sm:w-8">
            <Globe2 size={14} className="sm:hidden" />
            <Globe2 size={16} className="hidden sm:block" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="label-eyebrow text-info">
              Nivel {principal.nivelGeografico ?? 'agregado'}
            </p>
            <h3 className="mt-0.5 break-words text-sm font-semibold leading-snug text-foreground sm:truncate sm:text-base">
              {principal.dimension ?? filtro.dimension}
            </h3>
            <p className="mt-0.5 line-clamp-2 break-words text-[11px] text-foreground-muted sm:line-clamp-none sm:truncate">
              Período <span className="font-semibold text-foreground">{principal.periodo}</span>
              {principal.referencia ? <> · {principal.referencia}</> : null}
            </p>
          </div>
        </div>
        {nivelRiesgoPredominante && (
          <span className={badgeNivelRiesgoClass(nivelRiesgoPredominante)}>
            {configNivelRiesgo(nivelRiesgoPredominante).label}
          </span>
        )}
      </header>

      {/* Indicadores destacados */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        <KpiDestacado
          icon={Layers}
          label="Criterios analizados"
          value={String(destacados.cantidad)}
        />
        <KpiDestacado
          icon={Sigma}
          label="Promedio nacional"
          value={fmt.format(destacados.promedio)}
        />
        <KpiDestacado
          icon={ArrowUpCircle}
          tone="danger"
          label="Valor más alto"
          value={destacados.maximo ? fmt.format(destacados.maximo.valor) : '—'}
          caption={destacados.maximo?.etiqueta}
        />
        <KpiDestacado
          icon={ArrowDownCircle}
          tone="success"
          label="Valor más bajo"
          value={destacados.minimo ? fmt.format(destacados.minimo.valor) : '—'}
          caption={destacados.minimo?.etiqueta}
        />
      </div>

      {/* Comparativa entre series estadísticas */}
      <div className="rounded-xl border border-border bg-surface p-3 shadow-soft sm:p-4">
        <header className="mb-3 flex flex-wrap items-start justify-between gap-2">
          <div className="flex min-w-0 items-start gap-2">
            <BarChart3 size={16} className="mt-0.5 shrink-0 text-brand" />
            <div className="min-w-0">
              <p className="label-eyebrow">Comparativa por serie estadística</p>
              <p className="text-xs text-foreground-muted">
                Valores asociados a la referencia seleccionada
              </p>
            </div>
          </div>
          <span className="shrink-0 text-[11px] text-foreground-subtle">
            {criterios.length > 12 ? `Top 12 de ${criterios.length}` : `${criterios.length} series`}
          </span>
        </header>
        <div className="h-64 sm:h-72">
          <BarChart
            labels={datosBarras.map((c) => truncar(c.etiqueta, 22))}
            data={datosBarras.map((c) => c.valor)}
            label={filtro.dimension ?? 'Valor'}
            horizontal
          />
        </div>
      </div>

      {/* Tarjetas por criterio — KPIs + nivel_riesgo + observación.
          Se omite en el dashboard Home para no saturar el panel resumen. */}
      {mostrarDetalleCriterios && (
      <div className="rounded-xl border border-border bg-surface p-3 shadow-soft sm:p-4">
        <header className="mb-3 flex items-start gap-2">
          <ActivitySquare size={16} className="mt-0.5 shrink-0 text-brand" />
          <div className="min-w-0">
            <p className="label-eyebrow">Detalle por criterio</p>
            <p className="text-xs text-foreground-muted">
              Nivel de riesgo y observación asociados a cada serie estadística
            </p>
          </div>
        </header>
        <div className="grid gap-3 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {criterios.map((c) => {
            const cfg = configNivelRiesgo(c.nivelRiesgo);
            return (
              <article
                key={c.key}
                className="flex min-w-0 flex-col gap-2 rounded-xl border border-border bg-surface-elevated/40 p-3"
              >
                <header className="flex flex-wrap items-start justify-between gap-2">
                  <p
                    className="min-w-0 flex-1 break-words text-xs font-semibold text-foreground"
                    title={c.etiqueta}
                  >
                    {c.etiqueta}
                  </p>
                  {c.nivelRiesgo && (
                    <span className={cn('shrink-0', badgeNivelRiesgoClass(c.nivelRiesgo))}>
                      {cfg.label}
                    </span>
                  )}
                </header>
                <p className="break-words text-xl font-bold tracking-tight text-foreground num-tabular sm:text-2xl">
                  {fmt.format(c.valor)}
                </p>
                {c.observacion && (
                  <div className="flex items-start gap-2 rounded-lg bg-surface px-2.5 py-2 text-[11px] leading-snug text-foreground-muted">
                    <Info size={12} className="mt-0.5 shrink-0 text-info" />
                    <span className="break-words">{c.observacion}</span>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
      )}
    </div>
  );
}

interface CriterioVista {
  key: string;
  etiqueta: string;
  valor: number;
  nivelRiesgo: string | null;
  observacion: string | null;
  periodo: number;
}

interface DestacadoExtremo {
  valor: number;
  etiqueta: string;
}

interface Destacados {
  cantidad: number;
  promedio: number;
  maximo: DestacadoExtremo | null;
  minimo: DestacadoExtremo | null;
}

function calcularDestacados(criterios: CriterioVista[]): Destacados {
  if (criterios.length === 0) {
    return { cantidad: 0, promedio: 0, maximo: null, minimo: null };
  }
  let max = criterios[0];
  let min = criterios[0];
  let suma = 0;
  for (const c of criterios) {
    if (c.valor > max.valor) max = c;
    if (c.valor < min.valor) min = c;
    suma += c.valor;
  }
  return {
    cantidad: criterios.length,
    promedio: suma / criterios.length,
    maximo: { valor: max.valor, etiqueta: max.etiqueta },
    minimo: { valor: min.valor, etiqueta: min.etiqueta },
  };
}

function calcularNivelPredominante(rows: IndicadorPorDepartamento[]): string | null {
  const conteo = new Map<string, number>();
  for (const r of rows) {
    if (!r.nivelRiesgo) continue;
    const k = r.nivelRiesgo.toLowerCase().trim();
    conteo.set(k, (conteo.get(k) ?? 0) + 1);
  }
  if (conteo.size === 0) return null;
  let mejor: { clave: string; valor: number } | null = null;
  for (const [clave, valor] of conteo.entries()) {
    if (!mejor || valor > mejor.valor) mejor = { clave, valor };
  }
  return mejor?.clave ?? null;
}

function ordenarParaBarras(criterios: CriterioVista[]): CriterioVista[] {
  return [...criterios].sort((a, b) => b.valor - a.valor);
}

function truncar(s: string, n: number): string {
  if (s.length <= n) return s;
  return `${s.slice(0, n - 1)}…`;
}

interface KpiDestacadoProps {
  icon: LucideIcon;
  label: string;
  value: string;
  caption?: string;
  tone?: 'neutral' | 'success' | 'danger';
}

function KpiDestacado({ icon: Icon, label, value, caption, tone = 'neutral' }: KpiDestacadoProps) {
  return (
    <div className="min-w-0 rounded-xl border border-border bg-surface p-2.5 shadow-soft sm:p-3">
      <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
        <span
          className={cn(
            'flex h-6 w-6 shrink-0 items-center justify-center rounded-lg sm:h-7 sm:w-7',
            tone === 'danger' && 'bg-danger-muted text-danger',
            tone === 'success' && 'bg-success-muted text-success',
            tone === 'neutral' && 'bg-info-muted text-info',
          )}
        >
          <Icon size={13} className="sm:hidden" />
          <Icon size={14} className="hidden sm:block" />
        </span>
        <p className="label-eyebrow truncate">{label}</p>
      </div>
      <p className="mt-1.5 truncate text-xl font-bold tracking-tight text-foreground num-tabular sm:mt-2 sm:text-2xl">
        {value}
      </p>
      {caption && (
        <p
          className="mt-0.5 line-clamp-2 break-words text-[11px] leading-snug text-foreground-muted"
          title={caption}
        >
          {caption}
        </p>
      )}
    </div>
  );
}
