import { apiRequest } from '../shared/apiClient';
import type { 
  EmergencyContact, 
  CreateEmergencyContactRequest, 
  UpdateEmergencyContactRequest 
} from './types';

/**
 * Get all emergency contacts for a patient
 * GET /api/contacts/emergencies/patient/{patientId}/all
 */
export async function getEmergencyContactsByPatient(
  patientId: number
): Promise<EmergencyContact[]> {
  try {
    const data = await apiRequest<EmergencyContact[]>(
      `/contacts/emergencies/patient/${patientId}/all`,
      {
        method: 'GET',
      }
    );

    console.log('✅ Emergency contacts loaded:', data);
    return data;
  } catch (error) {
    console.error('❌ Error fetching emergency contacts:', error);
    throw error;
  }
}

/**
 * Create a new emergency contact
 * POST /api/contacts/emergencies
 */
export async function createEmergencyContact(
  contact: CreateEmergencyContactRequest
): Promise<EmergencyContact> {
  try {
    const data = await apiRequest<EmergencyContact>(
      '/contacts/emergencies',
      {
        method: 'POST',
        body: JSON.stringify(contact),
      }
    );

    console.log('✅ Emergency contact created:', data);

    // Sanity check: ensure backend created the contact for the same patientId we requested
    if (typeof contact.patientId !== 'undefined' && typeof data.patientId !== 'undefined') {
      if (data.patientId !== contact.patientId) {
        console.error(
          `⚠️ PatientId mismatch when creating emergency contact. Requested: ${contact.patientId}, Created: ${data.patientId}`
        );
        throw new Error(
          `PatientId mismatch: requested ${contact.patientId}, but created ${data.patientId}`
        );
      }
    }

    return data;
  } catch (error) {
    console.error('❌ Error creating emergency contact:', error);
    throw error;
  }
}

/**
 * Update an existing emergency contact
 * PUT /api/contacts/emergencies/contact/{id}
 */
export async function updateEmergencyContact(
  id: number,
  contact: UpdateEmergencyContactRequest
): Promise<EmergencyContact> {
  try {
    const data = await apiRequest<EmergencyContact>(
      `/contacts/emergencies/contact/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(contact),
      }
    );

    console.log('✅ Emergency contact updated:', data);
    return data;
  } catch (error) {
    console.error('❌ Error updating emergency contact:', error);
    throw error;
  }
}

/**
 * Delete an emergency contact
 * DELETE /api/contacts/emergencies/contact/{id}
 */
export async function deleteEmergencyContact(id: number): Promise<void> {
  try {
    await apiRequest<void>(
      `/contacts/emergencies/contact/${id}`,
      {
        method: 'DELETE',
      }
    );

    console.log('✅ Emergency contact deleted');
  } catch (error) {
    console.error('❌ Error deleting emergency contact:', error);
    throw error;
  }
}
