import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/mockData';
import type { Session } from '@/lib/types';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  const status = searchParams.get('status');
  const limitParam = searchParams.get('limit');
  const mentorId = searchParams.get('mentorId');

  let result = db.sessions.map((s) => ({
    ...s,
    mentor: db.users.find((u) => u.id === s.mentorId),
    apprentice: db.users.find((u) => u.id === s.apprenticeId),
  }));

  if (userId) {
    result = result.filter((s) => s.mentorId === userId || s.apprenticeId === userId);
  }

  if (mentorId) {
    result = result.filter((s) => s.mentorId === mentorId);
  }

  if (status) {
    result = result.filter((s) => s.status === status);
  }

  if (limitParam) {
    result = result.slice(0, parseInt(limitParam));
  }

  return NextResponse.json({ data: result, status: 'ok' });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newSession: Session = {
      id: `s${Date.now()}`,
      mentorId: body.mentorId,
      apprenticeId: body.apprenticeId || 'u1',
      topic: body.topic,
      date: body.date,
      time: body.time,
      duration: body.duration || 60,
      status: 'pending',
      type: body.type || 'videocall',
    };

    db.sessions.push(newSession);

    const enriched = {
      ...newSession,
      mentor: db.users.find((u) => u.id === newSession.mentorId),
      apprentice: db.users.find((u) => u.id === newSession.apprenticeId),
    };

    return NextResponse.json({ data: enriched, status: 'ok' }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Error al crear sesión', status: 'error' }, { status: 500 });
  }
}
