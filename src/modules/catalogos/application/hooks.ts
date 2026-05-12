'use client';

import { useQuery } from '@tanstack/react-query';
import { catalogosUseCases } from '../index';

export function useCorporaciones() {
  return useQuery({
    queryKey: ['catalogos', 'corporaciones'],
    queryFn: () => catalogosUseCases.listarCorporaciones.execute(),
    staleTime: 30 * 60 * 1000,
  });
}

export function usePartidos(codigoCorporacion: string | null) {
  return useQuery({
    queryKey: ['catalogos', 'partidos', codigoCorporacion],
    queryFn: () =>
      catalogosUseCases.listarPartidos.execute(codigoCorporacion ?? null),
    staleTime: 30 * 60 * 1000,
  });
}

export function useCandidatos(params: {
  codigoCorporacion?: string | null;
  codigoPartido?: string | null;
  limite?: number;
}) {
  return useQuery({
    queryKey: [
      'catalogos',
      'candidatos',
      params.codigoCorporacion,
      params.codigoPartido,
      params.limite,
    ],
    queryFn: () => catalogosUseCases.listarCandidatos.execute(params),
    staleTime: 5 * 60 * 1000,
  });
}
