import { create } from 'zustand';
import type { Role, Sensor } from '../types';

interface AppState {
  role: Role;
  activePage: string;
  sidebarCollapsed: boolean;
  selectedSensor: Sensor | null;
  setRole: (role: Role) => void;
  setActivePage: (page: string) => void;
  toggleSidebar: () => void;
  setSelectedSensor: (sensor: Sensor | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  role: 'superadmin',
  activePage: 'dashboard',
  sidebarCollapsed: false,
  selectedSensor: null,
  setRole: (role) => set({ role }),
  setActivePage: (page) => set({ activePage: page }),
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSelectedSensor: (sensor) => set({ selectedSensor: sensor }),
}));
