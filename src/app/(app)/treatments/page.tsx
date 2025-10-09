import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pill } from 'lucide-react';

const reminders = [
  { time: '08:00 AM', name: 'Lisinopril', dose: '10mg', status: 'Taken' },
  { time: '08:00 AM', name: 'Metformin', dose: '500mg', status: 'Taken' },
  { time: '01:00 PM', name: 'Aspirin', dose: '81mg', status: 'Upcoming' },
  { time: '08:00 PM', name: 'Atorvastatin', dose: '20mg', status: 'Upcoming' },
];

export default function TreatmentsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Treatments</h1>
      </div>
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Medication Reminders</CardTitle>
          <CardDescription>Your daily medication schedule.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {reminders.map((reminder, index) => (
              <li key={index} className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                  <Pill className="h-5 w-5 text-secondary-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{reminder.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {reminder.dose}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{reminder.time}</p>
                  {reminder.status === 'Taken' ? (
                    <Badge className="bg-[#E8F5E9] text-[#2E7D32] hover:bg-[#E8F5E9]">
                      Taken
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="border-amber-500 text-amber-500"
                    >
                      Upcoming
                    </Badge>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
