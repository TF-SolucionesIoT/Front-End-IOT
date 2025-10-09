import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { VitalsChart } from "@/components/vitals-chart";
import { SmartAlertClient } from "@/components/smart-alert-client";
import { AlertTriangle, Bell, Heart, Droplets, Activity, Users, Phone, Siren, Pill, Clock } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const vitalsData = {
  heartRate: [
    { month: "January", value: 78 }, { month: "February", value: 80 }, { month: "March", value: 75 },
    { month: "April", value: 82 }, { month: "May", value: 81 }, { month: "June", value: 79 },
  ],
  spo2: [
    { month: "January", value: 98 }, { month: "February", value: 97 }, { month: "March", value: 99 },
    { month: "April", value: 98 }, { month: "May", value: 97 }, { month: "June", value: 98 },
  ],
  bloodPressure: [
    { month: "January", value: 120 }, { month: "February", value: 122 }, { month: "March", value: 118 },
    { month: "April", value: 121 }, { month: "May", value: 123 }, { month: "June", value: 119 },
  ],
};

const reminders = [
    { time: "08:00 AM", name: "Lisinopril", dose: "10mg", status: "Taken" },
    { time: "08:00 AM", name: "Metformin", dose: "500mg", status: "Taken" },
    { time: "01:00 PM", name: "Aspirin", dose: "81mg", status: "Upcoming" },
    { time: "08:00 PM", name: "Atorvastatin", dose: "20mg", status: "Upcoming" },
];

const caregivers = [
    { name: "Maria Garcia", relation: "Daughter", avatarId: "user-avatar-1" },
    { name: "Dr. Smith", relation: "Primary Doctor", avatarId: "user-avatar-1" },
];


export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, John Doe. Here's your health overview.</p>
      </div>

      <Alert variant="destructive" className="bg-[#D32F2F] text-white border-[#D32F2F] dark:bg-[#D32F2F] dark:text-white dark:border-[#D32F2F]">
        <AlertTriangle className="h-4 w-4 !text-white" />
        <AlertTitle className="font-bold">Emergency Alert</AlertTitle>
        <AlertDescription>
          High heart rate detected at 10:45 AM. Emergency contacts have been notified.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
             <VitalsChart data={vitalsData.heartRate} dataKey="heartRate" color="var(--chart-1)" />
          </CardFooter>
        </Card>
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">SpO2</CardTitle>
            <Droplets className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98%</div>
            <p className="text-xs text-muted-foreground">
              Stable
            </p>
          </CardContent>
          <CardFooter className="p-0">
             <VitalsChart data={vitalsData.spo2} dataKey="spo2" color="var(--chart-2)" />
          </CardFooter>
        </Card>
        <Card className="shadow-card">
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
             <VitalsChart data={vitalsData.bloodPressure} dataKey="bloodPressure" color="var(--chart-3)" />
          </CardFooter>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="grid gap-6">
            <Card className="flex flex-col items-center justify-center p-6 text-center shadow-card">
                <CardHeader className="p-0 mb-4">
                    <CardTitle>Emergency</CardTitle>
                    <CardDescription>Press for immediate assistance</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <Button variant="destructive" className="h-32 w-32 rounded-full bg-[#D32F2F] text-white shadow-lg hover:bg-red-700">
                        <Siren className="h-16 w-16" />
                        <span className="sr-only">SOS</span>
                    </Button>
                </CardContent>
            </Card>
            <SmartAlertClient />
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
                    <p className="text-sm text-muted-foreground">{reminder.dose}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{reminder.time}</p>
                    {reminder.status === "Taken" ? (
                      <Badge className="bg-[#E8F5E9] text-[#2E7D32] hover:bg-[#E8F5E9]">Taken</Badge>
                    ) : (
                      <Badge variant="outline" className="border-amber-500 text-amber-500">Upcoming</Badge>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
      
       <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Caregivers & Contacts</CardTitle>
            <CardDescription>People who can help in an emergency.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 sm:grid-cols-2">
                {caregivers.map((caregiver, index) => {
                    const avatar = PlaceHolderImages.find(img => img.id === caregiver.avatarId);
                    return (
                        <div key={index} className="flex items-center gap-4">
                            <Avatar className="h-12 w-12">
                                {avatar && <AvatarImage src={avatar.imageUrl} alt={caregiver.name} data-ai-hint={avatar.imageHint} />}
                                <AvatarFallback>{caregiver.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <p className="font-bold">{caregiver.name}</p>
                                <p className="text-sm text-muted-foreground">{caregiver.relation}</p>
                            </div>
                            <Button variant="ghost" size="icon">
                                <Phone className="h-5 w-5 text-primary" />
                            </Button>
                        </div>
                    )
                })}
            </div>
          </CardContent>
        </Card>
    </div>
  );
}
