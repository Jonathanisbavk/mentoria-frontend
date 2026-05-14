import useSWR from 'swr';
import type { Mentor } from '@/lib/types';

interface MentorFilters {
  specialty?: string;
  available?: boolean;
  minRating?: number;
  recommended?: boolean;
  limit?: number;
}

const fetcher = (url: string) => fetch(url).then((r) => r.json()).then((j) => j.data);

export function useMentors(filters: MentorFilters = {}) {
  const params = new URLSearchParams();
  if (filters.specialty) params.set('specialty', filters.specialty);
  if (filters.available !== undefined) params.set('available', String(filters.available));
  if (filters.minRating !== undefined) params.set('minRating', String(filters.minRating));
  if (filters.recommended) params.set('recommended', 'true');
  if (filters.limit) params.set('limit', String(filters.limit));

  const query = params.toString();
  const url = `/api/mentors${query ? `?${query}` : ''}`;

  const { data, error, isLoading, mutate } = useSWR<Mentor[]>(url, fetcher);

  return { mentors: data ?? [], isLoading, error, mutate };
}
