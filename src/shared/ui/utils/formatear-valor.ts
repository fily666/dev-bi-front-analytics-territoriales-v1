/**
 * Formato visual basado en la columna `unidad_medida` de data_socioeconómica.
 *
 * La columna almacena texto libre (`'porcentaje'`, `'COP'`, `'Índice'`, `'tasa por 100k'`, …);
 * `clasificarUnidad()` la normaliza a una categoría y `formatearValor()` aplica
 * el sufijo/prefijo correspondiente.
 */

export type CategoriaUnidad =
  | 'porcentaje'
  | 'monetario'
  | 'indice'
  | 'tasa'
  | 'cantidad'
  | 'otro';

const numberFmt = new Intl.NumberFormat('es-CO', {
  maximumFractionDigits: 2,
});
const numberFmtEntero = new Intl.NumberFormat('es-CO', {
  maximumFractionDigits: 0,
});
const monedaFmt = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

function normalizar(texto: string | null | undefined): string {
  if (!texto) return '';
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim();
}

export function clasificarUnidad(
  unidad: string | null | undefined,
): CategoriaUnidad {
  const u = normalizar(unidad);
  if (!u) return 'otro';
  if (
    u.includes('porcent') ||
    u === '%' ||
    u.includes('pct') ||
    u.includes('percent')
  ) {
    return 'porcentaje';
  }
  if (
    u.includes('cop') ||
    u.includes('peso') ||
    u.includes('moneda') ||
    u.includes('monetar') ||
    u.includes('usd') ||
    u.includes('dolar') ||
    u === '$'
  ) {
    return 'monetario';
  }
  if (u.includes('indice') || u.includes('index')) {
    return 'indice';
  }
  if (u.includes('tasa') || u.includes('rate') || u.includes('por 100')) {
    return 'tasa';
  }
  if (
    u.includes('cantidad') ||
    u.includes('numero') ||
    u.includes('total') ||
    u.includes('habit') ||
    u.includes('person') ||
    u.includes('hogar') ||
    u.includes('caso')
  ) {
    return 'cantidad';
  }
  return 'otro';
}

export interface FormatearValorOptions {
  /** Si se quiere mostrar decimales aunque la categoría sea "cantidad". */
  conDecimales?: boolean;
  /** Para forzar una categoría específica (útil en KPIs derivados como vsPromedio). */
  forzarCategoria?: CategoriaUnidad;
}

/**
 * Devuelve la representación visual del valor según la unidad de medida.
 *
 *   123.4 + 'porcentaje' → '123,4 %'
 *   54000 + 'COP'        → '$ 54.000'
 *   2.3   + 'índice'     → '2,30'
 *   12    + 'tasa'       → '12 por 100k'  (la cadena original se conserva como sufijo)
 *   1234  + 'cantidad'   → '1.234'
 */
export function formatearValor(
  valor: number | null | undefined,
  unidad: string | null | undefined,
  opciones: FormatearValorOptions = {},
): string {
  if (valor == null || Number.isNaN(valor)) return '—';

  const categoria = opciones.forzarCategoria ?? clasificarUnidad(unidad);

  switch (categoria) {
    case 'porcentaje':
      return `${numberFmt.format(valor)} %`;
    case 'monetario':
      return monedaFmt.format(valor);
    case 'indice':
      return new Intl.NumberFormat('es-CO', {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      }).format(valor);
    case 'tasa': {
      const sufijo = unidad?.trim() ?? 'tasa';
      return `${numberFmt.format(valor)} ${sufijo}`;
    }
    case 'cantidad':
      return opciones.conDecimales
        ? numberFmt.format(valor)
        : numberFmtEntero.format(valor);
    default: {
      if (!unidad) return numberFmt.format(valor);
      return `${numberFmt.format(valor)} ${unidad}`;
    }
  }
}

/** Etiqueta corta para ejes de gráficos. */
export function sufijoUnidad(unidad: string | null | undefined): string {
  const cat = clasificarUnidad(unidad);
  if (cat === 'porcentaje') return '%';
  if (cat === 'monetario') return 'COP';
  return '';
}
