'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login as apiLogin, registerPatient, registerCaregiver, storeTokens, clearTokens, ApiError } from '@/lib/api';
import type {
  LoginRequest,
  RegisterPatientRequest,
  RegisterCaregiverRequest,
  UserType,
} from '@/lib/api';

interface UseAuthReturn {
  login: (credentials: LoginRequest) => Promise<void>;
  register: (
    data: RegisterPatientRequest | RegisterCaregiverRequest,
    userType: UserType
  ) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

export function useAuth(): UseAuthReturn {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (credentials: LoginRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      // Limpiar perfil de usuario antiguo antes de hacer login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user_profile');
      }
      
      const response = await apiLogin(credentials);
      
      // Guardar tokens en localStorage
      storeTokens(response.accessToken, response.refreshToken);
      console.log('✅ Tokens stored. User profile will be fetched from backend.');

      // Redirigir al dashboard
      router.push('/dashboard');
      router.refresh(); // Refrescar para actualizar el estado de autenticación
    } catch (err) {
      if (err instanceof ApiError) {
        // Mensajes de error más amigables según el código de estado
        if (err.status === 401) {
          setError('Invalid username or password');
        } else if (err.status === 404) {
          setError('User not found');
        } else if (err.code === 'NETWORK_ERROR') {
          setError('Cannot connect to server. Please check if the backend is running.');
        } else {
          setError(err.message || 'An error occurred during login');
        }
      } else {
        setError('An unexpected error occurred during login');
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (
    data: RegisterPatientRequest | RegisterCaregiverRequest,
    userType: UserType
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const response =
        userType === 'patient'
          ? await registerPatient(data as RegisterPatientRequest)
          : await registerCaregiver(data as RegisterCaregiverRequest);

      // Guardar tokens
      storeTokens(response.accessToken, response.refreshToken);

      // Guardar información del usuario en localStorage para uso posterior
      // Ya que el JWT solo contiene el ID y tipo de usuario
      if (typeof window !== 'undefined') {
        const userProfile = {
          id: undefined, // Se obtendrá del token
          username: response.username,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          gender: data.gender,
          phoneNumber: 'phoneNumber' in data ? data.phoneNumber : undefined,
          birthday: 'birthday' in data ? data.birthday : undefined,
        };
        localStorage.setItem('user_profile', JSON.stringify(userProfile));
      }

      // Redirigir al dashboard
      router.push('/dashboard');
      router.refresh(); // Refrescar para actualizar el estado de autenticación
    } catch (err) {
      if (err instanceof ApiError) {
        // Mensajes de error más amigables
        if (err.status === 400) {
          setError('Invalid registration data. Please check your information.');
        } else if (err.status === 409) {
          setError('Username or email already exists');
        } else if (err.code === 'NETWORK_ERROR') {
          setError('Cannot connect to server. Please check if the backend is running.');
        } else {
          setError(err.message || 'An error occurred during registration');
        }
      } else {
        setError('An unexpected error occurred during registration');
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    clearTokens();
    router.push('/auth/login');
    router.refresh();
  };

  const clearError = () => setError(null);

  return {
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    isLoading,
    error,
    clearError,
  };
}
