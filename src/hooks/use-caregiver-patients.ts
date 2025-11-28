'use client';

import { useEffect, useState } from 'react';

export function useCaregiverPatients() {
  const [patientIds, setPatientIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatientIds = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Intentar obtener patientIds de localStorage (vinculados por invite code)
        const storedPatientIds = localStorage.getItem('caregiver_patient_ids');
        
        if (storedPatientIds) {
          const ids = JSON.parse(storedPatientIds);
          setPatientIds(ids);
        } else {
          // Si no hay nada en localStorage, asumir que no hay pacientes vinculados
          setPatientIds([]);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Error al cargar los pacientes'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPatientIds();
  }, []);

  return { patientIds, loading, error };
}
