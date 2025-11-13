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
    return localStorage.getItem('accessToken');
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
  
  // Log para debug
  console.log('🔍 API Request:', {
    url,
    method: options.method || 'GET',
    hasToken: !!token,
    tokenPreview: token ? token.substring(0, 20) + '...' : 'NO TOKEN'
  });
  
  // Preparar headers con el token si está disponible
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    console.log('✅ Authorization header added');
  } else {
    console.warn('⚠️ No token found in localStorage');
  }
  
  const response = await fetch(url, {
    ...options,
    headers,
  });

  console.log('📥 Response:', response.status, response.statusText);

  if (!response.ok) {
    // Si es un error 401, podría ser que el token haya expirado
    if (response.status === 401) {
      console.error('🔒 401 Unauthorized - Token expired or invalid');
      // Limpiar el token y redirigir al login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/auth/login';
      }
    }
    
    // Si es 403, puede ser un problema de autorización
    if (response.status === 403) {
      console.error('🚫 403 Forbidden - Token:', token ? 'Present' : 'Missing');
      console.error('Request URL:', url);
      console.error('Headers sent:', headers);
    }
    
    // Si es 400, hay un error en la petición o validación
    if (response.status === 400) {
      console.error('⚠️ 400 Bad Request - Request URL:', url);
      console.error('Headers sent:', headers);
    }
    
    const errorText = await response.text();
    console.error('❌ Error response body:', errorText || '(empty)');
    
    // Intentar parsear como JSON para ver el error completo
    if (errorText) {
      try {
        const errorJson = JSON.parse(errorText);
        console.error('📋 Parsed error:', errorJson);
      } catch (e) {
        // No es JSON, ya se mostró el texto
      }
    }
    
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

