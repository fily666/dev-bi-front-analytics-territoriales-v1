import { Candidato, Corporacion, ListarCandidatosParams, Partido } from './entities';

export interface CatalogosRepositoryPort {
  listarCorporaciones(): Promise<Corporacion[]>;
  listarPartidos(codigoCorporacion?: string | null): Promise<Partido[]>;
  listarCandidatos(params: ListarCandidatosParams): Promise<Candidato[]>;
}
