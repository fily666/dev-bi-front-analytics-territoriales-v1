'use client';

import { BarChart } from '@/shared/ui/components/bar-chart';
import { EmptyState } from '@/shared/ui/components/empty-state';
import { Skeleton } from '@/shared/ui/components/skeleton';
import { useRankingPartidos } from '../../application/hooks';

export function RankingPartidosChart({ limite = 10 }: { limite?: number }) {
  const { data, isLoading, isError } = useRankingPartidos(limite);

  if (isLoading) return <Skeleton className="h-72 w-full" />;
  if (isError) {
    return (
      <EmptyState tone="danger" size="sm" description="Error al cargar el ranking." />
    );
  }
  if (!data || data.length === 0) {
    return <EmptyState size="sm" description="Sin datos para los filtros aplicados." />;
  }

  return (
    <div className="h-72 w-full">
      <BarChart
        horizontal
        labels={data.map((p) => p.nombrePartido)}
        data={data.map((p) => p.totalVotos)}
        label="Votos"
      />
    </div>
  );
}
