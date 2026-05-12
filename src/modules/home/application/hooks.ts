'use client';

import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useFiltrosGlobales } from '@/shared/application/stores/filtros-globales.store';
import { homeUseCases } from '../index';

export function useDashboardHome() {
  // Selectores granulares: el dashboard sólo depende de estos 4 códigos,
  // suscribirse a todo el store hacía re-render con cada acción del store
  // (incluso setters que no cambian valor).
  const codigoCorporacion = useFiltrosGlobales((s) => s.codigoCorporacion);
  const codigoDepartamento = useFiltrosGlobales((s) => s.codigoDepartamento);
  const codigoMunicipio = useFiltrosGlobales((s) => s.codigoMunicipio);
  const codigoPartido = useFiltrosGlobales((s) => s.codigoPartido);

  // Memoizar el DTO mantiene la queryKey estable mientras los valores no
  // cambien — evita que React Query reseree el hash en cada render.
  const dto = useMemo(
    () => ({ codigoCorporacion, codigoDepartamento, codigoMunicipio, codigoPartido }),
    [codigoCorporacion, codigoDepartamento, codigoMunicipio, codigoPartido],
  );

  return useQuery({
    queryKey: ['home', 'dashboard', dto],
    queryFn: () => homeUseCases.obtenerDashboard.execute(dto),
  });
}
