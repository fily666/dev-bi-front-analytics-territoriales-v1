import { ElectoralRepositoryPort } from '../domain/electoral.repository.port';
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
} from '../domain/entities';

export class ObtenerResumenElectoralUseCase {
  constructor(private readonly repo: ElectoralRepositoryPort) {}
  execute(filtro: FiltroElectoral): Promise<ResumenElectoral> {
    return this.repo.obtenerResumen(filtro);
  }
}

export class ObtenerVotosPorDepartamentoUseCase {
  constructor(private readonly repo: ElectoralRepositoryPort) {}
  execute(filtro: FiltroElectoral): Promise<VotosPorDepartamento[]> {
    return this.repo.obtenerVotosPorDepartamento(filtro);
  }
}

export class ObtenerVotosPorMunicipioUseCase {
  constructor(private readonly repo: ElectoralRepositoryPort) {}
  execute(filtro: FiltroElectoral): Promise<VotosPorMunicipio[]> {
    return this.repo.obtenerVotosPorMunicipio(filtro);
  }
}

export class ObtenerVotosPorPuestoUseCase {
  constructor(private readonly repo: ElectoralRepositoryPort) {}
  execute(filtro: FiltroElectoral): Promise<VotosPorPuesto[]> {
    return this.repo.obtenerVotosPorPuesto(filtro);
  }
}

export class ObtenerRankingPartidosUseCase {
  constructor(private readonly repo: ElectoralRepositoryPort) {}
  execute(filtro: FiltroElectoral, limite = 20): Promise<RankingPartido[]> {
    return this.repo.obtenerRankingPartidos(filtro, limite);
  }
}

export class ObtenerRankingCandidatosUseCase {
  constructor(private readonly repo: ElectoralRepositoryPort) {}
  execute(filtro: FiltroElectoral, limite = 50): Promise<RankingCandidato[]> {
    return this.repo.obtenerRankingCandidatos(filtro, limite);
  }
}

export class ObtenerResumenPorCorporacionUseCase {
  constructor(private readonly repo: ElectoralRepositoryPort) {}
  execute(filtro: FiltroElectoral): Promise<ResumenCorporacion[]> {
    return this.repo.obtenerResumenPorCorporacion(filtro);
  }
}

export class CompararTerritorialUseCase {
  constructor(private readonly repo: ElectoralRepositoryPort) {}
  execute(filtro: FiltroComparativoTerritorial): Promise<ComparativoTerritorialResultado> {
    return this.repo.compararTerritorial(filtro);
  }
}

export class CompararEstadisticoUseCase {
  constructor(private readonly repo: ElectoralRepositoryPort) {}
  execute(filtro: FiltroComparativoEstadistico): Promise<ComparativoEstadisticoResultado> {
    return this.repo.compararEstadistico(filtro);
  }
}

export class ObtenerTerritoriosGanadosUseCase {
  constructor(private readonly repo: ElectoralRepositoryPort) {}
  execute(filtro: FiltroTerritoriosGanados): Promise<TerritoriosGanadosResultado> {
    return this.repo.obtenerTerritoriosGanados(filtro);
  }
}
