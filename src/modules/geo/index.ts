/**
 * Composition root del módulo Geo. Aquí se cablea el adapter HTTP con los
 * casos de uso. Cualquier hook o componente que necesite Geo importa desde aquí.
 * Para tests basta crear instancias con un repo mock.
 */
import { apiClient } from '@/shared/infrastructure/http/api-client';
import {
  ListarDepartamentosUseCase,
  ListarMunicipiosUseCase,
  ListarPuestosUseCase,
} from './application/use-cases';
import { GeoHttpRepository } from './infrastructure/http/geo.http.repository';

const repository = new GeoHttpRepository(apiClient);

export const geoUseCases = {
  listarDepartamentos: new ListarDepartamentosUseCase(repository),
  listarMunicipios: new ListarMunicipiosUseCase(repository),
  listarPuestos: new ListarPuestosUseCase(repository),
};

export type { Departamento, Municipio, Puesto } from './domain/entities';
