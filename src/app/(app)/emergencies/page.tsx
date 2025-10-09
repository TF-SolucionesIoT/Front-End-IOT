import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Siren } from 'lucide-react';

const emergencies = [
  {
    name: 'Ambulance',
    description: 'Dispatched for high heart rate alert.',
    date: 'July 30, 2024',
  },
  {
    name: 'Ambulance',
    description: 'Dispatched after fall detected.',
    date: 'July 15, 2024',
  },
];

export default function EmergenciesPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Emergencies</h1>
      </div>
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Emergency History</CardTitle>
          <CardDescription>
            Recent emergency events and dispatches.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            {emergencies.map((emergency, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                  <Siren className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <p className="font-bold">{emergency.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {emergency.description}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{emergency.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card className="flex flex-col items-center justify-center p-6 text-center shadow-card">
        <CardHeader className="p-0 mb-4">
          <CardTitle>Emergency</CardTitle>
          <CardDescription>Press for immediate assistance</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Button
            variant="destructive"
            className="h-32 w-32 rounded-full bg-[#D32F2F] text-white shadow-lg hover:bg-red-700"
          >
            <Siren className="h-16 w-16" />
            <span className="sr-only">SOS</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
