import { apiRequest } from '../shared/apiClient';
import type {
  AuthResponse,
  RegisterResponse,
  LoginRequest,
  RegisterPatientRequest,
  RegisterCaregiverRequest,
  ChangePasswordRequest,
} from './types';

const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER_PATIENT: '/auth/register/patient',
  REGISTER_CAREGIVER: '/auth/register/caregiver',
  CHANGE_PASSWORD: '/me/change-password',
} as const;

/**
 * Autenticar usuario
 */
export async function login(credentials: LoginRequest): Promise<AuthResponse> {
  return apiRequest<AuthResponse>(AUTH_ENDPOINTS.LOGIN, {
    method: 'POST',
    body: JSON.stringify(credentials),
    requiresAuth: false, // Login doesn't need token usually
  });
}

/**
 * Registrar nuevo paciente
 */
export async function registerPatient(
  data: RegisterPatientRequest
): Promise<RegisterResponse> {
  return apiRequest<RegisterResponse>(AUTH_ENDPOINTS.REGISTER_PATIENT, {
    method: 'POST',
    body: JSON.stringify(data),
    requiresAuth: false,
  });
}

/**
 * Registrar nuevo cuidador
 */
export async function registerCaregiver(
  data: RegisterCaregiverRequest
): Promise<RegisterResponse> {
  return apiRequest<RegisterResponse>(AUTH_ENDPOINTS.REGISTER_CAREGIVER, {
    method: 'POST',
    body: JSON.stringify(data),
    requiresAuth: false,
  });
}

/**
 * Cambiar contraseña del usuario autenticado
 */
export async function changePassword(
  data: ChangePasswordRequest
): Promise<void> {
  // Este endpoint está en /me/change-password (sin /api prefix)
  const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8080';
  const url = `${API_BASE}/me/change-password`;
  
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    let errorMessage = 'Error al cambiar la contraseña';
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorData.detail || errorMessage;
    } catch {
      errorMessage = response.statusText || errorMessage;
    }
    
    const error = new Error(errorMessage);
    (error as any).status = response.status;
    throw error;
  }
  
  // No hay contenido en la respuesta exitosa (204 No Content o similar)
  return;
}
