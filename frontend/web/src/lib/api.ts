import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8000/api",
  timeout: 15_000,
  headers: { "Content-Type": "application/json" },
});

const isPublicAuthEndpoint = (url?: string) =>
  !!url && ["/auth/login", "/auth/register"].some((path) => url.endsWith(path));

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("sigat_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl = error.config?.url as string | undefined;

    if (error.response?.status === 401 && !isPublicAuthEndpoint(requestUrl)) {
      localStorage.removeItem("sigat_token");
      localStorage.removeItem("sigat_auth");
      window.location.reload();
    }

    return Promise.reject(error);
  },
);

export default api;
