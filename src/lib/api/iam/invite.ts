import { apiRequest } from '../shared/apiClient';
import type { InviteCodeResponse, UseCodeResponse } from './types';

/**
 * Servicio API para gestionar códigos de invitación
 */
export const inviteApi = {
  /**
   * Generar código de invitación (solo PATIENT)
   * POST /api/invite/generate
   */
  generateCode: async (): Promise<InviteCodeResponse> => {
    return apiRequest<InviteCodeResponse>('/invite/generate', {
      method: 'POST',
    });
  },

  /**
   * Usar código de invitación para enlazar paciente (solo CAREGIVER)
   * POST /api/invite/use/{code}
   */
  useCode: async (code: string): Promise<UseCodeResponse> => {
    return apiRequest<UseCodeResponse>(`/invite/use/${code}`, {
      method: 'POST',
    });
  },
};
