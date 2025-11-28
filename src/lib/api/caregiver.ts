/**
 * API functions for caregiver operations
 */

import { apiRequest } from './shared/apiClient';

export interface CaregiverPatient {
  patientId: number;
  patientName: string;
  accessLevel: string;
  grantedDate: string;
}

/**
 * Get all patients assigned to the current caregiver
 * @returns Promise with array of patients
 */
export async function getCaregiverPatients(): Promise<CaregiverPatient[]> {
  console.log('🔵 [API] Fetching caregiver patients...');

  try {
    const data = await apiRequest<CaregiverPatient[]>(
      '/me/caregiver/patients',
      {
        method: 'GET',
        requiresAuth: true,
      }
    );

    console.log('✅ Caregiver patients retrieved successfully');
    console.log('📦 Data:', data);
    console.log('📈 Total patients:', data.length);
    return data;
  } catch (error) {
    console.error('❌ Error fetching caregiver patients:', error);
    throw error;
  }
}
