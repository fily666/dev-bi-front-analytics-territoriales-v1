import { CatalogosRepositoryPort } from '../domain/catalogos.repository.port';
import {
  Candidato,
  Corporacion,
  ListarCandidatosParams,
  Partido,
} from '../domain/entities';

export class ListarCorporacionesUseCase {
  constructor(private readonly repo: CatalogosRepositoryPort) {}
  execute(): Promise<Corporacion[]> {
    return this.repo.listarCorporaciones();
  }
}

export class ListarPartidosUseCase {
  constructor(private readonly repo: CatalogosRepositoryPort) {}
  execute(codigoCorporacion?: string | null): Promise<Partido[]> {
    return this.repo.listarPartidos(codigoCorporacion ?? null);
  }
}

export class ListarCandidatosUseCase {
  constructor(private readonly repo: CatalogosRepositoryPort) {}
  execute(params: ListarCandidatosParams): Promise<Candidato[]> {
    return this.repo.listarCandidatos(params);
  }
}
