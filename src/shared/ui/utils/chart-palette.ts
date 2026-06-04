/**
 * Paleta unificada para gráficos. Los valores son réplicas concretas de los
 * tokens semánticos definidos en globals.css (Chart.js no entiende CSS vars
 * dentro de los datasets). Mantener sincronizado con :root y .dark si se
 * cambia la paleta del proyecto.
 */

export interface ChartPalette {
  /** Texto secundario (ticks, leyendas) */
  text: string;
  /** Líneas de cuadrícula y bordes suaves */
  grid: string;
  /** Color del fondo de los tooltips */
  tooltipBg: string;
  /** Texto principal del tooltip (título) */
  tooltipTitle: string;
  /** Texto secundario del tooltip (valores) */
  tooltipBody: string;
  /** Color de borde para arcos del donut sobre el fondo */
  surface: string;
  /** Brand principal (barras simples, énfasis) */
  brand: string;
  /** Serie de colores categóricos en orden estable */
  series: string[];
}

/**
 * Paleta del brandbook Analítica Territorial:
 *   navy  #313f69 · red #b32118 · yellow #efc72f · sky #81b7e6
 * Las series se ordenan para máxima diferenciación cromática.
 */
const SERIES_LIGHT = [
  'rgb(49 63 105)',    // brand · navy #313f69
  'rgb(179 33 24)',    // danger · red #b32118
  'rgb(239 199 47)',   // warning · yellow #efc72f
  'rgb(129 183 230)',  // info · sky #81b7e6
  'rgb(20 160 133)',   // success · teal complementario
  'rgb(140 95 200)',   // purple suave (extensión)
  'rgb(232 110 92)',   // coral (extensión)
  'rgb(168 144 60)',   // mostaza profunda (extensión)
];

const SERIES_DARK = [
  'rgb(129 183 230)',  // brand · sky #81b7e6 (más visible sobre fondo oscuro)
  'rgb(232 95 84)',    // danger · rojo cálido
  'rgb(239 199 47)',   // warning · yellow #efc72f
  'rgb(165 180 252)',  // navy claro (extensión)
  'rgb(52 211 153)',   // success · emerald
  'rgb(192 132 252)',  // purple
  'rgb(244 114 182)',  // pink
  'rgb(45 212 191)',   // teal
];

export function getChartPalette(isDark: boolean): ChartPalette {
  return {
    text: isDark ? 'rgb(184 195 218)' : 'rgb(91 102 124)',
    grid: isDark ? 'rgb(56 68 102)' : 'rgb(226 230 240)',
    tooltipBg: isDark ? 'rgb(46 56 88)' : 'rgb(255 255 255)',
    tooltipTitle: isDark ? 'rgb(248 240 215)' : 'rgb(35 45 75)',
    tooltipBody: isDark ? 'rgb(184 195 218)' : 'rgb(91 102 124)',
    surface: isDark ? 'rgb(35 43 70)' : 'rgb(255 255 255)',
    brand: isDark ? 'rgb(129 183 230)' : 'rgb(49 63 105)',
    series: isDark ? SERIES_DARK : SERIES_LIGHT,
  };
}

/**
 * Devuelve un color con alfa para áreas/relleno. Acepta tanto `rgb(...)` sólido
 * como hex (`#rrggbb` / `#rgb`); en ambos casos produce un `rgba(...)`.
 */
export function withAlpha(color: string, alpha: number): string {
  if (color.startsWith('#')) {
    let h = color.slice(1);
    if (h.length === 3) {
      h = h
        .split('')
        .map((c) => c + c)
        .join('');
    }
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  return color.replace('rgb(', 'rgba(').replace(')', `, ${alpha})`);
}
