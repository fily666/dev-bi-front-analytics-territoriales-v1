import { ApiClient } from '@/shared/infrastructure/http/api-client';
import { ElectoralRepositoryPort } from '../../domain/electoral.repository.port';
import {
  ComparativoTerritorialResultado,
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
} from '../../domain/entities';

function filtroParams(filtro: FiltroElectoral): Record<string, string | undefined> {
  return {
    codigoCorporacion: filtro.codigoCorporacion ?? undefined,
    codigoDepartamento: filtro.codigoDepartamento ?? undefined,
    codigoMunicipio: filtro.codigoMunicipio ?? undefined,
    codigoPartido: filtro.codigoPartido ?? undefined,
  };
}

export class ElectoralHttpRepository implements ElectoralRepositoryPort {
  constructor(private readonly api: ApiClient) {}

  obtenerResumen(filtro: FiltroElectoral): Promise<ResumenElectoral> {
    return this.api.get<ResumenElectoral>('/electoral/resumen', filtroParams(filtro));
  }

  obtenerVotosPorDepartamento(filtro: FiltroElectoral): Promise<VotosPorDepartamento[]> {
    return this.api.get<VotosPorDepartamento[]>(
      '/electoral/por-departamento',
      filtroParams(filtro),
    );
  }

  obtenerVotosPorMunicipio(filtro: FiltroElectoral): Promise<VotosPorMunicipio[]> {
    return this.api.get<VotosPorMunicipio[]>(
      '/electoral/por-municipio',
      filtroParams(filtro),
    );
  }

  obtenerVotosPorPuesto(filtro: FiltroElectoral): Promise<VotosPorPuesto[]> {
    return this.api.get<VotosPorPuesto[]>(
      '/electoral/por-puesto',
      filtroParams(filtro),
    );
  }

  obtenerRankingPartidos(filtro: FiltroElectoral, limite: number): Promise<RankingPartido[]> {
    return this.api.get<RankingPartido[]>('/electoral/ranking-partidos', {
      ...filtroParams(filtro),
      limite,
    });
  }

  obtenerRankingCandidatos(
    filtro: FiltroElectoral,
    limite: number,
  ): Promise<RankingCandidato[]> {
    return this.api.get<RankingCandidato[]>('/electoral/ranking-candidatos', {
      ...filtroParams(filtro),
      limite,
    });
  }

  obtenerResumenPorCorporacion(filtro: FiltroElectoral): Promise<ResumenCorporacion[]> {
    return this.api.get<ResumenCorporacion[]>(
      '/electoral/resumen-corporaciones',
      filtroParams(filtro),
    );
  }

  compararTerritorial(
    filtro: FiltroComparativoTerritorial,
  ): Promise<ComparativoTerritorialResultado> {
    return this.api.get<ComparativoTerritorialResultado>(
      '/electoral/comparativo/territorial',
      {
        tipo: filtro.tipo,
        codigoA: filtro.codigoA,
        codigoB: filtro.codigoB,
        codigoCorporacionA: filtro.codigoCorporacionA,
        codigoCorporacionB: filtro.codigoCorporacionB,
        codigoDepartamento: filtro.codigoDepartamento ?? undefined,
        codigoMunicipio: filtro.codigoMunicipio ?? undefined,
        // Sólo se envían cuando hay valor — para tipo=partido el backend los ignora.
        codigoPartidoA: filtro.codigoPartidoA ?? undefined,
        codigoPartidoB: filtro.codigoPartidoB ?? undefined,
      },
    );
  }

  obtenerTerritoriosGanados(
    filtro: FiltroTerritoriosGanados,
  ): Promise<TerritoriosGanadosResultado> {
    return this.api.get<TerritoriosGanadosResultado>('/electoral/territorios-ganados', {
      tipo: filtro.tipo,
      nivel: filtro.nivel,
      codigoCorporacion: filtro.codigoCorporacion,
      codigo: filtro.codigo,
      // Sólo se envía cuando hay valor — para tipo=partido el backend lo ignora.
      codigoPartido: filtro.codigoPartido ?? undefined,
    });
  }
}
