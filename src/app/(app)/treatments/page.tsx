'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Pill, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type Treatment = {
  id: number;
  time: string;
  name: string;
  dose: string;
  status: 'Taken' | 'Upcoming';
};

const initialTreatments: Treatment[] = [
  {
    id: 1,
    time: '08:00 AM',
    name: 'Lisinopril',
    dose: '10mg',
    status: 'Taken',
  },
  {
    id: 2,
    time: '08:00 AM',
    name: 'Metformin',
    dose: '500mg',
    status: 'Taken',
  },
  {
    id: 3,
    time: '01:00 PM',
    name: 'Aspirin',
    dose: '81mg',
    status: 'Upcoming',
  },
  {
    id: 4,
    time: '08:00 PM',
    name: 'Atorvastatin',
    dose: '20mg',
    status: 'Upcoming',
  },
];

export default function TreatmentsPage() {
  const [treatments, setTreatments] =
    useState<Treatment[]>(initialTreatments);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTreatment, setEditingTreatment] =
    useState<Treatment | null>(null);
  const [newTreatment, setNewTreatment] = useState({
    name: '',
    dose: '',
    time: '',
    status: 'Upcoming' as 'Taken' | 'Upcoming',
  });

  const handleAddClick = () => {
    setEditingTreatment(null);
    setNewTreatment({
      name: '',
      dose: '',
      time: '',
      status: 'Upcoming',
    });
    setIsDialogOpen(true);
  };

  const handleEditClick = (treatment: Treatment) => {
    setEditingTreatment(treatment);
    setNewTreatment({
      name: treatment.name,
      dose: treatment.dose,
      time: treatment.time,
      status: treatment.status,
    });
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setTreatments(treatments.filter((t) => t.id !== id));
  };

  const handleSave = () => {
    if (editingTreatment) {
      setTreatments(
        treatments.map((t) =>
          t.id === editingTreatment.id
            ? { ...editingTreatment, ...newTreatment }
            : t
        )
      );
    } else {
      setTreatments([
        ...treatments,
        { id: treatments.length + 1, ...newTreatment },
      ]);
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Treatments</h1>
          <p className="text-muted-foreground">
            Manage your medication schedule.
          </p>
        </div>
        <Button onClick={handleAddClick}>
          <PlusCircle className="mr-2" />
          Add Treatment
        </Button>
      </div>
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Medication Reminders</CardTitle>
          <CardDescription>Your daily medication schedule.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {treatments.map((treatment) => (
              <li key={treatment.id} className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                  <Pill className="h-5 w-5 text-secondary-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{treatment.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {treatment.dose}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{treatment.time}</p>
                  {treatment.status === 'Taken' ? (
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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => handleEditClick(treatment)}
                    >
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDeleteClick(treatment.id)}
                      className="text-destructive"
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingTreatment ? 'Edit Treatment' : 'Add Treatment'}
            </DialogTitle>
            <DialogDescription>
              {editingTreatment
                ? 'Update the details of the treatment.'
                : 'Fill in the form to add a new treatment.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Medication Name</Label>
              <Input
                id="name"
                value={newTreatment.name}
                onChange={(e) =>
                  setNewTreatment({ ...newTreatment, name: e.target.value })
                }
                placeholder="e.g. Lisinopril"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="dose">Dose</Label>
                <Input
                  id="dose"
                  value={newTreatment.dose}
                  onChange={(e) =>
                    setNewTreatment({ ...newTreatment, dose: e.target.value })
                  }
                  placeholder="e.g. 10mg"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={newTreatment.time}
                  onChange={(e) =>
                    setNewTreatment({ ...newTreatment, time: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={newTreatment.status}
                onValueChange={(value: 'Taken' | 'Upcoming') =>
                  setNewTreatment({ ...newTreatment, status: value })
                }
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Upcoming">Upcoming</SelectItem>
                  <SelectItem value="Taken">Taken</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
