'use client';

import type { ComparativoEstadisticoResultado } from '@/modules/electoral/domain/entities';
import { BarChart } from '@/shared/ui/components/bar-chart';
import { DonutChart } from '@/shared/ui/components/donut-chart';
import { GroupedBarChart } from '@/shared/ui/components/grouped-bar-chart';
import { RadarChart } from '@/shared/ui/components/radar-chart';
import { cn } from '@/shared/ui/utils/cn';
import { BarChart3, BarChartHorizontal, LucideIcon, PieChart, Radar } from 'lucide-react';
import { useMemo } from 'react';
import { colorCandidato } from './colores-estadistico';

/** Máximo de departamentos representados en radar / barras agrupadas. */
const TOP_DEPTOS = 8;

type TipoGrafica = 'distribucion' | 'radar' | 'barras-agrupadas' | 'barras-horizontales';

interface Analisis {
  tipo: TipoGrafica;
  icon: LucideIcon;
  badge: string;
  motivo: string;
}

/**
 * Elige la gráfica más adecuada según la cantidad de candidatos (n) y de
 * departamentos con datos (d):
 *  - n ≤ 3                  → Distribución (donut): participación porcentual.
 *  - 4 ≤ n ≤ 6 · d ≤ 8      → Radar: comparación territorial por departamento.
 *  - 4 ≤ n ≤ 6 · d > 8      → Barras agrupadas (top departamentos).
 *  - n ≥ 7                  → Barras horizontales: ranking de votos por candidato.
 */
function elegirGrafica(n: number, d: number): Analisis {
  if (n <= 3) {
    return {
      tipo: 'distribucion',
      icon: PieChart,
      badge: 'Distribución',
      motivo: `${n} candidatos — participación porcentual del total`,
    };
  }
  if (n <= 6 && d <= TOP_DEPTOS) {
    return {
      tipo: 'radar',
      icon: Radar,
      badge: 'Radar',
      motivo: `${n} candidatos × ${d} departamentos — comparación territorial`,
    };
  }
  if (n <= 6) {
    return {
      tipo: 'barras-agrupadas',
      icon: BarChart3,
      badge: 'Barras agrupadas',
      motivo: `${n} candidatos — top ${TOP_DEPTOS} departamentos`,
    };
  }
  return {
    tipo: 'barras-horizontales',
    icon: BarChartHorizontal,
    badge: 'Barras horizontales',
    motivo: `${n} candidatos — ranking de votos totales`,
  };
}

export interface GraficaComparativoEstadisticoProps {
  resultado: ComparativoEstadisticoResultado;
}

export function GraficaComparativoEstadistico({
  resultado,
}: GraficaComparativoEstadisticoProps) {
  const { candidatos, departamentos } = resultado;

  const analisis = useMemo(
    () => elegirGrafica(candidatos.length, departamentos.length),
    [candidatos.length, departamentos.length],
  );

  const colores = useMemo(
    () => candidatos.map((_, i) => colorCandidato(i)),
    [candidatos],
  );

  // Top departamentos (ya vienen ordenados por total del conjunto desc).
  const topDeptos = useMemo(
    () => departamentos.slice(0, TOP_DEPTOS),
    [departamentos],
  );

  // votos[candidatoKey][deptoCodigo] para radar / barras agrupadas.
  const votosPorDepto = useMemo(() => {
    const m = new Map<string, Map<string, number>>();
    for (const d of departamentos) {
      const inner = new Map<string, number>();
      for (const v of d.valores) inner.set(v.key, v.votos);
      m.set(d.codigoDepartamento, inner);
    }
    return m;
  }, [departamentos]);

  const Icon = analisis.icon;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2 text-xs text-foreground-muted">
        <span
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-semibold',
            'bg-brand-muted text-brand',
          )}
        >
          <Icon size={12} />
          {analisis.badge}
        </span>
        <span className="text-foreground-subtle">{analisis.motivo}</span>
      </div>

      <div className="h-[320px] sm:h-[360px]">
        {analisis.tipo === 'distribucion' && (
          <DonutChart
            labels={candidatos.map((c) => c.nombre)}
            data={candidatos.map((c) => c.totalVotos)}
            colors={colores}
          />
        )}

        {analisis.tipo === 'barras-horizontales' && (
          <BarChart
            label="Total de votos"
            horizontal
            labels={candidatos.map((c) => c.nombre)}
            data={candidatos.map((c) => c.totalVotos)}
            colors={colores}
          />
        )}

        {analisis.tipo === 'radar' && (
          <RadarChart
            labels={topDeptos.map((d) => d.nombre)}
            colors={colores}
            datasets={candidatos.map((c) => ({
              label: c.nombre,
              data: topDeptos.map(
                (d) => votosPorDepto.get(d.codigoDepartamento)?.get(c.key) ?? 0,
              ),
            }))}
          />
        )}

        {analisis.tipo === 'barras-agrupadas' && (
          <GroupedBarChart
            labels={topDeptos.map((d) => d.nombre)}
            datasets={candidatos.map((c, i) => ({
              label: c.nombre,
              color: colorCandidato(i),
              data: topDeptos.map(
                (d) => votosPorDepto.get(d.codigoDepartamento)?.get(c.key) ?? 0,
              ),
            }))}
          />
        )}
      </div>
    </div>
  );
}
