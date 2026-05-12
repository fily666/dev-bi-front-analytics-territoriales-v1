import { apiClient } from '@/shared/infrastructure/http/api-client';
import {
  ListarCriteriosUseCase,
  ListarDimensionesUseCase,
  ListarReferenciasUseCase,
  ListarResumenDimensionesUseCase,
  ObtenerKpisPoblacionalUseCase,
  ObtenerRadarPoblacionalUseCase,
  ObtenerSeriePoblacionalUseCase,
} from './application/use-cases';
import { PoblacionalHttpRepository } from './infrastructure/http/poblacional.http.repository';

const repository = new PoblacionalHttpRepository(apiClient);

export const poblacionalUseCases = {
  listarDimensiones: new ListarDimensionesUseCase(repository),
  listarResumenDimensiones: new ListarResumenDimensionesUseCase(repository),
  listarReferencias: new ListarReferenciasUseCase(repository),
  listarCriterios: new ListarCriteriosUseCase(repository),
  obtenerKpis: new ObtenerKpisPoblacionalUseCase(repository),
  obtenerSerieHistorica: new ObtenerSeriePoblacionalUseCase(repository),
  obtenerRadar: new ObtenerRadarPoblacionalUseCase(repository),
};

export type {
  FiltroPoblacional,
  FuenteConReferencias,
  KpiPoblacional,
  RadarPoblacionalPunto,
  ResumenDimension,
  SeriePoblacionalPunto,
} from './domain/entities';
