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

export interface BarChartProps {
  labels: string[];
  data: number[];
  label: string;
  horizontal?: boolean;
}

export function BarChart({ labels, data, label, horizontal = false }: BarChartProps) {
  const isDark = useResolvedTheme() === 'dark';
  const p = getChartPalette(isDark);

  return (
    <Bar
      data={{
        labels,
        datasets: [
          {
            label,
            data,
            backgroundColor: p.brand,
            borderRadius: 6,
            borderSkipped: false,
          },
        ],
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: horizontal ? 'y' : 'x',
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: p.tooltipBg,
            titleColor: p.tooltipTitle,
            bodyColor: p.tooltipBody,
            borderColor: p.grid,
            borderWidth: 1,
            padding: 10,
            displayColors: false,
            callbacks: {
              label: (ctx) =>
                `${ctx.dataset.label}: ${new Intl.NumberFormat('es-CO').format(Number(ctx.parsed[horizontal ? 'x' : 'y']))}`,
            },
          },
        },
        scales: {
          x: {
            ticks: { color: p.text, autoSkip: true, maxTicksLimit: 12, font: { size: 11 } },
            grid: { color: p.grid, display: !horizontal },
            border: { color: p.grid },
          },
          y: {
            beginAtZero: true,
            ticks: { color: p.text, font: { size: 11 } },
            grid: { color: p.grid, display: horizontal ? false : true },
            border: { color: p.grid },
          },
        },
      }}
    />
  );
}
