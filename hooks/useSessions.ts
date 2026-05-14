import useSWR from 'swr';
import type { Session } from '@/lib/types';

interface SessionFilters {
  userId?: string;
  status?: string;
  limit?: number;
  mentorId?: string;
}

const fetcher = (url: string) => fetch(url).then((r) => r.json()).then((j) => j.data);

export function useSessions(filters: SessionFilters = {}) {
  const params = new URLSearchParams();
  if (filters.userId) params.set('userId', filters.userId);
  if (filters.status) params.set('status', filters.status);
  if (filters.limit) params.set('limit', String(filters.limit));
  if (filters.mentorId) params.set('mentorId', filters.mentorId);

  const query = params.toString();
  const url = `/api/sessions${query ? `?${query}` : ''}`;

  const { data, error, isLoading, mutate } = useSWR<Session[]>(url, fetcher);

  return { sessions: data ?? [], isLoading, error, mutate };
}
