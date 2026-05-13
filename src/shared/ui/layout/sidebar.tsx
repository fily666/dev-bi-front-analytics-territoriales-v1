'use client';

import { useSidebar } from '@/shared/application/stores/sidebar.store';
import { cn } from '@/shared/ui/utils/cn';
import {
  BarChart3,
  ChevronLeft,
  Files,
  GitCompareArrows,
  Home,
  LucideIcon,
  Trophy,
  TrendingUp,
  Users,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  group: string;
}

const NAV: NavItem[] = [
  { href: '/', label: 'Home', icon: Home, group: 'Principal' },
  {
    href: '/electoral/comportamiento',
    label: 'Comportamiento electoral',
    icon: BarChart3,
    group: 'Análisis electoral',
  },
  {
    href: '/electoral/comparativo',
    label: 'Comparativo electoral',
    icon: GitCompareArrows,
    group: 'Análisis electoral',
  },
  {
    href: '/electoral/territorios-ganados',
    label: 'Territorios ganados',
    icon: Trophy,
    group: 'Análisis electoral',
  },
  { href: '/socioeconomico', label: 'Socioeconómico', icon: TrendingUp, group: 'Análisis social' },
  { href: '/poblacional', label: 'Impacto Poblacional', icon: Users, group: 'Análisis social' },
  { href: '/fuentes', label: 'Fuentes', icon: Files, group: 'Transparencia' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { collapsed, toggle, mobileOpen, setMobileOpen } = useSidebar();

  // Cerrar el drawer móvil al navegar.
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname, setMobileOpen]);

  const groups = NAV.reduce<Record<string, NavItem[]>>((acc, item) => {
    (acc[item.group] ||= []).push(item);
    return acc;
  }, {});

  return (
    <>
      {/* Backdrop móvil */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-foreground/40 backdrop-blur-sm transition-opacity duration-200 lg:hidden',
          mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={() => setMobileOpen(false)}
        aria-hidden
      />

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex h-screen flex-col border-r border-border bg-surface transition-[width,transform] duration-200',
          'lg:sticky lg:top-0 lg:z-30 lg:translate-x-0',
          collapsed ? 'lg:w-[64px]' : 'lg:w-[248px]',
          'w-[260px]',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
        aria-label="Navegación principal"
      >
        {/* Brand */}
        <div className="flex h-14 items-center gap-3 border-b border-border px-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand text-brand-foreground shadow-soft">
            <BarChart3 className="h-5 w-5" />
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1 animate-fade-in">
              <p className="truncate text-sm font-semibold leading-tight text-foreground">
                Analítica Territorial
              </p>
              <p className="truncate text-[11px] text-foreground-muted">
                Plataforma Colombia
              </p>
            </div>
          )}
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="ml-auto flex h-8 w-8 items-center justify-center rounded-md text-foreground-muted transition-colors hover:bg-surface-elevated hover:text-foreground lg:hidden"
            aria-label="Cerrar menú"
          >
            <X size={16} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-2.5 py-3">
          {Object.entries(groups).map(([group, items]) => (
            <div key={group} className="mb-4 last:mb-0">
              {!collapsed && (
                <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-foreground-subtle">
                  {group}
                </p>
              )}
              <ul className="space-y-0.5">
                {items.map((item) => {
                  const active =
                    item.href === '/'
                      ? pathname === '/'
                      : pathname === item.href || pathname.startsWith(item.href + '/');
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        title={collapsed ? item.label : undefined}
                        className={cn(
                          'group relative flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors',
                          active
                            ? 'bg-brand text-brand-foreground shadow-soft'
                            : 'text-foreground-muted hover:bg-surface-elevated hover:text-foreground',
                        )}
                      >
                        <Icon
                          size={18}
                          className={cn('shrink-0', !active && 'group-hover:text-brand')}
                        />
                        {!collapsed && (
                          <span className="truncate animate-fade-in">{item.label}</span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Toggle (escritorio) */}
        <button
          type="button"
          onClick={toggle}
          className={cn(
            'hidden h-11 items-center gap-2 border-t border-border px-4 text-xs font-medium text-foreground-muted transition-colors hover:bg-surface-elevated hover:text-foreground lg:flex',
            collapsed && 'justify-center',
          )}
          aria-label={collapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
        >
          <ChevronLeft
            size={16}
            className={cn('transition-transform duration-200', collapsed && 'rotate-180')}
          />
          {!collapsed && <span className="animate-fade-in">Colapsar</span>}
        </button>
      </aside>
    </>
  );
}
