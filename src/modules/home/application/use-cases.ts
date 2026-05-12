import { FiltroElectoral } from '@/modules/electoral';
import { DashboardHome } from '../domain/entities';
import { HomeRepositoryPort } from '../domain/home.repository.port';

export class ObtenerDashboardHomeUseCase {
  constructor(private readonly repo: HomeRepositoryPort) {}
  execute(filtro: FiltroElectoral): Promise<DashboardHome> {
    return this.repo.obtenerDashboard(filtro);
  }
}
