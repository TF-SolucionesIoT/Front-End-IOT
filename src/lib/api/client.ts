// Cliente API centralizado con manejo de errores
// Si NEXT_PUBLIC_API_URL está vacío, usará el proxy de Next.js (sin CORS)
// Si está definido, hará peticiones directas al backend (necesita CORS configurado)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);

    // Si la respuesta no es OK, manejar el error
    if (!response.ok) {
      let errorMessage = 'An error occurred';
      let errorDetails = null;

      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
        errorDetails = errorData;
      } catch {
        // Si no se puede parsear el error como JSON, usar mensaje genérico
        errorMessage = response.statusText || errorMessage;
      }

      throw new ApiError(
        errorMessage,
        response.status,
        response.status.toString(),
        errorDetails
      );
    }

    // Parsear respuesta exitosa
    const data = await response.json();
    return data;
  } catch (error) {
    // Si ya es un ApiError, re-lanzarlo
    if (error instanceof ApiError) {
      throw error;
    }

    // Error de red o conexión
    if (error instanceof TypeError) {
      throw new ApiError(
        'Network error. Please check your connection and ensure the backend server is running.',
        undefined,
        'NETWORK_ERROR'
      );
    }

    // Error desconocido
    throw new ApiError(
      'An unexpected error occurred',
      undefined,
      'UNKNOWN_ERROR'
    );
  }
}

export function getAuthHeaders(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
  };
}

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('accessToken');
}

export function getStoredRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('refreshToken');
}

export function storeTokens(accessToken: string, refreshToken: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
}

export function clearTokens(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');

  localStorage.removeItem('user_profile');

  //localStorage.clear(); // Si se quiere limpiar todo el localStorage
}
