'use client';

import { useQuery } from '@tanstack/react-query';
import { FiltroFuentes } from '../domain/entities';
import { fuentesUseCases } from '../index';

export function useFuentes(filtro: FiltroFuentes) {
  return useQuery({
    queryKey: ['fuentes', 'listado', filtro.tipificacion, filtro.fuente],
    queryFn: () => fuentesUseCases.listarFuentes.execute(filtro),
    staleTime: 5 * 60 * 1000,
  });
}

export function useTipificacionesFuente() {
  return useQuery({
    queryKey: ['fuentes', 'tipificaciones'],
    queryFn: () => fuentesUseCases.listarTipificaciones.execute(),
    staleTime: 30 * 60 * 1000,
  });
}

export function useNombresFuente() {
  return useQuery({
    queryKey: ['fuentes', 'nombres'],
    queryFn: () => fuentesUseCases.listarNombresFuente.execute(),
    staleTime: 30 * 60 * 1000,
  });
}
