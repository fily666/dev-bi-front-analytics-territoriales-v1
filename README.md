# Frontend Analítica Territorial

Aplicación Next.js (App Router) con **arquitectura hexagonal** que consume el backend NestJS y presenta los tableros electorales, socioeconómicos y poblacionales.

## Stack

- **Next.js 14** + App Router + React 18 + TypeScript
- **Tailwind CSS** con tokens semánticos en CSS vars (tema claro/oscuro vía `next-themes`)
- **Chart.js** (vía `react-chartjs-2`)
- **Leaflet** + `react-leaflet` para el mapa de Colombia
- **TanStack React Query** para cache de datos y refetching
- **Zustand** para los stores de filtros (global y comparativo)

## Arquitectura hexagonal en el frontend

Cada bounded context bajo `src/modules/<contexto>/` se organiza en tres capas, igual que el backend, con la regla **dependencias hacia adentro**:

```
src/modules/<contexto>/
├── domain/                  # Tipos puros, puertos (interfaces de repositorios)
│   ├── entities.ts
│   └── <contexto>.repository.port.ts
├── application/
│   ├── use-cases.ts         # Clases puras que orquestan dominio
│   └── hooks.ts             # Adaptadores React Query (consumen los use cases)
├── infrastructure/
│   ├── http/<contexto>.http.repository.ts   # Adapter HTTP del puerto
│   └── ui/                  # Componentes React específicos del módulo
└── index.ts                 # Composition root: cablea adapter + use cases
```

Cualquier hook o componente importa **solo** los `useCases` exportados desde `index.ts`.
Para tests basta crear un repositorio mock y pasarlo manualmente al `useCase`.

### Estructura completa

```
src/
├── app/                            # Next.js App Router (presentación)
│   ├── layout.tsx                  # Sidebar + Header + barra de filtros contextual
│   ├── page.tsx                    # Home
│   ├── electoral/
│   │   ├── page.tsx                # redirect → /electoral/comportamiento
│   │   ├── comportamiento/page.tsx
│   │   └── comparativo/page.tsx
│   ├── socioeconomico/page.tsx
│   ├── poblacional/page.tsx
│   └── globals.css                 # Tokens CSS vars + estilos base
├── modules/
│   ├── geo/                        # Departamentos, municipios, puestos
│   ├── catalogos/                  # Corporaciones, partidos, candidatos
│   ├── electoral/                  # Resúmenes, mapa, rankings, comparativo territorial
│   ├── socioeconomico/             # KPIs Publicaciones, mapa de calor
│   ├── poblacional/                # KPIs encuestas
│   └── home/                       # Agregador del dashboard
└── shared/
    ├── application/
    │   ├── stores/                 # Zustand: filtros-globales, sidebar
    │   └── hooks/                  # use-vista-actual, use-resolved-theme
    ├── domain/                     # divipola.ts (mapeo Registraduría↔DIVIPOLA)
    ├── infrastructure/
    │   ├── http/                   # apiClient (fetch wrapper)
    │   └── providers/              # QueryProvider, ThemeProvider
    └── ui/
        ├── components/             # KpiCard, Card, BarChart, LineChart, Skeleton, SelectFiltro, FiltrosCard, EmptyState, InsightsPanel, …
        ├── filters/                # BarraFiltrosGlobales, BarraFiltrosDepartamento, BarraFiltrosContextual
        └── layout/                 # Sidebar, Header, ThemeToggle
```

## Configuración

```bash
cp .env.example .env
# Ajustar NEXT_PUBLIC_API_BASE_URL si el backend no está en localhost:3001
```

## Mapa de Colombia

GeoJSON ya incluidos en `public/`:

- `colombia-departamentos.geojson` (33 features, propiedad `DPTO_CCDGO` 2 dígitos DIVIPOLA, `DPTO_CNMBR` nombre).
- `colombia-municipios.geojson` (1.122 features, `MPIO_CCNCT` 5 dígitos DIVIPOLA, `MPIO_CCDGO` 3 dígitos sufijo, `MPIO_CNMBR` nombre).

> ⚠ **Códigos de la Registraduría ≠ DIVIPOLA**. La BD usa códigos de la Registraduría Nacional; los GeoJSON usan DIVIPOLA del DANE. La traducción se resuelve en [`shared/domain/divipola.ts`](src/shared/domain/divipola.ts):
> - **Departamento:** mapeo determinístico de 33 entradas (`REGISTRADURIA_TO_DIVIPOLA_DEPTO`).
> - **Municipio:** match por nombre normalizado dentro del departamento (`normalizarNombre`), porque los códigos no son 1:1 traducibles.

## Instalación y ejecución

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # producción
npm run lint
npx tsc --noEmit     # typecheck
```

El backend debe estar corriendo en `http://localhost:3001/api/v1` (configurable vía env).

## Filtros y estado

### `useFiltrosGlobales`

[`src/shared/application/stores/filtros-globales.store.ts`](src/shared/application/stores/filtros-globales.store.ts) gestiona los 4 filtros transversales: **corporación, departamento, municipio, partido**. Reglas de dependencia:

