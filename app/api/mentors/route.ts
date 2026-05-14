import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/mockData';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const specialty = searchParams.get('specialty');
  const available = searchParams.get('available');
  const minRating = searchParams.get('minRating');
  const recommended = searchParams.get('recommended');
  const limitParam = searchParams.get('limit');

  let result = db.mentors.map((m) => ({
    ...m,
    user: db.users.find((u) => u.id === m.userId),
  }));

  if (specialty) {
    result = result.filter((m) => m.specialty === specialty);
  }

  if (available === 'true') {
    result = result.filter((m) => m.available);
  }

  if (minRating) {
    result = result.filter((m) => m.rating >= parseFloat(minRating));
  }

  if (recommended === 'true') {
    result = result.sort((a, b) => b.rating - a.rating);
  }

  if (limitParam) {
    result = result.slice(0, parseInt(limitParam));
  }

  return NextResponse.json({ data: result, status: 'ok' });
}
