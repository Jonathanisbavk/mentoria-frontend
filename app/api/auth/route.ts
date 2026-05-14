import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/mockData';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { role } = body as { role: 'aprendiz' | 'mentor' | 'admin' };

    const roleMap = {
      aprendiz: 'u1',
      mentor: 'u2',
      admin: 'admin1',
    };

    const userId = roleMap[role];
    const user = db.users.find((u) => u.id === userId);

    if (!user) {
      return NextResponse.json({ error: 'Rol no válido', status: 'error' }, { status: 400 });
    }

    return NextResponse.json({ data: user, status: 'ok' });
  } catch {
    return NextResponse.json({ error: 'Error interno del servidor', status: 'error' }, { status: 500 });
  }
}
