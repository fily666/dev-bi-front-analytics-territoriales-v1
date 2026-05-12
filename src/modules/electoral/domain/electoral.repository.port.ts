import {
  ComparativoTerritorialResultado,
  FiltroComparativoTerritorial,
  FiltroElectoral,
  RankingCandidato,
  RankingPartido,
  ResumenCorporacion,
  ResumenElectoral,
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
}
