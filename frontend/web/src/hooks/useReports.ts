import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reportService } from '@/services/report.service';
import type { GenerateReportRequest } from '@/types/api';

const REPORTS_KEY = 'reports';

export function useReports(scope: 'kadis' | 'admin' = 'admin') {
  return useQuery({
    queryKey: [REPORTS_KEY, scope],
    queryFn:  () => reportService.getAll(scope),
  });
}

export function useGenerateReport() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: GenerateReportRequest) => reportService.generate(payload),
    onSuccess:  () => qc.invalidateQueries({ queryKey: [REPORTS_KEY] }),
  });
}
