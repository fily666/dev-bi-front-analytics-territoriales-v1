'use client';

import { useCompararTerritorial } from '@/modules/electoral/application/hooks';
import { MapaComparativo } from '@/modules/electoral/infrastructure/ui/comparativo/mapa-comparativo';
import { PanelEtiquetasComparativo } from '@/modules/electoral/infrastructure/ui/comparativo/panel-etiquetas';
import { PanelSeleccionComparativo } from '@/modules/electoral/infrastructure/ui/comparativo/panel-seleccion';
import { TablaResultadosTerritorial } from '@/modules/electoral/infrastructure/ui/comparativo/tabla-resultados-territorial';
import { TarjetasTotales } from '@/modules/electoral/infrastructure/ui/comparativo/tarjetas-totales';
import { useFiltrosComparativo } from '@/modules/electoral/infrastructure/ui/comparativo/filtros-comparativo-store';
import { useFiltrosGlobales } from '@/shared/application/stores/filtros-globales.store';
import { Card, CardBody, CardHeader } from '@/shared/ui/components/card';
import { EmptyState } from '@/shared/ui/components/empty-state';
import { Skeleton } from '@/shared/ui/components/skeleton';
import { ListChecks, Map as MapIcon, Table as TableIcon } from 'lucide-react';

export default function ComparativoPage() {
  const codigoCorporacion = useFiltrosGlobales((s) => s.codigoCorporacion);
  const codigoDepartamento = useFiltrosGlobales((s) => s.codigoDepartamento);
  const codigoMunicipio = useFiltrosGlobales((s) => s.codigoMunicipio);
  const { tipo, selA, selB } = useFiltrosComparativo();

  const filtro = {
    tipo,
    codigoA: selA?.codigo ?? undefined,
    codigoB: selB?.codigo ?? undefined,
    codigoCorporacion: codigoCorporacion ?? undefined,
    codigoDepartamento: codigoDepartamento ?? null,
    codigoMunicipio: codigoMunicipio ?? null,
    codigoPartidoA: selA?.codigoPartido ?? null,
    codigoPartidoB: selB?.codigoPartido ?? null,
  };

  // Para 'candidato' la identidad es (codigo, codigoPartido). Para 'partido' basta el código.
  const sonDistintos = !!(
    selA &&
    selB &&
    (tipo === 'candidato'
      ? selA.codigo !== selB.codigo || selA.codigoPartido !== selB.codigoPartido
      : selA.codigo !== selB.codigo)
  );
  // Para candidatos exigimos también codigoPartido en ambos lados.
  const seleccionValida =
    tipo === 'partido'
      ? sonDistintos
      : sonDistintos && !!selA?.codigoPartido && !!selB?.codigoPartido;
  const haySeleccionCompleta = !!(codigoCorporacion && seleccionValida);

  const { data: resultado, isLoading, isError } = useCompararTerritorial(filtro);

  const etiquetaTerritorios =
    resultado?.nivel === 'puesto'
      ? 'Puestos'
      : resultado?.nivel === 'municipio'
        ? 'Municipios'
        : 'Departamentos';

  const encabezadoNivel =
    resultado?.nivel === 'puesto'
      ? 'Puestos'
      : resultado?.nivel === 'municipio'
        ? 'Municipios'
        : 'Departamentos';

  const encabezadoTerritorio =
    resultado?.nivel === 'puesto'
      ? 'Puesto'
      : resultado?.nivel === 'municipio'
        ? 'Municipio'
        : 'Departamento';

  return (
    <div className="space-y-5 animate-fade-in">
      <PanelSeleccionComparativo />

      {!haySeleccionCompleta ? (
        <Card>
          <CardBody>
            <EmptyState
              tone="info"
              title="Configure el comparativo"
              description="Seleccione una corporación en los filtros generales y los dos ítems a comparar."
            />
          </CardBody>
        </Card>
      ) : isLoading ? (
        <div className="space-y-5">
          <Skeleton className="h-40 w-full" />
          <div className="grid gap-4 lg:grid-cols-3">
            <Skeleton className="h-[320px] w-full sm:h-[400px] md:h-[440px] lg:col-span-2 lg:h-[480px]" />
            <Skeleton className="h-[320px] w-full sm:h-[400px] md:h-[440px] lg:h-[480px]" />
          </div>
        </div>
      ) : isError ? (
        <Card>
          <CardBody>
            <EmptyState
              tone="danger"
              title="Error al cargar el comparativo"
              description="Vuelva a intentarlo o ajuste los filtros."
            />
          </CardBody>
        </Card>
      ) : !resultado || resultado.territorios.length === 0 ? (
        <Card>
          <CardBody>
            <EmptyState
              title="Sin datos para los filtros aplicados"
              description="No hay territorios donde ambos ítems hayan obtenido votos."
            />
          </CardBody>
        </Card>
      ) : (
        <>
          <TarjetasTotales
            resultado={resultado}
            etiquetaTerritorios={etiquetaTerritorios}
          />

          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader
                title={
                  resultado.nivel === 'puesto'
                    ? 'Mapa del municipio seleccionado'
                    : `Mapa por ${encabezadoTerritorio.toLowerCase()}`
                }
                description={
                  resultado.nivel === 'puesto'
                    ? 'Resaltado = ganador agregado · detalle por puesto en la tabla'
                    : 'Color = ganador · intensidad = brecha'
                }
                icon={MapIcon}
                dense
              />
              <CardBody padding="none">
                <div className="map-wrapper h-[320px] sm:h-[400px] md:h-[440px] lg:h-[480px]">
                  <MapaComparativo resultado={resultado} />
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHeader
                title="Brechas y participación"
                icon={ListChecks}
                dense
              />
              <CardBody>
                <PanelEtiquetasComparativo
                  resultado={resultado}
                  encabezadoNivel={encabezadoNivel}
                />
              </CardBody>
            </Card>
          </div>

          <Card>
            <CardHeader
              title={`Detalle por ${encabezadoTerritorio.toLowerCase()}`}
              description={`${resultado.territorios.length} ${resultado.territorios.length === 1 ? encabezadoTerritorio.toLowerCase() : encabezadoNivel.toLowerCase()}`}
              icon={TableIcon}
              dense
            />
            <CardBody padding="none">
              <TablaResultadosTerritorial
                resultado={resultado}
                encabezadoTerritorio={encabezadoTerritorio}
              />
            </CardBody>
          </Card>
        </>
      )}
    </div>
  );
}
