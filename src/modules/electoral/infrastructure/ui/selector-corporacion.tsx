'use client';

import { useFiltrosGlobales } from '@/shared/application/stores/filtros-globales.store';
import { EmptyState } from '@/shared/ui/components/empty-state';
import { Skeleton } from '@/shared/ui/components/skeleton';
import { Vote } from 'lucide-react';
import { useResumenPorCorporacion } from '../../application/hooks';
import { TarjetaCorporacion } from './tarjeta-corporacion';

export interface SelectorCorporacionProps {
  /**
   * Texto opcional que describe el contexto: "el dashboard ejecutivo",
   * "el panel electoral", etc. Aparece en el subtítulo.
   */
  contextoVista?: string;
}

/**
 * Vista inicial que se muestra cuando aún no se ha seleccionado corporación.
 * Las corporaciones no se pueden mezclar — esta puerta de entrada fuerza al
 * usuario a elegir una para garantizar consistencia en los cruces de datos.
 */
export function SelectorCorporacion({ contextoVista }: SelectorCorporacionProps) {
  const setCorporacion = useFiltrosGlobales((s) => s.setCorporacion);
  const { data, isLoading, isError } = useResumenPorCorporacion();

  return (
    <div className="space-y-5 animate-fade-in">
      <header className="flex items-start gap-3 rounded-xl border border-border bg-surface px-4 py-4 shadow-soft sm:px-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-muted text-brand">
          <Vote size={18} />
        </div>
        <div className="min-w-0">
          <h2 className="text-base font-semibold tracking-tight text-foreground">
            Seleccione una corporación para continuar
          </h2>
          <p className="mt-1 text-xs text-foreground-muted sm:text-sm">
            Los datos no pueden mezclarse entre corporaciones. Elija una para habilitar
            {contextoVista ? ` ${contextoVista}` : ' el análisis'}.
          </p>
        </div>
      </header>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-44" />
          ))}
        </div>
      ) : isError ? (
        <EmptyState
          tone="danger"
          title="No se pudieron cargar las corporaciones"
          description="Reintente más tarde o verifique su conexión."
        />
      ) : !data || data.length === 0 ? (
        <EmptyState
          title="Sin corporaciones disponibles"
          description="No hay corporaciones con datos para mostrar."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((c) => (
            <TarjetaCorporacion
              key={c.codigoCorporacion}
              resumen={c}
              onClick={() => setCorporacion(c.codigoCorporacion)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
