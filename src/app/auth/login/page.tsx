'use client';

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/logo";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { clearTokens } from "@/lib/api";

export default function LoginPage() {
  const { login, isLoading, error, clearError } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  // limpiar localStorage al cargar el componente
  useEffect(() => {
    clearTokens();
  }, []);

  

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearError();

    try {
      await login({
        username: formData.username,
        password: formData.password,
      });
    } catch {
      // Error ya manejado por useAuth
    }

  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  return (
    <Card className="mx-auto w-full max-w-sm">
      <CardHeader className="space-y-2 text-center">
        <Logo className="mx-auto h-12 w-12 text-primary" />
        <CardTitle className="text-2xl">Bienvenido a AlertaVital</CardTitle>
        <CardDescription>
          Ingresa tus credenciales para iniciar sesión
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-2">
            <Label htmlFor="username">Usuario</Label>
            <Input
              id="username"
              type="text"
              placeholder="usuario123"
              required
              value={formData.username}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Contraseña</Label>
            </div>
            <Input
              id="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          ¿No tienes una cuenta?{" "}
          <Link href="/auth/signup" className="underline">
            Crear cuenta
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
