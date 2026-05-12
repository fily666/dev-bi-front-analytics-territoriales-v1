'use client';

import { useQuery } from '@tanstack/react-query';
import { useFiltrosGlobales } from '@/shared/application/stores/filtros-globales.store';
import { homeUseCases } from '../index';

export function useDashboardHome() {
  const filtros = useFiltrosGlobales();
  const dto = {
    codigoCorporacion: filtros.codigoCorporacion,
    codigoDepartamento: filtros.codigoDepartamento,
    codigoMunicipio: filtros.codigoMunicipio,
    codigoPartido: filtros.codigoPartido,
  };
  return useQuery({
    queryKey: ['home', 'dashboard', dto],
    queryFn: () => homeUseCases.obtenerDashboard.execute(dto),
  });
}
