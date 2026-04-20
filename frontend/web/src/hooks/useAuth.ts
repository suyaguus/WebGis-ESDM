import { useMutation } from '@tanstack/react-query';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store';
import type { LoginRequest } from '@/types/api';

export function useLogin() {
  const { setAuth } = useAuthStore();

  return useMutation({
    mutationFn: (payload: LoginRequest) => authService.login(payload),
    onSuccess: (data) => {
      setAuth(data.token, data.user);
    },
  });
}

export function useLogout() {
  const { clearAuth } = useAuthStore();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSettled: () => {
      clearAuth();
    },
  });
}
