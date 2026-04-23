import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { businessService } from "@/services/business.service";
import type { CreateBusinessRequest, UpdateBusinessRequest } from "@/types/api";

const KEY = "businesses";

export function useBusinesses() {
  return useQuery({
    queryKey: [KEY],
    queryFn: () => businessService.getAll(),
  });
}

export function useCreateBusiness() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateBusinessRequest) =>
      businessService.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
}

export function useUpdateBusiness() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateBusinessRequest;
    }) => businessService.update(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
}

export function useDeleteBusiness() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => businessService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
}
