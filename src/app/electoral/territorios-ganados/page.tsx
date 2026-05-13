'use client';

import { useTerritoriosGanados } from '@/modules/electoral/application/hooks';
import { KpisTerritoriosGanados } from '@/modules/electoral/infrastructure/ui/territorios-ganados/kpis-territorios-ganados';
import { PanelSeleccionTerritorios } from '@/modules/electoral/infrastructure/ui/territorios-ganados/panel-seleccion-territorios';
import { TablaTerritoriosGanados } from '@/modules/electoral/infrastructure/ui/territorios-ganados/tabla-territorios-ganados';
import { useFiltrosTerritoriosGanados } from '@/modules/electoral/infrastructure/ui/territorios-ganados/filtros-territorios-ganados-store';
import { useFiltrosGlobales } from '@/shared/application/stores/filtros-globales.store';
import { Card, CardBody, CardHeader } from '@/shared/ui/components/card';
import { EmptyState } from '@/shared/ui/components/empty-state';
import { Skeleton } from '@/shared/ui/components/skeleton';
import { Table as TableIcon } from 'lucide-react';

export default function TerritoriosGanadosPage() {
  const codigoCorporacion = useFiltrosGlobales((s) => s.codigoCorporacion);
  const nivel = useFiltrosTerritoriosGanados((s) => s.nivel);
  const seleccion = useFiltrosTerritoriosGanados((s) => s.seleccion);

  const filtro = {
    tipo: 'candidato' as const,
    nivel,
    codigoCorporacion: codigoCorporacion ?? undefined,
    codigo: seleccion?.codigo ?? undefined,
    codigoPartido: seleccion?.codigoPartido ?? null,
  };

  const seleccionValida = !!seleccion?.codigo && !!seleccion.codigoPartido;
  const haySeleccionCompleta = !!(codigoCorporacion && seleccionValida);

  const { data: resultado, isLoading, isError } = useTerritoriosGanados(filtro);

  const etiquetaTerritorios = nivel === 'departamento' ? 'departamentos' : 'municipios';
  const encabezadoTabla = `Territorios donde fue el más votado (${etiquetaTerritorios})`;

  return (
    <div className="space-y-5 animate-fade-in">
      <PanelSeleccionTerritorios />

      {!haySeleccionCompleta ? (
        <Card>
          <CardBody>
            <EmptyState
              tone="info"
              title="Configure el análisis"
              description="Seleccione una corporación en los filtros generales y un candidato para analizar sus territorios ganados."
            />
          </CardBody>
        </Card>
      ) : isLoading ? (
        <div className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
          <Skeleton className="h-[420px] w-full" />
        </div>
      ) : isError ? (
        <Card>
          <CardBody>
            <EmptyState
              tone="danger"
              title="Error al cargar el análisis"
              description="Vuelva a intentarlo o ajuste los filtros."
            />
          </CardBody>
        </Card>
      ) : !resultado ? null : (
        <>
          <KpisTerritoriosGanados resultado={resultado} />

          <Card>
            <CardHeader
              title={encabezadoTabla}
              description={
                resultado.totalTerritoriosGanados > 0
                  ? `${resultado.totalTerritoriosGanados} ${
                      resultado.totalTerritoriosGanados === 1
                        ? nivel === 'departamento'
                          ? 'departamento'
                          : 'municipio'
                        : etiquetaTerritorios
                    } con mayor votación de ${resultado.nombre}`
                  : `Sin ${etiquetaTerritorios} donde ${resultado.nombre} haya sido el más votado`
              }
              icon={TableIcon}
              dense
            />
            <CardBody padding="none">
              <TablaTerritoriosGanados
                territorios={resultado.territorios}
                nivel={resultado.nivel}
              />
            </CardBody>
          </Card>
        </>
      )}
    </div>
  );
}
