import {
  CriteriosFiltro,
  PoblacionalRepositoryPort,
} from '../domain/poblacional.repository.port';
import {
  FiltroPoblacional,
  KpiPoblacional,
  RadarPoblacionalPunto,
  ResumenDimension,
  SeriePoblacionalPunto,
} from '../domain/entities';

export class ListarDimensionesUseCase {
  constructor(private readonly repo: PoblacionalRepositoryPort) {}
  execute(): Promise<string[]> {
    return this.repo.listarDimensiones();
  }
}

export class ListarResumenDimensionesUseCase {
  constructor(private readonly repo: PoblacionalRepositoryPort) {}
  execute(): Promise<ResumenDimension[]> {
    return this.repo.listarResumenDimensiones();
  }
}

export class ListarReferenciasUseCase {
  constructor(private readonly repo: PoblacionalRepositoryPort) {}
  execute(
    dimension?: string | null,
    fuente?: string | null,
  ): Promise<string[]> {
    return this.repo.listarReferencias(dimension ?? null, fuente ?? null);
  }
}

export class ListarCriteriosUseCase {
  constructor(private readonly repo: PoblacionalRepositoryPort) {}
  execute(filtro: CriteriosFiltro): Promise<string[]> {
    return this.repo.listarCriterios(filtro);
  }
}

export class ObtenerKpisPoblacionalUseCase {
  constructor(private readonly repo: PoblacionalRepositoryPort) {}
  execute(filtro: FiltroPoblacional): Promise<KpiPoblacional[]> {
    return this.repo.obtenerKpis(filtro);
  }
}

export class ObtenerSeriePoblacionalUseCase {
  constructor(private readonly repo: PoblacionalRepositoryPort) {}
  execute(filtro: FiltroPoblacional): Promise<SeriePoblacionalPunto[]> {
    return this.repo.obtenerSerieHistorica(filtro);
  }
}

export class ObtenerRadarPoblacionalUseCase {
  constructor(private readonly repo: PoblacionalRepositoryPort) {}
  execute(filtro: FiltroPoblacional): Promise<RadarPoblacionalPunto[]> {
    return this.repo.obtenerRadarUltimoPeriodo(filtro);
  }
}
