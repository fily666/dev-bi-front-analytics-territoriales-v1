export interface FiltroPoblacional {
  fuente?: string | null;
  dimension?: string | null;
  referencia?: string | null;
  criterio?: string | null;
  criterios?: string[] | null;
  anio?: number | null;
  mes?: number | null;
}

export interface KpiPoblacional {
  dimension: string;
  referencia: string | null;
  promedio: number;
  minimo: number;
  maximo: number;
  cantidadRegistros: number;
}

export interface SeriePoblacionalPunto {
  anio: number;
  mes: number | null;
  dimension: string | null;
  criterio: string | null;
  valor: number;
}

export interface RadarPoblacionalPunto {
  criterio: string;
  valor: number;
  anio: number | null;
  mes: number | null;
}

export interface FuenteConReferencias {
  fuente: string;
  cantidadReferencias: number;
}

export interface ResumenDimension {
  dimension: string;
  fuentes: FuenteConReferencias[];
  totalReferencias: number;
}
