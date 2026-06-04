'use client';

import { create } from 'zustand';
import type { CandidatoSeleccionEstadistico } from '@/modules/electoral/domain/entities';

/** Clave estable de un candidato (debe coincidir con la del backend). */
export function keyCandidatoEstadistico(c: CandidatoSeleccionEstadistico): string {
  return `${c.codigoCorporacion}~${c.codigo}~${c.codigoPartido ?? ''}`;
}

/**
 * Estado del comparativo estadístico: dos corporaciones obligatorias y una
 * selección múltiple de candidatos por cada una. Cada candidato conserva su
 * corporación, de modo que cambiar una corporación sólo limpia los candidatos
 * de ESE lado.
 */
interface EstadisticoStore {
  corpA: string | null;
  corpB: string | null;
  seleccionados: CandidatoSeleccionEstadistico[];
  setCorpA: (codigo: string | null) => void;
  setCorpB: (codigo: string | null) => void;
  /** Alterna un candidato (lo agrega si no está, lo quita si ya estaba). */
  toggleCandidato: (sel: CandidatoSeleccionEstadistico) => void;
  /** Quita un candidato por clave. */
  quitar: (key: string) => void;
  reset: () => void;
}

export const useFiltrosEstadistico = create<EstadisticoStore>((set) => ({
  corpA: null,
  corpB: null,
  seleccionados: [],
  // Cambiar una corporación limpia sólo los candidatos de esa corporación: la
  // lista de candidatos depende de la corporación.
  setCorpA: (codigo) =>
    set((s) => ({
      corpA: codigo,
      seleccionados: s.seleccionados.filter((c) => c.codigoCorporacion !== s.corpA),
    })),
  setCorpB: (codigo) =>
    set((s) => ({
      corpB: codigo,
      seleccionados: s.seleccionados.filter((c) => c.codigoCorporacion !== s.corpB),
    })),
  toggleCandidato: (sel) =>
    set((s) => {
      const key = keyCandidatoEstadistico(sel);
      const existe = s.seleccionados.some((c) => keyCandidatoEstadistico(c) === key);
      return {
        seleccionados: existe
          ? s.seleccionados.filter((c) => keyCandidatoEstadistico(c) !== key)
          : [...s.seleccionados, sel],
      };
    }),
  quitar: (key) =>
    set((s) => ({
      seleccionados: s.seleccionados.filter((c) => keyCandidatoEstadistico(c) !== key),
    })),
  reset: () => set({ corpA: null, corpB: null, seleccionados: [] }),
}));
