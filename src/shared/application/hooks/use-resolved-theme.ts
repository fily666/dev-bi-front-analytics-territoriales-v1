'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

/**
 * Devuelve el tema resuelto en el cliente ('light' | 'dark'), evitando
 * el mismatch de hidratación. Antes del montaje devuelve 'light' por defecto.
 */
export function useResolvedTheme(): 'light' | 'dark' {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return 'light';
  return resolvedTheme === 'dark' ? 'dark' : 'light';
}
