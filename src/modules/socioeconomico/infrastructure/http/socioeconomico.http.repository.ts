import { ApiClient } from '@/shared/infrastructure/http/api-client';
import { SocioeconomicoRepositoryPort } from '../../domain/socioeconomico.repository.port';
import {
  FiltroSocioeconomico,
  IndicadorPorDepartamento,
  KpiSocioeconomico,
  ResumenDepartamentoDimension,
  SerieHistoricaPunto,
} from '../../domain/entities';

function filtroToParams(f: FiltroSocioeconomico): Record<string, string | number | undefined> {
  return {
    fuentePublicacion: f.fuentePublicacion ?? undefined,
    codigoDepartamento: f.codigoDepartamento ?? undefined,
    dimension: f.dimension ?? undefined,
    periodo: f.periodo ?? undefined,
    referencia: f.referencia ?? undefined,
    nivelGeografico: f.nivelGeografico ?? undefined,
    // El backend acepta CSV o param repetido; mandamos CSV para mantener
    // el contrato escalar del ApiClient.
    seriesEstadisticas:
      f.seriesEstadisticas && f.seriesEstadisticas.length > 0
        ? f.seriesEstadisticas.join(',')
        : undefined,
  };
}

export class SocioeconomicoHttpRepository implements SocioeconomicoRepositoryPort {
  constructor(private readonly api: ApiClient) {}

  listarDimensiones(fuentePublicacion?: string | null): Promise<string[]> {
    return this.api.get<string[]>('/socioeconomico/dimensiones', {
      fuentePublicacion: fuentePublicacion ?? undefined,
    });
  }

  listarFuentesPublicaciones(): Promise<string[]> {
    return this.api.get<string[]>('/socioeconomico/fuentes-publicaciones');
  }

  listarReferencias(filtro: FiltroSocioeconomico): Promise<string[]> {
    return this.api.get<string[]>('/socioeconomico/referencias', filtroToParams(filtro));
  }

  listarNivelesGeograficos(filtro: FiltroSocioeconomico): Promise<string[]> {
    return this.api.get<string[]>(
      '/socioeconomico/niveles-geograficos',
      filtroToParams(filtro),
    );
  }

  obtenerKpis(filtro: FiltroSocioeconomico): Promise<KpiSocioeconomico[]> {
    return this.api.get<KpiSocioeconomico[]>('/socioeconomico/kpis', filtroToParams(filtro));
  }

  obtenerSerieHistorica(filtro: FiltroSocioeconomico): Promise<SerieHistoricaPunto[]> {
    return this.api.get<SerieHistoricaPunto[]>(
      '/socioeconomico/serie-historica',
      filtroToParams(filtro),
    );
  }

  obtenerPorDepartamento(filtro: FiltroSocioeconomico): Promise<IndicadorPorDepartamento[]> {
    return this.api.get<IndicadorPorDepartamento[]>(
      '/socioeconomico/por-departamento',
      filtroToParams(filtro),
    );
  }

  obtenerResumenDepartamento(
    filtro: FiltroSocioeconomico,
  ): Promise<ResumenDepartamentoDimension[]> {
    return this.api.get<ResumenDepartamentoDimension[]>(
      '/socioeconomico/resumen-departamento',
      filtroToParams(filtro),
    );
  }
}
