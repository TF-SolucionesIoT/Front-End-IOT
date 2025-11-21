'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Pill, PlusCircle, Loader2 } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { treatmentsApi } from '@/lib/api';
import type { Treatment } from '@/lib/api';

export default function TreatmentsPage() {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTreatment, setNewTreatment] = useState({
    name: '',
    description: '',
    frequency: '',
    dosage: '',
    startDate: '',
    endDate: '',
    isActive: true,
  });
  const { toast } = useToast();

  // Cargar tratamientos al montar el componente
  useEffect(() => {
    loadTreatments();
  }, []);

  const loadTreatments = async () => {
    try {
      setIsLoading(true);
      const data = await treatmentsApi.getAll();
      setTreatments(data);
    } catch (error) {
      console.error('Error loading treatments:', error);
      toast({
        title: 'Error',
        description:
          error instanceof Error
            ? error.message
            : 'No se pudieron cargar los tratamientos',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddClick = () => {
    setNewTreatment({
      name: '',
      description: '',
      frequency: '',
      dosage: '',
      startDate: '',
      endDate: '',
      isActive: true,
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    // Validar campos requeridos
    if (!newTreatment.name || !newTreatment.description || !newTreatment.frequency || !newTreatment.dosage || !newTreatment.startDate) {
      toast({
        title: 'Error de validación',
        description: 'Por favor completa todos los campos requeridos',
        variant: 'destructive',
      });
      return;
    }

    // Validar límites del backend
    if (newTreatment.name.length > 100) {
      toast({
        title: 'Error de validación',
        description: 'El nombre no puede tener más de 100 caracteres',
        variant: 'destructive',
      });
      return;
    }

    if (newTreatment.description.length > 500) {
      toast({
        title: 'Error de validación',
        description: 'La descripción no puede tener más de 500 caracteres',
        variant: 'destructive',
      });
      return;
    }

    if (newTreatment.frequency.length > 100) {
      toast({
        title: 'Error de validación',
        description: 'La frecuencia no puede tener más de 100 caracteres',
        variant: 'destructive',
      });
      return;
    }

    if (newTreatment.dosage.length > 100) {
      toast({
        title: 'Error de validación',
        description: 'La dosificación no puede tener más de 100 caracteres',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSaving(true);
      
      // Convertir las fechas al formato ISO que espera el backend
      const startDateISO = newTreatment.startDate 
        ? new Date(newTreatment.startDate).toISOString() 
        : '';
      
      const endDateISO = newTreatment.endDate 
        ? new Date(newTreatment.endDate).toISOString() 
        : undefined;
      
      await treatmentsApi.create({
        name: newTreatment.name,
        description: newTreatment.description,
        frequency: newTreatment.frequency,
        dosage: newTreatment.dosage,
        startDate: startDateISO,
        endDate: endDateISO,
        isActive: newTreatment.isActive,
      });
      toast({
        title: 'Éxito',
        description: 'Tratamiento creado correctamente',
      });
      setIsDialogOpen(false);
      // Recargar la lista
      await loadTreatments();
    } catch (error) {
      console.error('Error creating treatment:', error);
      toast({
        title: 'Error',
        description:
          error instanceof Error
            ? error.message
            : 'No se pudo crear el tratamiento',
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
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
              <p className="mt-2 text-muted-foreground">
                Cargando tratamientos...
              </p>
            </div>
          ) : treatments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No hay tratamientos registrados
            </div>
          ) : (
            <ul className="space-y-4">
              {treatments.map((treatment) => (
                <li key={treatment.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                    <Pill className="h-5 w-5 text-secondary-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{treatment.name}</p>
                      {treatment.isActive ? (
                        <Badge className="bg-[#E8F5E9] text-[#2E7D32] hover:bg-[#E8F5E9]">
                          Activo
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-gray-500 text-gray-500">
                          Inactivo
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {treatment.description}
                    </p>
                    <div className="flex gap-4 mt-2 text-sm">
                      <span><strong>Dosificación:</strong> {treatment.dosage}</span>
                      <span><strong>Frecuencia:</strong> {treatment.frequency}</span>
                    </div>
                    <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                      <span>Inicio: {new Date(treatment.startDate).toLocaleDateString()}</span>
                      {treatment.endDate && (
                        <span>Fin: {new Date(treatment.endDate).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem className="text-destructive">
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Tratamiento</DialogTitle>
            <DialogDescription>
              Completa el formulario para agregar un nuevo tratamiento.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre del Medicamento (máx. 100 caracteres)</Label>
              <Input
                id="name"
                value={newTreatment.name}
                onChange={(e) =>
                  setNewTreatment({ ...newTreatment, name: e.target.value })
                }
                placeholder="ej. Lisinopril"
                maxLength={100}
              />
              <p className="text-xs text-muted-foreground">
                {newTreatment.name.length}/100 caracteres
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Descripción (máx. 500 caracteres)</Label>
              <Textarea
                id="description"
                value={newTreatment.description}
                onChange={(e) =>
                  setNewTreatment({ ...newTreatment, description: e.target.value })
                }
                placeholder="Descripción detallada del tratamiento"
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground">
                {newTreatment.description.length}/500 caracteres
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="dosage">Dosificación (máx. 100 caracteres)</Label>
                <Input
                  id="dosage"
                  value={newTreatment.dosage}
                  onChange={(e) =>
                    setNewTreatment({ ...newTreatment, dosage: e.target.value })
                  }
                  placeholder="ej. 10mg cada 8 horas"
                  maxLength={100}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="frequency">Frecuencia (máx. 100 caracteres)</Label>
                <Input
                  id="frequency"
                  value={newTreatment.frequency}
                  onChange={(e) =>
                    setNewTreatment({ ...newTreatment, frequency: e.target.value })
                  }
                  placeholder="ej. 3 veces al día"
                  maxLength={100}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startDate">Fecha de Inicio</Label>
                <Input
                  id="startDate"
                  type="datetime-local"
                  value={newTreatment.startDate}
                  onChange={(e) =>
                    setNewTreatment({ ...newTreatment, startDate: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="endDate">Fecha de Fin (opcional)</Label>
                <Input
                  id="endDate"
                  type="datetime-local"
                  value={newTreatment.endDate}
                  onChange={(e) =>
                    setNewTreatment({ ...newTreatment, endDate: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid gap-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={newTreatment.isActive}
                  onChange={(e) =>
                    setNewTreatment({ ...newTreatment, isActive: e.target.checked })
                  }
                  className="w-4 h-4"
                />
                <Label htmlFor="isActive" className="cursor-pointer">
                  Tratamiento activo
                </Label>
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
