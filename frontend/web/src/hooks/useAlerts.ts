import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { alertService } from '@/services/alert.service';
import type { AlertFilter } from '@/types/api';

const ALERTS_KEY = 'alerts';

export function useAlerts(filter?: AlertFilter) {
  return useQuery({
    queryKey: [ALERTS_KEY, filter],
    queryFn:  () => alertService.getAll(filter),
  });
}

export function useUnreadAlertCount() {
  return useQuery({
    queryKey: [ALERTS_KEY, 'unread-count'],
    queryFn:  alertService.getUnreadCount,
    refetchInterval: 30_000,
  });
}

export function useMarkAlertRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => alertService.markAsRead(id),
    onSuccess:  () => qc.invalidateQueries({ queryKey: [ALERTS_KEY] }),
  });
}

export function useMarkAllAlertsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: alertService.markAllAsRead,
    onSuccess:  () => qc.invalidateQueries({ queryKey: [ALERTS_KEY] }),
  });
}
