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
import { disturbancesApi } from '@/lib/api';
import type { Disturbance } from '@/lib/api';

export default function AlterationsPage() {
  const [alterations, setAlterations] = useState<Disturbance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newAlteration, setNewAlteration] = useState({
    name: '',
    description: '',
    severity_level: 3,
    onset_date: '',
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
      setAlterations(data || []);
    } catch (error) {
      console.error('Error loading alterations:', error);
      // Solo mostrar error si no es un problema de datos vacíos
      setAlterations([]);
      // No mostrar toast si es solo que no hay datos
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddClick = () => {
    setNewAlteration({ name: '', description: '', severity_level: 3, onset_date: '' });
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
    if (!newAlteration.name || !newAlteration.description || !newAlteration.onset_date) {
      toast({
        title: 'Error de validación',
        description: 'Por favor completa todos los campos',
        variant: 'destructive',
      });
      return;
    }

    // Validar límites del backend
    if (newAlteration.name.length > 20) {
      toast({
        title: 'Error de validación',
        description: 'El nombre no puede tener más de 20 caracteres',
        variant: 'destructive',
      });
      return;
    }

    if (newAlteration.description.length > 50) {
      toast({
        title: 'Error de validación',
        description: 'La descripción no puede tener más de 50 caracteres',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSaving(true);
      await disturbancesApi.create({
        name: newAlteration.name,
        description: newAlteration.description,
        severity_level: newAlteration.severity_level,
        onset_date: newAlteration.onset_date,
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
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Onset Date</TableHead>
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
                    <TableCell>{alteration.name}</TableCell>
                    <TableCell>{alteration.description}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        alteration.severityLevel >= 4 ? 'bg-red-100 text-red-700' :
                        alteration.severityLevel >= 3 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {alteration.severityLevel}/5
                      </span>
                    </TableCell>
                    <TableCell>{alteration.onsetDate}</TableCell>
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
              <Label htmlFor="name">Name (máx. 20 caracteres)</Label>
              <Input
                id="name"
                value={newAlteration.name}
                onChange={(e) =>
                  setNewAlteration({
                    ...newAlteration,
                    name: e.target.value,
                  })
                }
                placeholder="Enter the name of the alteration"
                maxLength={20}
              />
              <p className="text-xs text-muted-foreground">
                {newAlteration.name.length}/20 caracteres
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description (máx. 50 caracteres)</Label>
              <Textarea
                id="description"
                value={newAlteration.description}
                onChange={(e) =>
                  setNewAlteration({
                    ...newAlteration,
                    description: e.target.value,
                  })
                }
                placeholder="Enter a detailed description"
                maxLength={50}
              />
              <p className="text-xs text-muted-foreground">
                {newAlteration.description.length}/50 caracteres
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="severity">Severity Level (1-5)</Label>
                <Input
                  id="severity"
                  type="number"
                  min="1"
                  max="5"
                  value={newAlteration.severity_level}
                  onChange={(e) =>
                    setNewAlteration({ ...newAlteration, severity_level: parseInt(e.target.value) || 1 })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="date">Onset Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={newAlteration.onset_date}
                  onChange={(e) =>
                    setNewAlteration({ ...newAlteration, onset_date: e.target.value })
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
