import { ApiClient } from '@/shared/infrastructure/http/api-client';
import { CatalogosRepositoryPort } from '../../domain/catalogos.repository.port';
import {
  Candidato,
  Corporacion,
  ListarCandidatosParams,
  Partido,
} from '../../domain/entities';

export class CatalogosHttpRepository implements CatalogosRepositoryPort {
  constructor(private readonly api: ApiClient) {}

  listarCorporaciones(): Promise<Corporacion[]> {
    return this.api.get<Corporacion[]>('/catalogos/corporaciones');
  }

  listarPartidos(codigoCorporacion?: string | null): Promise<Partido[]> {
    return this.api.get<Partido[]>('/catalogos/partidos', {
      codigoCorporacion: codigoCorporacion ?? undefined,
    });
  }

  listarCandidatos(params: ListarCandidatosParams): Promise<Candidato[]> {
    return this.api.get<Candidato[]>('/catalogos/candidatos', {
      codigoCorporacion: params.codigoCorporacion ?? undefined,
      codigoPartido: params.codigoPartido ?? undefined,
      limite: params.limite ?? undefined,
    });
  }
}
