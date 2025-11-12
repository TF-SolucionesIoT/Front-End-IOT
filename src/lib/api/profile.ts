import { getStoredToken } from './client';
import type { UserProfile } from './types';

/**
 * Decodificar el token JWT para obtener información del usuario
 * Nota: Esta es una decodificación básica del payload del JWT
 */
function decodeJWT(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
}

/**
 * Obtener perfil del usuario desde localStorage o token JWT
 * 
 * IMPORTANTE: El backend solo incluye 'id' y 'typeOfUser' en el JWT.
 * Para obtener el perfil completo después de login, el backend necesitaría:
 * 1. Un endpoint GET /api/profiles/me que devuelva el perfil del usuario autenticado
 * 2. O incluir más información en el JWT (firstName, lastName, email, etc.)
 * 
 * Por ahora, usamos localStorage para guardar la info del registro.
 * En login, solo tendremos ID y username hasta que se implemente un endpoint de perfil.
 */
export async function getCurrentUserProfile(): Promise<UserProfile> {
  const token = getStoredToken();
  
  if (!token) {
    throw new Error('No authentication token found');
  }

  // Intentar obtener desde localStorage primero (datos guardados en registro)
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('user_profile');
    if (stored) {
      try {
        const profile = JSON.parse(stored) as UserProfile;
        
        // Si el perfil tiene datos completos, usarlo
        if (profile.email && profile.firstName && profile.lastName) {
          console.log('Using complete profile from localStorage:', profile);
          return profile;
        }
      } catch (e) {
        console.error('Error parsing stored profile:', e);
      }
    }
  }

  // Decodificar el token JWT para obtener información básica del usuario
  const decoded = decodeJWT(token);
  if (decoded) {
    // El JWT solo contiene: sub (id) y typeOfUser
    const userId = decoded.sub ? parseInt(decoded.sub) : undefined;
    
    console.warn(
      '⚠️ Limited user information available. JWT only contains ID and user type.\n' +
      'To get complete profile (name, email, etc.), the backend needs to:\n' +
      '1. Provide a GET /api/profiles/me endpoint, OR\n' +
      '2. Include more user data in the JWT payload'
    );
    
    // Crear un perfil básico solo con la información disponible
    const profile: UserProfile = {
      id: userId,
      username: userId?.toString() || 'Usuario',
      firstName: '',
      lastName: '',
      email: '',
      gender: '',
      phoneNumber: undefined,
      birthday: undefined,
    };
    
    // Guardar en localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('user_profile', JSON.stringify(profile));
    }
    
    return profile;
  }

  throw new Error('Could not extract user information from token');
}
