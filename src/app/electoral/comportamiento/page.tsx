'use client';

import { useResumenElectoral } from '@/modules/electoral/application/hooks';
import { MapaColombia } from '@/modules/electoral/infrastructure/ui/mapa-colombia/mapa-colombia';
import { MatrizOrganizaciones } from '@/modules/electoral/infrastructure/ui/matriz-organizaciones';
import { PanelTerritorialComportamiento } from '@/modules/electoral/infrastructure/ui/panel-territorial-comportamiento';
import { SelectorCorporacion } from '@/modules/electoral/infrastructure/ui/selector-corporacion';
import { useFiltrosGlobales } from '@/shared/application/stores/filtros-globales.store';
import { Card, CardBody, CardHeader } from '@/shared/ui/components/card';
import { KpiCard } from '@/shared/ui/components/kpi-card';
import { Skeleton } from '@/shared/ui/components/skeleton';
import {
  Building2,
  LayoutGrid,
  MapPin,
  Map as MapIcon,
  UserCheck,
  Vote,
} from 'lucide-react';

const fmt = new Intl.NumberFormat('es-CO');

export default function ComportamientoElectoralPage() {
  // Selector granular: el guard sólo depende de la corporación, no de los
  // demás filtros. Suscribirse a todo el store re-renderiza la página entera
  // (incluido el mapa) con cada cambio de depto/municipio/partido.
  const codigoCorporacion = useFiltrosGlobales((s) => s.codigoCorporacion);

  if (!codigoCorporacion) {
    return <SelectorCorporacion contextoVista="el panel electoral" />;
  }

  return <ComportamientoContent />;
}

function ComportamientoContent() {
  const { data: resumen, isLoading: loadingResumen } = useResumenElectoral();

  return (
    <div className="space-y-5 animate-fade-in">
      {/* KPIs */}
      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {loadingResumen ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28" />)
        ) : resumen ? (
          <>
            <KpiCard label="Total votos" value={fmt.format(resumen.totalVotos)} icon={Vote} tone="brand" />
            <KpiCard label="Candidatos" value={fmt.format(resumen.totalCandidatos)} icon={UserCheck} tone="info" />
            <KpiCard label="Partidos" value={fmt.format(resumen.totalPartidos)} icon={Building2} tone="success" />
            <KpiCard label="Puestos" value={fmt.format(resumen.totalPuestos)} icon={MapPin} tone="warning" />
          </>
        ) : null}
      </section>

      {/* Mapa + Panel territorial adaptativo */}
      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="Distribución territorial"
            description="Toque un departamento para ver sus municipios"
            icon={MapIcon}
          />
          <CardBody padding="none">
            <div className="h-[320px] w-full p-3 sm:h-[400px] md:h-[440px] lg:h-[460px]">
              <MapaColombia />
            </div>
          </CardBody>
        </Card>

        <Card className="flex flex-col">
          <PanelTerritorialComportamiento />
        </Card>
      </section>

      {/* Matriz de organizaciones con drill-down a candidatos */}
      <section>
        <Card>
          <CardHeader
            title="Matriz de organizaciones"
            description="Agrupado por partido — expanda para ver candidatos"
            icon={LayoutGrid}
          />
          <CardBody padding="none">
            <MatrizOrganizaciones />
          </CardBody>
        </Card>
      </section>
    </div>
  );
}
