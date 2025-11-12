'use client';

import { PlaceHolderImages } from "@/lib/placeholder-images";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { CreditCard, LogOut, Settings, User } from "lucide-react";
import { logout } from "@/lib/api/auth";
import { useUser } from "@/hooks/use-user";

export function UserNav() {
  const { user, loading } = useUser();
  const userAvatar = PlaceHolderImages.find((img) => img.id === "user-avatar-1");

  const handleLogout = () => {
    logout();
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

  // Obtener email
  const getUserEmail = () => {
    return user?.email || 'No disponible';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            {userAvatar && (
              <AvatarImage
                src={userAvatar.imageUrl}
                alt="User avatar"
                data-ai-hint={userAvatar.imageHint}
              />
            )}
            <AvatarFallback>{getInitials()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {loading ? 'Cargando...' : getFullName()}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {loading ? '...' : getUserEmail()}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href="/settings/profile" passHref>
            <DropdownMenuItem>
              <User />
              Perfil
            </DropdownMenuItem>
          </Link>
          <Link href="/settings/device" passHref>
            <DropdownMenuItem>
              <CreditCard />
              Dispositivo
            </DropdownMenuItem>
          </Link>
          <Link href="/settings/profile" passHref>
            <DropdownMenuItem>
              <Settings />
              Configuración
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut />
          Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
