/**
 * Configuración de la API REST
 */
// Usar el proxy de Next.js para evitar CORS
// Las peticiones a /api/records se reescriben automáticamente a http://localhost:8080/api/records
// gracias a la configuración de rewrites en next.config.ts
const API_BASE_URL = '/api/records';

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  HEADERS: {
    'Content-Type': 'application/json',
  },
} as const;

/**
 * Obtiene el token de autenticación del localStorage
 */
function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token');
  }
  return null;
}

/**
 * Función helper para hacer peticiones HTTP con autenticación
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  
  // Obtener el token de autenticación
  const token = getAuthToken();
  
  // Preparar headers con el token si está disponible
  const headers: HeadersInit = {
    ...API_CONFIG.HEADERS,
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    // Si es un error 401, podría ser que el token haya expirado
    if (response.status === 401) {
      // Limpiar el token y redirigir al login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        window.location.href = '/auth/login';
      }
    }
    
    const errorText = await response.text();
    throw new Error(
      `API Error: ${response.status} ${response.statusText} - ${errorText}`
    );
  }

  // Si la respuesta está vacía (como en DELETE), retornar un objeto vacío
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    return {} as T;
  }

  return response.json();
}

