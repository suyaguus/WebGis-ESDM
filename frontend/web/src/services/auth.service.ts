/**
 * AUTH SERVICE
 *
 * Endpoint yang dibutuhkan backend:
 *   POST   /auth/login       → LoginResponse
 *   POST   /auth/logout      → { success: true }
 *   GET    /auth/me          → AuthUser
 *   POST   /auth/refresh     → { token: string, expiresIn: number }
 */
import api from '@/lib/api';
import type { LoginRequest, LoginResponse, AuthUser } from '@/types/api';

interface RegisterAdminRequest {
  name: string;
  companyName: string;
  email: string;
  password: string;
}

/* ── Data mock untuk development ── */
const MOCK_USERS: Record<string, { password: string; user: AuthUser }> = {
  'admin@sigat.go.id': {
    password: 'sigat123',
    user: { id: 'u1', name: 'Ahmad Fauzi', email: 'admin@sigat.go.id', role: 'superadmin', avatar: 'AF' },
  },
  'kadis@dinas.go.id': {
    password: 'sigat123',
    user: { id: 'u4', name: 'Deni Kurniawan', email: 'kadis@dinas.go.id', role: 'kadis', avatar: 'DK' },
  },
  'admin@majujaya.co.id': {
    password: 'sigat123',
    user: { id: 'u2', name: 'Budi Santoso', email: 'admin@majujaya.co.id', role: 'admin', companyId: 'c1', avatar: 'BS' },
  },
  'surveyor@lapangan.go.id': {
    password: 'sigat123',
    user: { id: 'u5', name: 'Eka Prasetya', email: 'surveyor@lapangan.go.id', role: 'surveyor', companyId: 'c1', avatar: 'EP' },
  },
};

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

/* ── Simulasi delay jaringan pada mock ── */
const mockDelay = () => new Promise(r => setTimeout(r, 400));

export const authService = {
  /**
   * Login pengguna.
   * Backend harus memvalidasi email + password, lalu mengembalikan JWT token.
   */
  login: async (payload: LoginRequest): Promise<LoginResponse> => {
    if (USE_MOCK) {
      await mockDelay();
      const match = MOCK_USERS[payload.email];
      if (!match || match.password !== payload.password) {
        throw { response: { status: 401, data: { message: 'Email atau password salah' } } };
      }
      const token = `mock_token_${Date.now()}`;
      localStorage.setItem('sigat_token', token);
      return { token, expiresIn: 86400, user: match.user };
    }
    const { data } = await api.post<LoginResponse>('/auth/login', payload);
    localStorage.setItem('sigat_token', data.token);
    return data;
  },

  /**
   * Registrasi admin perusahaan.
   */
  registerAdmin: async (payload: RegisterAdminRequest): Promise<LoginResponse> => {
    if (USE_MOCK) {
      await mockDelay();

      if (MOCK_USERS[payload.email]) {
        throw { response: { status: 409, data: { message: 'Email sudah terdaftar' } } };
      }

      const initials = payload.name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? '')
        .join('') || 'AP';

      const user: AuthUser = {
        id: `u-${Date.now()}`,
        name: payload.name,
        email: payload.email,
        role: 'admin',
        avatar: initials,
      };

      const token = `mock_token_${Date.now()}`;
      localStorage.setItem('sigat_token', token);
      return { token, expiresIn: 86400, user };
    }

    const { data } = await api.post<LoginResponse>('/auth/register-admin', payload);
    localStorage.setItem('sigat_token', data.token);
    return data;
  },

  /**
   * Logout — hapus token dari server dan localStorage.
   */
  logout: async (): Promise<void> => {
    if (!USE_MOCK) {
      await api.post('/auth/logout').catch(() => {}); // fire and forget
    }
    localStorage.removeItem('sigat_token');
  },

  /**
   * Ambil profil pengguna yang sedang login (dipakai saat refresh halaman).
   */
  getMe: async (): Promise<AuthUser> => {
    if (USE_MOCK) {
      await mockDelay();
      // Kembalikan user berdasarkan token yang tersimpan
      const token = localStorage.getItem('sigat_token');
      if (!token) throw new Error('Tidak ada token');
      // Pada mock: cari user yang cocok (gunakan email pertama sebagai default)
      return MOCK_USERS['admin@sigat.go.id'].user;
    }
    const { data } = await api.get<AuthUser>('/auth/me');
    return data;
  },

  /**
   * Refresh JWT token sebelum kedaluwarsa.
   */
  refreshToken: async (): Promise<{ token: string; expiresIn: number }> => {
    const { data } = await api.post('/auth/refresh');
    localStorage.setItem('sigat_token', data.token);
    return data;
  },
};
