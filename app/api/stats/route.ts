import { NextResponse } from 'next/server';
import { db } from '@/lib/mockData';

export async function GET() {
  const totalUsers = 1247;
  const activeMentors = db.mentors.filter((m) => m.available).length + 140;
  const totalApprentices = totalUsers - activeMentors - 3;
  const sessionsThisMonth = 386;

  const allRatings = db.reviews.map((r) => r.rating);
  const averageRating = allRatings.length > 0
    ? Math.round((allRatings.reduce((a, b) => a + b, 0) / allRatings.length) * 10) / 10
    : 4.8;

  const sessionsThisWeek = [
    { day: 'Lun', count: 68 },
    { day: 'Mar', count: 82 },
    { day: 'Mié', count: 75 },
    { day: 'Jue', count: 91 },
    { day: 'Vie', count: 70 },
  ];

  return NextResponse.json({
    data: {
      totalUsers,
      activeMentors,
      totalApprentices,
      sessionsThisMonth,
      averageRating,
      sessionsThisWeek,
    },
    status: 'ok',
  });
}
