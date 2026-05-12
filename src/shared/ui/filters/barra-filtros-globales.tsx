'use client';

import { useCorporaciones, usePartidos } from '@/modules/catalogos/application/hooks';
import { useDepartamentos, useMunicipios } from '@/modules/geo/application/hooks';
import { useFiltrosGlobales } from '@/shared/application/stores/filtros-globales.store';
import { SelectFiltro } from '@/shared/ui/components/select-filtro';
import { Filter, X } from 'lucide-react';

export interface BarraFiltrosGlobalesProps {
  /** Si se omite, oculta el selector de partido (vista comparativo electoral). */
  ocultarPartido?: boolean;
}

export function BarraFiltrosGlobales({ ocultarPartido = false }: BarraFiltrosGlobalesProps = {}) {
  const filtros = useFiltrosGlobales();

  const { data: corporaciones, isLoading: loadingCorp } = useCorporaciones();
  const { data: partidos, isLoading: loadingPart } = usePartidos(
    ocultarPartido ? null : filtros.codigoCorporacion,
  );
  const { data: departamentos, isLoading: loadingDep } = useDepartamentos();
  const { data: municipios, isLoading: loadingMun } = useMunicipios(
    filtros.codigoDepartamento,
  );

  const activos = [
    filtros.codigoCorporacion,
    filtros.codigoDepartamento,
    filtros.codigoMunicipio,
    !ocultarPartido ? filtros.codigoPartido : null,
  ].filter(Boolean).length;

  return (
    <div className="border-b border-border bg-surface/95 px-4 py-3 backdrop-blur-sm sm:px-6">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-end">
        <div className="hidden shrink-0 items-center gap-1.5 self-end pb-2 text-[10px] font-semibold uppercase tracking-wider text-foreground-subtle xl:flex">
          <Filter size={12} />
          Filtros
        </div>
        <div
          className={
            ocultarPartido
              ? 'grid flex-1 grid-cols-1 gap-2.5 sm:grid-cols-3 sm:gap-3'
              : 'grid flex-1 grid-cols-2 gap-2.5 lg:grid-cols-4 lg:gap-3'
          }
        >
          <SelectFiltro
            label="Corporación"
            value={filtros.codigoCorporacion}
            loading={loadingCorp}
            options={(corporaciones ?? []).map((c) => ({
              value: c.codigo,
              label: c.nombre,
            }))}
            onChange={(v) => {
              filtros.setCorporacion(v);
              filtros.setPartido(null);
            }}
          />
          <SelectFiltro
            label="Departamento"
            value={filtros.codigoDepartamento}
            loading={loadingDep}
            options={(departamentos ?? []).map((d) => ({
              value: d.codigo,
              label: d.nombre,
            }))}
            onChange={filtros.setDepartamento}
          />
          <SelectFiltro
            label="Municipio"
            value={filtros.codigoMunicipio}
            loading={loadingMun}
            disabled={!filtros.codigoDepartamento}
            placeholder={
              filtros.codigoDepartamento ? 'Todos' : 'Seleccione departamento'
            }
            options={(municipios ?? []).map((m) => ({
              value: m.codigo,
              label: m.nombre,
            }))}
            onChange={filtros.setMunicipio}
          />
          {!ocultarPartido && (
            <SelectFiltro
              label="Partido"
              value={filtros.codigoPartido}
              loading={loadingPart}
              options={(partidos ?? []).map((p) => ({
                value: p.codigo,
                label: p.nombre,
              }))}
              onChange={filtros.setPartido}
            />
          )}
        </div>
        {activos > 0 && (
          <button
            type="button"
            onClick={filtros.reset}
            className="inline-flex h-10 shrink-0 items-center justify-center gap-1.5 self-end rounded-lg border border-border bg-surface px-3 text-xs font-medium text-foreground-muted transition-colors hover:border-danger/40 hover:bg-danger-muted/30 hover:text-danger"
            aria-label="Limpiar filtros globales"
          >
            <X size={13} />
            Limpiar ({activos})
          </button>
        )}
      </div>
    </div>
  );
}
