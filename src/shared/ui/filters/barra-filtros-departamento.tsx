'use client';

import { useDepartamentos } from '@/modules/geo/application/hooks';
import { useFiltrosGlobales } from '@/shared/application/stores/filtros-globales.store';
import { SelectFiltro } from '@/shared/ui/components/select-filtro';
import { Filter, X } from 'lucide-react';

/**
 * Barra de filtros reducida para vistas que solo aceptan filtro por departamento
 * (ej: Socioeconómico). Sigue escribiendo en el mismo store global.
 */
export function BarraFiltrosDepartamento() {
  const { codigoDepartamento, setDepartamento } = useFiltrosGlobales();
  const { data: departamentos, isLoading } = useDepartamentos();

  const activo = !!codigoDepartamento;

  return (
    <div className="border-b border-border bg-surface/95 px-4 py-3 backdrop-blur-sm sm:px-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="hidden shrink-0 items-center gap-1.5 self-end pb-2 text-[10px] font-semibold uppercase tracking-wider text-foreground-subtle sm:flex">
          <Filter size={12} />
          Filtros
        </div>
        <div className="grid flex-1 grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4 md:gap-3">
          <SelectFiltro
            label="Departamento"
            value={codigoDepartamento}
            loading={isLoading}
            options={(departamentos ?? []).map((d) => ({
              value: d.codigo,
              label: d.nombre,
            }))}
            onChange={setDepartamento}
          />
        </div>
        {activo && (
          <button
            type="button"
            onClick={() => setDepartamento(null)}
            className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 self-start rounded-lg border border-border bg-surface px-3 text-xs font-medium text-foreground-muted transition-colors hover:border-danger/40 hover:bg-danger-muted/30 hover:text-danger sm:self-end"
            aria-label="Limpiar filtro de departamento"
          >
            <X size={13} />
            Limpiar (1)
          </button>
        )}
      </div>
    </div>
  );
}
