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
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useUser } from '@/hooks/use-user';

export default function ProfileSettingsPage() {
  const { user, loading } = useUser();
  const userAvatar = PlaceHolderImages.find(
    (img) => img.id === 'user-avatar-1'
  );
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // Actualizar el estado cuando se carga el usuario
  useEffect(() => {
    if (user) {
      const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
      setName(fullName || user.username || '');
      setEmail(user.email || '');
    }
  }, [user]);

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
              <CardTitle className="text-2xl">{getFullName()}</CardTitle>
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
              <Button variant="outline">Cambiar Contraseña</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
