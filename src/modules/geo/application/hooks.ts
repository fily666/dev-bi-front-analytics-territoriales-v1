'use client';

import { useQuery } from '@tanstack/react-query';
import { geoUseCases } from '../index';

export function useDepartamentos() {
  return useQuery({
    queryKey: ['geo', 'departamentos'],
    queryFn: () => geoUseCases.listarDepartamentos.execute(),
    staleTime: 30 * 60 * 1000, // 30 min: catálogo estable
  });
}

export function useMunicipios(codigoDepartamento: string | null) {
  return useQuery({
    queryKey: ['geo', 'municipios', codigoDepartamento],
    queryFn: () => geoUseCases.listarMunicipios.execute(codigoDepartamento as string),
    enabled: !!codigoDepartamento,
    staleTime: 30 * 60 * 1000,
  });
}

export function usePuestos(
  codigoDepartamento: string | null,
  codigoMunicipio: string | null,
) {
  return useQuery({
    queryKey: ['geo', 'puestos', codigoDepartamento, codigoMunicipio],
    queryFn: () =>
      geoUseCases.listarPuestos.execute(
        codigoDepartamento as string,
        codigoMunicipio as string,
      ),
    enabled: !!codigoDepartamento && !!codigoMunicipio,
    staleTime: 30 * 60 * 1000,
  });
}
