'use client';

import { useQuery } from '@tanstack/react-query';
import { socioeconomicoUseCases } from '../index';
import { FiltroSocioeconomico, FuenteSocioeconomica } from '../domain/entities';

export function useFuentesPublicaciones() {
  return useQuery({
    queryKey: ['socioeconomico', 'fuentes-publicaciones'],
    queryFn: () => socioeconomicoUseCases.listarFuentesPublicaciones.execute(),
    staleTime: 30 * 60 * 1000,
  });
}

/** Antes `useCategoriasSocioeconomicas`. */
export function useDimensionesSocioeconomicas(
  fuente: FuenteSocioeconomica,
  fuentePublicacion: string | null = null,
) {
  return useQuery({
    queryKey: ['socioeconomico', 'dimensiones', fuente, fuentePublicacion],
    queryFn: () =>
      socioeconomicoUseCases.listarDimensiones.execute(fuente, fuentePublicacion),
    staleTime: 30 * 60 * 1000,
  });
}

export function useReferenciasSocioeconomicas(
  filtro: FiltroSocioeconomico,
  options: { enabled?: boolean } = {},
) {
  const { enabled = true } = options;
  return useQuery({
    queryKey: ['socioeconomico', 'referencias', filtro],
    queryFn: () => socioeconomicoUseCases.listarReferencias.execute(filtro),
    enabled,
    staleTime: 30 * 60 * 1000,
  });
}

export function useNivelesGeograficosSocioeconomicos(
  filtro: FiltroSocioeconomico,
  options: { enabled?: boolean } = {},
) {
  const { enabled = true } = options;
  return useQuery({
    queryKey: ['socioeconomico', 'niveles-geograficos', filtro],
    queryFn: () => socioeconomicoUseCases.listarNivelesGeograficos.execute(filtro),
    enabled,
    staleTime: 30 * 60 * 1000,
  });
}

export function useKpisSocioeconomicos(filtro: FiltroSocioeconomico) {
  return useQuery({
    queryKey: ['socioeconomico', 'kpis', filtro],
    queryFn: () => socioeconomicoUseCases.obtenerKpis.execute(filtro),
  });
}

export function useSerieHistoricaSocioeconomica(
  filtro: FiltroSocioeconomico,
  options: { enabled?: boolean } = {},
) {
  const { enabled = true } = options;
  return useQuery({
    queryKey: ['socioeconomico', 'serie', filtro],
    queryFn: () => socioeconomicoUseCases.obtenerSerieHistorica.execute(filtro),
    enabled,
  });
}

export function useIndicadoresPorDepartamentoSocioeconomico(filtro: FiltroSocioeconomico) {
  return useQuery({
    queryKey: ['socioeconomico', 'por-departamento', filtro],
    queryFn: () => socioeconomicoUseCases.obtenerPorDepartamento.execute(filtro),
  });
}

export function useResumenDepartamentoSocioeconomico(
  filtro: FiltroSocioeconomico,
  options: { enabled?: boolean } = {},
) {
  const { enabled = true } = options;
  return useQuery({
    queryKey: ['socioeconomico', 'resumen-departamento', filtro],
    queryFn: () => socioeconomicoUseCases.obtenerResumenDepartamento.execute(filtro),
    enabled: enabled && !!filtro.codigoDepartamento,
  });
}
