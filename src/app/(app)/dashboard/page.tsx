import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { VitalsChart } from '@/components/vitals-chart';
import { Heart } from 'lucide-react';

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
  return (
    <div className="flex flex-col gap-8 items-center justify-center h-full">
      <h1 className="text-4xl font-bold tracking-tight text-center">
        Hi John Doe!
      </h1>
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
            />
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
