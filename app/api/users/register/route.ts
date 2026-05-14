import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/mockData';

const registerSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  role: z.enum(['aprendiz', 'mentor', 'admin'], { message: 'Rol inválido' }),
  cycle: z.string().min(1, 'El ciclo es requerido'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validar datos de entrada
    const validatedData = registerSchema.parse(body);

    // Verificar si el email ya existe
    const existingUser = db.users.find((u) => u.email === validatedData.email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'El email ya está registrado', status: 'error' },
        { status: 400 }
      );
    }

    // Generar ID único
    const newId = `u${db.users.length + 1}`;

    // Crear nuevo usuario
    const newUser = {
      id: newId,
      name: validatedData.name,
      email: validatedData.email,
      role: validatedData.role,
      cycle: validatedData.cycle,
      avatar: validatedData.name.split(' ').map(n => n[0]).join('').toUpperCase(),
      status: 'active' as const,
      sessions: 0,
    };

    // Agregar a la base de datos
    db.users.push(newUser);

    // NOTA: En producción, guardar la contraseña hasheada en una base de datos real
    // Aquí solo retornamos el usuario sin la contraseña
    return NextResponse.json(
      {
        data: newUser,
        status: 'ok',
        message: 'Usuario registrado exitosamente',
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Datos inválidos',
          details: error.errors,
          status: 'error',
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Error interno del servidor', status: 'error' },
      { status: 500 }
    );
  }
}
