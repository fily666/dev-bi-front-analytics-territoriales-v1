'use client';

import type {
  ComparativoTerritorialResultado,
  ItemComparativoTerritorial,
} from '@/modules/electoral/domain/entities';
import { Card, CardBody } from '@/shared/ui/components/card';
import { cn } from '@/shared/ui/utils/cn';
import { COLOR_A, COLOR_B } from './colores-comparativo';

const fmt = new Intl.NumberFormat('es-CO');

export interface TarjetasTotalesProps {
  resultado: ComparativoTerritorialResultado;
  /** Nombre del nivel territorial visible en la última KPI ("Departamentos"…). */
  etiquetaTerritorios: string;
}

export function TarjetasTotales({ resultado, etiquetaTerritorios }: TarjetasTotalesProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <TarjetaItem
        item={resultado.itemA}
        color={COLOR_A}
        rotulo="Ítem A"
        totalEleccion={resultado.totalEleccion}
        etiquetaTerritorios={etiquetaTerritorios}
      />
      <TarjetaItem
        item={resultado.itemB}
        color={COLOR_B}
        rotulo="Ítem B"
        totalEleccion={resultado.totalEleccion}
        etiquetaTerritorios={etiquetaTerritorios}
      />
    </div>
  );
}

function TarjetaItem({
  item,
  color,
  rotulo,
  totalEleccion,
  etiquetaTerritorios,
}: {
  item: ItemComparativoTerritorial;
  color: typeof COLOR_A;
  rotulo: string;
  totalEleccion: number;
  etiquetaTerritorios: string;
}) {
  return (
    <Card className={cn('border-2', color.border)}>
      <CardBody className="space-y-4">
        <div>
          <div className={cn('text-[11px] font-semibold uppercase tracking-wider', color.text)}>
            {rotulo}
          </div>
          <div className="mt-1 text-base font-semibold text-foreground">
            {item.nombre}
          </div>
          {item.nombrePartido && (
            <div className="text-xs text-foreground-muted">
              {item.nombrePartido}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Kpi etiqueta="Total votos" valor={fmt.format(item.totalVotos)} acentoColor={color.text} />
          <Kpi
            etiqueta="% elección"
            valor={`${item.participacionPct.toFixed(2)}%`}
            acentoColor={color.text}
          />
          <Kpi etiqueta={etiquetaTerritorios} valor={fmt.format(item.totalTerritorios)} />
          <Kpi etiqueta="Total elección" valor={`${fmt.format(totalEleccion)} votos`} chico />
        </div>
      </CardBody>
    </Card>
  );
}

function Kpi({
  etiqueta,
  valor,
  acentoColor,
  chico = false,
}: {
  etiqueta: string;
  valor: string;
  acentoColor?: string;
  chico?: boolean;
}) {
  return (
    <div className="rounded-lg border border-border bg-surface-elevated/50 p-3">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-foreground-muted">
        {etiqueta}
      </div>
      <div
        className={cn(
          chico ? 'text-sm font-semibold' : 'text-xl font-bold',
          'mt-1 num-tabular',
          acentoColor ?? 'text-foreground',
        )}
      >
        {valor}
      </div>
    </div>
  );
}
