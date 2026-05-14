import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/mockData';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Contraseña requerida'),
});

const demoLoginSchema = z.object({
  role: z.enum(['aprendiz', 'mentor', 'admin']).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Intentar validar como login tradicional primero
    try {
      const validatedData = loginSchema.parse(body);
      
      // Buscar usuario por email
      const user = db.users.find((u) => u.email === validatedData.email);
      
      if (!user) {
        return NextResponse.json(
          { error: 'Email o contraseña incorrectos', status: 'error' },
          { status: 401 }
        );
      }

      // NOTA: En producción, comparar contraseña hasheada
      // Por ahora, validamos que la contraseña no esté vacía
      if (!validatedData.password) {
        return NextResponse.json(
          { error: 'Contraseña requerida', status: 'error' },
          { status: 401 }
        );
      }

      return NextResponse.json(
        { data: user, status: 'ok', message: 'Sesión iniciada correctamente' },
        { status: 200 }
      );
    } catch (emailError) {
      // Fallback: intentar login por rol (para desarrollo/demostración)
      try {
        const demoData = demoLoginSchema.parse(body);
        
        if (!demoData.role) {
          return NextResponse.json(
            { error: 'Email, contraseña o rol requeridos', status: 'error' },
            { status: 400 }
          );
        }

        const roleMap = {
          aprendiz: 'u1',
          mentor: 'u2',
          admin: 'admin1',
        };

        const userId = roleMap[demoData.role];
        const user = db.users.find((u) => u.id === userId);

        if (!user) {
          return NextResponse.json(
            { error: 'Rol no válido', status: 'error' },
            { status: 400 }
          );
        }

        return NextResponse.json(
          { data: user, status: 'ok', message: 'Sesión demo iniciada' },
          { status: 200 }
        );
      } catch {
        return NextResponse.json(
          { error: 'Datos de login inválidos', status: 'error' },
          { status: 400 }
        );
      }
    }
  } catch {
    return NextResponse.json(
      { error: 'Error interno del servidor', status: 'error' },
      { status: 500 }
    );
  }
}
