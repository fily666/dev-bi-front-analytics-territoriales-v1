'use client';

import 'leaflet/dist/leaflet.css';
import { useGeoJSON } from '@/shared/application/hooks/use-geojson';
import { useResolvedTheme } from '@/shared/application/hooks/use-resolved-theme';
import { Feature, FeatureCollection, Geometry } from 'geojson';
import L, { Layer, PathOptions } from 'leaflet';
import { useCallback, useEffect, useMemo } from 'react';
import { GeoJSON, MapContainer, TileLayer, useMap } from 'react-leaflet';

interface PropsFeature {
  [key: string]: unknown;
}

export interface MapaBaseInnerProps {
  geoJsonUrl: string;
  propiedadCodigo: string;
  propiedadNombre: string;
  /** Lookup código → total para colorear el choropleth */
  valoresPorCodigo: Map<string, number>;
  /** Callback al hacer click sobre una feature */
  onSeleccion: (codigo: string) => void;
  /** Código seleccionado, para resaltar el contorno */
  codigoSeleccionado: string | null;
  /** Filtro opcional para mostrar sólo un subconjunto (drill-down) */
  filtroFeature?: (props: PropsFeature) => boolean;
  /** Centro inicial del mapa cuando no hay drill-down */
  centroDefault?: [number, number];
  /** Zoom inicial cuando no hay drill-down */
  zoomDefault?: number;
  /** Etiqueta para el tooltip (ej: "Votos") */
  tooltipLabel?: string;
  /**
   * Coloreo categórico opcional. Si se proporciona, sobreescribe la escala
   * numérica (`valoresPorCodigo`) y usa el color provisto por código.
   */
  coloresPorCodigo?: Map<string, string>;
  /** Línea adicional a agregar al tooltip por código (ej: calificación). */
  etiquetasPorCodigo?: Map<string, string>;
  /**
   * Líneas adicionales por código. Se renderizan después de `etiquetasPorCodigo`.
   * Útil para observaciones u otros campos cualitativos largos.
   */
  detallesPorCodigo?: Map<string, string[]>;
  /**
   * Sobreescribe el formateo del valor en el tooltip (útil para unidades como
   * porcentaje o moneda). Si se omite se usa Intl.NumberFormat es-CO.
   */
  formatearValor?: (valor: number) => string;
}

const formatter = new Intl.NumberFormat('es-CO');

function colorScale(valor: number, max: number, isDark: boolean): string {
  if (max === 0) return isDark ? 'rgb(56, 68, 102)' : 'rgb(226, 230, 240)';
  const t = Math.max(0, Math.min(1, valor / max));
  if (isDark) {
    // Surface oscuro → sky brand #81b7e6 (gradiente sobre navy profundo)
    const r = Math.round(56 + t * 73);
    const g = Math.round(68 + t * 115);
    const b = Math.round(102 + t * 128);
    return `rgb(${r}, ${g}, ${b})`;
  }
  // Light gray-blue → navy brand #313f69 (gradiente frío de la marca)
  const r = Math.round(226 - t * 177);
  const g = Math.round(230 - t * 167);
  const b = Math.round(240 - t * 135);
  return `rgb(${r}, ${g}, ${b})`;
}

/**
 * Reajusta el viewport del mapa al bbox del FeatureCollection cuando éste cambia.
 * Útil para hacer drill-down: al filtrar a los municipios de un departamento,
 * el mapa hace zoom a esa región.
 */
