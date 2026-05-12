'use client';

import { useSidebar } from '@/shared/application/stores/sidebar.store';
import { useVistaActual } from '@/shared/application/hooks/use-vista-actual';
import { Menu } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';

export function Header() {
  const vista = useVistaActual();
  const Icon = vista.icon;
  const toggleMobile = useSidebar((s) => s.toggleMobile);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-surface/80 px-4 backdrop-blur-md sm:px-6">
      {/* Toggle móvil */}
      <button
        type="button"
        onClick={toggleMobile}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-surface text-foreground-muted transition-colors hover:bg-surface-elevated hover:text-foreground lg:hidden"
        aria-label="Abrir menú"
      >
        <Menu size={18} />
      </button>

      {/* Identidad de la vista activa */}
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-muted text-brand sm:flex">
          <Icon size={18} />
        </div>
        <div className="min-w-0 leading-tight">
          <h1 className="truncate text-sm font-semibold text-foreground sm:text-[15px]">
            {vista.titulo}
          </h1>
          <p className="hidden truncate text-xs text-foreground-muted md:block">
            {vista.descripcion}
          </p>
        </div>
      </div>

      {/* Acciones a la derecha */}
      <div className="flex shrink-0 items-center gap-2">
        <ThemeToggle />
      </div>
    </header>
  );
}
