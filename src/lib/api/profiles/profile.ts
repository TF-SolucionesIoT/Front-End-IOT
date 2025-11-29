import { apiRequest } from '../shared/apiClient';
import type { UserProfile } from './types';

/**
 * Obtener perfil completo del usuario autenticado desde el backend
 * Llama al endpoint GET /api/auth/profile/me
 */
export async function getCurrentUserProfile(): Promise<UserProfile> {
  try {
    // Llamar al endpoint del backend que devuelve el perfil completo
    const data = await apiRequest<any>('/auth/profile/me', {
      method: 'GET',
    });

    console.log('✅ User profile loaded from backend:', data);

    // Mapear el response del backend al tipo UserProfile
    const profile: UserProfile = {
      id: data.id,
      username: data.username,
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      email: data.email || '',
      gender: data.gender || '',
      phoneNumber: data.phoneNumber,
      birthday: data.birthday,
      typeOfUser: data.typeOfUser, // 'PATIENT' o 'CAREGIVER'
      patientId: data.patientId,   // ID de la tabla patient
      caregiverId: data.caregiverId, // ID de la tabla caregiver
    };

    // Guardar en localStorage para uso futuro
    if (typeof window !== 'undefined') {
      localStorage.setItem('user_profile', JSON.stringify(profile));
    }

    return profile;
  } catch (error) {
    console.error('❌ Error fetching user profile:', error);
    
    // Intentar recuperar desde localStorage como fallback
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('user_profile');
      if (stored) {
        try {
          const profile = JSON.parse(stored) as UserProfile;
          console.log('⚠️ Using cached profile from localStorage');
          return profile;
        } catch (e) {
          console.error('Error parsing stored profile:', e);
        }
      }
    }

    throw error;
  }
}
