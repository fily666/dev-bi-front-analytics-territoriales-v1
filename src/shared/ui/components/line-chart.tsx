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
  /** Texto cualitativo (observación) por punto, mismo orden que `data`. */
  observaciones?: Array<string | null | undefined>;
}

export interface LineChartProps {
  labels: string[];
  datasets: LineDataset[];
  /**
   * Formatea el valor numérico en el tooltip y en el eje Y. Útil para inyectar
   * el sufijo de unidad (%, COP, …). Si se omite usa Intl.NumberFormat es-CO.
   */
  formatearValor?: (valor: number) => string;
}

const defaultFmt = new Intl.NumberFormat('es-CO', { maximumFractionDigits: 2 });

/** Parte un texto en líneas de hasta `ancho` caracteres, respetando palabras. */
function envolverTexto(texto: string, ancho: number): string[] {
  const palabras = texto.split(/\s+/);
  const lineas: string[] = [];
  let actual = '';
  for (const p of palabras) {
    if (!actual) {
      actual = p;
    } else if (actual.length + 1 + p.length <= ancho) {
      actual = `${actual} ${p}`;
    } else {
      lineas.push(actual);
      actual = p;
    }
  }
  if (actual) lineas.push(actual);
  return lineas;
}

export function LineChart({ labels, datasets, formatearValor }: LineChartProps) {
  const isDark = useResolvedTheme() === 'dark';
  const p = getChartPalette(isDark);
  const fmt = formatearValor ?? ((v: number) => defaultFmt.format(v));

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
            // Chart.js no rompe líneas automáticamente; envolvemos el texto
            // manualmente para que la observación se ajuste a un ancho legible.
            boxPadding: 4,
            callbacks: {
              label: (ctx) => {
                const valor = Number(ctx.parsed.y);
                return `${ctx.dataset.label}: ${fmt(valor)}`;
              },
              afterLabel: (ctx) => {
                const ds = datasets[ctx.datasetIndex];
                const obs = ds?.observaciones?.[ctx.dataIndex];
                if (!obs) return '';
                return [`Observación:`, ...envolverTexto(obs, 56)];
              },
            },
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
            ticks: {
              color: p.text,
              font: { size: 11 },
              callback: (value) => fmt(Number(value)),
            },
            grid: { color: p.grid },
            border: { color: p.grid },
          },
        },
      }}
    />
  );
}