- Cambiar departamento resetea el municipio.
- Cambiar corporación resetea el partido.

Todos los hooks de los bounded contexts leen de este store, por lo que un cambio en la barra superior dispara refetch automático en los componentes que consumen esos datos vía React Query.

### `useFiltrosComparativo`

[`src/modules/electoral/infrastructure/ui/comparativo/filtros-comparativo-store.ts`](src/modules/electoral/infrastructure/ui/comparativo/filtros-comparativo-store.ts) — store local del comparativo pairwise: `tipo: 'partido'|'candidato'`, **`corpA`/`corpB`** (corporación por lado), `selA`/`selB`, más `setCorpA`/`setCorpB`, `swap()` y `reset()`. La geografía (depto/muni) se lee del store global (la usan los mapas para el drill-down) y se expone con selectores dentro del panel de selección del comparativo.

## Páginas

| Ruta | Descripción |
|---|---|
| `/` | Dashboard ejecutivo: mapa + tarjetas corporación + ranking + paneles socio/poblacional + insights. Requiere haber elegido corporación. |
| `/electoral` | Redirige a `/electoral/comportamiento` |
| `/electoral/comportamiento` | KPIs · mapa · panel territorial adaptativo · matriz de organizaciones con drill-down a candidatos. Requiere corporación. |
| `/electoral/comparativo` | Comparativo pairwise A vs B (candidato o partido) con **corporación por lado** (pueden diferir) + ámbito territorial, todo en el panel de selección (sin barra global) + mapa choropleth + tarjetas totales + panel brechas + tabla por territorio (Participación % por candidato, Diferencia y Ventaja %, sin "Total elección"). |
| `/socioeconomico` | Botonera de fuentes (publicaciones) · `FiltrosCard` inline (Departamento + Dimensión + Referencia) · mapa de calor · tabla por depto · tendencia histórica. |
| `/poblacional` | Filtros propios in-page · tendencia · radar por criterio · tabla detallada. |

### Alcance de filtros por vista

[`src/shared/application/hooks/use-vista-actual.ts`](src/shared/application/hooks/use-vista-actual.ts) declara qué barra de filtros se monta en cada ruta. [`src/shared/ui/filters/barra-filtros-contextual.tsx`](src/shared/ui/filters/barra-filtros-contextual.tsx) hace el switch.

| Vista | `alcanceFiltros` | Barra que se renderiza |
|---|---|---|
| `/` y `/electoral/comportamiento` | `global` | Corporación + Departamento + Municipio + Partido |
| `/electoral/comparativo` | `ninguno` | Sin barra global — corporación por lado + ámbito territorial dentro del panel de selección |
| `/socioeconomico`, `/poblacional` | `ninguno` | No se renderiza barra global; las vistas usan filtros propios in-page |

> La rama `'departamento'` (que renderiza `BarraFiltrosDepartamento`) está cableada en `BarraFiltrosContextual` pero hoy ninguna ruta la usa — se mantiene por extensibilidad.

### Sidebar

[`src/shared/ui/layout/sidebar.tsx`](src/shared/ui/layout/sidebar.tsx) usa una lista plana agrupada por la propiedad `group`. Soporta colapso en escritorio y drawer móvil. Item activo se resuelve con `pathname.startsWith(item.href + '/')`.

## Sistema de diseño

- **Tokens semánticos** en [`src/app/globals.css`](src/app/globals.css) (`--bg`, `--surface`, `--brand`, `--success`, etc.) y expuestos a Tailwind como utilidades en [`tailwind.config.ts`](tailwind.config.ts).
- Cambiar tema = cambiar `:root` (claro) vs `.dark` (oscuro). El tema se alterna desde el header (`ThemeToggle`).
- **Sombra**: `shadow-soft` para cards default, `shadow-elevated` para elementos destacados.
- **Tipografía**: `Inter` con feature-settings `cv11`, `ss01` y `font-variant-numeric: tabular-nums` para números alineados.
- Skeleton con clase `.shimmer` para loaders animados consistentes.

## Cómo agregar un nuevo bounded context

1. Crear `src/modules/<nuevo>/domain/{entities,<nuevo>.repository.port}.ts`.
2. Implementar el adapter en `infrastructure/http/<nuevo>.http.repository.ts`.
3. Escribir los casos de uso en `application/use-cases.ts`.
4. Cablear todo en `index.ts` (composition root del módulo).
5. Añadir hooks React Query en `application/hooks.ts`.
6. Crear los componentes UI en `infrastructure/ui/`.
7. Consumir los hooks desde una página en `src/app/<ruta>/page.tsx`.

## Notas

- El mapa es **dynamic-imported con `ssr: false`** porque Leaflet requiere `window`.
- `apiClient` usa `cache: 'no-store'` — confiamos en React Query para el cache HTTP.
- React Query: `staleTime` 60s y `retry: 1` por defecto. Las queries del comparativo usan keys order-aware para que `[A,B]` y `[B,A]` compartan caché.
- Tailwind escanea `src/app`, `src/modules` y `src/shared`. Si crea componentes fuera de esas carpetas, ajuste `tailwind.config.ts`.
