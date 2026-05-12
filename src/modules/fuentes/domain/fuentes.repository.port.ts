import { FiltroFuentes, Fuente } from './entities';

export interface FuentesRepositoryPort {
  listar(filtro: FiltroFuentes): Promise<Fuente[]>;
  listarTipificaciones(): Promise<string[]>;
  listarNombresFuente(): Promise<string[]>;
}
