import { ApiClient } from '@/shared/infrastructure/http/api-client';
import { FiltroFuentes, Fuente } from '../../domain/entities';
import { FuentesRepositoryPort } from '../../domain/fuentes.repository.port';

export class FuentesHttpRepository implements FuentesRepositoryPort {
  constructor(private readonly api: ApiClient) {}

  listar(filtro: FiltroFuentes): Promise<Fuente[]> {
    return this.api.get<Fuente[]>('/fuentes', {
      tipificacion: filtro.tipificacion,
      fuente: filtro.fuente,
    });
  }

  listarTipificaciones(): Promise<string[]> {
    return this.api.get<string[]>('/fuentes/tipificaciones');
  }

  listarNombresFuente(): Promise<string[]> {
    return this.api.get<string[]>('/fuentes/nombres');
  }
}
