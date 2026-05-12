import { ApiClient } from '@/shared/infrastructure/http/api-client';
import { Departamento, Municipio, Puesto } from '../../domain/entities';
import { GeoRepositoryPort } from '../../domain/geo.repository.port';

export class GeoHttpRepository implements GeoRepositoryPort {
  constructor(private readonly api: ApiClient) {}

  listarDepartamentos(): Promise<Departamento[]> {
    return this.api.get<Departamento[]>('/geo/departamentos');
  }

  listarMunicipios(codigoDepartamento: string): Promise<Municipio[]> {
    return this.api.get<Municipio[]>(
      `/geo/departamentos/${encodeURIComponent(codigoDepartamento)}/municipios`,
    );
  }

  listarPuestos(codigoDepartamento: string, codigoMunicipio: string): Promise<Puesto[]> {
    return this.api.get<Puesto[]>('/geo/puestos', { codigoDepartamento, codigoMunicipio });
  }
}
