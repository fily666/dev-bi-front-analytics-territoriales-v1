export interface Departamento {
  codigo: string;
  nombre: string;
}

export interface Municipio {
  codigo: string;
  nombre: string;
  codigoDepartamento: string;
}

export interface Puesto {
  codigo: string;
  nombre: string;
  codigoMunicipio: string;
  codigoZona: string | null;
}
