'use client';

import { useResolvedTheme } from '@/shared/application/hooks/use-resolved-theme';
import { getChartPalette } from '@/shared/ui/utils/chart-palette';
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Filler,
  Title,
  Tooltip,
  Legend,
);

export interface LineDataset {
  label: string;
  data: number[];
}

export interface LineChartProps {
  labels: string[];
  datasets: LineDataset[];
}

export function LineChart({ labels, datasets }: LineChartProps) {
  const isDark = useResolvedTheme() === 'dark';
  const p = getChartPalette(isDark);

  return (
    <Line
      data={{
        labels,
        datasets: datasets.map((d, i) => {
          const color = p.series[i % p.series.length];
          return {
            label: d.label,
            data: d.data,
            borderColor: color,
            backgroundColor: color,
            tension: 0.35,
            borderWidth: 2,
            pointRadius: 3,
            pointHoverRadius: 5,
          };
        }),
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: p.text, font: { size: 11 }, usePointStyle: true, padding: 16 },
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
        scales: {
          x: {
            ticks: { color: p.text, font: { size: 11 } },
            grid: { color: p.grid, display: false },
            border: { color: p.grid },
          },
          y: {
            beginAtZero: true,
            ticks: { color: p.text, font: { size: 11 } },
            grid: { color: p.grid },
            border: { color: p.grid },
          },
        },
      }}
    />
  );
}
