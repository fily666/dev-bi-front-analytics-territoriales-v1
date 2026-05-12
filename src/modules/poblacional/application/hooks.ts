'use client';

import { useQuery } from '@tanstack/react-query';
import { poblacionalUseCases } from '../index';
import { CriteriosFiltro } from '../domain/poblacional.repository.port';
import { FiltroPoblacional } from '../domain/entities';

export function useDimensionesPoblacional() {
  return useQuery({
    queryKey: ['poblacional', 'dimensiones'],
    queryFn: () => poblacionalUseCases.listarDimensiones.execute(),
    staleTime: 30 * 60 * 1000,
  });
}

export function useResumenDimensionesPoblacional() {
  return useQuery({
    queryKey: ['poblacional', 'resumen-dimensiones'],
    queryFn: () => poblacionalUseCases.listarResumenDimensiones.execute(),
    staleTime: 30 * 60 * 1000,
  });
}

export function useReferenciasPoblacional(
  dimension: string | null,
  fuente: string | null = null,
) {
  return useQuery({
    queryKey: ['poblacional', 'referencias', dimension, fuente],
    queryFn: () =>
      poblacionalUseCases.listarReferencias.execute(dimension, fuente),
    enabled: !!dimension,
    staleTime: 30 * 60 * 1000,
  });
}

export function useCriteriosPoblacional(filtro: CriteriosFiltro) {
  return useQuery({
    queryKey: [
      'poblacional',
      'criterios',
      filtro.dimension ?? null,
      filtro.fuente ?? null,
      filtro.referencia ?? null,
    ],
    queryFn: () => poblacionalUseCases.listarCriterios.execute(filtro),
    enabled: !!filtro.referencia,
    staleTime: 30 * 60 * 1000,
  });
}

export function useKpisPoblacional(filtro: FiltroPoblacional) {
  return useQuery({
    queryKey: ['poblacional', 'kpis', filtro],
    queryFn: () => poblacionalUseCases.obtenerKpis.execute(filtro),
  });
}

export function useSeriePoblacional(
  filtro: FiltroPoblacional,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: ['poblacional', 'serie', filtro],
    queryFn: () => poblacionalUseCases.obtenerSerieHistorica.execute(filtro),
    enabled: options?.enabled ?? true,
  });
}

export function useRadarPoblacional(
  filtro: FiltroPoblacional,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: ['poblacional', 'radar', filtro],
    queryFn: () => poblacionalUseCases.obtenerRadar.execute(filtro),
    enabled: options?.enabled ?? !!filtro.referencia,
  });
}
