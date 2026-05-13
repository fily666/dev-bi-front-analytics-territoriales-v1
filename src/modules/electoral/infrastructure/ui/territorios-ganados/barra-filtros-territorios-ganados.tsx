'use client';

import { useEffect } from 'react';
import { useFiltrosGlobales } from '@/shared/application/stores/filtros-globales.store';
import { BarraFiltrosGlobales } from '@/shared/ui/filters/barra-filtros-globales';
import { useFiltrosTerritoriosGanados } from './filtros-territorios-ganados-store';

/**
 * Variante de la barra de filtros para `/electoral/territorios-ganados`.
 * El selector de Departamento aparece sólo cuando el tipo de análisis es
 * Municipal; al volver a Departamental se oculta y se limpia (también
 * Municipio, que sólo tiene sentido bajo un departamento). El selector de
 * Municipio nunca se muestra: el alcance territorial se decide en el panel
 * interno y en la tabla.
 */
export function BarraFiltrosTerritoriosGanados() {
  const nivel = useFiltrosTerritoriosGanados((s) => s.nivel);
  const setDepartamento = useFiltrosGlobales((s) => s.setDepartamento);

  useEffect(() => {
    if (nivel === 'departamento') {
      // setDepartamento(null) limpia también el municipio (store global).
      setDepartamento(null);
    }
  }, [nivel, setDepartamento]);

  return (
    <BarraFiltrosGlobales
      ocultarTerritorio
      mostrarDepartamento={nivel === 'municipio'}
    />
  );
}
