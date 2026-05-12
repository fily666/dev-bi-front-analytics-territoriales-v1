import { FiltroElectoral } from '@/modules/electoral';
import { ApiClient } from '@/shared/infrastructure/http/api-client';
import { DashboardHome } from '../../domain/entities';
import { HomeRepositoryPort } from '../../domain/home.repository.port';

export class HomeHttpRepository implements HomeRepositoryPort {
  constructor(private readonly api: ApiClient) {}

  obtenerDashboard(filtro: FiltroElectoral): Promise<DashboardHome> {
    return this.api.get<DashboardHome>('/home/resumen-global', {
      codigoCorporacion: filtro.codigoCorporacion ?? undefined,
      codigoDepartamento: filtro.codigoDepartamento ?? undefined,
      codigoMunicipio: filtro.codigoMunicipio ?? undefined,
      codigoPartido: filtro.codigoPartido ?? undefined,
    });
  }
}
