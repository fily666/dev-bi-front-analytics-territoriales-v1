'use client';

import { useResumenElectoral } from '@/modules/electoral/application/hooks';
import { MapaColombia } from '@/modules/electoral/infrastructure/ui/mapa-colombia/mapa-colombia';
import { SelectorCorporacion } from '@/modules/electoral/infrastructure/ui/selector-corporacion';
import { TablaRankingPartidos } from '@/modules/electoral/infrastructure/ui/tabla-ranking-partidos';
import { TarjetasCorporaciones } from '@/modules/electoral/infrastructure/ui/tarjetas-corporaciones';
import { TopTerritorial } from '@/modules/electoral/infrastructure/ui/top-territorial';
import { PanelPoblacionalHome } from '@/modules/poblacional/infrastructure/ui/panel-poblacional-home';
import { PanelSocioHome } from '@/modules/socioeconomico/infrastructure/ui/panel-socio-home';
import { useFiltrosGlobales } from '@/shared/application/stores/filtros-globales.store';
import { Card, CardBody, CardHeader } from '@/shared/ui/components/card';
import { InsightsPanel, type Insight } from '@/shared/ui/components/insights-panel';
import { Map as MapIcon, TrendingUp, Trophy, Users } from 'lucide-react';
import { useMemo } from 'react';

const fmt = new Intl.NumberFormat('es-CO');

export default function HomePage() {
  // Selector específico: el guard sólo necesita la corporación, así no
  // re-renderiza cuando cambian otros filtros sin razón.
  const codigoCorporacion = useFiltrosGlobales((s) => s.codigoCorporacion);

  // Filtro previo obligatorio: las corporaciones no pueden mezclarse.
  if (!codigoCorporacion) {
    return <SelectorCorporacion contextoVista="el dashboard ejecutivo" />;
  }

  return <HomeContent />;
}

function HomeContent() {
  const { data: resumen } = useResumenElectoral();

  const insights = useMemo<Insight[]>(() => {
    if (!resumen) return [];
    const list: Insight[] = [];
    list.push({
      id: 'cobertura',
      tone: 'info',
      title: 'Cobertura territorial',
      description: `Datos disponibles para ${fmt.format(resumen.totalDepartamentos)} departamentos y ${fmt.format(resumen.totalMunicipios)} municipios.`,
    });
    if (resumen.totalCandidatos > 0) {
      const promedioVotos = resumen.totalVotos / Math.max(1, resumen.totalCandidatos);
      list.push({
        id: 'votos-candidato',
        tone: 'positive',
        title: 'Promedio votos por candidato',
        description: `Cada candidato recibe en promedio ${fmt.format(Math.round(promedioVotos))} votos según los filtros activos.`,
      });
    }
    return list;
  }, [resumen]);

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Mapa + Tarjetas corporaciones + Top partidos */}
      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Distribución territorial" icon={MapIcon} />
          <CardBody padding="none">
            <div className="h-[320px] w-full p-3 sm:h-[400px] md:h-[440px] lg:h-[480px]">
              <MapaColombia />
            </div>
          </CardBody>
        </Card>

        <div className="flex flex-col gap-4">
          <TarjetasCorporaciones />
          <TopTerritorial limite={5} />
        </div>
      </section>

      <section className="grid gap-4">
        <Card>
          <CardHeader title="Ranking de partidos" icon={Trophy} />
          <CardBody padding="none">
            <TablaRankingPartidos limite={7} />
          </CardBody>
        </Card>
      </section>

      {/* Sección socioeconómica — afectada sólo por filtro de Departamento */}
      <Card>
        <CardHeader title="Indicadores socioeconómicos" icon={TrendingUp} />
        <CardBody>
          <PanelSocioHome />
        </CardBody>
      </Card>

      {/* Sección poblacional — independiente de los filtros del Home */}
      <Card>
        <CardHeader title="Impacto poblacional" icon={Users} />
        <CardBody>
          <PanelPoblacionalHome />
        </CardBody>
      </Card>

      {/* Insights ejecutivos */}
      <section>
        <InsightsPanel insights={insights} />
      </section>
    </div>
  );
}
