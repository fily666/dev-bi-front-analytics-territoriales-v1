import { Departamento, Municipio, Puesto } from '../domain/entities';
import { GeoRepositoryPort } from '../domain/geo.repository.port';

export class ListarDepartamentosUseCase {
  constructor(private readonly repo: GeoRepositoryPort) {}
  execute(): Promise<Departamento[]> {
    return this.repo.listarDepartamentos();
  }
}

export class ListarMunicipiosUseCase {
  constructor(private readonly repo: GeoRepositoryPort) {}
  execute(codigoDepartamento: string): Promise<Municipio[]> {
    return this.repo.listarMunicipios(codigoDepartamento);
  }
}

export class ListarPuestosUseCase {
  constructor(private readonly repo: GeoRepositoryPort) {}
  execute(codigoDepartamento: string, codigoMunicipio: string): Promise<Puesto[]> {
    return this.repo.listarPuestos(codigoDepartamento, codigoMunicipio);
  }
}
