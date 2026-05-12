import { FiltroFuentes, Fuente } from '../domain/entities';
import { FuentesRepositoryPort } from '../domain/fuentes.repository.port';

export class ListarFuentesUseCase {
  constructor(private readonly repo: FuentesRepositoryPort) {}
  execute(filtro: FiltroFuentes): Promise<Fuente[]> {
    return this.repo.listar(filtro);
  }
}

export class ListarTipificacionesUseCase {
  constructor(private readonly repo: FuentesRepositoryPort) {}
  execute(): Promise<string[]> {
    return this.repo.listarTipificaciones();
  }
}

export class ListarNombresFuenteUseCase {
  constructor(private readonly repo: FuentesRepositoryPort) {}
  execute(): Promise<string[]> {
    return this.repo.listarNombresFuente();
  }
}
