'use client';

import {
  Files,
  GitCompareArrows,
  Home,
  LucideIcon,
  TrendingUp,
  Trophy,
  Users,
  Vote,
} from 'lucide-react';
import { usePathname } from 'next/navigation';

export type AlcanceFiltros =
  | 'global'
  | 'global-sin-partido'
  | 'corporacion-partido'
  | 'departamento'
  | 'ninguno';

export interface VistaMeta {
  ruta: string;
  titulo: string;
  descripcion: string;
  icon: LucideIcon;
  /**
   * Determina qué filtros transversales aplican:
   * - 'global'              → corporación, departamento, municipio, partido
   * - 'global-sin-partido'  → corporación, departamento, municipio
   * - 'corporacion-partido' → corporación + organización política (Territorios ganados)
   * - 'departamento'        → solo departamento (ej: Socioeconómico)
   * - 'ninguno'             → la vista no usa DIVIPOLA (ej: Poblacional)
   */
  alcanceFiltros: AlcanceFiltros;
}

// Ordenadas de más específicas a más generales para que `startsWith` resuelva
// las sub-rutas antes que la ruta padre.
const VISTAS: VistaMeta[] = [
  {
    ruta: '/electoral/comparativo',
    titulo: 'Comparativo electoral',
    descripcion: 'Comparativo pairwise por partido o candidato con desglose territorial',
    icon: GitCompareArrows,
    // Sin barra global: todos los filtros (corporación por lado + ámbito
    // territorial) viven en el panel de selección de la propia vista.
    alcanceFiltros: 'ninguno',
  },
  {
    ruta: '/electoral/territorios-ganados',
    titulo: 'Territorios ganados',
    descripcion:
      'Territorios donde un candidato fue el más votado, a nivel departamental o municipal',
    icon: Trophy,
    alcanceFiltros: 'corporacion-partido',
  },
  {
    ruta: '/electoral/comportamiento',
    titulo: 'Comportamiento electoral',
    descripcion: 'Resultados, rankings y mapas territoriales',
    icon: Vote,
    alcanceFiltros: 'global',
  },
  {
    ruta: '/socioeconomico',
    titulo: 'Estadísticas socioeconómicas',
    descripcion: 'Indicadores territoriales por fuente de información',
    icon: TrendingUp,
    alcanceFiltros: 'ninguno',
  },
  {
    ruta: '/poblacional',
    titulo: 'Impacto poblacional',
    descripcion: 'Encuestas y mediciones por dimensión',
    icon: Users,
    alcanceFiltros: 'ninguno',
  },
  {
    ruta: '/fuentes',
    titulo: 'Fuentes documentales',
    descripcion: 'Trazabilidad de las publicaciones que respaldan los indicadores',
    icon: Files,
    alcanceFiltros: 'ninguno',
  },
  {
    ruta: '/',
    titulo: 'Dashboard ejecutivo',
    descripcion: 'Vista consolidada electoral, socioeconómica y poblacional',
    icon: Home,
    alcanceFiltros: 'global',
  },
];

const FALLBACK: VistaMeta = VISTAS[VISTAS.length - 1];

export function useVistaActual(): VistaMeta {
  const pathname = usePathname();
  const match =
    VISTAS.find((v) => (v.ruta === '/' ? pathname === '/' : pathname.startsWith(v.ruta))) ??
    FALLBACK;
  return match;
}
