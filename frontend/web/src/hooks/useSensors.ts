import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sensorService } from '@/services/sensor.service';
import type { SensorFilter, CreateSensorRequest, UpdateSensorRequest } from '@/types/api';

const SENSORS_KEY = 'sensors';

export function useSensors(filter?: SensorFilter) {
  return useQuery({
    queryKey: [SENSORS_KEY, filter],
    queryFn:  () => sensorService.getAll(filter),
  });
}

export function useSensorsByCompany(companyId: string) {
  return useQuery({
    queryKey: [SENSORS_KEY, 'company', companyId],
    queryFn:  () => sensorService.getByCompany(companyId),
    enabled:  !!companyId,
  });
}

export function useSensor(id: string) {
  return useQuery({
    queryKey: [SENSORS_KEY, id],
    queryFn:  () => sensorService.getById(id),
    enabled:  !!id,
  });
}

export function useCreateSensor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateSensorRequest) => sensorService.create(payload),
    onSuccess:  () => qc.invalidateQueries({ queryKey: [SENSORS_KEY] }),
  });
}

export function useUpdateSensor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateSensorRequest }) =>
      sensorService.update(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: [SENSORS_KEY] }),
  });
}

export function useDeleteSensor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => sensorService.delete(id),
    onSuccess:  () => qc.invalidateQueries({ queryKey: [SENSORS_KEY] }),
  });
}
