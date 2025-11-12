/**
 * Servicio de autenticación
 */

// Usar el proxy de Next.js para evitar CORS
// Las peticiones a /api/auth se reescriben automáticamente a http://localhost:8080/api/auth
// gracias a la configuración de rewrites en next.config.ts
const AUTH_BASE_URL = '/api/auth';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface PatientSignUpRequest {
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  username: string;
  password: string;
  birthday: string; // Formato: YYYY-MM-DD
}

export interface CaregiverSignUpRequest {
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  username: string;
  password: string;
  phoneNumber: string;
}

export interface AuthResponse {
  token: string;
  user?: UserProfile; // El backend puede devolver el usuario en el login
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  gender?: string;
  phoneNumber?: string;
  password?: string; // El backend puede devolverlo, pero no lo usamos
}

/**
 * Almacena el token en localStorage
 */
export const setAuthToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', token);
  }
};

/**
 * Obtiene el token del localStorage
 */
export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token');
  }
  return null;
};

/**
 * Elimina el token del localStorage
 */
export const removeAuthToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
  }
};

/**
 * Inicia sesión con username y password
 */
export async function login(credentials: LoginRequest): Promise<AuthResponse> {
  const response = await fetch(`${AUTH_BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Error al iniciar sesión: ${response.status} ${response.statusText} - ${errorText}`
    );
  }

  const data = await response.json();
  
  // Guardar el token
  if (data.token) {
    setAuthToken(data.token);
  }
  
  // El backend puede devolver el usuario de varias formas:
  // 1. En un campo 'user'
  // 2. Directamente en el body de la respuesta (firstName, lastName, etc.)
  // 3. No devolverlo en absoluto (requiere llamar a un endpoint de perfil)
  
  let userProfile: UserProfile | null = null;
  
  if (data.user) {
    // Caso 1: El usuario viene en un campo 'user'
    userProfile = data.user;
  } else if (data.firstName || data.email || data.username) {
    // Caso 2: El usuario viene directamente en el body
    userProfile = {
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      email: data.email || '',
      username: data.username || '',
      gender: data.gender,
      phoneNumber: data.phoneNumber,
    };
  }
  
  // Guardar el perfil si lo encontramos
  if (userProfile) {
    console.log('Perfil de usuario encontrado en respuesta de login:', userProfile);
    if (typeof window !== 'undefined') {
      localStorage.setItem('user_profile', JSON.stringify(userProfile));
    }
  } else {
    console.log('No se encontró información del usuario en la respuesta de login');
  }

  return data;
}

/**
 * Registra un nuevo paciente
 */
export async function signUpPatient(credentials: PatientSignUpRequest): Promise<AuthResponse> {
  const response = await fetch(`${AUTH_BASE_URL}/register/patient`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Registro de paciente falló: ${response.status} ${response.statusText} - ${errorText}`
    );
  }

  const data = await response.json();
  
  // Guardar el token si se devuelve
  if (data.token) {
    setAuthToken(data.token);
  }

  return data;
}

/**
 * Registra un nuevo cuidador
 */
export async function signUpCaregiver(credentials: CaregiverSignUpRequest): Promise<AuthResponse> {
  const response = await fetch(`${AUTH_BASE_URL}/register/caregiver`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Registro de cuidador falló: ${response.status} ${response.statusText} - ${errorText}`
    );
  }

  const data = await response.json();
  
  // Guardar el token si se devuelve
  if (data.token) {
    setAuthToken(data.token);
  }

  return data;
}

/**
 * Obtiene el perfil del usuario desde localStorage (si fue guardado en el login)
 */
function getUserProfileFromStorage(): UserProfile | null {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('user_profile');
    if (stored) {
      try {
        return JSON.parse(stored) as UserProfile;
      } catch (e) {
        console.error('Error al parsear perfil guardado:', e);
        return null;
      }
    }
  }
  return null;
}

/**
 * Guarda el perfil del usuario en localStorage
 */
function setUserProfileToStorage(profile: UserProfile): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user_profile', JSON.stringify(profile));
  }
}

/**
 * Obtiene el perfil del usuario autenticado
 * Primero intenta obtenerlo desde localStorage, luego desde el backend
 */
export async function getUserProfile(): Promise<UserProfile> {
  const token = getAuthToken();
  
  if (!token) {
    // Si no hay token, intentar obtener desde localStorage
    const storedProfile = getUserProfileFromStorage();
    if (storedProfile) {
      console.log('Perfil obtenido desde localStorage:', storedProfile);
      return storedProfile;
    }
    throw new Error('No hay token de autenticación');
  }

  // Primero intentar desde localStorage (más rápido)
  const storedProfile = getUserProfileFromStorage();
  if (storedProfile) {
    console.log('Perfil obtenido desde localStorage:', storedProfile);
  }

  // Lista de endpoints posibles para obtener el perfil
  const possibleEndpoints = [
    '/profile',
    '/me',
    '/user',
    '/user/profile',
  ];

  let lastError: Error | null = null;

  // Intentar cada endpoint hasta que uno funcione
  for (const endpoint of possibleEndpoints) {
    try {
      console.log(`Intentando obtener perfil desde: ${AUTH_BASE_URL}${endpoint}`);
      const response = await fetch(`${AUTH_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log(`Respuesta del endpoint ${endpoint}:`, response.status, response.statusText);

      if (response.ok) {
        const data = await response.json();
        console.log('Perfil de usuario obtenido del backend:', data);
        
        // Guardar en localStorage para próximas consultas
        setUserProfileToStorage(data as UserProfile);
        
        return data as UserProfile;
      }

      if (response.status === 401) {
        removeAuthToken();
        if (typeof window !== 'undefined') {
          localStorage.removeItem('user_profile');
          window.location.href = '/auth/login';
        }
        throw new Error('No autorizado');
      }

      // Si no es 401, guardar el error y continuar con el siguiente endpoint
      const errorText = await response.text();
      console.warn(`Endpoint ${endpoint} falló:`, response.status, errorText);
      lastError = new Error(
        `Error ${response.status}: ${errorText}`
      );
    } catch (error) {
      if (error instanceof Error && error.message === 'No autorizado') {
        throw error;
      }
      console.warn(`Error al intentar endpoint ${endpoint}:`, error);
      lastError = error instanceof Error ? error : new Error('Error desconocido');
    }
  }

  // Si ninguno de los endpoints funcionó, pero tenemos un perfil guardado, usarlo
  if (storedProfile) {
    console.log('Usando perfil guardado en localStorage porque el backend no respondió');
    return storedProfile;
  }

  // Si ninguno de los endpoints funcionó, lanzar el último error
  if (lastError) {
    console.error('Error al obtener perfil del usuario:', lastError);
    throw new Error(
      `No se pudo obtener el perfil del usuario. Verifica que el backend exponga un endpoint de perfil (como /api/auth/profile, /api/auth/me, etc.). Último error: ${lastError.message}`
    );
  }

  throw new Error('No se pudo obtener el perfil del usuario');
}

/**
 * Cierra sesión
 */
export function logout(): void {
  removeAuthToken();
  // Limpiar también el perfil guardado
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user_profile');
    window.location.href = '/auth/login';
  }
}

