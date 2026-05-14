import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/mockData';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const role = searchParams.get('role');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const search = searchParams.get('search') || '';

  let result = [...db.users];

  if (role && role !== 'all') {
    result = result.filter((u) => u.role === role);
  }

  if (search) {
    const q = search.toLowerCase();
    result = result.filter(
      (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    );
  }

  const total = result.length;
  const paginated = result.slice((page - 1) * limit, page * limit);

  return NextResponse.json({
    data: { users: paginated, total, page, limit },
    status: 'ok',
  });
}
