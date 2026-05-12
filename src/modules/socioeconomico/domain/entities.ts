export interface FiltroSocioeconomico {
  /** Filtra por la columna `fuente` de data_publicaciones (DNP TerriData, etc.). */
  fuentePublicacion?: string | null;
  codigoDepartamento?: string | null;
  /** Antes `categoria`. */
  dimension?: string | null;
  /** Antes `ano`. */
  periodo?: number | null;
  /** Nuevo. */
  referencia?: string | null;
  /** Nuevo: Departamental | Nacional | … */
  nivelGeografico?: string | null;
}

export interface KpiSocioeconomico {
  /** Antes `categoria`. */
  dimension: string;
  promedio: number;
  minimo: number;
  maximo: number;
  cantidadRegistros: number;
  /** Antes `anoMinimo`. */
  periodoMinimo: number | null;
  /** Antes `anoMaximo`. */
  periodoMaximo: number | null;
}

export interface SerieHistoricaPunto {
  /** Antes `ano`. */
  periodo: number;
  /** Antes `categoria`. */
  dimension: string | null;
  valor: number;
}

export interface IndicadorPorDepartamento {
  codigoDepartamento: string;
  departamento: string;
  /** Antes `calificacion` — "medio" | "alto" | "extremo" | otra cadena | null */
  nivelRiesgo: string | null;
  valor: number;
  /** Antes `ano`. */
  periodo: number;
  /** Antes `categoria`. */
  dimension: string | null;
  /** Nuevos campos. */
  serieEstadistica: string | null;
  nivelGeografico: string | null;
  referencia: string | null;
  observacion: string | null;
}

/**
 * Snapshot por dimensión para un departamento dado: incluye ranking y
 * promedio nacional para construir KPIs comparativos en el detalle.
 */
export interface ResumenDepartamentoDimension {
  codigoDepartamento: string;
  departamento: string;
  /** Antes `categoria`. */
  dimension: string;
  valor: number;
  /** Antes `calificacion`. */
  nivelRiesgo: string | null;
  /** Antes `ano`. */
  periodo: number;
  /** Posición del depto (1 = mayor valor de la dimensión). */
  posicion: number;
  totalDepartamentos: number;
  /** Promedio nacional de la dimensión para ese período. */
  promedioNacional: number;
  /** Antes `valorAnoAnterior`. */
  valorPeriodoAnterior: number | null;
  /** Antes `anoAnterior`. */
  periodoAnterior: number | null;
}
