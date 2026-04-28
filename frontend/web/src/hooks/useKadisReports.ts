import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { kadisReportService } from "@/services/kadis-report.service";
import type { KadisReportPayload } from "@/services/kadis-report.service";

const KEY = "kadis-reports";

export function useKadisReports() {
  return useQuery({
    queryKey: [KEY],
    queryFn: kadisReportService.getAll,
  });
}

export function useSendToKadis() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: KadisReportPayload) => kadisReportService.send(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
}
