import {
  FiltroSocioeconomico,
  IndicadorPorDepartamento,
  KpiSocioeconomico,
  ResumenDepartamentoDimension,
  SerieHistoricaPunto,
} from './entities';

export interface SocioeconomicoRepositoryPort {
  /** Antes `listarCategorias`. */
  listarDimensiones(fuentePublicacion?: string | null): Promise<string[]>;
  listarFuentesPublicaciones(): Promise<string[]>;
  listarReferencias(filtro: FiltroSocioeconomico): Promise<string[]>;
  listarNivelesGeograficos(filtro: FiltroSocioeconomico): Promise<string[]>;
  obtenerKpis(filtro: FiltroSocioeconomico): Promise<KpiSocioeconomico[]>;
  obtenerSerieHistorica(filtro: FiltroSocioeconomico): Promise<SerieHistoricaPunto[]>;
  obtenerPorDepartamento(filtro: FiltroSocioeconomico): Promise<IndicadorPorDepartamento[]>;
  obtenerResumenDepartamento(
    filtro: FiltroSocioeconomico,
  ): Promise<ResumenDepartamentoDimension[]>;
}
