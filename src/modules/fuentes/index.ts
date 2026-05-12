/**
 * Composition root del módulo Fuentes. Cablea el adapter HTTP con los casos
 * de uso. Los hooks (application/hooks.ts) son el único punto de consumo
 * para los componentes UI.
 */
import { apiClient } from '@/shared/infrastructure/http/api-client';
import {
  ListarFuentesUseCase,
  ListarNombresFuenteUseCase,
  ListarTipificacionesUseCase,
} from './application/use-cases';
import { FuentesHttpRepository } from './infrastructure/http/fuentes.http.repository';

const repository = new FuentesHttpRepository(apiClient);

export const fuentesUseCases = {
  listarFuentes: new ListarFuentesUseCase(repository),
  listarTipificaciones: new ListarTipificacionesUseCase(repository),
  listarNombresFuente: new ListarNombresFuenteUseCase(repository),
};

export type { FiltroFuentes, Fuente } from './domain/entities';

/**
 * Carpeta pública (Next.js) donde viven los PDFs. El backend solo guarda el
 * nombre de archivo en `link`; el frontend lo concatena con este prefijo.
 */
export const PDF_BASE_PATH = '/fuentes';

export function buildPdfUrl(link: string | null | undefined): string | null {
  if (!link) return null;
  if (link.startsWith('http://') || link.startsWith('https://')) return link;
  if (link.startsWith('/')) return link;
  return `${PDF_BASE_PATH}/${link}`;
}
