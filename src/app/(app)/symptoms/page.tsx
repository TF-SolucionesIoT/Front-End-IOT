'use client';

import { useState, useEffect } from 'react';
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
import { MoreHorizontal, PlusCircle, Loader2 } from 'lucide-react';
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
import { useToast } from '@/hooks/use-toast';
import { symptomsApi } from '@/lib/api/symptoms';
import type { Symptom } from '@/lib/api/types';

export default function SymptomsPage() {
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newSymptom, setNewSymptom] = useState({
    description: '',
    date: '',
    time: '',
  });
  const { toast } = useToast();

  // Cargar síntomas al montar el componente
  useEffect(() => {
    loadSymptoms();
  }, []);

  const loadSymptoms = async () => {
    try {
      setIsLoading(true);
      const data = await symptomsApi.getAll();
      setSymptoms(data);
    } catch (error) {
      console.error('Error loading symptoms:', error);
      toast({
        title: 'Error',
        description:
          error instanceof Error
            ? error.message
            : 'No se pudieron cargar los síntomas',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddClick = () => {
    setNewSymptom({ description: '', date: '', time: '' });
    setIsDialogOpen(true);
  };

  const handleDeleteClick = async (id: number) => {
    try {
      await symptomsApi.delete(id);
      toast({
        title: 'Éxito',
        description: 'Síntoma eliminado correctamente',
      });
      // Recargar la lista
      await loadSymptoms();
    } catch (error) {
      console.error('Error deleting symptom:', error);
      toast({
        title: 'Error',
        description:
          error instanceof Error
            ? error.message
            : 'No se pudo eliminar el síntoma',
        variant: 'destructive',
      });
    }
  };

  const handleSave = async () => {
    // Validar campos
    if (!newSymptom.description || !newSymptom.date || !newSymptom.time) {
      toast({
        title: 'Error de validación',
        description: 'Por favor completa todos los campos',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSaving(true);
      await symptomsApi.create({
        description: newSymptom.description,
        date: newSymptom.date,
        time: newSymptom.time,
      });
      toast({
        title: 'Éxito',
        description: 'Síntoma creado correctamente',
      });
      setIsDialogOpen(false);
      // Recargar la lista
      await loadSymptoms();
    } catch (error) {
      console.error('Error creating symptom:', error);
      toast({
        title: 'Error',
        description:
          error instanceof Error
            ? error.message
            : 'No se pudo crear el síntoma',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
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
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                    <p className="mt-2 text-muted-foreground">
                      Cargando síntomas...
                    </p>
                  </TableCell>
                </TableRow>
              ) : symptoms.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No hay síntomas registrados
                  </TableCell>
                </TableRow>
              ) : (
                symptoms.map((symptom) => (
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
                          <DropdownMenuItem
                            onClick={() => handleDeleteClick(symptom.id)}
                            className="text-destructive"
                          >
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Síntoma</DialogTitle>
            <DialogDescription>
              Completa el formulario para agregar un nuevo síntoma.
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
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isSaving}
            >
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                'Guardar'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
