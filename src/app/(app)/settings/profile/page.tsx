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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useUser } from '@/hooks/use-user';
import { useToast } from '@/hooks/use-toast';
import { inviteApi } from '@/lib/api';
import { Copy, Check, UserPlus, Link2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { ChangePasswordDialog } from '@/components/change-password-dialog';

export default function ProfileSettingsPage() {
  const { user, loading } = useUser();
  const { toast } = useToast();
  const userAvatar = PlaceHolderImages.find(
    (img) => img.id === 'user-avatar-1'
  );
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  
  // Estados para códigos de invitación
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [inviteExpiry, setInviteExpiry] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUsingCode, setIsUsingCode] = useState(false);
  const [codeToUse, setCodeToUse] = useState('');
  const [showUseCodeDialog, setShowUseCodeDialog] = useState(false);
  
  // Estado para dialog de cambio de contraseña
  const [showChangePasswordDialog, setShowChangePasswordDialog] = useState(false);

  // Actualizar el estado cuando se carga el usuario
  useEffect(() => {
    if (user) {
      const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
      setName(fullName || user.username || '');
      setEmail(user.email || '');
    }
  }, [user]);

  // Generar código de invitación (solo PATIENT)
  const handleGenerateCode = async () => {
    try {
      setIsGenerating(true);
      const response = await inviteApi.generateCode();
      setInviteCode(response.code);
      setInviteExpiry(response.expiresAt);
      toast({
        title: '✅ Código generado',
        description: 'Tu código de invitación ha sido generado exitosamente',
      });
    } catch (error) {
      console.error('Error generating invite code:', error);
      toast({
        title: '❌ Error',
        description: error instanceof Error ? error.message : 'No se pudo generar el código',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Copiar código al portapapeles
  const handleCopyCode = async () => {
    if (inviteCode) {
      try {
        await navigator.clipboard.writeText(inviteCode);
        setCopied(true);
        toast({
          title: '✅ Código copiado',
          description: 'El código ha sido copiado al portapapeles',
        });
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        toast({
          title: '❌ Error',
          description: 'No se pudo copiar el código',
          variant: 'destructive',
        });
      }
    }
  };

  // Usar código de invitación (solo CAREGIVER)
  const handleUseCode = async () => {
    if (!codeToUse.trim()) {
      toast({
        title: '⚠️ Código requerido',
        description: 'Por favor ingresa un código de invitación',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsUsingCode(true);
      const response = await inviteApi.useCode(codeToUse.trim());
      toast({
        title: '✅ Enlace exitoso',
        description: response.message,
      });
      setShowUseCodeDialog(false);
      setCodeToUse('');
    } catch (error) {
      console.error('Error using invite code:', error);
      toast({
        title: '❌ Error',
        description: error instanceof Error ? error.message : 'No se pudo usar el código',
        variant: 'destructive',
      });
    } finally {
      setIsUsingCode(false);
    }
  };

  // Obtener iniciales del usuario
  const getInitials = () => {
    if (!user) return 'U';
    const firstInitial = user.firstName?.[0]?.toUpperCase() || '';
    const lastInitial = user.lastName?.[0]?.toUpperCase() || '';
    if (firstInitial && lastInitial) return `${firstInitial}${lastInitial}`;
    if (user.username) return user.username[0].toUpperCase();
    return 'U';
  };

  // Obtener nombre completo
  const getFullName = () => {
    if (!user) return 'Usuario';
    const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
    return fullName || user.username || 'Usuario';
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold">Configuración de Perfil</h1>
          <p className="text-muted-foreground">Gestiona los detalles de tu cuenta.</p>
        </div>
        <Card className="shadow-card">
          <CardContent className="p-6">
            <p>Cargando información del usuario...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold">Configuración de Perfil</h1>
        <p className="text-muted-foreground">Gestiona los detalles de tu cuenta.</p>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              {userAvatar && (
                <AvatarImage
                  src={userAvatar.imageUrl}
                  alt="User avatar"
                  data-ai-hint={userAvatar.imageHint}
                />
              )}
              <AvatarFallback>{getInitials()}</AvatarFallback>
            </Avatar>
            <div className="grid gap-1">
              <div className="flex items-center gap-2">
                <CardTitle className="text-2xl">{getFullName()}</CardTitle>
                {user?.typeOfUser && (
                  <Badge variant={user.typeOfUser === 'PATIENT' ? 'default' : 'secondary'}>
                    {user.typeOfUser === 'PATIENT' ? '🏥 Paciente' : '👨‍⚕️ Cuidador'}
                  </Badge>
                )}
              </div>
              <CardDescription>
                Este es tu nombre público de visualización.
              </CardDescription>
              <p className="text-sm text-muted-foreground">{email || 'No disponible'}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setIsEditing(false);
            }}
            className="grid gap-6"
          >
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={!isEditing}
                placeholder="Nombre completo"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!isEditing}
                placeholder="correo@ejemplo.com"
              />
            </div>
            <div className="flex justify-end gap-2">
              {isEditing ? (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => setIsEditing(false)}
                    type="button"
                  >
                    Cancelar
                  </Button>
                  <Button type="submit">Guardar</Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)} type="button">
                  Editar Perfil
                </Button>
              )}
              <Button 
                variant="outline"
                onClick={() => setShowChangePasswordDialog(true)}
                type="button"
              >
                Cambiar Contraseña
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Card de Códigos de Invitación - Solo para PATIENT */}
      {user?.typeOfUser === 'PATIENT' && (
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              <CardTitle>Código de Invitación</CardTitle>
            </div>
            <CardDescription>
              Genera un código para que un cuidador pueda acceder a tus datos de salud.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {inviteCode ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 p-4 bg-primary/10 rounded-lg border-2 border-primary/20">
                  <code className="flex-1 text-2xl font-bold tracking-wider text-center">
                    {inviteCode}
                  </code>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCopyCode}
                    className="shrink-0"
                  >
                    {copied ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : (
                      <Copy className="h-5 w-5" />
                    )}
                  </Button>
                </div>
                {inviteExpiry && (
                  <p className="text-sm text-muted-foreground text-center">
                    ⏱️ Expira el: {new Date(inviteExpiry).toLocaleString()}
                  </p>
                )}
                <Button
                  onClick={handleGenerateCode}
                  disabled={isGenerating}
                  variant="outline"
                  className="w-full"
                >
                  Generar Nuevo Código
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleGenerateCode}
                disabled={isGenerating}
                className="w-full"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                {isGenerating ? 'Generando...' : 'Generar Código de Invitación'}
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Card para Usar Código - Solo para CAREGIVER */}
      {user?.typeOfUser === 'CAREGIVER' && (
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Link2 className="h-5 w-5" />
              <CardTitle>Enlazar con Paciente</CardTitle>
            </div>
            <CardDescription>
              Ingresa el código de invitación que te proporcionó el paciente.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => setShowUseCodeDialog(true)}
              className="w-full"
            >
              <Link2 className="mr-2 h-4 w-4" />
              Usar Código de Invitación
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Dialog para usar código */}
      <Dialog open={showUseCodeDialog} onOpenChange={setShowUseCodeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Usar Código de Invitación</DialogTitle>
            <DialogDescription>
              Ingresa el código de 6 caracteres que te proporcionó el paciente.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="code">Código de Invitación</Label>
              <Input
                id="code"
                value={codeToUse}
                onChange={(e) => setCodeToUse(e.target.value.toUpperCase())}
                placeholder="Ej: ABC123"
                maxLength={6}
                className="text-center text-lg tracking-wider font-mono"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowUseCodeDialog(false);
                setCodeToUse('');
              }}
              disabled={isUsingCode}
            >
              Cancelar
            </Button>
            <Button onClick={handleUseCode} disabled={isUsingCode || !codeToUse.trim()}>
              {isUsingCode ? 'Verificando...' : 'Enlazar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para cambiar contraseña */}
      <ChangePasswordDialog
        open={showChangePasswordDialog}
        onOpenChange={setShowChangePasswordDialog}
      />
    </div>
  );
}
