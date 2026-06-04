'use client';

import { useResolvedTheme } from '@/shared/application/hooks/use-resolved-theme';
import { getChartPalette } from '@/shared/ui/utils/chart-palette';
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export interface GroupedBarDataset {
  label: string;
  data: number[];
  /** Color sólido rgb(...). Si se omite usa la serie de la paleta por índice. */
  color?: string;
}

export interface GroupedBarChartProps {
  labels: string[];
  datasets: GroupedBarDataset[];
  horizontal?: boolean;
  /** Formato del valor (eje + tooltip). Por defecto Intl.NumberFormat es-CO. */
  formatearValor?: (valor: number) => string;
}

const defaultFmt = new Intl.NumberFormat('es-CO', { maximumFractionDigits: 2 });

/**
 * Barras agrupadas multi-serie. A diferencia de `BarChart` (un solo dataset),
 * pinta una barra por dataset dentro de cada categoría, con leyenda. Usado por
 * el comparativo estadístico para mostrar varios candidatos por departamento.
 */
export function GroupedBarChart({
  labels,
  datasets,
  horizontal = false,
  formatearValor,
}: GroupedBarChartProps) {
  const isDark = useResolvedTheme() === 'dark';
  const p = getChartPalette(isDark);
  const fmt = formatearValor ?? ((v: number) => defaultFmt.format(v));

  const valueAxis = {
    type: 'linear' as const,
    beginAtZero: true,
    ticks: {
      color: p.text,
      font: { size: 11 },
      callback: (value: string | number) => fmt(Number(value)),
    },
    grid: { color: p.grid },
    border: { color: p.grid },
  };
  const categoryAxis = {
    type: 'category' as const,
    ticks: { color: p.text, autoSkip: false, font: { size: 11 } },
    grid: { color: p.grid, display: false },
    border: { color: p.grid },
  };

  return (
    <Bar
      data={{
        labels,
        datasets: datasets.map((d, i) => ({
          label: d.label,
          data: d.data,
          backgroundColor: d.color ?? p.series[i % p.series.length],
          borderRadius: 5,
          borderSkipped: false,
          maxBarThickness: 38,
        })),
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: horizontal ? 'y' : 'x',
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: p.text, font: { size: 11 }, usePointStyle: true, padding: 14 },
          },
          tooltip: {
            backgroundColor: p.tooltipBg,
            titleColor: p.tooltipTitle,
            bodyColor: p.tooltipBody,
            borderColor: p.grid,
            borderWidth: 1,
            padding: 10,
            usePointStyle: true,
            callbacks: {
              label: (ctx) => {
                const valor = Number(ctx.parsed[horizontal ? 'x' : 'y']);
                return `${ctx.dataset.label}: ${fmt(valor)}`;
              },
            },
          },
        },
        scales: horizontal
          ? { x: valueAxis, y: categoryAxis }
          : { x: categoryAxis, y: valueAxis },
      }}
    />
  );
}
