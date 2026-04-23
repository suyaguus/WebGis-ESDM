import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store";
import type { LoginRequest } from "@/types/api";

interface RegisterAdminPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  companyName: string;
  companyAddress?: string;
  companyEmail?: string;
  companyPhone?: string;
  companyType?: string;
}

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

export function useRegisterAdmin() {
  return useMutation({
    mutationFn: (payload: RegisterAdminPayload) =>
      authService.registerAdmin(payload),
  });
}
