'use client';

import type { FeatureCollection } from 'geojson';
import { useEffect, useState } from 'react';

/**
 * Cache module-level de FeatureCollections parseadas. Sobrevive a cambios de
 * ruta y de tema. Los archivos en `public/` son estáticos y pesados
 * (departamentos ~80 KB, municipios ~600 KB) — re-fetch + re-parse en cada
 * navegación es la causa principal de la latencia visual al cambiar de
 * vista. Compartir la misma `FeatureCollection` también ayuda al GC.
 */
const cache = new Map<string, FeatureCollection>();
const inflight = new Map<string, Promise<FeatureCollection>>();

export async function fetchGeoJSON(url: string): Promise<FeatureCollection> {
  const hit = cache.get(url);
  if (hit) return hit;
  const pending = inflight.get(url);
  if (pending) return pending;

  const promise = fetch(url)
    .then(async (r) => {
      if (!r.ok) throw new Error(`No se encontró ${url}`);
      const data = (await r.json()) as FeatureCollection;
      cache.set(url, data);
      return data;
    })
    .finally(() => {
      inflight.delete(url);
    });
  inflight.set(url, promise);
  return promise;
}

export interface UseGeoJSONResult {
  data: FeatureCollection | null;
  error: string | null;
  isLoading: boolean;
}

/**
 * Hook React para consumir un GeoJSON estático con caché compartida. Devuelve
 * `data` síncronamente cuando ya está en caché (no hay flicker al volver a
 * la vista). Cancelable: la promise sigue, pero su resultado se descarta si
 * el componente se desmontó antes de resolver.
 */
export function useGeoJSON(url: string): UseGeoJSONResult {
  const cached = cache.get(url) ?? null;
  const [data, setData] = useState<FeatureCollection | null>(cached);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(!cached);

  useEffect(() => {
    const hit = cache.get(url);
    if (hit) {
      setData(hit);
      setError(null);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    fetchGeoJSON(url)
      .then((g) => {
        if (cancelled) return;
        setData(g);
        setError(null);
        setIsLoading(false);
      })
      .catch((e: Error) => {
        if (cancelled) return;
        setError(e.message);
        setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [url]);

  return { data, error, isLoading };
}
