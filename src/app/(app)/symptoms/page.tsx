'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';

type Symptom = {
  id: number;
  date: string;
  time: string;
  description: string;
};

const initialSymptoms: Symptom[] = [
  {
    id: 1,
    date: '2024-08-01',
    time: '09:00 AM',
    description: 'Persistent cough and slight fever.',
  },
  {
    id: 2,
    date: '2024-07-31',
    time: '06:30 PM',
    description: 'Feeling fatigued throughout the day.',
  },
];

export default function SymptomsPage() {
  const [symptoms, setSymptoms] = useState<Symptom[]>(initialSymptoms);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSymptom, setEditingSymptom] = useState<Symptom | null>(null);
  const [newSymptom, setNewSymptom] = useState({
    description: '',
    date: '',
    time: '',
  });

  const handleAddClick = () => {
    setEditingSymptom(null);
    setNewSymptom({ description: '', date: '', time: '' });
    setIsDialogOpen(true);
  };

  const handleEditClick = (symptom: Symptom) => {
    setEditingSymptom(symptom);
    setNewSymptom({
      description: symptom.description,
      date: symptom.date,
      time: symptom.time,
    });
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setSymptoms(symptoms.filter((sym) => sym.id !== id));
  };

  const handleSave = () => {
    if (editingSymptom) {
      setSymptoms(
        symptoms.map((sym) =>
          sym.id === editingSymptom.id ? { ...sym, ...newSymptom } : sym
        )
      );
    } else {
      setSymptoms([...symptoms, { id: symptoms.length + 1, ...newSymptom }]);
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Symptoms</h1>
          <p className="text-muted-foreground">
            A history of reported symptoms.
          </p>
        </div>
        <Button onClick={handleAddClick}>
          <PlusCircle className="mr-2" />
          Add Symptom
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Symptom History</CardTitle>
          <CardDescription>
            Browse and manage recorded symptoms.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">#</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {symptoms.map((symptom) => (
                <TableRow key={symptom.id}>
                  <TableCell>{symptom.id}</TableCell>
                  <TableCell>{symptom.date}</TableCell>
                  <TableCell>{symptom.time}</TableCell>
                  <TableCell>{symptom.description}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleEditClick(symptom)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteClick(symptom.id)}
                          className="text-destructive"
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingSymptom ? 'Edit Symptom' : 'Add Symptom'}
            </DialogTitle>
            <DialogDescription>
              {editingSymptom
                ? 'Update the details of the symptom.'
                : 'Fill in the form to add a new symptom.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newSymptom.description}
                onChange={(e) =>
                  setNewSymptom({
                    ...newSymptom,
                    description: e.target.value,
                  })
                }
                placeholder="Enter a description"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={newSymptom.date}
                  onChange={(e) =>
                    setNewSymptom({ ...newSymptom, date: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={newSymptom.time}
                  onChange={(e) =>
                    setNewSymptom({ ...newSymptom, time: e.target.value })
                  }
                />
              </div>
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
