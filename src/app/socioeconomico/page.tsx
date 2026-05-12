'use client';

import { useDepartamentos } from '@/modules/geo/application/hooks';
import { FuenteSocioeconomica } from '@/modules/socioeconomico';
import {
  useDimensionesSocioeconomicas,
  useFuentesPublicaciones,
  useNivelesGeograficosSocioeconomicos,
  useReferenciasSocioeconomicas,
  useSerieHistoricaSocioeconomica,
} from '@/modules/socioeconomico/application/hooks';
import { DetalleDepartamentoSocio } from '@/modules/socioeconomico/infrastructure/ui/detalle-departamento-socio';
import { MapaCalorSocioeconomico } from '@/modules/socioeconomico/infrastructure/ui/mapa-calor-socioeconomico';
import { PanelNacionalSocio } from '@/modules/socioeconomico/infrastructure/ui/panel-nacional-socio';
import { TablaDepartamentosSocioeconomico } from '@/modules/socioeconomico/infrastructure/ui/tabla-departamentos-socioeconomico';
import { useFiltrosGlobales } from '@/shared/application/stores/filtros-globales.store';
import { Card, CardBody, CardHeader } from '@/shared/ui/components/card';
import { EmptyState } from '@/shared/ui/components/empty-state';
import { FiltrosCard } from '@/shared/ui/components/filtros-card';
import { LineChart } from '@/shared/ui/components/line-chart';
import { SelectFiltro } from '@/shared/ui/components/select-filtro';
import { Skeleton } from '@/shared/ui/components/skeleton';
import { cn } from '@/shared/ui/utils/cn';
import {
  BookOpen,
  FileBarChart,
  LineChart as LineIcon,
  type LucideIcon,
  Map as MapIcon,
  ShieldAlert,
  Table as TableIcon,
  TrendingUp,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

const TAB_MOE = 'MOE';
const TAB_PUB_PREFIX = 'PUB:';

const NIVEL_DEPARTAMENTAL = 'Departamental';

function iconoParaFuente(fuente: string): LucideIcon {
  const f = fuente.toLowerCase();
  if (f.includes('terridata') || f.includes('dnp')) return FileBarChart;
  if (f.includes('externado') || f.includes('indepaz') || f.includes('undp'))
    return BookOpen;
  if (f.includes('riesgo') || f.includes('seguridad')) return ShieldAlert;
  return TrendingUp;
}

interface OpcionFuente {
  value: string;
  label: string;
  icon: LucideIcon;
}

export default function SocioeconomicoPage() {
  const [tab, setTab] = useState<string>(TAB_MOE);
  const [dimension, setDimension] = useState<string | null>(null);
  const [referencia, setReferencia] = useState<string | null>(null);
  // Selectores específicos: la vista socio sólo consume el código de
  // departamento y su setter; otros cambios del store no la afectan.
  const codigoDepartamento = useFiltrosGlobales((s) => s.codigoDepartamento);
  const setDepartamento = useFiltrosGlobales((s) => s.setDepartamento);

  const { data: departamentos, isLoading: loadingDepartamentos } = useDepartamentos();
  const { data: fuentesPub, isLoading: loadingFuentes } = useFuentesPublicaciones();

  const fuente: FuenteSocioeconomica = tab === TAB_MOE ? 'MOE' : 'PUBLICACIONES';
  const fuentePublicacion = tab.startsWith(TAB_PUB_PREFIX)
    ? tab.slice(TAB_PUB_PREFIX.length)
    : null;
  const esMoe = fuente === 'MOE';

  const opcionesFuente: OpcionFuente[] = useMemo(() => {
    const opciones: OpcionFuente[] = [
      { value: TAB_MOE, label: 'MOE', icon: ShieldAlert },
    ];
    (fuentesPub ?? []).forEach((f) => {
      opciones.push({
        value: `${TAB_PUB_PREFIX}${f}`,
        label: f,
        icon: iconoParaFuente(f),
      });
    });
    return opciones;
  }, [fuentesPub]);

  // Default: seleccionar la primera fuente disponible al cargar.
  useEffect(() => {
    if (opcionesFuente.length === 0) return;
    if (!opcionesFuente.some((o) => o.value === tab)) {
      setTab(opcionesFuente[0].value);
      setDimension(null);
      setReferencia(null);
    }
  }, [opcionesFuente, tab]);

  // ============================================================
  //  CASCADA DE FILTROS:
  //   Fuente → Dimensión → Referencia
  //  El nivel geográfico se infiere automáticamente de la
  //  referencia (sólo aplica para PUBLICACIONES; MOE siempre
  //  se trata como Departamental).
  // ============================================================

  const { data: dimensiones, isLoading: loadingDims } =
    useDimensionesSocioeconomicas(fuente, fuentePublicacion);

  // Default: primera dimensión disponible.
  useEffect(() => {
    if (!dimensiones || dimensiones.length === 0) return;
    if (!dimension || !dimensiones.includes(dimension)) {
      setDimension(dimensiones[0]);
      setReferencia(null);
    }
  }, [dimensiones, dimension]);

  // Referencias dependientes de fuente + dimensión.
  const filtroReferencias = {
    fuente,
    fuentePublicacion,
    dimension,
    codigoDepartamento: null,
    periodo: null,
    referencia: null,
    nivelGeografico: null,
  };
  const { data: referencias, isLoading: loadingRefs } =
    useReferenciasSocioeconomicas(filtroReferencias, { enabled: !!dimension });

  // Default: seleccionar la primera referencia disponible al cambiar dimensión.
  useEffect(() => {
    if (!referencias || referencias.length === 0) return;
    if (!referencia || !referencias.includes(referencia)) {
      setReferencia(referencias[0]);
    }
  }, [referencias, referencia]);

  // Niveles geográficos asociados a la combinación fuente + dimensión + referencia.
  // Sólo se consulta para PUBLICACIONES — MOE no expone este eje.
  const filtroNiveles = {
    fuente,
    fuentePublicacion,
    dimension,
    codigoDepartamento: null,
    periodo: null,
    referencia,
    nivelGeografico: null,
  };
  const { data: niveles } = useNivelesGeograficosSocioeconomicos(filtroNiveles, {
    enabled: !esMoe && !!dimension && !!referencia,
  });

  // El nivel geográfico se infiere automáticamente de la referencia seleccionada.
  // - MOE → siempre Departamental (no aplica).
  // - PUBLICACIONES → se toma el primer nivel asociado a la referencia.
  const nivelInferido: string | null = esMoe
    ? NIVEL_DEPARTAMENTAL
    : niveles && niveles.length > 0
      ? niveles[0]
      : null;

  // El mapa coroplético sólo aplica cuando el nivel inferido es Departamental.
  // Para Nacional u otros agregados, se muestra el panel alternativo y se
  // oculta el selector de Departamento (no aplica al indicador agregado).
  const usarVistaDepartamental = nivelInferido === NIVEL_DEPARTAMENTAL;

  // Filtro base que se pasa a las visualizaciones (mapa/panel/tabla).
  // Cuando el nivel no es Departamental, ignoramos cualquier `codigoDepartamento`
  // residual del store global para que el panel agregado no termine
  // sobre-filtrado por una selección invisible al usuario.
  const filtroBase = {
    fuente,
    fuentePublicacion,
    codigoDepartamento: usarVistaDepartamental ? (codigoDepartamento ?? null) : null,
    dimension,
    periodo: null,
    referencia,
    nivelGeografico: nivelInferido,
  };

  const filtroTendencia = {
    fuente,
    fuentePublicacion,
    codigoDepartamento: null,
    dimension,
    periodo: null,
    referencia,
    nivelGeografico: nivelInferido,
  };

  const tendenciaActiva = !!dimension && opcionesFuente.length > 0;

  const { data: serie, isLoading: loadingSerie } = useSerieHistoricaSocioeconomica(
    filtroTendencia,
    { enabled: tendenciaActiva },
  );

  const serieAgrupada = useMemo(() => {
    if (!serie) return { labels: [], datasets: [] };
    const periodos = Array.from(new Set(serie.map((p) => p.periodo))).sort();
    const dims = Array.from(new Set(serie.map((p) => p.dimension ?? 'sin dimensión')));
    const map = new Map<string, Map<number, number>>();
    serie.forEach((p) => {
      const c = p.dimension ?? 'sin dimensión';
      if (!map.has(c)) map.set(c, new Map());
      map.get(c)!.set(p.periodo, p.valor);
    });
    return {
      labels: periodos.map(String),
      datasets: dims.slice(0, 8).map((c) => ({
        label: c,
        data: periodos.map((a) => map.get(c)?.get(a) ?? 0),
      })),
    };
  }, [serie]);

  const filtrosActivos =
    (usarVistaDepartamental && codigoDepartamento ? 1 : 0) +
    (dimension ? 1 : 0) +
    (!esMoe && referencia ? 1 : 0);

  // Cantidad de selectores visibles en la barra de filtros — guía el grid.
  const colsFiltros: 1 | 2 | 3 = esMoe
    ? 2
    : usarVistaDepartamental
      ? 3
      : 2;

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Barra de fuentes — botones visuales centrados. Compacta en mobile
          para dejar más aire al contenido en pantallas estrechas. */}
      {loadingFuentes ? (
        <Skeleton className="h-11 w-full" />
      ) : (
        <div className="flex flex-wrap items-stretch justify-center gap-1.5 sm:gap-2.5">
          {opcionesFuente.map((opt) => {
            const active = opt.value === tab;
            const Icon = opt.icon;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  if (opt.value !== tab) {
                    setTab(opt.value);
                    setDimension(null);
                    setReferencia(null);
                  }
                }}
                aria-pressed={active}
                className={cn(
                  'group relative inline-flex h-9 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-semibold shadow-soft transition-all duration-150 sm:h-10 sm:gap-2 sm:px-4 sm:text-sm',
                  active
                    ? 'border-brand bg-brand text-brand-foreground shadow-md'
                    : 'border-border bg-surface text-foreground-muted hover:border-brand/40 hover:bg-surface-elevated hover:text-foreground',
                )}
              >
                <Icon
                  size={14}
                  className={cn(
                    'shrink-0 transition-colors sm:hidden',
                    active ? 'text-brand-foreground' : 'text-brand',
                  )}
                />
                <Icon
                  size={16}
                  className={cn(
                    'hidden shrink-0 transition-colors sm:block',
                    active ? 'text-brand-foreground' : 'text-brand',
                  )}
                />
                <span className="whitespace-nowrap tracking-tight">
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Panel unificado de filtros — Nivel geográfico se infiere automáticamente.
          Cuando el nivel inferido no es Departamental (típicamente Nacional para
          publicaciones agregadas), ocultamos el selector de Departamento porque
          el indicador no se desagrega geográficamente. */}
      <FiltrosCard
        cols={colsFiltros}
        filtrosActivos={filtrosActivos}
        onLimpiar={() => {
          setDepartamento(null);
          setDimension(dimensiones && dimensiones.length > 0 ? dimensiones[0] : null);
          setReferencia(null);
        }}
      >
        {usarVistaDepartamental && (
          <SelectFiltro
            label="Departamento"
            value={codigoDepartamento}
            loading={loadingDepartamentos}
            options={(departamentos ?? []).map((d) => ({
              value: d.codigo,
              label: d.nombre,
            }))}
            onChange={setDepartamento}
            placeholder="Todos"
          />
        )}
        <SelectFiltro
          label="Dimensión"
          value={dimension}
          loading={loadingDims}
          options={(dimensiones ?? []).map((c) => ({ value: c, label: c }))}
          onChange={(v) => {
            setDimension(v);
            setReferencia(null);
          }}
          placeholder="Seleccione una dimensión"
        />
        {!esMoe && (
          <SelectFiltro
            label="Referencia"
            value={referencia}
            loading={loadingRefs}
            disabled={!dimension}
            options={(referencias ?? []).map((r) => ({ value: r, label: r }))}
            onChange={setReferencia}
            placeholder={dimension ? 'Seleccione una referencia' : 'Elija una dimensión'}
          />
        )}
      </FiltrosCard>

      {/* Visualización principal — coroplética para Departamental, panel para Nacional.
          Cuando el indicador es nacional ocultamos "Detalle por departamento" y damos
          ancho completo al panel para priorizar las visualizaciones analíticas. */}
      <section
        className={cn(
          'grid gap-4',
          usarVistaDepartamental ? 'lg:grid-cols-3' : 'lg:grid-cols-1',
        )}
      >
        <Card className={usarVistaDepartamental ? 'lg:col-span-2' : undefined}>
          <CardHeader
            title={
              usarVistaDepartamental
                ? 'Distribución territorial'
                : `Indicador ${nivelInferido ?? 'agregado'}`
            }
            description={
              dimension
                ? usarVistaDepartamental
                  ? `Nivel de riesgo · ${dimension}`
                  : `Vista ${nivelInferido?.toLowerCase() ?? 'agregada'} · ${dimension}`
                : undefined
            }
            icon={usarVistaDepartamental ? MapIcon : TrendingUp}
          />
          <CardBody>
            {usarVistaDepartamental ? (
              <MapaCalorSocioeconomico filtro={filtroBase} />
            ) : (
              <PanelNacionalSocio filtro={filtroBase} />
            )}
          </CardBody>
        </Card>

        {usarVistaDepartamental && (
          <Card>
            <CardHeader
              title="Detalle por departamento"
              description={
                codigoDepartamento
                  ? 'KPIs comparativos del departamento'
                  : 'Último período disponible'
              }
              icon={TableIcon}
            />
            <CardBody padding="none">
              {codigoDepartamento ? (
                <DetalleDepartamentoSocio
                  filtro={filtroBase}
                  dimensionActiva={dimension}
                />
              ) : (
                <TablaDepartamentosSocioeconomico filtro={filtroBase} />
              )}
            </CardBody>
          </Card>
        )}
      </section>

      {/* Tendencia */}
      <Card>
        <CardHeader
          title="Tendencia histórica"
          description={tendenciaActiva ? `Evolución por período · ${dimension}` : undefined}
          icon={LineIcon}
        />
        <CardBody>
          {!tendenciaActiva ? (
            <EmptyState
              size="sm"
              icon={LineIcon}
              description="Seleccione una fuente y una dimensión para visualizar la tendencia."
            />
          ) : loadingSerie ? (
            <Skeleton className="h-72 w-full" />
          ) : serieAgrupada.labels.length === 0 ? (
            <EmptyState size="sm" description="Sin datos históricos para esta combinación." />
          ) : (
            <div className="h-72 sm:h-80">
              <LineChart labels={serieAgrupada.labels} datasets={serieAgrupada.datasets} />
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
