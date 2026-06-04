import { apiClient } from '@/shared/infrastructure/http/api-client';
import {
  CompararEstadisticoUseCase,
  CompararTerritorialUseCase,
  ObtenerRankingCandidatosUseCase,
  ObtenerRankingPartidosUseCase,
  ObtenerResumenElectoralUseCase,
  ObtenerResumenPorCorporacionUseCase,
  ObtenerTerritoriosGanadosUseCase,
  ObtenerVotosPorDepartamentoUseCase,
  ObtenerVotosPorMunicipioUseCase,
  ObtenerVotosPorPuestoUseCase,
} from './application/use-cases';
import { ElectoralHttpRepository } from './infrastructure/http/electoral.http.repository';

const repository = new ElectoralHttpRepository(apiClient);

export const electoralUseCases = {
  obtenerResumen: new ObtenerResumenElectoralUseCase(repository),
  obtenerVotosPorDepartamento: new ObtenerVotosPorDepartamentoUseCase(repository),
  obtenerVotosPorMunicipio: new ObtenerVotosPorMunicipioUseCase(repository),
  obtenerVotosPorPuesto: new ObtenerVotosPorPuestoUseCase(repository),
  obtenerRankingPartidos: new ObtenerRankingPartidosUseCase(repository),
  obtenerRankingCandidatos: new ObtenerRankingCandidatosUseCase(repository),
  obtenerResumenPorCorporacion: new ObtenerResumenPorCorporacionUseCase(repository),
  compararTerritorial: new CompararTerritorialUseCase(repository),
  compararEstadistico: new CompararEstadisticoUseCase(repository),
  obtenerTerritoriosGanados: new ObtenerTerritoriosGanadosUseCase(repository),
};

export type {
  CandidatoSeleccionEstadistico,
  ComparativoEstadisticoResultado,
  ComparativoTerritorialResultado,
  DepartamentoComparativoEstadistico,
  FiltroComparativoEstadistico,
  FiltroComparativoTerritorial,
  FiltroElectoral,
  FiltroTerritoriosGanados,
  GanadorComparativo,
  ItemCandidatoEstadistico,
  ItemComparativoTerritorial,
  NivelAnalisisTerritoriosGanados,
  NivelTerritorial,
  RankingCandidato,
  RankingPartido,
  ResumenCorporacion,
  ResumenElectoral,
  TerritorioComparativo,
  TerritorioGanado,
  TerritoriosGanadosResultado,
  TipoComparacionTerritorial,
  TipoSeleccionTerritoriosGanados,
  ValorCandidatoDepartamento,
  VotosPorDepartamento,
  VotosPorMunicipio,
  VotosPorPuesto,
} from './domain/entities';
