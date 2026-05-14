import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/mockData';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const mentor = db.mentors.find((m) => m.userId === id);

  if (!mentor) {
    return NextResponse.json({ error: 'Mentor no encontrado', status: 'error' }, { status: 404 });
  }

  const user = db.users.find((u) => u.id === mentor.userId);
  const reviews = db.reviews
    .filter((r) => r.mentorId === id)
    .map((r) => ({
      ...r,
      apprentice: db.users.find((u) => u.id === r.apprenticeId),
    }));

  return NextResponse.json({
    data: { ...mentor, user, reviews },
    status: 'ok',
  });
}
