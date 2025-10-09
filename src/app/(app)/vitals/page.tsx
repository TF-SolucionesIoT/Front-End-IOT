'use client';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { VitalsChart } from '@/components/vitals-chart';
import { Heart, Droplets, Activity } from 'lucide-react';
import Link from 'next/link';

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

export default function VitalsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Vitals</h1>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/vitals/history">
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
        </Link>
        <Link href="/vitals/history">
          <Card className="shadow-card">
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
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Blood Pressure
              </CardTitle>
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
  );
}
