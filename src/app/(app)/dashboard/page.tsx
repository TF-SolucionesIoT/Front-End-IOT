'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { VitalsChart } from '@/components/vitals-chart';
import { Heart, Users } from 'lucide-react';
import { useUser } from '@/hooks/use-user';

const vitalsData = {
  heartRate: [
    { month: 'January', value: 78 },
    { month: 'February', value: 80 },
    { month: 'March', value: 75 },
    { month: 'April', value: 82 },
    { month: 'May', value: 81 },
    { month: 'June', value: 79 },
  ],
};

export default function DashboardPage() {
  const { user, loading, error } = useUser();
  const router = useRouter();
  
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
  
  const userName = user 
    ? (user.firstName && user.lastName 
        ? `${user.firstName} ${user.lastName}`.trim() 
        : user.firstName || user.lastName || user.username || 'Usuario')
    : 'Usuario';

  const isCaregiver = user?.typeOfUser === 'CAREGIVER';

  if (error && !loading) {
    console.error('Error al cargar usuario:', error.message);
  }

  return (
    <div className="flex flex-col gap-8 items-center justify-center h-full">
      <h1 className="text-4xl font-bold tracking-tight text-center">
        {loading ? 'Cargando...' : `¡Hola ${userName}!`}
      </h1>
      {error && !loading && (
        <p className="text-sm text-muted-foreground">
          Error: {error.message}
        </p>
      )}
      
      {/* Botón para Cuidadores */}
      {isCaregiver && !loading && (
        <div className="w-full max-w-sm">
          <Button 
            onClick={() => router.push('/caregiver/patient')}
            className="w-full"
            size="lg"
          >
            <Users className="mr-2 h-5 w-5" />
            Datos del Paciente
          </Button>
        </div>
      )}

      <div className="w-full max-w-sm">
        <Card className="shadow-card">
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
      </div>
    </div>
  );
}
