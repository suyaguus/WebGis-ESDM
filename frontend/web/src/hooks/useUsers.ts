import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services/user.service";
import type { CreateUserRequest, UpdateUserRequest } from "@/types/api";

const USERS_KEY = "users";

export function useUsers() {
  return useQuery({
    queryKey: [USERS_KEY],
    queryFn: userService.getAll,
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
