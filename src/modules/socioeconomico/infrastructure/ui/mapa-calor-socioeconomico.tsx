'use client';

import { useResolvedTheme } from '@/shared/application/hooks/use-resolved-theme';
import { aDivipolaDepto } from '@/shared/domain/divipola';
import { EmptyState } from '@/shared/ui/components/empty-state';
import { Skeleton } from '@/shared/ui/components/skeleton';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import { useIndicadoresPorDepartamentoSocioeconomico } from '../../application/hooks';
import { FiltroSocioeconomico } from '../../domain/entities';
import {
  badgeNivelRiesgoClass,
  colorParaNivelRiesgo,
  configNivelRiesgo,
} from './calificacion-utils';

const MapaBaseInner = dynamic(
  () =>
    import(
      '@/modules/electoral/infrastructure/ui/mapa-colombia/mapa-base.inner'
    ).then((m) => m.MapaBaseInner),
  { ssr: false, loading: () => <Skeleton className="h-full min-h-[280px] w-full" /> },
);

const fmt = new Intl.NumberFormat('es-CO');

export interface MapaCalorSocioeconomicoProps {
  filtro: FiltroSocioeconomico;
}

export function MapaCalorSocioeconomico({ filtro }: MapaCalorSocioeconomicoProps) {
  const isDark = useResolvedTheme() === 'dark';
  const { data, isLoading, isError } =
    useIndicadoresPorDepartamentoSocioeconomico(filtro);

  // Las tablas guardan códigos de la Registraduría (a veces sin padding,
  // ej. '1' por Antioquia). Normalizamos y traducimos a DIVIPOLA antes de
  // armar los lookups que consume el GeoJSON.
  const valoresPorCodigo = useMemo(
    () =>
      new Map(
        (data ?? []).flatMap((d) => {
          const divipola = aDivipolaDepto(d.codigoDepartamento);
          return divipola ? [[divipola, d.valor] as const] : [];
        }),
      ),
    [data],
  );
  const coloresPorCodigo = useMemo(
    () =>
      new Map(
        (data ?? []).flatMap((d) => {
          const divipola = aDivipolaDepto(d.codigoDepartamento);
          return divipola
            ? [[divipola, colorParaNivelRiesgo(d.nivelRiesgo, isDark)] as const]
            : [];
        }),
      ),
    [data, isDark],
  );
  const etiquetasPorCodigo = useMemo(
    () =>
      new Map(
        (data ?? []).flatMap((d) => {
          const divipola = aDivipolaDepto(d.codigoDepartamento);
          return divipola
            ? [
                [
                  divipola,
                  `Nivel de riesgo: ${configNivelRiesgo(d.nivelRiesgo).label}`,
                ] as const,
              ]
            : [];
        }),
      ),
    [data],
  );

  // Niveles de riesgo únicos presentes (para la leyenda)
  const nivelesPresentes = useMemo(() => {
    const set = new Set<string>();
    (data ?? []).forEach((d) => {
      if (d.nivelRiesgo) set.add(d.nivelRiesgo);
    });
    return Array.from(set);
  }, [data]);

  const periodo = (data ?? [])[0]?.periodo ?? null;

  if (!filtro.dimension) {
    return (
      <EmptyState
        size="lg"
        title="Sin dimensión seleccionada"
        description="Elija una dimensión para visualizar el mapa de calor por departamento."
      />
    );
  }

  if (isLoading) {
    return <Skeleton className="h-[380px] w-full sm:h-[420px] lg:h-[460px]" />;
  }

  if (isError) {
    return (
      <EmptyState tone="danger" size="sm" description="Error al cargar el mapa." />
    );
  }

  if (!data || data.length === 0) {
    return (
      <EmptyState
        size="lg"
        description={`Sin datos para esta dimensión en ${filtro.fuentePublicacion ?? filtro.fuente}.`}
      />
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        {periodo !== null && (
          <p className="text-xs text-foreground-muted">
            Período: <span className="font-semibold text-foreground">{periodo}</span>
          </p>
        )}
        <p className="text-[11px] text-foreground-subtle">
          {fmt.format(data.length)} {data.length === 1 ? 'departamento' : 'departamentos'}
        </p>
      </div>

      <div className="map-wrapper h-[380px] border border-border bg-surface sm:h-[420px] lg:h-[460px]">
        <MapaBaseInner
          geoJsonUrl="/colombia-departamentos.geojson"
          propiedadCodigo="DPTO_CCDGO"
          propiedadNombre="DPTO_CNMBR"
          valoresPorCodigo={valoresPorCodigo}
          coloresPorCodigo={coloresPorCodigo}
          etiquetasPorCodigo={etiquetasPorCodigo}
          onSeleccion={() => {
            /* selección sin efecto en este contexto */
          }}
          codigoSeleccionado={null}
          tooltipLabel="Valor"
        />
      </div>

      {/* Leyenda */}
      {nivelesPresentes.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-foreground-muted">
            Leyenda:
          </span>
          {nivelesPresentes.map((c) => (
            <span key={c} className={badgeNivelRiesgoClass(c)}>
              <span
                className="mr-1.5 inline-block h-2 w-2 rounded-full"
                style={{ backgroundColor: colorParaNivelRiesgo(c, isDark) }}
              />
              {configNivelRiesgo(c).label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
