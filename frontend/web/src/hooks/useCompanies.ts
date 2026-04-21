import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { companyService } from '@/services/company.service';
import type { CreateCompanyRequest } from '@/types/api';

const COMPANIES_KEY = 'companies';

export function useCompanies() {
  return useQuery({
    queryKey: [COMPANIES_KEY],
    queryFn:  companyService.getAll,
  });
}

export function useCompany(id: string) {
  return useQuery({
    queryKey: [COMPANIES_KEY, id],
    queryFn:  () => companyService.getById(id),
    enabled:  !!id,
  });
}

export function useCreateCompany() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCompanyRequest) => companyService.create(payload),
    onSuccess:  () => qc.invalidateQueries({ queryKey: [COMPANIES_KEY] }),
  });
}

export function useUpdateCompany() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<CreateCompanyRequest> }) =>
      companyService.update(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: [COMPANIES_KEY] }),
  });
}

export function useDeleteCompany() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => companyService.delete(id),
    onSuccess:  () => qc.invalidateQueries({ queryKey: [COMPANIES_KEY] }),
  });
}
