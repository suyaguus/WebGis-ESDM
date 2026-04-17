import { create } from 'zustand';
import type { Role } from '../types';

interface AppState {
  role: Role;
  activePage: string;
  sidebarCollapsed: boolean;
  setRole: (role: Role) => void;
  setActivePage: (page: string) => void;
  toggleSidebar: () => void;
}

const DEFAULT_PAGE: Record<Role, string> = {
  superadmin: 'dashboard',
  admin:      'ap-dashboard',
  kadis:      'kadis-dashboard',
  supervisor: 'dashboard',
};

export const useAppStore = create<AppState>((set) => ({
  role:             'admin',          // ← Switch here: 'superadmin' | 'admin'
  activePage:       'ap-dashboard',
  sidebarCollapsed: false,
  setRole: (role) => set({ role, activePage: DEFAULT_PAGE[role] }),
  setActivePage: (page) => set({ activePage: page }),
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
}));
