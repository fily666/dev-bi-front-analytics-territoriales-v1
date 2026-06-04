import {
  ComparativoEstadisticoResultado,
  ComparativoTerritorialResultado,
  FiltroComparativoEstadistico,
  FiltroComparativoTerritorial,
  FiltroElectoral,
  FiltroTerritoriosGanados,
  RankingCandidato,
  RankingPartido,
  ResumenCorporacion,
  ResumenElectoral,
  TerritoriosGanadosResultado,
  VotosPorDepartamento,
  VotosPorMunicipio,
  VotosPorPuesto,
} from './entities';

export interface ElectoralRepositoryPort {
  obtenerResumen(filtro: FiltroElectoral): Promise<ResumenElectoral>;
  obtenerVotosPorDepartamento(filtro: FiltroElectoral): Promise<VotosPorDepartamento[]>;
  obtenerVotosPorMunicipio(filtro: FiltroElectoral): Promise<VotosPorMunicipio[]>;
  obtenerVotosPorPuesto(filtro: FiltroElectoral): Promise<VotosPorPuesto[]>;
  obtenerRankingPartidos(filtro: FiltroElectoral, limite: number): Promise<RankingPartido[]>;
  obtenerRankingCandidatos(filtro: FiltroElectoral, limite: number): Promise<RankingCandidato[]>;
  obtenerResumenPorCorporacion(filtro: FiltroElectoral): Promise<ResumenCorporacion[]>;
  compararTerritorial(
    filtro: FiltroComparativoTerritorial,
  ): Promise<ComparativoTerritorialResultado>;
  compararEstadistico(
    filtro: FiltroComparativoEstadistico,
  ): Promise<ComparativoEstadisticoResultado>;
  obtenerTerritoriosGanados(
    filtro: FiltroTerritoriosGanados,
  ): Promise<TerritoriosGanadosResultado>;
}
