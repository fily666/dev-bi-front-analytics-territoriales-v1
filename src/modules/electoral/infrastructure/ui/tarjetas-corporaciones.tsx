'use client';

import { useFiltrosGlobales } from '@/shared/application/stores/filtros-globales.store';
import { EmptyState } from '@/shared/ui/components/empty-state';
import { Skeleton } from '@/shared/ui/components/skeleton';
import { useResumenPorCorporacion } from '../../application/hooks';
import { TarjetaCorporacion } from './tarjeta-corporacion';

export function TarjetasCorporaciones() {
  const { data, isLoading, isError } = useResumenPorCorporacion();
  // Selectores específicos: este componente sólo lee `codigoCorporacion`
  // y la acción `setCorporacion`, ambos estables salvo cambio real.
  const codigoCorporacion = useFiltrosGlobales((s) => s.codigoCorporacion);
  const setCorporacion = useFiltrosGlobales((s) => s.setCorporacion);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
        <Skeleton className="h-44 w-full" />
        <Skeleton className="h-44 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <EmptyState
        tone="danger"
        size="sm"
        description="No se pudieron cargar las corporaciones."
      />
    );
  }

  if (!data || data.length === 0) {
    return (
      <EmptyState
        size="sm"
        description="Sin datos para los filtros aplicados."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
      {data.map((c) => {
        const seleccionada = codigoCorporacion === c.codigoCorporacion;
        return (
          <TarjetaCorporacion
            key={c.codigoCorporacion}
            resumen={c}
            seleccionada={seleccionada}
            onClick={() =>
              setCorporacion(seleccionada ? null : c.codigoCorporacion)
            }
          />
        );
      })}
    </div>
  );
}
