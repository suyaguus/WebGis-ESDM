import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '@/services/analytics.service';
import type { AnalyticsTrendFilter } from '@/types/api';

export function useAnalyticsTrend(filter?: AnalyticsTrendFilter) {
  return useQuery({
    queryKey: ['analytics', 'trend', filter],
    queryFn:  () => analyticsService.getTrend(filter),
  });
}

export function useCompanySummary() {
  return useQuery({
    queryKey: ['analytics', 'company-summary'],
    queryFn:  analyticsService.getCompanySummary,
  });
}
