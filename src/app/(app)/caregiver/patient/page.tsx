'use client';

import { useState, useEffect } from 'react';
import PatientDataView from '@/components/patient-data-view';
import { getCaregiverPatients } from '@/lib/api/caregiver';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';

export default function CaregiverPatientPage() {
  const [patientId, setPatientId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Intentar obtener desde el backend primero
        console.log('🔍 Fetching patients from backend...');
        const patients = await getCaregiverPatients();
        
        if (patients && patients.length > 0) {
          const firstPatientId = patients[0].patientId;
          setPatientId(firstPatientId);
          
          // Actualizar localStorage con los IDs actuales
          const patientIds = patients.map(p => p.patientId);
          localStorage.setItem('caregiver_patient_ids', JSON.stringify(patientIds));
          console.log('✅ Patients loaded from backend:', patientIds);
        } else {
          console.log('⚠️ No patients found in backend');
        }
      } catch (err) {
        console.error('❌ Error fetching patients from backend:', err);
        setError(err instanceof Error ? err.message : 'Error al cargar los pacientes');
        
        // Fallback: intentar desde localStorage
        const storedIds = localStorage.getItem('caregiver_patient_ids');
        if (storedIds) {
          const patientIds: number[] = JSON.parse(storedIds);
          if (patientIds.length > 0) {
            setPatientId(patientIds[0]);
            console.log('⚠️ Using cached patient from localStorage:', patientIds[0]);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <Skeleton className="h-10 w-64 mb-2" />
        <Skeleton className="h-6 w-96 mb-6" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (error && !patientId) {
    return (
      <div className="container mx-auto py-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!patientId) {
    return (
      <div className="container mx-auto py-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No tienes pacientes asignados. Solicita un código de invitación a un paciente para vincularte.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Datos del Paciente</h1>
        <p className="text-muted-foreground">
          Información médica y contactos de emergencia
        </p>
      </div>
      
      <PatientDataView patientId={patientId} />
    </div>
  );
}
