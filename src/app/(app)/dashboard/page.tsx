'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { VitalsChart } from '@/components/vitals-chart';
import { 
  Heart, 
  Droplets, 
  Activity, 
  Pill, 
  Phone, 
  AlertTriangle, 
  Stethoscope,
  Loader2,
  Siren
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/hooks/use-user';
import Link from 'next/link';
import { 
  treatmentsApi, 
  symptomsApi, 
  disturbancesApi,
  getEmergencyContactsByPatient,
  type Treatment,
  type Symptom,
  type Disturbance,
  type EmergencyContact
} from '@/lib/api';

const vitalsData = {
  heartRate: [
    { month: 'January', value: 78 },
    { month: 'February', value: 80 },
    { month: 'March', value: 75 },
    { month: 'April', value: 82 },
    { month: 'May', value: 81 },
    { month: 'June', value: 79 },
  ],
  spo2: [
    { month: 'January', value: 98 },
    { month: 'February', value: 97 },
    { month: 'March', value: 99 },
    { month: 'April', value: 98 },
    { month: 'May', value: 97 },
    { month: 'June', value: 98 },
  ],
  bloodPressure: [
    { month: 'January', systolic: 120, diastolic: 80 },
    { month: 'February', systolic: 122, diastolic: 82 },
    { month: 'March', systolic: 118, diastolic: 78 },
    { month: 'April', systolic: 121, diastolic: 81 },
    { month: 'May', systolic: 123, diastolic: 83 },
    { month: 'June', systolic: 119, diastolic: 79 },
  ],
};

export default function DashboardPage() {
  const { user, loading, error } = useUser();
  
  // Estados para los datos del paciente
  const [latestTreatment, setLatestTreatment] = useState<Treatment | null>(null);
  const [latestSymptom, setLatestSymptom] = useState<Symptom | null>(null);
  const [latestAlteration, setLatestAlteration] = useState<Disturbance | null>(null);
  const [latestContact, setLatestContact] = useState<EmergencyContact | null>(null);
  const [loadingData, setLoadingData] = useState(false);
  const { toast } = useToast();
  
  const isPatient = user?.typeOfUser === 'PATIENT';
  
  // Función para manejar el botón SOS
  const handleSOS = () => {
    toast({
      title: '🚨 Emergencia Activada',
      description: 'Se ha enviado una alerta de emergencia. Los servicios de emergencia han sido notificados.',
      variant: 'destructive',
    });
    // Aquí se podría agregar la lógica para enviar la alerta real al backend
    console.log('SOS activado por:', user?.username);
  };
  
  // Debug: mostrar información en consola
  useEffect(() => {
    if (user) {
      console.log('Usuario en dashboard:', user);
      console.log('firstName:', user.firstName);
      console.log('lastName:', user.lastName);
      console.log('username:', user.username);
      console.log('typeOfUser:', user.typeOfUser);
    }
    if (error) {
      console.error('Error en dashboard:', error);
    }
  }, [user, error]);
  
  // Cargar datos del paciente
  useEffect(() => {
    const loadPatientData = async () => {
      if (!user || !isPatient) return;
      
      setLoadingData(true);
      
      try {
        // Cargar tratamientos
        const treatments = await treatmentsApi.getAll();
        if (treatments && treatments.length > 0) {
          setLatestTreatment(treatments[treatments.length - 1]);
        }
      } catch (err: any) {
        if (err?.status !== 400 && err?.status !== 404) {
          console.error('Error loading treatments:', err);
        }
      }
      
      try {
        // Cargar síntomas
        const symptoms = await symptomsApi.getAll();
        if (symptoms && symptoms.length > 0) {
          setLatestSymptom(symptoms[symptoms.length - 1]);
        }
      } catch (err: any) {
        if (err?.status !== 400 && err?.status !== 404) {
          console.error('Error loading symptoms:', err);
        }
      }
      
      try {
        // Cargar alteraciones
        const alterations = await disturbancesApi.getAll();
        if (alterations && alterations.length > 0) {
          setLatestAlteration(alterations[alterations.length - 1]);
        }
      } catch (err: any) {
        if (err?.status !== 400 && err?.status !== 404) {
          console.error('Error loading alterations:', err);
        }
      }
      
      try {
        // Cargar contactos
        if (user.patientId) {
          const contacts = await getEmergencyContactsByPatient(user.patientId);
          if (contacts && contacts.length > 0) {
            setLatestContact(contacts[contacts.length - 1]);
          }
        }
      } catch (err: any) {
        if (err?.status !== 400 && err?.status !== 404) {
          console.error('Error loading contacts:', err);
        }
      }
      
      setLoadingData(false);
    };
    
    loadPatientData();
  }, [user, isPatient]);
  
  const userName = user 
    ? (user.firstName && user.lastName 
        ? `${user.firstName} ${user.lastName}`.trim() 
        : user.firstName || user.lastName || user.username || 'Usuario')
    : 'Usuario';

  if (error && !loading) {
    console.error('Error al cargar usuario:', error.message);
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Saludo */}
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          {loading ? 'Cargando...' : `¡Hola ${userName}!`}
        </h1>
        {error && !loading && (
          <p className="text-sm text-muted-foreground mt-2">
            Error: {error.message}
          </p>
        )}
      </div>
      
      {/* Sección de Vitales */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-4">Vitals</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Link href="/vitals/history">
            <Card className="shadow-card hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Heart Rate</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">82 BPM</div>
                <p className="text-xs text-muted-foreground">
                  +2.1% from last hour
                </p>
              </CardContent>
              <CardFooter className="p-0">
                <VitalsChart
                  data={vitalsData.heartRate}
                  dataKey="value"
                  color="var(--chart-1)"
                  chartType="area"
                />
              </CardFooter>
            </Card>
          </Link>
          <Link href="/vitals/history">
            <Card className="shadow-card hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">SpO2</CardTitle>
                <Droplets className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">98%</div>
                <p className="text-xs text-muted-foreground">Stable</p>
              </CardContent>
              <CardFooter className="p-0">
                <VitalsChart
                  data={vitalsData.spo2}
                  dataKey="value"
                  color="var(--chart-2)"
                  chartType="area"
                />
              </CardFooter>
            </Card>
          </Link>
          <Link href="/vitals/history">
            <Card className="shadow-card hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Blood Pressure</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">120/80 mmHg</div>
                <p className="text-xs text-muted-foreground">
                  Within normal range
                </p>
              </CardContent>
              <CardFooter className="p-0">
                <VitalsChart
                  data={vitalsData.bloodPressure}
                  dataKey="systolic"
                  color="var(--chart-3)"
                  chartType="bar"
                />
              </CardFooter>
            </Card>
          </Link>
        </div>
      </div>
      
      {/* Sección de Resumen solo para pacientes */}
      {isPatient && (
        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-4">Resumen Reciente</h2>
          {loadingData ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2 text-muted-foreground">Cargando datos...</span>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {/* Último Tratamiento */}
              <Link href="/treatments">
                <Card className="shadow-card hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Último Tratamiento</CardTitle>
                    <Pill className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    {latestTreatment ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-lg truncate">{latestTreatment.name}</p>
                          {latestTreatment.isActive && (
                            <Badge className="bg-[#E8F5E9] text-[#2E7D32] hover:bg-[#E8F5E9] text-xs">
                              Activo
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{latestTreatment.dosage}</p>
                        <p className="text-xs text-muted-foreground">{latestTreatment.frequency}</p>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Sin tratamientos registrados</p>
                    )}
                  </CardContent>
                </Card>
              </Link>
              
              {/* Último Contacto */}
              <Link href="/contacts">
                <Card className="shadow-card hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Último Contacto</CardTitle>
                    <Phone className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    {latestContact ? (
                      <div className="space-y-2">
                        <p className="font-semibold text-lg truncate">{latestContact.name}</p>
                        <p className="text-xs text-muted-foreground">{latestContact.connection || 'Contacto'}</p>
                        <p className="text-xs text-muted-foreground">{latestContact.phoneNumber}</p>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Sin contactos registrados</p>
                    )}
                  </CardContent>
                </Card>
              </Link>
              
              {/* Última Alteración */}
              <Link href="/alterations">
                <Card className="shadow-card hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Última Alteración</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    {latestAlteration ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-lg truncate">{latestAlteration.name}</p>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                            latestAlteration.severityLevel >= 4 ? 'bg-red-100 text-red-700' :
                            latestAlteration.severityLevel >= 3 ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {latestAlteration.severityLevel}/5
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{latestAlteration.description}</p>
                        <p className="text-xs text-muted-foreground">{latestAlteration.onsetDate}</p>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Sin alteraciones registradas</p>
                    )}
                  </CardContent>
                </Card>
              </Link>
              
              {/* Último Síntoma */}
              <Link href="/symptoms">
                <Card className="shadow-card hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Último Síntoma</CardTitle>
                    <Stethoscope className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    {latestSymptom ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-lg truncate">{latestSymptom.name}</p>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium text-white ${
                            latestSymptom.severityLevel <= 2 ? 'bg-green-500' :
                            latestSymptom.severityLevel <= 3 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}>
                            {latestSymptom.severityLevel}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">{latestSymptom.category}</p>
                        <p className="text-xs text-muted-foreground truncate">{latestSymptom.description}</p>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Sin síntomas registrados</p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            </div>
          )}
        </div>
      )}
      
      {/* Botón SOS - Disponible para todos los usuarios */}
      <Card className="flex flex-col items-center justify-center p-6 text-center shadow-card">
        <CardHeader className="p-0 mb-4">
          <CardTitle>Emergencia</CardTitle>
          <CardDescription>Presiona para asistencia inmediata</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Button
            variant="destructive"
            className="h-32 w-32 rounded-full bg-[#D32F2F] text-white shadow-lg hover:bg-red-700 hover:scale-105 transition-transform"
            onClick={handleSOS}
          >
            <Siren className="h-16 w-16" />
            <span className="sr-only">SOS</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
