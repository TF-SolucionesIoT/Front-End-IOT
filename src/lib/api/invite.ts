/**
 * Respuesta al generar un código de invitación
 */
export interface InviteCodeResponse {
  code: string;
  expiresAt: string; // ISO DateTime
}

/**
 * Respuesta al usar un código de invitación
 */
export interface UseCodeResponse {
  message: string;
}

/**
 * Servicio API para gestionar códigos de invitación
 * Nota: Estas peticiones van directamente a /api/invite (no a /api/records)
 */
export const inviteApi = {
  /**
   * Generar código de invitación (solo PATIENT)
   * POST /api/invite/generate
   */
  generateCode: async (): Promise<InviteCodeResponse> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : '';
    const response = await fetch('/api/invite/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Error ${response.status}: ${response.statusText}`);
    }

    return response.json();
  },

  /**
   * Usar código de invitación para enlazar paciente (solo CAREGIVER)
   * POST /api/invite/use/{code}
   */
  useCode: async (code: string): Promise<UseCodeResponse> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : '';
    const response = await fetch(`/api/invite/use/${code}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Error ${response.status}: ${response.statusText}`);
    }

    return response.json();
  },
};
