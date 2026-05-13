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
  codigoCorporacion: string;
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
  totalVotos: number;
  totalTerritorios: number;
  participacionPct: number;
}

export interface TerritorioComparativo {
  codigoDepartamento: string;
  codigoMunicipio: string | null;
  codigoPuesto: string | null;
  nombre: string;
  totalA: number;
  totalB: number;
  totalEleccion: number;
  ganador: GanadorComparativo;
  diferencia: number;
  diferenciaPct: number;
}

export interface ComparativoTerritorialResultado {
  nivel: NivelTerritorial;
  itemA: ItemComparativoTerritorial;
  itemB: ItemComparativoTerritorial;
  totalEleccion: number;
  territorios: TerritorioComparativo[];
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
