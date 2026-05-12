'use client';

import {
  keepPreviousData,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

export function QueryProvider({ children }: { children: ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // 60s evita refetch al re-renderizar componentes durante navegación.
            staleTime: 60 * 1000,
            // 5 min en cache permite navegar atrás sin re-fetch perceptible.
            gcTime: 5 * 60 * 1000,
            refetchOnWindowFocus: false,
            retry: 1,
            // CLAVE para UX al cambiar filtros: la query mantiene los datos
            // anteriores mientras los nuevos están en vuelo. Elimina el
            // flash de skeleton entre cada cambio de filtro/depto/municipio.
            placeholderData: keepPreviousData,
          },
        },
      }),
  );

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
