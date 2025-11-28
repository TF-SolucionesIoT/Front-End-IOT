/**
 * API functions for patient data
 * Used by caregivers to view patient records and emergency contacts
 */

import { apiRequest } from './shared/apiClient';

export interface PatientHealthRecords {
  patientId: number;
  disturbances: Disturbance[];
  symptons: Sympton[];
  treatments: Treatment[];
}

export interface Disturbance {
  id: number;
  disturbanceName: string;
  description: string;
  severity: string;
  diagnosisDate: string;
  patientId: number;
}

export interface Sympton {
  id: number;
  symptonName: string;
  description: string;
  severity: string;
  onsetDate: string;
  patientId: number;
}

export interface Treatment {
  id: number;
  treatmentName: string;
  description: string;
  startDate: string;
  endDate?: string;
  status: string;
  patientId: number;
}

export interface EmergencyContact {
  id: number;
  name: string;
  relationship: string;
  phoneNumber: string;
  email?: string;
  isPrimary: boolean;
  patientId: number;
}

/**
 * Get patient health records including disturbances, symptoms, and treatments
 * @param patientId - The ID of the patient
 * @returns Promise with patient health records
 */
export async function getPatientHealthRecords(
  patientId: number
): Promise<PatientHealthRecords> {
  console.log('🔵 [API] Fetching patient health records...');
  console.log('🆔 Patient ID:', patientId);

  try {
    const data = await apiRequest<PatientHealthRecords>(
      `/records/patient/${patientId}`,
      {
        method: 'GET',
        requiresAuth: true,
      }
    );

    console.log('✅ Patient health records retrieved successfully');
    console.log('📦 Data:', data);
    return data;
  } catch (error) {
    console.error('❌ Error fetching patient health records:', error);
    throw error;
  }
}

/**
 * Get all emergency contacts for a patient
 * @param patientId - The ID of the patient
 * @returns Promise with array of emergency contacts
 */
export async function getEmergencyContacts(
  patientId: number
): Promise<EmergencyContact[]> {
  console.log('🔵 [API] Fetching emergency contacts...');
  console.log('🆔 Patient ID:', patientId);

  try {
    const data = await apiRequest<EmergencyContact[]>(
      `/contacts/emergencies/patient/${patientId}/all`,
      {
        method: 'GET',
        requiresAuth: true,
      }
    );

    console.log('✅ Emergency contacts retrieved successfully');
    console.log('📦 Data:', data);
    console.log('📈 Total contacts:', data.length);
    return data;
  } catch (error) {
    console.error('❌ Error fetching emergency contacts:', error);
    throw error;
  }
}

/**
 * Get all patient data (records + contacts) in a single call
 * @param patientId - The ID of the patient
 * @returns Promise with both records and contacts
 */
export async function getAllPatientData(patientId: number) {
  console.log('🚀 [API] Starting to fetch all patient data...');
  console.log('🆔 Patient ID:', patientId);
  console.log('⏰ Timestamp:', new Date().toISOString());

  try {
    const [records, contacts] = await Promise.all([
      getPatientHealthRecords(patientId),
      getEmergencyContacts(patientId),
    ]);

    console.log('✅ All patient data fetched successfully');
    console.log('📊 Summary:');
    console.log('  - Disturbances:', records.disturbances?.length || 0);
    console.log('  - Symptoms:', records.symptons?.length || 0);
    console.log('  - Treatments:', records.treatments?.length || 0);
    console.log('  - Emergency Contacts:', contacts.length);

    return {
      records,
      contacts,
    };
  } catch (error) {
    console.error('❌ Error fetching all patient data:', error);
    throw error;
  }
}
