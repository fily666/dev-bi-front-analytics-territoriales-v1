'use client';

import { create } from 'zustand';
import type { NivelAnalisisTerritoriosGanados } from '@/modules/electoral/domain/entities';

/**
 * Selección del candidato cuyo desempeño territorial se analiza.
 * La identidad real es la tupla (codigo, codigoPartido) porque
 * `codigo_candidato` se reinicia por partido.
 */
export interface SeleccionTerritoriosGanados {
  codigo: string;
  codigoPartido: string | null;
}

interface TerritoriosGanadosStore {
  nivel: NivelAnalisisTerritoriosGanados;
  seleccion: SeleccionTerritoriosGanados | null;
  setNivel: (nivel: NivelAnalisisTerritoriosGanados) => void;
  setSeleccion: (s: SeleccionTerritoriosGanados | null) => void;
  reset: () => void;
}

export const useFiltrosTerritoriosGanados = create<TerritoriosGanadosStore>((set) => ({
  nivel: 'departamento',
  seleccion: null,
  setNivel: (nivel) => set({ nivel }),
  setSeleccion: (seleccion) => set({ seleccion }),
  reset: () => set({ nivel: 'departamento', seleccion: null }),
}));
