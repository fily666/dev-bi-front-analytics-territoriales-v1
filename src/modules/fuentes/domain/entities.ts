export interface Fuente {
  id: string;
  fuente: string;
  tipificacion: string;
  fechaPublicacion: string | null;
  link: string | null;
}

export interface FiltroFuentes {
  tipificacion: string | null;
  fuente: string | null;
}
