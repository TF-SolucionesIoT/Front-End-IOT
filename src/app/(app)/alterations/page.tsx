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
import { disturbancesApi } from '@/lib/api/disturbances';
import type { Disturbance } from '@/lib/api/types';

export default function AlterationsPage() {
  const [alterations, setAlterations] = useState<Disturbance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newAlteration, setNewAlteration] = useState({
    description: '',
    date: '',
    time: '',
  });
  const { toast } = useToast();

  // Cargar alteraciones al montar el componente
  useEffect(() => {
    loadAlterations();
  }, []);

  const loadAlterations = async () => {
    try {
      setIsLoading(true);
      const data = await disturbancesApi.getAll();
      setAlterations(data);
    } catch (error) {
      console.error('Error loading alterations:', error);
      toast({
        title: 'Error',
        description:
          error instanceof Error
            ? error.message
            : 'No se pudieron cargar las alteraciones',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddClick = () => {
    setNewAlteration({ description: '', date: '', time: '' });
    setIsDialogOpen(true);
  };

  const handleDeleteClick = async (id: number) => {
    try {
      await disturbancesApi.delete(id);
      toast({
        title: 'Éxito',
        description: 'Alteración eliminada correctamente',
      });
      // Recargar la lista
      await loadAlterations();
    } catch (error) {
      console.error('Error deleting alteration:', error);
      toast({
        title: 'Error',
        description:
          error instanceof Error
            ? error.message
            : 'No se pudo eliminar la alteración',
        variant: 'destructive',
      });
    }
  };

  const handleSave = async () => {
    // Validar campos
    if (!newAlteration.description || !newAlteration.date || !newAlteration.time) {
      toast({
        title: 'Error de validación',
        description: 'Por favor completa todos los campos',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSaving(true);
      await disturbancesApi.create({
        description: newAlteration.description,
        date: newAlteration.date,
        time: newAlteration.time,
      });
      toast({
        title: 'Éxito',
        description: 'Alteración creada correctamente',
      });
      setIsDialogOpen(false);
      // Recargar la lista
      await loadAlterations();
    } catch (error) {
      console.error('Error creating alteration:', error);
      toast({
        title: 'Error',
        description:
          error instanceof Error
            ? error.message
            : 'No se pudo crear la alteración',
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
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                    <p className="mt-2 text-muted-foreground">
                      Cargando alteraciones...
                    </p>
                  </TableCell>
                </TableRow>
              ) : alterations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No hay alteraciones registradas
                  </TableCell>
                </TableRow>
              ) : (
                alterations.map((alteration) => (
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
                            onClick={() => handleDeleteClick(alteration.id)}
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
            <DialogTitle>Agregar Alteración</DialogTitle>
            <DialogDescription>
              Completa el formulario para agregar una nueva alteración.
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
