'use client';

import type {
  ComparativoTerritorialResultado,
  TerritorioComparativo,
} from '@/modules/electoral/domain/entities';
import { cn } from '@/shared/ui/utils/cn';
import { ChevronLeft, ChevronRight, Crown } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { COLOR_A, COLOR_B } from './colores-comparativo';

const fmt = new Intl.NumberFormat('es-CO');
const PAGE_SIZE = 10;

export interface TablaResultadosTerritorialProps {
  resultado: ComparativoTerritorialResultado;
  encabezadoTerritorio: string;
}

export function TablaResultadosTerritorial({
  resultado,
  encabezadoTerritorio,
}: TablaResultadosTerritorialProps) {
  const filas = resultado.territorios;
  const totalPaginas = Math.max(1, Math.ceil(filas.length / PAGE_SIZE));
  const [pagina, setPagina] = useState(1);

  // Si cambian los filtros (cambia la lista o el conteo), volvemos a la pág. 1.
  useEffect(() => {
    setPagina(1);
  }, [filas]);

  const paginaActual = Math.min(pagina, totalPaginas);
  const inicio = (paginaActual - 1) * PAGE_SIZE;
  const fin = Math.min(inicio + PAGE_SIZE, filas.length);
  const filasVisibles = useMemo(() => filas.slice(inicio, fin), [filas, inicio, fin]);

  return (
    <div className="rounded-lg border border-border">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-surface-elevated text-left label-eyebrow">
            <tr>
              <th className="px-4 py-2.5">{encabezadoTerritorio}</th>
              <th className="px-3 py-2.5 text-right">
                <span className={cn('inline-flex items-center gap-1.5', COLOR_A.text)}>
                  {resultado.itemA.nombre}
                </span>
              </th>
              <th className="px-3 py-2.5 text-right">
                <span className={cn('inline-flex items-center gap-1.5', COLOR_B.text)}>
                  {resultado.itemB.nombre}
                </span>
              </th>
              <th className="hidden px-3 py-2.5 text-right md:table-cell">Total elección</th>
              <th className="px-3 py-2.5 text-right">Diferencia</th>
              <th className="hidden px-4 py-2.5 sm:table-cell">Ganador</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filasVisibles.map((t) => (
              <FilaTerritorio key={claveTerritorio(t)} t={t} />
            ))}
            {filas.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-xs text-foreground-muted"
                >
                  Sin datos para los filtros aplicados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {filas.length > 0 && (
        <Paginacion
          pagina={paginaActual}
          totalPaginas={totalPaginas}
          inicio={inicio + 1}
          fin={fin}
          total={filas.length}
          onCambiarPagina={setPagina}
        />
      )}
    </div>
  );
}

interface PaginacionProps {
  pagina: number;
  totalPaginas: number;
  inicio: number;
  fin: number;
  total: number;
  onCambiarPagina: (pagina: number) => void;
}

function Paginacion({
  pagina,
  totalPaginas,
  inicio,
  fin,
  total,
  onCambiarPagina,
}: PaginacionProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border bg-surface-elevated/40 px-4 py-2.5 text-xs text-foreground-muted">
      <span className="num-tabular">
        Mostrando <span className="font-semibold text-foreground">{inicio}</span>–
        <span className="font-semibold text-foreground">{fin}</span> de{' '}
        <span className="font-semibold text-foreground">{total}</span>
      </span>
      <div className="flex items-center gap-1.5">
        <BotonPagina
          disabled={pagina <= 1}
          onClick={() => onCambiarPagina(pagina - 1)}
          aria-label="Página anterior"
        >
          <ChevronLeft size={14} />
        </BotonPagina>
        <span className="px-1.5 num-tabular">
          <span className="font-semibold text-foreground">{pagina}</span> /{' '}
          {totalPaginas}
        </span>
        <BotonPagina
          disabled={pagina >= totalPaginas}
          onClick={() => onCambiarPagina(pagina + 1)}
          aria-label="Página siguiente"
        >
          <ChevronRight size={14} />
        </BotonPagina>
      </div>
    </div>
  );
}

function BotonPagina({
  children,
  disabled,
  onClick,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex h-7 w-7 items-center justify-center rounded-md border border-border bg-surface text-foreground-muted transition-colors',
        'hover:border-brand/40 hover:bg-brand-muted/30 hover:text-brand',
        'disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border disabled:hover:bg-surface disabled:hover:text-foreground-muted',
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

function FilaTerritorio({ t }: { t: TerritorioComparativo }) {
  return (
    <tr className="hover:bg-surface-elevated/60">
      <td className="px-4 py-2.5 font-medium text-foreground">
        <span className="block max-w-[8rem] truncate sm:max-w-[12rem] lg:max-w-[16rem]" title={t.nombre}>
          {t.nombre}
        </span>
      </td>
      <td
        className={cn(
          'px-3 py-2.5 text-right num-tabular',
          t.ganador === 'A' ? cn('font-semibold', COLOR_A.text) : 'text-foreground-muted',
        )}
      >
        {fmt.format(t.totalA)}
      </td>
      <td
        className={cn(
          'px-3 py-2.5 text-right num-tabular',
          t.ganador === 'B' ? cn('font-semibold', COLOR_B.text) : 'text-foreground-muted',
        )}
      >
        {fmt.format(t.totalB)}
      </td>
      <td className="hidden px-3 py-2.5 text-right text-foreground-muted num-tabular md:table-cell">
        {fmt.format(t.totalEleccion)}
      </td>
      <td className="px-3 py-2.5 text-right text-foreground num-tabular">
        {fmt.format(t.diferencia)}
        <span className="ml-1 text-[10px] text-foreground-subtle">
          ({t.diferenciaPct.toFixed(1)}%)
        </span>
      </td>
      <td className="hidden px-4 py-2.5 sm:table-cell">
        <EtiquetaGanador ganador={t.ganador} />
      </td>
    </tr>
  );
}

function EtiquetaGanador({ ganador }: { ganador: TerritorioComparativo['ganador'] }) {
  if (ganador === 'EMPATE') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-elevated px-2 py-0.5 text-[11px] font-medium text-foreground-muted">
        Empate
      </span>
    );
  }
  const c = ganador === 'A' ? COLOR_A : COLOR_B;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-semibold',
        c.border,
        c.bg,
        c.text,
      )}
    >
      <Crown size={11} />
      {ganador}
    </span>
  );
}

function claveTerritorio(t: TerritorioComparativo): string {
  return [t.codigoDepartamento, t.codigoMunicipio ?? '', t.codigoPuesto ?? ''].join('|');
}
