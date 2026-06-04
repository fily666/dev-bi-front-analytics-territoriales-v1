/**
 * Exporta filas a un archivo CSV y dispara la descarga en el navegador.
 * - Antepone BOM UTF-8 para que Excel respete los acentos.
 * - Escapa comillas, comas y saltos de línea según RFC 4180.
 *
 * Es agnóstico del dominio: recibe encabezados y filas ya formateadas.
 */
export function exportarCsv(
  nombreArchivo: string,
  encabezados: string[],
  filas: Array<Array<string | number>>,
): void {
  const escapar = (valor: string | number): string => {
    const s = String(valor ?? '');
    if (/[",\n;]/.test(s)) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  };

  const lineas = [encabezados, ...filas].map((fila) => fila.map(escapar).join(','));
  const contenido = '﻿' + lineas.join('\r\n');

  const blob = new Blob([contenido], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nombreArchivo.endsWith('.csv') ? nombreArchivo : `${nombreArchivo}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
