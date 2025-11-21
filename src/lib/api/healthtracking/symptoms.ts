import { apiRequest } from '../shared/apiClient';
import type {
  CreateSymptonRequest,
  Symptom,
  DeleteSymptonRequest,
} from './types';

/**
 * Servicio API para gestionar Symptoms (Síntomas)
 */
export const symptomsApi = {
  /**
   * Crear un nuevo síntoma
   * POST /api/records/symptons
   */
  create: async (data: CreateSymptonRequest): Promise<Symptom> => {
    return apiRequest<Symptom>('/records/symptons', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Obtener todos los síntomas del paciente
   * GET /api/records/symptons/all
   */
  getAll: async (): Promise<Symptom[]> => {
    return apiRequest<Symptom[]>('/records/symptons/all', {
      method: 'GET',
    });
  },

  /**
   * Eliminar un síntoma
   * DELETE /api/records/symptons
   */
  delete: async (symptonId: number): Promise<void> => {
    const data: DeleteSymptonRequest = { symptonId };
    await apiRequest<void>('/records/symptons', {
      method: 'DELETE',
      body: JSON.stringify(data),
    });
  },
};
