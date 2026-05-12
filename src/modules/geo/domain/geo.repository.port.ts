import { Departamento, Municipio, Puesto } from './entities';

export interface GeoRepositoryPort {
  listarDepartamentos(): Promise<Departamento[]>;
  listarMunicipios(codigoDepartamento: string): Promise<Municipio[]>;
  listarPuestos(codigoDepartamento: string, codigoMunicipio: string): Promise<Puesto[]>;
}
