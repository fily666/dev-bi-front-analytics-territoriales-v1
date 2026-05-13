'use client';

import { BarraFiltrosTerritoriosGanados } from '@/modules/electoral/infrastructure/ui/territorios-ganados/barra-filtros-territorios-ganados';
import { useVistaActual } from '@/shared/application/hooks/use-vista-actual';
import { BarraFiltrosDepartamento } from './barra-filtros-departamento';
import { BarraFiltrosGlobales } from './barra-filtros-globales';

/**
 * Renderiza la barra de filtros adecuada según la vista activa:
 *  - 'global'              → BarraFiltrosGlobales (corp, dept, mun, partido) → Home, Comportamiento
 *  - 'global-sin-partido'  → BarraFiltrosGlobales sin partido → Comparativo electoral
 *  - 'corporacion-partido' → BarraFiltrosGlobales sólo con corporación + organización política → Territorios ganados
 *  - 'departamento'        → BarraFiltrosDepartamento → Socioeconómico
 *  - 'ninguno'             → no se renderiza (filtros propios in-page) → Poblacional, Reportes, Configuración
 */
export function BarraFiltrosContextual() {
  const { alcanceFiltros } = useVistaActual();

  if (alcanceFiltros === 'global') return <BarraFiltrosGlobales />;
  if (alcanceFiltros === 'global-sin-partido')
    return <BarraFiltrosGlobales ocultarPartido />;
  if (alcanceFiltros === 'corporacion-partido')
    return <BarraFiltrosTerritoriosGanados />;
  if (alcanceFiltros === 'departamento') return <BarraFiltrosDepartamento />;
  return null;
}
