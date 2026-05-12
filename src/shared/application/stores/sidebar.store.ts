'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SidebarStore {
  /** Colapsado en escritorio (solo iconos). Persistido. */
  collapsed: boolean;
  /** Abierto en móvil (off-canvas). No persistido — siempre arranca cerrado. */
  mobileOpen: boolean;
  toggle: () => void;
  setCollapsed: (collapsed: boolean) => void;
  toggleMobile: () => void;
  setMobileOpen: (open: boolean) => void;
}

export const useSidebar = create<SidebarStore>()(
  persist(
    (set) => ({
      collapsed: false,
      mobileOpen: false,
      toggle: () => set((s) => ({ collapsed: !s.collapsed })),
      setCollapsed: (collapsed) => set({ collapsed }),
      toggleMobile: () => set((s) => ({ mobileOpen: !s.mobileOpen })),
      setMobileOpen: (mobileOpen) => set({ mobileOpen }),
    }),
    {
      name: 'sidebar-state',
      partialize: (s) => ({ collapsed: s.collapsed }),
    },
  ),
);
