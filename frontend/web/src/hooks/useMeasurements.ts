import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { measurementService } from "@/services/measurement.service";
import type { MeasurementFilter } from "@/services/measurement.service";
import type {
  CreateMeasurementRequest,
  VerifyMeasurementRequest,
} from "@/types/api";

const MEASUREMENTS_KEY = "measurements";

export function useMeasurements(filter?: MeasurementFilter) {
  return useQuery({
    queryKey: [MEASUREMENTS_KEY, filter],
    queryFn: () => measurementService.getAll(filter),
  });
}

export function useMeasurement(id: string) {
  return useQuery({
    queryKey: [MEASUREMENTS_KEY, id],
    queryFn: () => measurementService.getById(id),
    enabled: !!id,
  });
}

export function useSubmitMeasurement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateMeasurementRequest) =>
      measurementService.submit(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: [MEASUREMENTS_KEY] }),
  });
}

export function useVerifyMeasurement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: VerifyMeasurementRequest;
    }) => measurementService.verify(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: [MEASUREMENTS_KEY] }),
  });
}
