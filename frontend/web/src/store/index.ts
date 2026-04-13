import { create } from 'zustand'

/* ── UI Store ──────────────────────────────────────────────────────── */
interface UIState {
  sidebarCollapsed: boolean
  mapLayer: 'street' | 'satellite' | 'terrain'
  toggleSidebar: () => void
  setMapLayer: (l: UIState['mapLayer']) => void
}

export const useUIStore = create<UIState>((set) => ({
  sidebarCollapsed: false,
  mapLayer: 'street',
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setMapLayer: (mapLayer) => set({ mapLayer }),
}))

/* ── Auth Store ────────────────────────────────────────────────────── */
interface AuthState {
  user: { name: string; initials: string; role: string; email: string }
}

export const useAuthStore = create<AuthState>(() => ({
  user: {
    name:     'Ahmad Fauzi',
    initials: 'SA',
    role:     'Super Admin',
    email:    'ahmad.fauzi@webgis.id',
  },
}))
