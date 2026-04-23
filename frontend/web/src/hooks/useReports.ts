import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reportService } from "@/services/report.service";
import { verificationService } from "@/services/verification.service";
import type { GenerateReportRequest } from "@/types/api";

const REPORTS_KEY = "reports";
const VERIFICATION_KEY = "verification-reports";

export function useReports(scope: "kadis" | "admin" = "admin") {
  return useQuery({
    queryKey: [REPORTS_KEY, scope],
    queryFn: () => reportService.getAll(scope),
  });
}

export function useVerificationReports() {
  return useQuery({
    queryKey: [VERIFICATION_KEY],
    queryFn: verificationService.getAll,
  });
}

export function useApproveReport() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => verificationService.approve(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [VERIFICATION_KEY] }),
  });
}

export function useRejectReport() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      verificationService.reject(id, reason),
    onSuccess: () => qc.invalidateQueries({ queryKey: [VERIFICATION_KEY] }),
  });
}

export function useGenerateReport() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: GenerateReportRequest) =>
      reportService.generate(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: [REPORTS_KEY] }),
  });
}
