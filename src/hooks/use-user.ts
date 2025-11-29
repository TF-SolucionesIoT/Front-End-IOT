'use client';

import { useState, useEffect, useCallback } from 'react';
import { getCurrentUserProfile, getStoredToken } from '@/lib/api';
import type { UserProfile } from '@/lib/api';

/**
 * Obtiene el perfil del usuario desde localStorage de forma síncrona
 * Valida que tenga los campos requeridos (patientId/caregiverId)
 */
function getUserFromStorage(): UserProfile | null {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('user_profile');
    if (stored) {
      try {
        const profile = JSON.parse(stored) as UserProfile;
        // Validar que el perfil tenga patientId o caregiverId según el tipo
        if (profile.typeOfUser === 'PATIENT' && !profile.patientId) {
          console.warn('⚠️ Perfil en localStorage no tiene patientId, se recargará del backend');
          return null;
        }
        if (profile.typeOfUser === 'CAREGIVER' && !profile.caregiverId) {
          console.warn('⚠️ Perfil en localStorage no tiene caregiverId, se recargará del backend');
          return null;
        }
        return profile;
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
function saveUserToStorage(profile: UserProfile): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user_profile', JSON.stringify(profile));
  }
}

export function useUser() {
  // Inicializar sin datos para forzar la carga desde el backend
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const userData = await getCurrentUserProfile();
      console.log('✅ Usuario cargado desde backend:', userData);
      setUser(userData);
      saveUserToStorage(userData);
    } catch (err) {
      console.error('❌ Error al obtener usuario:', err);
      const error = err instanceof Error ? err : new Error('Error al obtener usuario');
      setError(error);
      
      // Como último recurso, intentar usar datos guardados
      const storedUser = getUserFromStorage();
      if (storedUser) {
        console.log('⚠️ Usando datos de localStorage como fallback');
        setUser(storedUser);
      } else {
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Solo hacer fetch si hay token (usuario autenticado)
    const token = getStoredToken();
    if (token) {
      fetchUser();
    } else {
      // Si no hay token, usar datos de localStorage si existen
      const storedUser = getUserFromStorage();
      if (storedUser) {
        setUser(storedUser);
      }
      setLoading(false);
    }
  }, [fetchUser]);

  return { user, loading, error, refetch: fetchUser };
}

