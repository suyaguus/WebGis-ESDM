/**
 * Axios HTTP client — instans tunggal untuk seluruh aplikasi.
 *
 * Interceptor request  : menyisipkan token Authorization secara otomatis.
 * Interceptor response : menangani 401 (token kedaluwarsa) → logout otomatis.
 */
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api',
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
});

/* ── Request interceptor: sisipkan token ── */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sigat_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* ── Response interceptor: tangani 401 ── */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('sigat_token');
      localStorage.removeItem('sigat_auth');
      // Redirect ke login — App.tsx akan mendeteksi token kosong
      window.location.reload();
    }
    return Promise.reject(error);
  },
);

export default api;
