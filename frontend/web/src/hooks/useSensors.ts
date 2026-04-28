import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { sensorService } from "@/services/sensor.service";
import type {
  SensorFilter,
  CreateSensorRequest,
  UpdateSensorRequest,
  PaginationParams,
} from "@/types/api";

const SENSORS_KEY = "sensors";

export function useSensors(
  filter?: SensorFilter,
  pagination?: PaginationParams,
) {
  return useQuery({
    queryKey: [SENSORS_KEY, filter, pagination],
    queryFn: () => sensorService.getAll(filter, pagination),
  });
}

export function useSensorsByCompany(companyId: string) {
  return useQuery({
    queryKey: [SENSORS_KEY, "company", companyId],
    queryFn: () => sensorService.getByCompany(companyId),
    enabled: !!companyId,
  });
}

export function useSensor(id: string) {
  return useQuery({
    queryKey: [SENSORS_KEY, id],
    queryFn: () => sensorService.getById(id),
    enabled: !!id,
  });
}

export function useCreateSensor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateSensorRequest) => sensorService.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: [SENSORS_KEY] }),
  });
}

export function useUpdateSensor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateSensorRequest;
    }) => sensorService.update(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: [SENSORS_KEY] }),
  });
}

export function useDeleteSensor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => sensorService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [SENSORS_KEY] }),
  });
}

export function useVerifyWell() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => sensorService.verify(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [SENSORS_KEY] }),
  });
}

export function useProcessWell() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => sensorService.process(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [SENSORS_KEY] }),
  });
}

export function useApproveWell() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => sensorService.approve(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [SENSORS_KEY] }),
  });
}

export function useRejectWell() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      sensorService.reject(id, reason ?? ""),
    onSuccess: () => qc.invalidateQueries({ queryKey: [SENSORS_KEY] }),
  });
}

export function useSupervisorWells(page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: ["supervisorWells", page, limit],
    queryFn: () => sensorService.getSupervisorWells(page, limit),
  });
}

export function useReviewWell() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => sensorService.review(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [SENSORS_KEY] });
      qc.invalidateQueries({ queryKey: ["supervisorWells"] });
    },
  });
}

export function useFlagWell() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, note }: { id: string; note: string }) =>
      sensorService.flag(id, note),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [SENSORS_KEY] });
      qc.invalidateQueries({ queryKey: ["supervisorWells"] });
    },
  });
}
