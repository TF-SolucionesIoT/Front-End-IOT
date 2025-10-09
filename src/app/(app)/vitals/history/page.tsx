'use client';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { HeartRateChart } from '@/components/heart-rate-chart';
import { BloodPressureChart } from '@/components/blood-pressure-chart';

const heartRateData = [
  { date: '2023-01-01', bpm: 72 },
  { date: '2023-01-02', bpm: 75 },
  { date: '2023-01-03', bpm: 70 },
  { date: '2023-01-04', bpm: 78 },
  { date: '2023-01-05', bpm: 80 },
  { date: '2023-01-06', bpm: 79 },
  { date: '2023-01-07', bpm: 76 },
];

const bloodPressureData = [
  { date: '2023-01-01', systolic: 120, diastolic: 80 },
  { date: '2023-01-02', systolic: 122, diastolic: 81 },
  { date: '2023-01-03', systolic: 118, diastolic: 79 },
  { date: '2023-01-04', systolic: 125, diastolic: 82 },
  { date: '2023-01-05', systolic: 123, diastolic: 80 },
  { date: '2023-01-06', systolic: 121, diastolic: 78 },
  { date: '2023-01-07', systolic: 119, diastolic: 77 },
];

export default function VitalsHistoryPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/vitals">
            <ArrowLeft />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Vital Signs History
          </h1>
          <p className="text-muted-foreground">Analyze your vital sign trends.</p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Heart Rate Over Time</CardTitle>
          <CardDescription>Heart Rate (BPM)</CardDescription>
        </CardHeader>
        <CardContent>
          <HeartRateChart data={heartRateData} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Blood Pressure Readings</CardTitle>
          <CardDescription>Blood Pressure (mmHg)</CardDescription>
        </CardHeader>
        <CardContent>
          <BloodPressureChart data={bloodPressureData} />
        </CardContent>
      </Card>
    </div>
  );
}
