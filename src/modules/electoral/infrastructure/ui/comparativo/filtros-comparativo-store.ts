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
 * La geografía vive en el store global de filtros (la usan los mapas para el
 * drill-down). Aquí guardamos lo específico del comparativo: el tipo, la
 * **corporación de cada lado** (pueden diferir para comparar entre
 * corporaciones/elecciones distintas) y los dos ítems seleccionados.
 */
interface ComparativoStore {
  tipo: TipoComparacionTerritorial;
  corpA: string | null;
  corpB: string | null;
  selA: SeleccionComparativo | null;
  selB: SeleccionComparativo | null;
  setTipo: (tipo: TipoComparacionTerritorial) => void;
  setCorpA: (codigo: string | null) => void;
  setCorpB: (codigo: string | null) => void;
  setSelA: (sel: SeleccionComparativo | null) => void;
  setSelB: (sel: SeleccionComparativo | null) => void;
  swap: () => void;
  reset: () => void;
}

export const useFiltrosComparativo = create<ComparativoStore>((set) => ({
  tipo: 'candidato',
  corpA: null,
  corpB: null,
  selA: null,
  selB: null,
  // Cambiar tipo limpia las selecciones: A/B son específicas a partido o
  // candidato. Las corporaciones se conservan (aplican a ambos tipos).
  setTipo: (tipo) => set({ tipo, selA: null, selB: null }),
  // Cambiar la corporación de un lado invalida la selección de ESE lado: la
  // lista de partidos/candidatos depende de la corporación.
  setCorpA: (codigo) => set({ corpA: codigo, selA: null }),
  setCorpB: (codigo) => set({ corpB: codigo, selB: null }),
  setSelA: (sel) => set({ selA: sel }),
  setSelB: (sel) => set({ selB: sel }),
  // El swap intercambia corporación + ítem de cada lado para mantener la
  // coherencia (corpA↔corpB, selA↔selB).
  swap: () =>
    set((s) => ({ corpA: s.corpB, corpB: s.corpA, selA: s.selB, selB: s.selA })),
  reset: () => set({ tipo: 'candidato', corpA: null, corpB: null, selA: null, selB: null }),
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
