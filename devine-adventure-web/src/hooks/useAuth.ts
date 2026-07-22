import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import { User } from '@/types';

interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);
  return useMutation({
    mutationFn: async (input: { email: string; password: string }) => {
      const { data } = await api.post('/auth/login', input);
      return data.data as AuthResponse;
    },
    onSuccess: (data) => setAuth(data.user, data.accessToken, data.refreshToken),
  });
}

export function useRegister() {
  const setAuth = useAuthStore((s) => s.setAuth);
  return useMutation({
    mutationFn: async (input: {
      name: string;
      email: string;
      phone?: string;
      password: string;
    }) => {
      const { data } = await api.post('/auth/register', input);
      return data.data as AuthResponse;
    },
    onSuccess: (data) => setAuth(data.user, data.accessToken, data.refreshToken),
  });
}
