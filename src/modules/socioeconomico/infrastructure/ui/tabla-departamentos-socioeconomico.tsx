'use client';

import { EmptyState } from '@/shared/ui/components/empty-state';
import { Skeleton } from '@/shared/ui/components/skeleton';
import { useIndicadoresPorDepartamentoSocioeconomico } from '../../application/hooks';
import { FiltroSocioeconomico } from '../../domain/entities';
import { badgeNivelRiesgoClass, configNivelRiesgo } from './calificacion-utils';

const fmt = new Intl.NumberFormat('es-CO', { maximumFractionDigits: 2 });

export interface TablaDepartamentosSocioeconomicoProps {
  filtro: FiltroSocioeconomico;
}

export function TablaDepartamentosSocioeconomico({
  filtro,
}: TablaDepartamentosSocioeconomicoProps) {
  const { data, isLoading } = useIndicadoresPorDepartamentoSocioeconomico(filtro);

  if (!filtro.dimension) {
    return (
      <div className="p-4">
        <EmptyState
          size="md"
          description="Seleccione una dimensión para ver el detalle por departamento."
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-4">
        <Skeleton className="h-[420px] w-full" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="p-4">
        <EmptyState size="sm" description="Sin datos disponibles." />
      </div>
    );
  }

  return (
    <div className="max-h-[450px] overflow-auto">
      <table className="w-full text-xs">
        <thead className="sticky top-0 z-10 border-b border-border bg-surface-elevated/95 backdrop-blur">
          <tr className="text-left label-eyebrow">
            <th className="px-3 py-2.5">Departamento</th>
            <th className="px-3 py-2.5 text-right">Valor</th>
            <th className="px-3 py-2.5 text-right">Nivel de riesgo</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {data.map((d) => (
            <tr
              key={d.codigoDepartamento}
              className="transition-colors hover:bg-surface-elevated/60"
            >
              <td className="px-3 py-2 font-medium text-foreground">
                <span
                  className="block max-w-[7rem] truncate sm:max-w-[10rem] lg:max-w-[12rem]"
                  title={d.departamento}
                >
                  {d.departamento}
                </span>
              </td>
              <td className="px-3 py-2 text-right num-tabular text-foreground">
                {fmt.format(d.valor)}
              </td>
              <td className="px-3 py-2 text-right">
                {d.nivelRiesgo ? (
                  <span className={badgeNivelRiesgoClass(d.nivelRiesgo)}>
                    {configNivelRiesgo(d.nivelRiesgo).label}
                  </span>
                ) : (
                  <span className="text-foreground-subtle">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
