export interface FiltroElectoral {
  codigoCorporacion: string | null;
  codigoDepartamento: string | null;
  codigoMunicipio: string | null;
  codigoPartido: string | null;
}

export interface ResumenElectoral {
  totalVotos: number;
  totalCandidatos: number;
  totalPartidos: number;
  totalCorporaciones: number;
  totalDepartamentos: number;
  totalMunicipios: number;
  totalPuestos: number;
}

export interface VotosPorDepartamento {
  codigoDepartamento: string;
  nombreDepartamento: string;
  totalVotos: number;
}

export interface VotosPorMunicipio {
  codigoDepartamento: string;
  codigoMunicipio: string;
  nombreMunicipio: string;
  totalVotos: number;
}

export interface VotosPorPuesto {
  codigoDepartamento: string;
  codigoMunicipio: string;
  codigoPuesto: string;
  nombrePuesto: string;
  totalVotos: number;
}

export interface RankingPartido {
  codigoPartido: string;
  nombrePartido: string;
  totalVotos: number;
  totalCandidatos: number;
}

export interface RankingCandidato {
  codigoCandidato: string;
  nombreCandidato: string;
  codigoPartido: string | null;
  nombrePartido: string | null;
  totalVotos: number;
}

export interface ResumenCorporacion {
  codigoCorporacion: string;
  nombreCorporacion: string;
  totalVotos: number;
  totalCandidatos: number;
  totalPartidos: number;
  participacionPct: number;
}

export type TipoComparacionTerritorial = 'partido' | 'candidato';

export type NivelTerritorial = 'departamento' | 'municipio' | 'puesto';

export type GanadorComparativo = 'A' | 'B' | 'EMPATE';

export interface FiltroComparativoTerritorial {
  tipo: TipoComparacionTerritorial;
  codigoA: string;
  codigoB: string;
  /** Corporación del ítem A. */
  codigoCorporacionA: string;
  /**
   * Corporación del ítem B. Puede diferir de la de A para comparar candidatos
   * o partidos entre corporaciones/elecciones distintas.
   */
  codigoCorporacionB: string;
  codigoDepartamento: string | null;
  codigoMunicipio: string | null;
  /**
   * Partido del ítem A. Obligatorio cuando `tipo='candidato'` porque
   * `codigo_candidato` se reinicia por partido — la identidad real es la
   * tupla (codigo, codigoPartido). Se ignora para `tipo='partido'`.
   */
  codigoPartidoA: string | null;
  /** Partido del ítem B. Mismas reglas que `codigoPartidoA`. */
  codigoPartidoB: string | null;
}

export interface ItemComparativoTerritorial {
  codigo: string;
  nombre: string;
  nombrePartido: string | null;
  codigoPartido: string | null;
  /** Corporación del lado del comparativo. */
  codigoCorporacion: string;
  totalVotos: number;
  /** Total de votos de la elección de su corporación en el ámbito filtrado. */
  totalEleccion: number;
  totalTerritorios: number;
  /** % del ítem sobre el total de la elección de su corporación. */
  participacionPct: number;
}

export interface TerritorioComparativo {
  codigoDepartamento: string;
  codigoMunicipio: string | null;
  codigoPuesto: string | null;
  nombre: string;
  totalA: number;
  totalB: number;
  ganador: GanadorComparativo;
  /** |totalA - totalB| en votos absolutos. */
  diferencia: number;
  /** Ventaja porcentual del ganador sobre el par A + B (0–100). */
  diferenciaPct: number;
  /** % de los votos del par que corresponden a A (0–100). */
  participacionAPct: number;
  /** % de los votos del par que corresponden a B (0–100). */
  participacionBPct: number;
}

export interface ComparativoTerritorialResultado {
  nivel: NivelTerritorial;
  itemA: ItemComparativoTerritorial;
  itemB: ItemComparativoTerritorial;
  territorios: TerritorioComparativo[];
}

// ─── Comparativo estadístico (multi-candidato por departamento) ───────────────

/** Identidad de un candidato seleccionado en el comparativo estadístico. */
export interface CandidatoSeleccionEstadistico {
  codigoCorporacion: string;
  codigo: string;
  codigoPartido: string | null;
}

export interface FiltroComparativoEstadistico {
  candidatos: CandidatoSeleccionEstadistico[];
}

export interface ItemCandidatoEstadistico {
  /** Clave estable codigoCorporacion~codigo~codigoPartido. */
  key: string;
  codigo: string;
  codigoPartido: string | null;
  codigoCorporacion: string;
  nombre: string;
  nombrePartido: string | null;
  totalVotos: number;
  /** % sobre el total del conjunto seleccionado (0-100). */
  participacionPct: number;
}

export interface ValorCandidatoDepartamento {
  key: string;
  votos: number;
  /** % sobre el total del conjunto en el departamento (0-100). */
  participacionPct: number;
}

export interface DepartamentoComparativoEstadistico {
  codigoDepartamento: string;
  nombre: string;
  /** Votos por candidato, en el mismo orden que `candidatos`. */
  valores: ValorCandidatoDepartamento[];
  totalSeleccionados: number;
  /** Clave del candidato más votado en el departamento (null si no hay votos). */
  liderKey: string | null;
  /** Diferencia en votos entre el líder y el segundo más votado. */
  diferencia: number;
  /** Ventaja del líder sobre el segundo, en puntos porcentuales del conjunto (0-100). */
  ventajaPct: number;
}

export interface ComparativoEstadisticoResultado {
  candidatos: ItemCandidatoEstadistico[];
  departamentos: DepartamentoComparativoEstadistico[];
}

export type TipoSeleccionTerritoriosGanados = 'partido' | 'candidato';
export type NivelAnalisisTerritoriosGanados = 'departamento' | 'municipio';

export interface FiltroTerritoriosGanados {
  tipo: TipoSeleccionTerritoriosGanados;
  nivel: NivelAnalisisTerritoriosGanados;
  codigoCorporacion: string;
  codigo: string;
  /** Obligatorio cuando tipo='candidato'. */
  codigoPartido: string | null;
}

export interface TerritorioGanado {
  codigoDepartamento: string;
  codigoMunicipio: string | null;
  nombre: string;
  totalVotosTerritorio: number;
  votosSeleccionado: number;
  participacionPct: number;
  diferencia: number;
}

export interface TerritoriosGanadosResultado {
  tipo: TipoSeleccionTerritoriosGanados;
  nivel: NivelAnalisisTerritoriosGanados;
  codigo: string;
  nombre: string;
  codigoPartido: string | null;
  nombrePartido: string | null;
  totalVotosEleccion: number;
  votosSeleccionado: number;
  participacionPct: number;
  totalTerritoriosGanados: number;
  territorios: TerritorioGanado[];
}
