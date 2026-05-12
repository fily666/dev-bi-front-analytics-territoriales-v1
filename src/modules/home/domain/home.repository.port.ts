import { FiltroElectoral } from '@/modules/electoral';
import { DashboardHome } from './entities';

export interface HomeRepositoryPort {
  obtenerDashboard(filtro: FiltroElectoral): Promise<DashboardHome>;
}
