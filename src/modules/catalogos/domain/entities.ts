export interface Corporacion {
  codigo: string;
  nombre: string;
}

export interface Partido {
  codigo: string;
  nombre: string;
}

export interface Candidato {
  codigo: string;
  nombre: string;
  codigoPartido: string | null;
  codigoCorporacion: string | null;
  nombrePartido: string | null;
}

export interface ListarCandidatosParams {
  codigoCorporacion?: string | null;
  codigoPartido?: string | null;
  limite?: number;
}
