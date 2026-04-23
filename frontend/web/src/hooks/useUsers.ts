import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services/user.service";
import type {
  CreateAdminPerusahaanRequest,
  CreateUserRequest,
  UpdateUserRequest,
} from "@/types/api";

const USERS_KEY = "users";

export function useUsers(page: number = 1, limit: number = 5) {
  return useQuery({
    queryKey: [USERS_KEY, { page, limit }],
    queryFn: () => userService.getAll(page, limit),
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: [USERS_KEY, id],
    queryFn: () => userService.getById(id),
    enabled: !!id,
  });
}

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateUserRequest) => userService.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: [USERS_KEY] }),
  });
}

export function useCreateAdminPerusahaan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateAdminPerusahaanRequest) =>
      userService.createAdminPerusahaan(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [USERS_KEY] });
      qc.invalidateQueries({ queryKey: ["companies"] });
    },
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateUserRequest }) =>
      userService.update(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: [USERS_KEY] }),
  });
}

export function useDeactivateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => userService.deactivate(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [USERS_KEY] }),
  });
}

export function useActivateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => userService.activate(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [USERS_KEY] }),
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => userService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [USERS_KEY] }),
  });
}
