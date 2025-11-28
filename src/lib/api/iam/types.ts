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

export interface ChangePasswordRequest {
  password: string;
  newPassword: string;
}

export type UserType = 'patient' | 'caregiver';

// Invite types
export interface InviteCodeResponse {
  code: string;
  expiresAt: string; // ISO DateTime
}

export interface UseCodeResponse {
  message: string;
  patientId: number;
}
