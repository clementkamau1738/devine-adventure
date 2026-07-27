import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/store/auth.store';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: false,
});

function authHeader(config?: InternalAxiosRequestConfig): string | undefined {
  const h = config?.headers;
  if (!h) return undefined;
  if (typeof h.get === 'function') {
    const v = h.get('Authorization') ?? h.get('authorization');
    return typeof v === 'string' ? v : undefined;
  }
  return (
    (h as { Authorization?: string; authorization?: string }).Authorization ??
    (h as { authorization?: string }).authorization
  );
}

// Request interceptor — attach token
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — auto-refresh on 401 (never bounce public pages to login)
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    if (error.response?.status === 401 && original && !original._retry) {
      // Guest request to a protected endpoint — leave the page alone
      if (!authHeader(original) && !localStorage.getItem('refreshToken')) {
        return Promise.reject(error);
      }

      original._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token');

        const res = await axios.post<{
          data: { accessToken: string; refreshToken: string };
        }>(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          {},
          { headers: { Authorization: `Bearer ${refreshToken}` } },
        );
        const { accessToken, refreshToken: newRefresh } = res.data.data;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', newRefresh);
        original.headers.Authorization = `Bearer ${accessToken}`;
        return api(original);
      } catch {
        useAuthStore.getState().clearAuth();
        // Only force login on areas that require a session
        if (typeof window !== 'undefined') {
          const path = window.location.pathname;
          if (path.startsWith('/dashboard') || path.startsWith('/admin')) {
            const redirect = encodeURIComponent(path);
            window.location.href = `/login?redirect=${redirect}`;
          }
        }
      }
    }
    return Promise.reject(error);
  },
);

export default api;
