import { apiRequest } from '../shared/apiClient';
import type { CreateTreatmentRequest, Treatment } from './types';

/**
 * Servicio API para gestionar Treatments (Tratamientos)
 */
export const treatmentsApi = {
  /**
   * Crear un nuevo tratamiento
   * POST /api/records/treatments
   */
  create: async (data: CreateTreatmentRequest): Promise<Treatment> => {
    return apiRequest<Treatment>('/records/treatments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Obtener todos los tratamientos del paciente
   * GET /api/records/treatments/all
   */
  getAll: async (): Promise<Treatment[]> => {
    return apiRequest<Treatment[]>('/records/treatments/all', {
      method: 'GET',
    });
  },
};
