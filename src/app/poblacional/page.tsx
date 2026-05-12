'use client';

import { FiltroPoblacional } from '@/modules/poblacional';
import { GraficaRadarPoblacional } from '@/modules/poblacional/infrastructure/ui/grafica-radar-poblacional';
import { GraficaTendenciaPoblacional } from '@/modules/poblacional/infrastructure/ui/grafica-tendencia-poblacional';
import {
  FiltrosPoblacionalState,
  PanelFiltrosPoblacional,
} from '@/modules/poblacional/infrastructure/ui/panel-filtros-poblacional';
import { TablaDatosPoblacional } from '@/modules/poblacional/infrastructure/ui/tabla-datos-poblacional';
import { Card, CardBody, CardHeader } from '@/shared/ui/components/card';
import {
  LineChart as LineIcon,
  Radar as RadarIcon,
  Table as TableIcon,
} from 'lucide-react';
import { useMemo, useState } from 'react';

const ESTADO_INICIAL: FiltrosPoblacionalState = {
  dimension: null,
  fuente: null,
  referencia: null,
  criterios: [],
};

export default function PoblacionalPage() {
  const [filtros, setFiltros] = useState<FiltrosPoblacionalState>(ESTADO_INICIAL);

  const filtroDominio: FiltroPoblacional = useMemo(
    () => ({
      dimension: filtros.dimension,
      fuente: filtros.fuente,
      referencia: filtros.referencia,
      criterios: filtros.criterios.length > 0 ? filtros.criterios : null,
    }),
    [filtros],
  );

  const tendenciaDescripcion = filtros.referencia
    ? `${filtros.referencia}${
        filtros.criterios.length > 0
          ? ` · ${filtros.criterios.length} criterio${filtros.criterios.length === 1 ? '' : 's'}`
          : ''
      }`
    : undefined;

  const radarDescripcion = filtros.referencia ? 'Último período disponible' : undefined;

  return (
    <div className="space-y-5 animate-fade-in">
      <PanelFiltrosPoblacional value={filtros} onChange={setFiltros} />

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="Tendencia"
            description={tendenciaDescripcion}
            icon={LineIcon}
          />
          <CardBody>
            <GraficaTendenciaPoblacional filtro={filtroDominio} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Radar por criterio"
            description={radarDescripcion}
            icon={RadarIcon}
          />
          <CardBody>
            <GraficaRadarPoblacional filtro={filtroDominio} />
          </CardBody>
        </Card>
      </section>

      <Card>
        <CardHeader title="Tabla de datos" icon={TableIcon} />
        <CardBody padding="none">
          <TablaDatosPoblacional filtro={filtroDominio} />
        </CardBody>
      </Card>
    </div>
  );
}
