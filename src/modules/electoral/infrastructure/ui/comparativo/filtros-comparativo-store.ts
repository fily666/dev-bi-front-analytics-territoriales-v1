'use client';

import { create } from 'zustand';
import type { TipoComparacionTerritorial } from '@/modules/electoral/domain/entities';

/**
 * Selección de un lado del comparativo. Para `tipo='partido'`, sólo importa
 * `codigo`; para `tipo='candidato'`, la identidad real es la tupla
 * (codigo, codigoPartido) porque `codigo_candidato` se reinicia por partido.
 */
export interface SeleccionComparativo {
  codigo: string;
  /** Sólo aplica cuando tipo='candidato'. Para 'partido' debe ir null. */
  codigoPartido: string | null;
}

/**
 * Estado del comparativo electoral pairwise (item A vs item B).
 * La geografía y la corporación viven en el store global de filtros — aquí
 * sólo guardamos lo específico del comparativo: tipo y los dos lados.
 */
interface ComparativoStore {
  tipo: TipoComparacionTerritorial;
  selA: SeleccionComparativo | null;
  selB: SeleccionComparativo | null;
  setTipo: (tipo: TipoComparacionTerritorial) => void;
  setSelA: (sel: SeleccionComparativo | null) => void;
  setSelB: (sel: SeleccionComparativo | null) => void;
  swap: () => void;
  reset: () => void;
}

export const useFiltrosComparativo = create<ComparativoStore>((set) => ({
  tipo: 'candidato',
  selA: null,
  selB: null,
  // Cambiar tipo limpia las selecciones: A/B son específicas a partido o candidato.
  setTipo: (tipo) => set({ tipo, selA: null, selB: null }),
  setSelA: (sel) => set({ selA: sel }),
  setSelB: (sel) => set({ selB: sel }),
  swap: () =>
    set((s) => ({ selA: s.selB, selB: s.selA })),
  reset: () => set({ tipo: 'candidato', selA: null, selB: null }),
}));

/**
 * Devuelve true cuando A y B identifican exactamente al mismo ítem
 * (mismo código y, para candidatos, mismo partido).
 */
export function mismaSeleccion(
  a: SeleccionComparativo | null,
  b: SeleccionComparativo | null,
): boolean {
  if (!a || !b) return false;
  return a.codigo === b.codigo && a.codigoPartido === b.codigoPartido;
}
