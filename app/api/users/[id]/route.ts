import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/mockData';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const user = db.users.find((u) => u.id === id);

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado', status: 'error' }, { status: 404 });
    }

    if (body.status) user.status = body.status;
    if (body.role) user.role = body.role;

    return NextResponse.json({ data: user, status: 'ok' });
  } catch {
    return NextResponse.json({ error: 'Error al actualizar usuario', status: 'error' }, { status: 500 });
  }
}
