export interface FiltroSocioeconomico {
  /** Filtra por la columna `fuente` de data_socioeconómica (DNP TerriData, etc.). */
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
  /**
   * Filtro opcional por serie estadística (criterio). Sólo aplica en indicadores
   * nacionales donde la referencia tiene múltiples series; se aplica en el cliente.
   */
  seriesEstadisticas?: string[] | null;
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
  /** Observación más reciente registrada para ese período. */
  observacion?: string | null;
  /** Unidad de medida del valor (porcentaje, monetario, …). */
  unidadMedida?: string | null;
  /** Serie estadística (criterio) — permite trazar una línea por serie. */
  serieEstadistica?: string | null;
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
  /** Migración 2026-05: unidad para formateo visual (porcentaje, monetario, índice, tasa, cantidad…). */
  unidadMedida?: string | null;
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
  /** Observación del último reporte del depto en esta dimensión. */
  observacion?: string | null;
  /** Unidad para formateo visual. */
  unidadMedida?: string | null;
}
