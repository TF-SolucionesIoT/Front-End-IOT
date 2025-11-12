'use client';

import { useState, useEffect, useCallback } from 'react';
import { getCurrentUserProfile } from '@/lib/api/profile';
import { getStoredToken } from '@/lib/api/client';
import type { UserProfile } from '@/lib/api/types';

/**
 * Obtiene el perfil del usuario desde localStorage de forma síncrona
 */
function getUserFromStorage(): UserProfile | null {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('user_profile');
    if (stored) {
      try {
        return JSON.parse(stored) as UserProfile;
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
  // Inicializar con datos de localStorage si están disponibles (carga inmediata)
  const [user, setUser] = useState<UserProfile | null>(() => getUserFromStorage());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUser = useCallback(async () => {
    // Si ya tenemos datos en localStorage, no mostrar loading
    const hasStoredData = getUserFromStorage() !== null;
    
    try {
      if (!hasStoredData) {
        setLoading(true);
      }
      setError(null);
      
      const userData = await getCurrentUserProfile();
      console.log('Usuario cargado en hook:', userData);
      setUser(userData);
      saveUserToStorage(userData);
    } catch (err) {
      console.error('Error al obtener usuario:', err);
      const error = err instanceof Error ? err : new Error('Error al obtener usuario');
      setError(error);
      
      // Si hay datos guardados, mantenerlos aunque haya error
      const storedUser = getUserFromStorage();
      if (storedUser) {
        console.log('Manteniendo datos guardados a pesar del error');
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

