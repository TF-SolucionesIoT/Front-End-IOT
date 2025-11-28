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
    const response = await apiRequest<UseCodeResponse>(`/invite/use/${code}`, {
      method: 'POST',
    });

    // Guardar el patientId en localStorage cuando se vincula exitosamente
    if (response && response.patientId && typeof window !== 'undefined') {
      try {
        // Obtener IDs existentes
        const storedIds = localStorage.getItem('caregiver_patient_ids');
        const patientIds: number[] = storedIds ? JSON.parse(storedIds) : [];
        
        // Agregar el nuevo patientId si no existe
        if (!patientIds.includes(response.patientId)) {
          patientIds.push(response.patientId);
          localStorage.setItem('caregiver_patient_ids', JSON.stringify(patientIds));
          console.log('✅ Patient ID saved to localStorage:', response.patientId);
        }
      } catch (error) {
        console.error('Error saving patient ID:', error);
      }
    }

    return response;
  },
};
