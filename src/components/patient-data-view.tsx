'use client';

import { useEffect, useState } from 'react';
import {
  getAllPatientData,
  PatientHealthRecords,
  EmergencyContact,
} from '@/lib/api/patient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Phone, Mail, Activity, Pill, AlertCircle } from 'lucide-react';

interface PatientDataViewProps {
  patientId: number;
}

export default function PatientDataView({ patientId }: PatientDataViewProps) {
  const [records, setRecords] = useState<PatientHealthRecords | null>(null);
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      console.log('🔄 [PatientDataView] Starting data fetch...');
      console.log('🆔 Patient ID:', patientId);
      
      try {
        setLoading(true);
        setError(null);
        
        const data = await getAllPatientData(patientId);
        
        console.log('✅ [PatientDataView] Data loaded successfully');
        setRecords(data.records);
        setContacts(data.contacts);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error al cargar los datos';
        console.error('❌ [PatientDataView] Error loading data:', errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
        console.log('🏁 [PatientDataView] Fetch completed');
      }
    };

    if (patientId) {
      fetchData();
    } else {
      console.warn('⚠️ [PatientDataView] No patient ID provided');
    }
  }, [patientId]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[200px] w-full" />
        <Skeleton className="h-[200px] w-full" />
        <Skeleton className="h-[200px] w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  const getSeverityColor = (severity: string) => {
    const colors: Record<string, string> = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800',
      mild: 'bg-green-100 text-green-800',
      moderate: 'bg-yellow-100 text-yellow-800',
      severe: 'bg-red-100 text-red-800',
    };
    return colors[severity?.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Emergency Contacts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Contactos de Emergencia
          </CardTitle>
        </CardHeader>
        <CardContent>
          {contacts.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No hay contactos de emergencia registrados
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  className="rounded-lg border p-4 space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{contact.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {contact.relationship}
                      </p>
                    </div>
                    {contact.isPrimary && (
                      <Badge variant="default">Primario</Badge>
                    )}
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{contact.phoneNumber}</span>
                    </div>
                    {contact.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{contact.email}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Disturbances */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Trastornos/Condiciones
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!records?.disturbances || records.disturbances.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No hay trastornos registrados
            </p>
          ) : (
            <div className="space-y-3">
              {records.disturbances.map((disturbance) => (
                <div key={disturbance.id} className="rounded-lg border p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold">
                      {disturbance.disturbanceName}
                    </h4>
                    <Badge className={getSeverityColor(disturbance.severity)}>
                      {disturbance.severity}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {disturbance.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Diagnóstico:{' '}
                    {new Date(disturbance.diagnosisDate).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Symptoms */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Síntomas
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!records?.symptons || records.symptons.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No hay síntomas registrados
            </p>
          ) : (
            <div className="space-y-3">
              {records.symptons.map((sympton) => (
                <div key={sympton.id} className="rounded-lg border p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold">{sympton.symptonName}</h4>
                    <Badge className={getSeverityColor(sympton.severity)}>
                      {sympton.severity}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {sympton.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Inicio: {new Date(sympton.onsetDate).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Treatments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pill className="h-5 w-5" />
            Tratamientos
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!records?.treatments || records.treatments.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No hay tratamientos registrados
            </p>
          ) : (
            <div className="space-y-3">
              {records.treatments.map((treatment) => (
                <div key={treatment.id} className="rounded-lg border p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold">{treatment.treatmentName}</h4>
                    <Badge
                      variant={
                        treatment.status === 'active' ? 'default' : 'secondary'
                      }
                    >
                      {treatment.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {treatment.description}
                  </p>
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span>
                      Inicio: {new Date(treatment.startDate).toLocaleDateString()}
                    </span>
                    {treatment.endDate && (
                      <span>
                        Fin: {new Date(treatment.endDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
