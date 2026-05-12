'use client';

import { EmptyState } from '@/shared/ui/components/empty-state';
import { LineChart } from '@/shared/ui/components/line-chart';
import { Skeleton } from '@/shared/ui/components/skeleton';
import { useMemo } from 'react';
import { useSeriePoblacional } from '../../application/hooks';
import { FiltroPoblacional, SeriePoblacionalPunto } from '../../domain/entities';

export interface GraficaTendenciaPoblacionalProps {
  filtro: FiltroPoblacional;
}

function formatPeriodo(anio: number, mes: number | null): string {
  if (!mes) return String(anio);
  return `${anio}-${String(mes).padStart(2, '0')}`;
}

export function GraficaTendenciaPoblacional({
  filtro,
}: GraficaTendenciaPoblacionalProps) {
  const tendenciaActiva = !!filtro.referencia;

  const { data: serie, isLoading } = useSeriePoblacional(filtro, {
    enabled: tendenciaActiva,
  });

  const datos = useMemo(() => agruparPorCriterio(serie ?? []), [serie]);

  if (!tendenciaActiva) {
    return (
      <EmptyState
        size="md"
        description="Seleccione una referencia para visualizar la tendencia."
      />
    );
  }

  if (isLoading) return <Skeleton className="h-72 w-full" />;

  if (datos.labels.length === 0) {
    return <EmptyState size="md" description="Sin datos históricos para esta combinación." />;
  }

  return (
    <div className="h-72 sm:h-80">
      <LineChart labels={datos.labels} datasets={datos.datasets} />
    </div>
  );
}

function agruparPorCriterio(serie: SeriePoblacionalPunto[]): {
  labels: string[];
  datasets: { label: string; data: number[] }[];
} {
  if (serie.length === 0) return { labels: [], datasets: [] };

  const labels = Array.from(
    new Set(serie.map((p) => formatPeriodo(p.anio, p.mes))),
  ).sort();
  const cats = Array.from(new Set(serie.map((p) => p.criterio ?? 'Sin criterio')));
  const map = new Map<string, Map<string, number>>();
  serie.forEach((p) => {
    const c = p.criterio ?? 'Sin criterio';
    const k = formatPeriodo(p.anio, p.mes);
    if (!map.has(c)) map.set(c, new Map());
    map.get(c)!.set(k, p.valor);
  });
  return {
    labels,
    datasets: cats.slice(0, 8).map((c) => ({
      label: c,
      data: labels.map((k) => map.get(c)?.get(k) ?? 0),
    })),
  };
}
