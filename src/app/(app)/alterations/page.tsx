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

type Alteration = {
  id: number;
  date: string;
  time: string;
  description: string;
};

const initialAlterations: Alteration[] = [
  {
    id: 1,
    date: '2024-07-31',
    time: '10:30 AM',
    description: 'Feeling dizzy after medication.',
  },
  {
    id: 2,
    date: '2024-07-30',
    time: '03:15 PM',
    description: 'Experienced a slight headache.',
  },
];

export default function AlterationsPage() {
  const [alterations, setAlterations] =
    useState<Alteration[]>(initialAlterations);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAlteration, setEditingAlteration] =
    useState<Alteration | null>(null);
  const [newAlteration, setNewAlteration] = useState({
    description: '',
    date: '',
    time: '',
  });

  const handleAddClick = () => {
    setEditingAlteration(null);
    setNewAlteration({ description: '', date: '', time: '' });
    setIsDialogOpen(true);
  };

  const handleEditClick = (alteration: Alteration) => {
    setEditingAlteration(alteration);
    setNewAlteration({
      description: alteration.description,
      date: alteration.date,
      time: alteration.time,
    });
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setAlterations(alterations.filter((alt) => alt.id !== id));
  };

  const handleSave = () => {
    if (editingAlteration) {
      setAlterations(
        alterations.map((alt) =>
          alt.id === editingAlteration.id
            ? { ...alt, ...newAlteration }
            : alt
        )
      );
    } else {
      setAlterations([
        ...alterations,
        { id: alterations.length + 1, ...newAlteration },
      ]);
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Alterations</h1>
          <p className="text-muted-foreground">
            A history of reported alterations.
          </p>
        </div>
        <Button onClick={handleAddClick}>
          <PlusCircle className="mr-2" />
          Add Alteration
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Alteration History</CardTitle>
          <CardDescription>
            Browse and manage recorded alterations.
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
              {alterations.map((alteration) => (
                <TableRow key={alteration.id}>
                  <TableCell>{alteration.id}</TableCell>
                  <TableCell>{alteration.date}</TableCell>
                  <TableCell>{alteration.time}</TableCell>
                  <TableCell>{alteration.description}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() => handleEditClick(alteration)}
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteClick(alteration.id)}
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
              {editingAlteration ? 'Edit Alteration' : 'Add Alteration'}
            </DialogTitle>
            <DialogDescription>
              {editingAlteration
                ? 'Update the details of the alteration.'
                : 'Fill in the form to add a new alteration.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newAlteration.description}
                onChange={(e) =>
                  setNewAlteration({
                    ...newAlteration,
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
                  value={newAlteration.date}
                  onChange={(e) =>
                    setNewAlteration({ ...newAlteration, date: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={newAlteration.time}
                  onChange={(e) =>
                    setNewAlteration({ ...newAlteration, time: e.target.value })
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
