import { apiRequest } from '../shared/apiClient';
import type {
  AuthResponse,
  RegisterResponse,
  LoginRequest,
  RegisterPatientRequest,
  RegisterCaregiverRequest,
} from './types';

const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER_PATIENT: '/auth/register/patient',
  REGISTER_CAREGIVER: '/auth/register/caregiver',
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
