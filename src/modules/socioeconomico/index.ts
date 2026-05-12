import { apiClient } from '@/shared/infrastructure/http/api-client';
import {
  ListarDimensionesUseCase,
  ListarFuentesPublicacionesUseCase,
  ListarNivelesGeograficosUseCase,
  ListarReferenciasUseCase,
  ObtenerKpisSocioeconomicosUseCase,
  ObtenerPorDepartamentoSocioeconomicoUseCase,
  ObtenerResumenDepartamentoUseCase,
  ObtenerSerieHistoricaUseCase,
} from './application/use-cases';
import { SocioeconomicoHttpRepository } from './infrastructure/http/socioeconomico.http.repository';

const repository = new SocioeconomicoHttpRepository(apiClient);

export const socioeconomicoUseCases = {
  listarDimensiones: new ListarDimensionesUseCase(repository),
  listarFuentesPublicaciones: new ListarFuentesPublicacionesUseCase(repository),
  listarReferencias: new ListarReferenciasUseCase(repository),
  listarNivelesGeograficos: new ListarNivelesGeograficosUseCase(repository),
  obtenerKpis: new ObtenerKpisSocioeconomicosUseCase(repository),
  obtenerSerieHistorica: new ObtenerSerieHistoricaUseCase(repository),
  obtenerPorDepartamento: new ObtenerPorDepartamentoSocioeconomicoUseCase(repository),
  obtenerResumenDepartamento: new ObtenerResumenDepartamentoUseCase(repository),
};

export type {
  FiltroSocioeconomico,
  FuenteSocioeconomica,
  IndicadorPorDepartamento,
  KpiSocioeconomico,
  ResumenDepartamentoDimension,
  SerieHistoricaPunto,
} from './domain/entities';
