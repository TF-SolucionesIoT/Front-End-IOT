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
import { useToast } from '@/hooks/use-toast';
import { treatmentsApi } from '@/lib/api/treatments';
import type { Treatment } from '@/lib/api/types';

export default function TreatmentsPage() {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTreatment, setNewTreatment] = useState({
    name: '',
    dose: '',
    time: '',
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
      dose: '',
      time: '',
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    // Validar campos
    if (!newTreatment.name || !newTreatment.dose || !newTreatment.time) {
      toast({
        title: 'Error de validación',
        description: 'Por favor completa todos los campos',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSaving(true);
      await treatmentsApi.create({
        name: newTreatment.name,
        dose: newTreatment.dose,
        time: newTreatment.time,
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
                        Tomado
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="border-amber-500 text-amber-500"
                      >
                        Próximo
                      </Badge>
                    )}
                  </div>
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
              <Label htmlFor="name">Nombre del Medicamento</Label>
              <Input
                id="name"
                value={newTreatment.name}
                onChange={(e) =>
                  setNewTreatment({ ...newTreatment, name: e.target.value })
                }
                placeholder="ej. Lisinopril"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="dose">Dosis</Label>
                <Input
                  id="dose"
                  value={newTreatment.dose}
                  onChange={(e) =>
                    setNewTreatment({ ...newTreatment, dose: e.target.value })
                  }
                  placeholder="ej. 10mg"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="time">Hora</Label>
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
