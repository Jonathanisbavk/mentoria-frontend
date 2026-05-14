import useSWR from 'swr';
import type { Stats } from '@/lib/types';

const fetcher = (url: string) => fetch(url).then((r) => r.json()).then((j) => j.data);

export function useStats() {
  const { data, error, isLoading } = useSWR<Stats>('/api/stats', fetcher);
  return { stats: data ?? null, isLoading, error };
}
