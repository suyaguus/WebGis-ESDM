import { useQuery } from "@tanstack/react-query";
import { auditService, type AuditFilter } from "@/services/audit.service";

const AUDIT_KEY = "audit-logs";

export function useAuditLogs(filter?: AuditFilter) {
  return useQuery({
    queryKey: [AUDIT_KEY, filter],
    queryFn: () => auditService.getAll(filter),
    staleTime: 30_000,
    placeholderData: (prev) => prev,
  });
}
