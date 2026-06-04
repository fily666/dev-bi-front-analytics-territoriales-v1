'use client';

import { useResolvedTheme } from '@/shared/application/hooks/use-resolved-theme';
import { getChartPalette } from '@/shared/ui/utils/chart-palette';
import {
  ArcElement,
  Chart as ChartJS,
  Legend,
  Tooltip,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export interface DonutChartProps {
  labels: string[];
  data: number[];
  /** Colores por segmento (hex/rgb). Si se omite usa la serie de la paleta. */
  colors?: string[];
}

export function DonutChart({ labels, data, colors }: DonutChartProps) {
  const isDark = useResolvedTheme() === 'dark';
  const p = getChartPalette(isDark);

  return (
    <Doughnut
      data={{
        labels,
        datasets: [
          {
            data,
            backgroundColor: labels.map(
              (_, i) => colors?.[i] ?? p.series[i % p.series.length],
            ),
            borderColor: p.surface,
            borderWidth: 2,
          },
        ],
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        cutout: '62%',
        plugins: {
          legend: {
            position: 'right',
            labels: {
              color: p.text,
              font: { size: 11 },
              usePointStyle: true,
              padding: 12,
            },
          },
          tooltip: {
            backgroundColor: p.tooltipBg,
            titleColor: p.tooltipTitle,
            bodyColor: p.tooltipBody,
            borderColor: p.grid,
            borderWidth: 1,
            padding: 10,
            usePointStyle: true,
          },
        },
      }}
    />
  );
}
