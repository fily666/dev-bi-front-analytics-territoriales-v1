import { SocioeconomicoRepositoryPort } from '../domain/socioeconomico.repository.port';
import {
  FiltroSocioeconomico,
  FuenteSocioeconomica,
  IndicadorPorDepartamento,
  KpiSocioeconomico,
  ResumenDepartamentoDimension,
  SerieHistoricaPunto,
} from '../domain/entities';

export class ListarDimensionesUseCase {
  constructor(private readonly repo: SocioeconomicoRepositoryPort) {}
  execute(
    fuente: FuenteSocioeconomica,
    fuentePublicacion?: string | null,
  ): Promise<string[]> {
    return this.repo.listarDimensiones(fuente, fuentePublicacion ?? null);
  }
}

export class ListarFuentesPublicacionesUseCase {
  constructor(private readonly repo: SocioeconomicoRepositoryPort) {}
  execute(): Promise<string[]> {
    return this.repo.listarFuentesPublicaciones();
  }
}

export class ListarReferenciasUseCase {
  constructor(private readonly repo: SocioeconomicoRepositoryPort) {}
  execute(filtro: FiltroSocioeconomico): Promise<string[]> {
    return this.repo.listarReferencias(filtro);
  }
}

export class ListarNivelesGeograficosUseCase {
  constructor(private readonly repo: SocioeconomicoRepositoryPort) {}
  execute(filtro: FiltroSocioeconomico): Promise<string[]> {
    return this.repo.listarNivelesGeograficos(filtro);
  }
}

export class ObtenerKpisSocioeconomicosUseCase {
  constructor(private readonly repo: SocioeconomicoRepositoryPort) {}
  execute(filtro: FiltroSocioeconomico): Promise<KpiSocioeconomico[]> {
    return this.repo.obtenerKpis(filtro);
  }
}

export class ObtenerSerieHistoricaUseCase {
  constructor(private readonly repo: SocioeconomicoRepositoryPort) {}
  execute(filtro: FiltroSocioeconomico): Promise<SerieHistoricaPunto[]> {
    return this.repo.obtenerSerieHistorica(filtro);
  }
}

export class ObtenerPorDepartamentoSocioeconomicoUseCase {
  constructor(private readonly repo: SocioeconomicoRepositoryPort) {}
  execute(filtro: FiltroSocioeconomico): Promise<IndicadorPorDepartamento[]> {
    return this.repo.obtenerPorDepartamento(filtro);
  }
}

export class ObtenerResumenDepartamentoUseCase {
  constructor(private readonly repo: SocioeconomicoRepositoryPort) {}
  execute(filtro: FiltroSocioeconomico): Promise<ResumenDepartamentoDimension[]> {
    return this.repo.obtenerResumenDepartamento(filtro);
  }
}
