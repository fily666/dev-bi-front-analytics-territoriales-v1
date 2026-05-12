import { apiClient } from '@/shared/infrastructure/http/api-client';
import { ObtenerDashboardHomeUseCase } from './application/use-cases';
import { HomeHttpRepository } from './infrastructure/http/home.http.repository';

const repository = new HomeHttpRepository(apiClient);

export const homeUseCases = {
  obtenerDashboard: new ObtenerDashboardHomeUseCase(repository),
};

export type { DashboardHome } from './domain/entities';
