import { QueryProvider } from '@/shared/infrastructure/providers/query-provider';
import { ThemeProvider } from '@/shared/infrastructure/providers/theme-provider';
import { BarraFiltrosContextual } from '@/shared/ui/filters/barra-filtros-contextual';
import { Header } from '@/shared/ui/layout/header';
import { Sidebar } from '@/shared/ui/layout/sidebar';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ReactNode } from 'react';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Analítica Territorial',
  description: 'Plataforma de análisis territorial: comportamiento electoral, indicadores socioeconómicos e impacto poblacional',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider>
          <QueryProvider>
            <div className="flex min-h-screen">
              <Sidebar />
              <div className="flex min-w-0 flex-1 flex-col">
                <Header />
                <BarraFiltrosContextual />
                <main className="flex-1 overflow-x-hidden px-3 py-4 sm:px-5 sm:py-5 lg:px-6 lg:py-6">
                  <div className="mx-auto w-full max-w-[1600px]">{children}</div>
                </main>
              </div>
            </div>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
