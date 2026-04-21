import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Role } from "../types";
import type { AuthUser } from "../types/api";
import { toFrontendRole } from "../types/api";

/* ── UI Store ── */

interface UIState {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarCollapsed: false,
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
}));

/* ── App / Role Store ── */

interface AppState {
  role: Role;
  activePage: string;
  sidebarCollapsed: boolean;
  mobileSidebarOpen: boolean;
  setRole: (role: Role) => void;
  setActivePage: (page: string) => void;
  toggleSidebar: () => void;
  setMobileSidebarOpen: (open: boolean) => void;
}

const DEFAULT_PAGE: Record<Role, string> = {
  superadmin: "dashboard",
  admin: "ap-dashboard",
  kadis: "kadis-dashboard",
  surveyor: "sv-dashboard",
};

const VALID_ROLES: Role[] = ["superadmin", "admin", "kadis", "surveyor"];

/* Baca role dari auth yang sudah di-persist agar tidak reset ke default saat reload */
function getInitialRole(): Role {
  try {
    const stored = localStorage.getItem("sigat_auth");
    if (stored) {
      const role = JSON.parse(stored)?.state?.user?.role as string | undefined;
      if (role) {
        // Tangani BackendRole (dari login real) maupun Role lama (dari mock/cache)
        const mapped = toFrontendRole(role as any);
        if (VALID_ROLES.includes(mapped)) return mapped;
      }
    }
  } catch {}
  return "superadmin";
}

export const useAppStore = create<AppState>((set) => {
  const role = getInitialRole();
  return {
    role,
    activePage: DEFAULT_PAGE[role] ?? "dashboard",
    sidebarCollapsed: false,
    mobileSidebarOpen: false,
    setRole: (role) => set({ role, activePage: DEFAULT_PAGE[role] }),
    setActivePage: (page) =>
      set({ activePage: page, mobileSidebarOpen: false }),
    toggleSidebar: () =>
      set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
    setMobileSidebarOpen: (open) => set({ mobileSidebarOpen: open }),
  };
});

/* ── Auth Store ── */

const TOKEN_KEY = "sigat_token";

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: AuthUser | null;
  setAuth: (token: string, user: AuthUser) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      token: localStorage.getItem(TOKEN_KEY),
      user: null,

      setAuth: (token, user) => {
        localStorage.setItem(TOKEN_KEY, token);
        set({ isAuthenticated: true, token, user });
      },

      clearAuth: () => {
        localStorage.removeItem(TOKEN_KEY);
        set({ isAuthenticated: false, token: null, user: null });
      },
    }),
    {
      name: "sigat_auth",
      partialize: (s) => ({
        token: s.token,
        user: s.user,
        isAuthenticated: s.isAuthenticated,
      }),
    },
  ),
);
