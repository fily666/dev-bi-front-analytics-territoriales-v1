import {
  FiltroPoblacional,
  KpiPoblacional,
  RadarPoblacionalPunto,
  ResumenDimension,
  SeriePoblacionalPunto,
} from './entities';

export interface CriteriosFiltro {
  dimension?: string | null;
  fuente?: string | null;
  referencia?: string | null;
}

export interface PoblacionalRepositoryPort {
  listarDimensiones(): Promise<string[]>;
  listarResumenDimensiones(): Promise<ResumenDimension[]>;
  listarReferencias(
    dimension?: string | null,
    fuente?: string | null,
  ): Promise<string[]>;
  listarCriterios(filtro: CriteriosFiltro): Promise<string[]>;
  obtenerKpis(filtro: FiltroPoblacional): Promise<KpiPoblacional[]>;
  obtenerSerieHistorica(filtro: FiltroPoblacional): Promise<SeriePoblacionalPunto[]>;
  obtenerRadarUltimoPeriodo(filtro: FiltroPoblacional): Promise<RadarPoblacionalPunto[]>;
}
