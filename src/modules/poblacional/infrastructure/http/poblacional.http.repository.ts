import { ApiClient } from '@/shared/infrastructure/http/api-client';
import {
  CriteriosFiltro,
  PoblacionalRepositoryPort,
} from '../../domain/poblacional.repository.port';
import {
  FiltroPoblacional,
  KpiPoblacional,
  RadarPoblacionalPunto,
  ResumenDimension,
  SeriePoblacionalPunto,
} from '../../domain/entities';

function filtroToParams(
  f: FiltroPoblacional,
): Record<string, string | number | undefined> {
  const criterios =
    f.criterios && f.criterios.length > 0 ? f.criterios.join(',') : undefined;
  return {
    fuente: f.fuente ?? undefined,
    dimension: f.dimension ?? undefined,
    referencia: f.referencia ?? undefined,
    criterio: f.criterio ?? undefined,
    criterios,
    anio: f.anio ?? undefined,
    mes: f.mes ?? undefined,
  };
}

export class PoblacionalHttpRepository implements PoblacionalRepositoryPort {
  constructor(private readonly api: ApiClient) {}

  listarDimensiones(): Promise<string[]> {
    return this.api.get<string[]>('/poblacional/dimensiones');
  }

  listarResumenDimensiones(): Promise<ResumenDimension[]> {
    return this.api.get<ResumenDimension[]>('/poblacional/resumen-dimensiones');
  }

  listarReferencias(
    dimension?: string | null,
    fuente?: string | null,
  ): Promise<string[]> {
    return this.api.get<string[]>('/poblacional/referencias', {
      dimension: dimension ?? undefined,
      fuente: fuente ?? undefined,
    });
  }

  listarCriterios(filtro: CriteriosFiltro): Promise<string[]> {
    return this.api.get<string[]>('/poblacional/criterios', {
      dimension: filtro.dimension ?? undefined,
      fuente: filtro.fuente ?? undefined,
      referencia: filtro.referencia ?? undefined,
    });
  }

  obtenerKpis(filtro: FiltroPoblacional): Promise<KpiPoblacional[]> {
    return this.api.get<KpiPoblacional[]>('/poblacional/kpis', filtroToParams(filtro));
  }

  obtenerSerieHistorica(filtro: FiltroPoblacional): Promise<SeriePoblacionalPunto[]> {
    return this.api.get<SeriePoblacionalPunto[]>(
      '/poblacional/serie-historica',
      filtroToParams(filtro),
    );
  }

  obtenerRadarUltimoPeriodo(
    filtro: FiltroPoblacional,
  ): Promise<RadarPoblacionalPunto[]> {
    return this.api.get<RadarPoblacionalPunto[]>(
      '/poblacional/radar',
      filtroToParams(filtro),
    );
  }
}
