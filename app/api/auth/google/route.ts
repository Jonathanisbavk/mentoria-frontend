import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/mockData';

/**
 * Google OAuth callback handler
 * 
 * IMPORTANTE: Para implementar Google OAuth correctamente, necesitas:
 * 1. Instalar: npm install next-auth@beta @auth/core @auth/nextjs-core @react-oauth/google
 * 2. Crear variables de entorno en .env.local:
 *    - GOOGLE_CLIENT_ID=tu_client_id
 *    - GOOGLE_CLIENT_SECRET=tu_client_secret
 *    - NEXTAUTH_SECRET=tu_secret_generado
 * 3. Configurar Google Cloud Console en https://console.cloud.google.com
 */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { googleId, email, name, picture } = body;

    if (!googleId || !email) {
      return NextResponse.json(
        { error: 'Datos de Google incompletos', status: 'error' },
        { status: 400 }
      );
    }

    // Buscar usuario existente
    let user = db.users.find((u) => u.email === email);

    if (!user) {
      // Crear nuevo usuario desde Google
      const newId = `google_${googleId}`;
      const nameInitials = name
        ?.split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase() || 'U';

      user = {
        id: newId,
        name: name || 'Usuario',
        email: email,
        role: 'aprendiz', // Por defecto nuevo usuario es aprendiz
        cycle: '—',
        avatar: picture || nameInitials,
        status: 'active' as const,
        sessions: 0,
      };

      db.users.push(user);
    }

    return NextResponse.json(
      {
        data: user,
        status: 'ok',
        message: `Bienvenido ${user.name}`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error en Google OAuth:', error);
    return NextResponse.json(
      { error: 'Error al procesar autenticación de Google', status: 'error' },
      { status: 500 }
    );
  }
}
