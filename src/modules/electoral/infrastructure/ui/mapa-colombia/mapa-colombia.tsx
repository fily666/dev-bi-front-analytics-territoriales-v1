'use client';

import { useFiltrosGlobales } from '@/shared/application/stores/filtros-globales.store';
import { MapaDepartamentos } from './mapa-departamentos';
import { MapaMunicipios } from './mapa-municipios';

/**
 * Mapa principal: muestra departamentos por defecto y hace drill-down a municipios
 * cuando hay un departamento seleccionado en el store global.
 */
export function MapaColombia() {
  const codigoDepartamento = useFiltrosGlobales((s) => s.codigoDepartamento);
  const setDepartamento = useFiltrosGlobales((s) => s.setDepartamento);
  const enModoMunicipal = !!codigoDepartamento;

  return (
    <div className="map-wrapper border border-border bg-surface">
      {enModoMunicipal ? <MapaMunicipios /> : <MapaDepartamentos />}

      {enModoMunicipal && (
        <button
          type="button"
          onClick={() => setDepartamento(null)}
          className="absolute right-3 top-3 z-[500] inline-flex items-center gap-1.5 rounded-md border border-border bg-surface/95 px-3 py-1.5 text-xs font-medium text-foreground shadow-soft backdrop-blur transition hover:bg-surface-elevated"
          title="Volver a la vista de Colombia"
        >
          ← Ver país
        </button>
      )}
    </div>
  );
}
