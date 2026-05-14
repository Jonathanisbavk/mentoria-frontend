import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/mockData';
import type { Review } from '@/lib/types';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  const mentorId = searchParams.get('mentorId');

  let result = db.reviews.map((r) => ({
    ...r,
    mentor: db.users.find((u) => u.id === r.mentorId),
    apprentice: db.users.find((u) => u.id === r.apprenticeId),
  }));

  if (userId) {
    result = result.filter((r) => r.apprenticeId === userId || r.mentorId === userId);
  }

  if (mentorId) {
    result = result.filter((r) => r.mentorId === mentorId);
  }

  return NextResponse.json({ data: result, status: 'ok' });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const newReview: Review = {
      id: `r${Date.now()}`,
      sessionId: body.sessionId,
      mentorId: body.mentorId,
      apprenticeId: body.apprenticeId || 'u1',
      rating: body.rating,
      comment: body.comment || '',
      clarity: body.clarity || body.rating,
      knowledge: body.knowledge || body.rating,
      punctuality: body.punctuality || body.rating,
      helpfulness: body.helpfulness || body.rating,
      date: new Date().toISOString().split('T')[0],
    };

    db.reviews.push(newReview);

    const mentor = db.mentors.find((m) => m.userId === body.mentorId);
    if (mentor) {
      const mentorReviews = db.reviews.filter((r) => r.mentorId === body.mentorId);
      const avg = mentorReviews.reduce((sum, r) => sum + r.rating, 0) / mentorReviews.length;
      mentor.rating = Math.round(avg * 10) / 10;
      mentor.totalSessions = mentorReviews.length + mentor.totalSessions;
    }

    if (body.sessionId) {
      const session = db.sessions.find((s) => s.id === body.sessionId);
      if (session) session.status = 'completed';
    }

    return NextResponse.json({ data: newReview, status: 'ok' }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Error al crear valoración', status: 'error' }, { status: 500 });
  }
}
