import { apiClient } from '@/shared/infrastructure/http/api-client';
import {
  ListarCandidatosUseCase,
  ListarCorporacionesUseCase,
  ListarPartidosUseCase,
} from './application/use-cases';
import { CatalogosHttpRepository } from './infrastructure/http/catalogos.http.repository';

const repository = new CatalogosHttpRepository(apiClient);

export const catalogosUseCases = {
  listarCorporaciones: new ListarCorporacionesUseCase(repository),
  listarPartidos: new ListarPartidosUseCase(repository),
  listarCandidatos: new ListarCandidatosUseCase(repository),
};

export type {
  Candidato,
  Corporacion,
  ListarCandidatosParams,
  Partido,
} from './domain/entities';
