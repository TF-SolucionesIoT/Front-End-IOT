/**
 * Tipos TypeScript para las requests y responses de la API
 */

// ==================== AUTHENTICATION (Autenticación) ====================

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

export interface RegisterResponse extends AuthResponse {
  username: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterPatientRequest {
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  username: string;
  password: string;
  birthday: string; // ISO date format (YYYY-MM-DD)
}

export interface RegisterCaregiverRequest {
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  username: string;
  password: string;
  phoneNumber: string;
}

export type UserType = 'patient' | 'caregiver';

// Información del usuario (basado en el ProfileResource del backend)
export interface UserProfile {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  username: string;
  phoneNumber?: string;
  birthday?: string;
}

// ==================== DISTURBANCES (Alteraciones) ====================

export interface CreateDisturbanceRequest {
  description: string;
  date: string; // Formato: YYYY-MM-DD
  time: string; // Formato: HH:mm
}

export interface Disturbance {
  id: number;
  description: string;
  date: string;
  time: string;
  // Agregar otros campos que retorne el backend si los hay
}

export interface DeleteDisturbanceRequest {
  disturbanceId: number;
}

// ==================== SYMPTOMS (Síntomas) ====================

export interface CreateSymptonRequest {
  description: string;
  date: string; // Formato: YYYY-MM-DD
  time: string; // Formato: HH:mm
}

export interface Symptom {
  id: number;
  description: string;
  date: string;
  time: string;
  // Agregar otros campos que retorne el backend si los hay
}

export interface DeleteSymptonRequest {
  symptonId: number;
}

// ==================== TREATMENTS (Tratamientos) ====================

export interface CreateTreatmentRequest {
  name: string;
  dose: string;
  time: string; // Formato: HH:mm
  // Agregar otros campos que requiera el backend
}

export interface Treatment {
  id: number;
  name: string;
  dose: string;
  time: string;
  status?: 'Taken' | 'Upcoming';
  // Agregar otros campos que retorne el backend si los hay
}

