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
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type UserType = 'patient' | 'caregiver';

export default function SignUpPage() {
  const { register, isLoading: authLoading, error: authError } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState<UserType>('patient');
  
  // Campos comunes
  const [commonData, setCommonData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    gender: '',
    username: '',
    password: '',
    confirmPassword: '',
  });

  // Campos específicos de paciente
  const [patientData, setPatientData] = useState({
    birthday: '',
  });

  // Campos específicos de cuidador
  const [caregiverData, setCaregiverData] = useState({
    phoneNumber: '',
  });

  const handleCommonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommonData({
      ...commonData,
      [e.target.id]: e.target.value,
    });
  };

  const handlePatientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPatientData({
      ...patientData,
      [e.target.id]: e.target.value,
    });
  };

  const handleCaregiverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCaregiverData({
      ...caregiverData,
      [e.target.id]: e.target.value,
    });
  };

  const handleGenderChange = (value: string) => {
    setCommonData({
      ...commonData,
      gender: value,
    });
  };

  const validateForm = (): boolean => {
    // Validar campos comunes
    if (!commonData.firstName || !commonData.lastName || !commonData.email || 
        !commonData.gender || !commonData.username || !commonData.password) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos requeridos",
        variant: "destructive",
      });
      return false;
    }

    // Validar contraseñas
    if (commonData.password !== commonData.confirmPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden",
        variant: "destructive",
      });
      return false;
    }

    if (commonData.password.length < 6) {
      toast({
        title: "Error",
        description: "La contraseña debe tener al menos 6 caracteres",
        variant: "destructive",
      });
      return false;
    }

    // Validar campos específicos
    if (userType === 'patient') {
      if (!patientData.birthday) {
        toast({
          title: "Error",
          description: "Por favor ingresa tu fecha de nacimiento",
          variant: "destructive",
        });
        return false;
      }
    } else {
      if (!caregiverData.phoneNumber) {
        toast({
          title: "Error",
          description: "Por favor ingresa tu número de teléfono",
          variant: "destructive",
        });
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const data = {
        firstName: commonData.firstName,
        lastName: commonData.lastName,
        email: commonData.email,
        gender: commonData.gender,
        username: commonData.username,
        password: commonData.password,
        ...(userType === 'patient' 
          ? { birthday: patientData.birthday }
          : { phoneNumber: caregiverData.phoneNumber }
        )
      };

      await register(data, userType);

      toast({
        title: "¡Cuenta creada!",
        description: `Tu cuenta de ${userType === 'patient' ? 'paciente' : 'cuidador'} ha sido creada exitosamente`,
      });
    } catch (error) {
      // Error ya manejado por useAuth
      toast({
        title: "Error al registrarse",
        description: authError || "Ocurrió un error al crear la cuenta",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader className="space-y-2 text-center">
        <Logo className="mx-auto h-12 w-12 text-primary" />
        <CardTitle className="text-2xl">Crear cuenta</CardTitle>
        <CardDescription>
          Selecciona el tipo de cuenta e ingresa tu información
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={userType} onValueChange={(value) => setUserType(value as UserType)} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="patient">Paciente</TabsTrigger>
            <TabsTrigger value="caregiver">Cuidador</TabsTrigger>
          </TabsList>

          <TabsContent value="patient" className="mt-6">
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                {/* Campos comunes */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="firstName">Nombre *</Label>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="Juan"
                      required
                      value={commonData.firstName}
                      onChange={handleCommonChange}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="lastName">Apellido *</Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Pérez"
                      required
                      value={commonData.lastName}
                      onChange={handleCommonChange}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="juan@example.com"
                    required
                    value={commonData.email}
                    onChange={handleCommonChange}
                    disabled={isLoading}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="gender">Sexo *</Label>
                  <Select
                    value={commonData.gender}
                    onValueChange={handleGenderChange}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona tu Sexo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Masculino</SelectItem>
                      <SelectItem value="Female">Femenino</SelectItem>
                      <SelectItem value="Other">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="username">Usuario *</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="usuario123"
                    required
                    value={commonData.username}
                    onChange={handleCommonChange}
                    disabled={isLoading}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="password">Contraseña *</Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={commonData.password}
                      onChange={handleCommonChange}
                      disabled={isLoading}
                      minLength={6}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="confirmPassword">Confirmar contraseña *</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      required
                      value={commonData.confirmPassword}
                      onChange={handleCommonChange}
                      disabled={isLoading}
                      minLength={6}
                    />
                  </div>
                </div>

                {/* Campo específico de paciente */}
                <div className="grid gap-2">
                  <Label htmlFor="birthday">Fecha de nacimiento *</Label>
                  <Input
                    id="birthday"
                    type="date"
                    required
                    value={patientData.birthday}
                    onChange={handlePatientChange}
                    disabled={isLoading}
                    max={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Creando cuenta...' : 'Crear cuenta de paciente'}
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="caregiver" className="mt-6">
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                {/* Campos comunes */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="firstName">Nombre *</Label>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="María"
                      required
                      value={commonData.firstName}
                      onChange={handleCommonChange}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="lastName">Apellido *</Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="González"
                      required
                      value={commonData.lastName}
                      onChange={handleCommonChange}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="maria@example.com"
                    required
                    value={commonData.email}
                    onChange={handleCommonChange}
                    disabled={isLoading}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="gender">Sexo *</Label>
                  <Select
                    value={commonData.gender}
                    onValueChange={handleGenderChange}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona tu sexo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Masculino</SelectItem>
                      <SelectItem value="Female">Femenino</SelectItem>
                      <SelectItem value="Other">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="username">Usuario *</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="usuario123"
                    required
                    value={commonData.username}
                    onChange={handleCommonChange}
                    disabled={isLoading}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="password">Contraseña *</Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={commonData.password}
                      onChange={handleCommonChange}
                      disabled={isLoading}
                      minLength={6}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="confirmPassword">Confirmar contraseña *</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      required
                      value={commonData.confirmPassword}
                      onChange={handleCommonChange}
                      disabled={isLoading}
                      minLength={6}
                    />
                  </div>
                </div>

                {/* Campo específico de cuidador */}
                <div className="grid gap-2">
                  <Label htmlFor="phoneNumber">Número de teléfono *</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="+1234567890"
                    required
                    value={caregiverData.phoneNumber}
                    onChange={handleCaregiverChange}
                    disabled={isLoading}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Creando cuenta...' : 'Crear cuenta de cuidador'}
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>

        <div className="mt-4 text-center text-sm">
          ¿Ya tienes una cuenta?{" "}
          <Link href="/auth/login" className="underline">
            Inicia sesión
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
