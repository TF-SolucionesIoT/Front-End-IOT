import { apiRequest } from '../shared/apiClient';
import type {
  CreateDisturbanceRequest,
  Disturbance,
  DeleteDisturbanceRequest,
} from './types';

/**
 * Servicio API para gestionar Disturbances (Alteraciones)
 */
export const disturbancesApi = {
  /**
   * Crear una nueva alteración
   * POST /api/records/disturbances
   */
  create: async (
    data: CreateDisturbanceRequest
  ): Promise<Disturbance> => {
    return apiRequest<Disturbance>('/records/disturbances', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Obtener todas las alteraciones del paciente
   * GET /api/records/disturbances/all
   */
  getAll: async (): Promise<Disturbance[]> => {
    return apiRequest<Disturbance[]>('/records/disturbances/all', {
      method: 'GET',
    });
  },

  /**
   * Eliminar una alteración
   * DELETE /api/records/disturbances
   */
  delete: async (disturbanceId: number): Promise<void> => {
    await apiRequest<void>('/records/disturbances', {
      method: 'DELETE',
      body: JSON.stringify(disturbanceId),
    });
  },
};
