'use client';

import { create } from 'zustand';

export interface FiltrosGlobales {
  codigoCorporacion: string | null;
  codigoDepartamento: string | null;
  codigoMunicipio: string | null;
  codigoPartido: string | null;
}

interface FiltrosGlobalesStore extends FiltrosGlobales {
  setCorporacion: (codigo: string | null) => void;
  setDepartamento: (codigo: string | null) => void;
  setMunicipio: (codigo: string | null) => void;
  setPartido: (codigo: string | null) => void;
  reset: () => void;
}

const initialState: FiltrosGlobales = {
  codigoCorporacion: null,
  codigoDepartamento: null,
  codigoMunicipio: null,
  codigoPartido: null,
};

export const useFiltrosGlobales = create<FiltrosGlobalesStore>((set) => ({
  ...initialState,
  // Cambiar corporación resetea partido (filtros dependientes)
  setCorporacion: (codigo) => set({ codigoCorporacion: codigo, codigoPartido: null }),
  // Cambiar depto resetea municipio (filtros dependientes)
  setDepartamento: (codigo) =>
    set({ codigoDepartamento: codigo, codigoMunicipio: null }),
  setMunicipio: (codigo) => set({ codigoMunicipio: codigo }),
  setPartido: (codigo) => set({ codigoPartido: codigo }),
  reset: () => set(initialState),
}));