function FitBoundsToData({ features }: { features: Feature[] }) {
  const map = useMap();
  useEffect(() => {
    if (features.length === 0) return;
    const layer = L.geoJSON({ type: 'FeatureCollection', features } as FeatureCollection);
    const bounds = layer.getBounds();
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [features, map]);
  return null;
}

export function MapaBaseInner({
  geoJsonUrl,
  propiedadCodigo,
  propiedadNombre,
  valoresPorCodigo,
  onSeleccion,
  codigoSeleccionado,
  filtroFeature,
  centroDefault = [4.5709, -74.2973],
  zoomDefault = 5,
  tooltipLabel = 'Votos',
  coloresPorCodigo,
  etiquetasPorCodigo,
  detallesPorCodigo,
  formatearValor,
}: MapaBaseInnerProps) {
  // GeoJSON viene del hook compartido (cache module-level): al cambiar de
  // vista no hay re-fetch ni re-parse del archivo de ~80–600 KB.
  const { data: geo, error } = useGeoJSON(geoJsonUrl);
  const theme = useResolvedTheme();
  const isDark = theme === 'dark';

  const features = useMemo(() => {
    if (!geo) return [];
    return filtroFeature
      ? geo.features.filter((f) => filtroFeature(f.properties as PropsFeature))
      : geo.features;
  }, [geo, filtroFeature]);

  const maxValor = useMemo(
    () => Array.from(valoresPorCodigo.values()).reduce((m, v) => Math.max(m, v), 0),
    [valoresPorCodigo],
  );

  // Memoizamos style/onEachFeature: aunque el GeoJSON se remonta vía `key`,
  // las funciones estables evitan trabajo extra dentro del ciclo de Leaflet
  // y permiten que React Compiler reconozca su pureza.
  const styleFeature = useCallback(
    (feature?: Feature<Geometry, PropsFeature>): PathOptions => {
      const codigo = String(feature?.properties?.[propiedadCodigo] ?? '');
      const valor = valoresPorCodigo.get(codigo) ?? 0;
      const seleccionado = codigo === codigoSeleccionado;
      const colorOverride = coloresPorCodigo?.get(codigo);
      const fillDefault = isDark ? 'rgb(56, 68, 102)' : 'rgb(226, 230, 240)';
      // Resaltado de selección con el rojo brand (--danger #b32118 light /
      // #e85f54 dark) — alto contraste sobre la paleta fría del choropleth y
      // accesible en ambos temas.
      const accentBorder = isDark ? 'rgb(232, 95, 84)' : 'rgb(179, 33, 24)';
      return {
        fillColor:
          colorOverride ??
          (coloresPorCodigo ? fillDefault : colorScale(valor, maxValor, isDark)),
        weight: seleccionado ? 4 : 0.6,
        color: seleccionado
          ? accentBorder
          : isDark
            ? 'rgb(84, 99, 140)'
            : 'rgb(200, 209, 226)',
        fillOpacity: seleccionado ? 1 : 0.85,
      };
    },
    [
      propiedadCodigo,
      valoresPorCodigo,
      codigoSeleccionado,
      coloresPorCodigo,
      isDark,
      maxValor,
    ],
  );

  const onEachFeature = useCallback(
    (feature: Feature<Geometry, PropsFeature>, layer: Layer) => {
      const codigo = String(feature.properties?.[propiedadCodigo] ?? '');
      const nombre = String(feature.properties?.[propiedadNombre] ?? codigo);
      const valor = valoresPorCodigo.get(codigo) ?? 0;
      const etiqueta = etiquetasPorCodigo?.get(codigo);
      const detalles = detallesPorCodigo?.get(codigo) ?? [];
      const valorFmt = formatearValor ? formatearValor(valor) : formatter.format(valor);
      const lineas: string[] = [`<strong>${nombre}</strong>`];
      lineas.push(`${tooltipLabel}: ${valorFmt}`);
      if (etiqueta) lineas.push(etiqueta);
      for (const d of detalles) {
        if (d) lineas.push(`<span style="opacity:.85">${d}</span>`);
      }
      layer.bindTooltip(lineas.join('<br/>'), {
        sticky: true,
        direction: 'auto',
        opacity: 0.97,
      });
      layer.on({
        click: () => onSeleccion(codigo),
      });
      // Sin esto, el contorno grueso de la feature seleccionada queda
      // parcialmente oculto por los polígonos vecinos dibujados después.
      if (codigo === codigoSeleccionado && 'bringToFront' in layer) {
        (layer as L.Path).bringToFront();
      }
    },
    [
      propiedadCodigo,
      propiedadNombre,
      valoresPorCodigo,
      etiquetasPorCodigo,
      detallesPorCodigo,
      formatearValor,
      tooltipLabel,
      onSeleccion,
      codigoSeleccionado,
    ],
  );

  if (error) {
    return (
      <div className="flex h-full min-h-[240px] items-center justify-center rounded-md border border-warning/30 bg-warning-muted/40 p-4 text-sm text-warning">
        <div>
          <strong>Mapa no disponible:</strong> {error}
          <p className="mt-1 text-xs opacity-80">
            Asegúrese de que el archivo <code>{geoJsonUrl}</code> exista en <code>public/</code>.
          </p>
        </div>
      </div>
    );
  }

  // Key fuerza el remount del GeoJSON cuando cambia filtro, selección, tema o colores.
  const coloresHash = coloresPorCodigo ? coloresPorCodigo.size : 0;
  const featuresKey = `${codigoSeleccionado ?? 'none'}-${features.length}-${maxValor}-${theme}-${coloresHash}`;

  return (
    <MapContainer
      center={centroDefault}
      zoom={zoomDefault}
      minZoom={4}
      maxZoom={11}
      style={{ height: '100%', width: '100%', borderRadius: '0.5rem' }}
      // Zoom 100% controlado: el mapa sólo cambia de escala vía
      // FitBoundsToData (filtros + clics). Cualquier gesto/atajo manual
      // está deshabilitado para evitar saltos confusos de viewport.
      scrollWheelZoom={false}
      doubleClickZoom={false}
      touchZoom={false}
      boxZoom={false}
      keyboard={false}
      zoomControl={false}
      zoomSnap={0.25}
    >
      <TileLayer
        key={isDark ? 'dark' : 'light'}
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url={
          isDark
            ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
            : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
        }
      />
      {features.length > 0 && (
        <>
          <GeoJSON
            key={featuresKey}
            data={{ type: 'FeatureCollection', features } as FeatureCollection}
            style={styleFeature}
            onEachFeature={onEachFeature}
          />
          <FitBoundsToData features={features} />
        </>
      )}
    </MapContainer>
  );
}
