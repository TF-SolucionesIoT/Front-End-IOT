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
import { symptomsApi } from '@/lib/api';
import type { Symptom } from '@/lib/api';

export default function SymptomsPage() {
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newSymptom, setNewSymptom] = useState({
    name: '',
    description: '',
    severity_level: 3,
    onset_date: '',
    category: '',
    resolution_date: '',
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
      setSymptoms(data || []);
    } catch (error: any) {
      // Si es un 400 o 404, simplemente no hay datos - no es un error real
      if (error?.status === 400 || error?.status === 404) {
        setSymptoms([]);
        return;
      }
      // Solo loguear errores reales (no 400/404 por datos vacíos)
      console.error('Error loading symptoms:', error);
      setSymptoms([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddClick = () => {
    setNewSymptom({ 
      name: '', 
      description: '', 
      severity_level: 3, 
      onset_date: '', 
      category: '',
      resolution_date: '' 
    });
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
    // Validar campos requeridos
    if (!newSymptom.name || !newSymptom.description || !newSymptom.onset_date || !newSymptom.category) {
      toast({
        title: 'Error de validación',
        description: 'Por favor completa todos los campos requeridos',
        variant: 'destructive',
      });
      return;
    }

    // Validar límites del backend
    if (newSymptom.name.length > 20) {
      toast({
        title: 'Error de validación',
        description: 'El nombre no puede tener más de 20 caracteres',
        variant: 'destructive',
      });
      return;
    }

    if (newSymptom.description.length > 50) {
      toast({
        title: 'Error de validación',
        description: 'La descripción no puede tener más de 50 caracteres',
        variant: 'destructive',
      });
      return;
    }

    if (newSymptom.category.length > 30) {
      toast({
        title: 'Error de validación',
        description: 'La categoría no puede tener más de 30 caracteres',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSaving(true);
      
      // Convertir las fechas al formato ISO que espera el backend
      const onsetDateISO = newSymptom.onset_date 
        ? new Date(newSymptom.onset_date).toISOString() 
        : '';
      
      const resolutionDateISO = newSymptom.resolution_date 
        ? new Date(newSymptom.resolution_date).toISOString() 
        : undefined;
      
      await symptomsApi.create({
        name: newSymptom.name,
        description: newSymptom.description,
        severity_level: newSymptom.severity_level,
        onset_date: onsetDateISO,
        category: newSymptom.category,
        resolution_date: resolutionDateISO,
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
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Onset Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                    <p className="mt-2 text-muted-foreground">
                      Cargando síntomas...
                    </p>
                  </TableCell>
                </TableRow>
              ) : symptoms.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No hay síntomas registrados
                  </TableCell>
                </TableRow>
              ) : (
                symptoms.map((symptom) => {
                  const getSeverityBadge = (level: number) => {
                    if (level <= 2) return 'bg-green-500';
                    if (level <= 3) return 'bg-yellow-500';
                    return 'bg-red-500';
                  };

                  return (
                    <TableRow key={symptom.id}>
                      <TableCell>{symptom.id}</TableCell>
                      <TableCell className="font-medium">{symptom.name}</TableCell>
                      <TableCell>{symptom.category}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white ${getSeverityBadge(symptom.severityLevel)}`}>
                          {symptom.severityLevel}
                        </span>
                      </TableCell>
                      <TableCell>{new Date(symptom.onsetDate).toLocaleString()}</TableCell>
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
                  );
                })
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
              <Label htmlFor="name">Name (máx. 20 caracteres)</Label>
              <Input
                id="name"
                value={newSymptom.name}
                onChange={(e) =>
                  setNewSymptom({
                    ...newSymptom,
                    name: e.target.value,
                  })
                }
                placeholder="Enter symptom name"
                maxLength={20}
              />
              <p className="text-xs text-muted-foreground">
                {newSymptom.name.length}/20 caracteres
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description (máx. 50 caracteres)</Label>
              <Textarea
                id="description"
                value={newSymptom.description}
                onChange={(e) =>
                  setNewSymptom({
                    ...newSymptom,
                    description: e.target.value,
                  })
                }
                placeholder="Enter a detailed description"
                maxLength={50}
              />
              <p className="text-xs text-muted-foreground">
                {newSymptom.description.length}/50 caracteres
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Category (máx. 30 caracteres)</Label>
              <Input
                id="category"
                value={newSymptom.category}
                onChange={(e) =>
                  setNewSymptom({
                    ...newSymptom,
                    category: e.target.value,
                  })
                }
                placeholder="Enter category (e.g., Respiratory, Digestive)"
                maxLength={30}
              />
              <p className="text-xs text-muted-foreground">
                {newSymptom.category.length}/30 caracteres
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
                  value={newSymptom.severity_level}
                  onChange={(e) =>
                    setNewSymptom({ ...newSymptom, severity_level: parseInt(e.target.value) || 1 })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="onset_date">Onset Date & Time</Label>
                <Input
                  id="onset_date"
                  type="datetime-local"
                  value={newSymptom.onset_date}
                  onChange={(e) =>
                    setNewSymptom({ ...newSymptom, onset_date: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="resolution_date">Resolution Date & Time (opcional)</Label>
              <Input
                id="resolution_date"
                type="datetime-local"
                value={newSymptom.resolution_date}
                onChange={(e) =>
                  setNewSymptom({ ...newSymptom, resolution_date: e.target.value })
                }
              />
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
