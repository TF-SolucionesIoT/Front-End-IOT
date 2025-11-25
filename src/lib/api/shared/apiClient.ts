import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Cliente API centralizado con manejo de errores
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

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

export interface ApiRequestOptions extends RequestInit {
  requiresAuth?: boolean;
}

export async function apiRequest<T>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  // Remove leading slash if present to avoid double slashes if base has trailing slash
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}${cleanEndpoint}`;
  
  const { requiresAuth = true, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (requiresAuth) {
    const token = getStoredToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const config: RequestInit = {
    ...fetchOptions,
    headers,
  };

  console.log(`📡 API Request: ${options.method || 'GET'} ${url}`);
  console.log('📋 Headers:', headers);
  if (fetchOptions.body) {
    console.log('📦 Body:', fetchOptions.body);
  }

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      // Handle 401 Unauthorized
      if (response.status === 401) {
        console.warn('🔒 401 Unauthorized - Clearing tokens');
        clearTokens();
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/auth')) {
           window.location.href = '/auth/login';
        }
      }

      // Handle 403 Forbidden
      if (response.status === 403) {
        console.error('🚫 403 Forbidden - Check token validity and permissions');
        console.log('Token present:', !!getStoredToken());
      }

      let errorMessage = 'An error occurred';
      let errorDetails = null;

      try {
        const errorData = await response.json();
        console.error('❌ Error response:', errorData);
        errorMessage = errorData.message || errorData.error || errorMessage;
        errorDetails = errorData;
      } catch {
        errorMessage = response.statusText || errorMessage;
      }

      throw new ApiError(
        errorMessage,
        response.status,
        response.status.toString(),
        errorDetails
      );
    }

    // Handle empty responses (like DELETE)
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        return await response.json();
    }
    return {} as T;

  } catch (error) {
    console.error('❌ API Error:', error);
    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof TypeError) {
      throw new ApiError(
        'Network error. Please check your connection.',
        undefined,
        'NETWORK_ERROR'
      );
    }

    throw new ApiError(
      'An unexpected error occurred',
      undefined,
      'UNKNOWN_ERROR'
    );
  }
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
}
