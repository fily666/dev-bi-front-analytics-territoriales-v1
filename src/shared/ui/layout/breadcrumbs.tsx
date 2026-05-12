'use client';

import { ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LABELS: Record<string, string> = {
  electoral: 'Electoral',
  comportamiento: 'Comportamiento',
  comparativo: 'Comparativo',
  socioeconomico: 'Socioeconómico',
  poblacional: 'Impacto Poblacional',
  reportes: 'Reportes',
  configuracion: 'Configuración',
};

export function Breadcrumbs() {
  const pathname = usePathname();
  const parts = pathname.split('/').filter(Boolean);

  if (parts.length === 0) {
    return (
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs">
        <Home size={13} className="text-foreground-subtle" />
        <span className="font-medium text-foreground">Home</span>
      </nav>
    );
  }

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs">
      <Link
        href="/"
        className="flex items-center gap-1.5 text-foreground-muted transition-colors hover:text-foreground"
      >
        <Home size={13} />
        <span>Home</span>
      </Link>
      {parts.map((part, idx) => {
        const href = '/' + parts.slice(0, idx + 1).join('/');
        const isLast = idx === parts.length - 1;
        const label = LABELS[part] ?? part;
        return (
          <div key={href} className="flex items-center gap-1.5">
            <ChevronRight size={12} className="text-foreground-subtle" />
            {isLast ? (
              <span className="font-medium text-foreground">{label}</span>
            ) : (
              <Link href={href} className="text-foreground-muted transition-colors hover:text-foreground">
                {label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
