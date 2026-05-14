'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { Star } from 'lucide-react';
import { Topbar } from '@/components/layout/Topbar';
import { ReviewCard } from '@/components/features/ReviewCard';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { StarRating } from '@/components/ui/StarRating';
import { SkeletonCard } from '@/components/ui/SkeletonCard';
import { useSessions } from '@/hooks/useSessions';
import { useAuth } from '@/context/AuthContext';
import { getRatingLabel, formatDate } from '@/lib/utils';
import useSWR, { mutate as globalMutate } from 'swr';
import type { Review } from '@/lib/types';

const fetcher = (url: string) => fetch(url).then((r) => r.json()).then((j) => j.data);

const criteria = [
  { key: 'clarity', label: 'Claridad en la explicación' },
  { key: 'knowledge', label: 'Dominio del tema' },
  { key: 'punctuality', label: 'Puntualidad' },
  { key: 'helpfulness', label: 'Capacidad de respuesta' },
] as const;

export default function ValoracionesPage() {
  const { user } = useAuth();
  const { sessions, isLoading: loadingSessions } = useSessions({ userId: user?.id, status: 'completed' });
  const { data: reviews, isLoading: loadingReviews } = useSWR<Review[]>(
    user ? `/api/reviews?userId=${user.id}` : null,
    fetcher
  );

  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [ratings, setRatings] = useState<Record<string, { overall: number; comment: string; clarity: number; knowledge: number; punctuality: number; helpfulness: number }>>({});
  const [submitting, setSubmitting] = useState<Set<string>>(new Set());

  const reviewedSessionIds = new Set((reviews ?? []).map((r) => r.sessionId));
  const pendingSessions = sessions.filter((s) => !reviewedSessionIds.has(s.id) && !dismissed.has(s.id));

  const getRating = (sessionId: string) =>
    ratings[sessionId] || { overall: 0, comment: '', clarity: 0, knowledge: 0, punctuality: 0, helpfulness: 0 };

  const updateRating = (sessionId: string, field: string, value: number | string) => {
    setRatings((prev) => ({
      ...prev,
      [sessionId]: { ...getRating(sessionId), [field]: value },
    }));
  };

  const handleSubmit = async (session: (typeof sessions)[0]) => {
    const r = getRating(session.id);
    if (r.overall === 0) {
      toast.error('Selecciona al menos una estrella para valorar');
      return;
    }

    setSubmitting((prev) => new Set(prev).add(session.id));
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: session.id,
          mentorId: session.mentorId,
          apprenticeId: user?.id || 'u1',
          rating: r.overall,
          comment: r.comment,
          clarity: r.clarity || r.overall,
          knowledge: r.knowledge || r.overall,
          punctuality: r.punctuality || r.overall,
          helpfulness: r.helpfulness || r.overall,
        }),
      });
      const json = await res.json();
      if (json.status === 'ok') {
        toast.success('Valoración enviada correctamente');
        globalMutate(`/api/reviews?userId=${user?.id}`);
        globalMutate(`/api/sessions?userId=${user?.id}&status=completed`);
      }
    } catch {
      toast.error('Error al enviar la valoración');
    } finally {
      setSubmitting((prev) => {
        const s = new Set(prev);
        s.delete(session.id);
        return s;
      });
    }
  };

  return (
    <>
      <Topbar title="Mis Valoraciones" subtitle="Comparte tu experiencia y ayuda a mejorar la plataforma" />
      <div style={{ padding: '32px 36px', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: '100%', maxWidth: 720, display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Pending reviews */}
          {loadingSessions ? (
            <SkeletonCard />
          ) : (
            pendingSessions.map((session) => {
              const r = getRating(session.id);
              const isSubmitting = submitting.has(session.id);

              return (
                <Card key={session.id} padding={28}>
                  {/* Session info */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid var(--brand-border)' }}>
                    <Avatar initials={session.mentor?.avatar || 'ME'} size={48} />
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: 'var(--brand-dark)', fontFamily: 'var(--font-sora, Sora, sans-serif)' }}>
                        {session.mentor?.name}
                      </h4>
                      <p style={{ margin: '2px 0', fontSize: 13, color: 'var(--brand-slate)' }}>{session.topic}</p>
                      <span style={{ fontSize: 11, color: 'var(--brand-slate-light)' }}>{formatDate(session.date, 'dd MMM yyyy')}</span>
                    </div>
                    <Badge variant="success">Completada</Badge>
                  </div>

                  <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700, color: 'var(--brand-dark)', fontFamily: 'var(--font-sora, Sora, sans-serif)' }}>
                    ¿Cómo fue tu experiencia?
                  </h3>

                  {/* Main stars */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => updateRating(session.id, 'overall', s)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, transition: 'transform 0.1s' }}
                          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.transform = 'scale(1.2)')}
                          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.transform = 'scale(1)')}
                          aria-label={`${s} estrella${s !== 1 ? 's' : ''}`}
                        >
                          <Star
                            size={36}
                            fill={s <= r.overall ? '#F59E0B' : 'none'}
                            stroke={s <= r.overall ? '#F59E0B' : '#CBD5E1'}
                            strokeWidth={1.5}
                          />
                        </button>
                      ))}
                    </div>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 500, color: r.overall > 0 ? 'var(--brand-warning)' : 'var(--brand-slate-light)' }}>
                      {getRatingLabel(r.overall)}
                    </p>
                  </div>

                  {/* Criteria */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20, padding: 16, borderRadius: 12, backgroundColor: 'var(--brand-surface)' }}>
                    {criteria.map(({ key, label }) => (
                      <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                        <span style={{ fontSize: 13, color: 'var(--brand-slate)', flex: 1 }}>{label}</span>
                        <StarRating
                          rating={r[key]}
                          size={16}
                          interactive
                          onChange={(val) => updateRating(session.id, key, val)}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Comment */}
                  <div style={{ marginBottom: 20 }}>
                    <Textarea
                      label="Comparte tu experiencia (opcional)"
                      placeholder="¿Qué aprendiste? ¿Qué destacarías del mentor? ¿Recomendarías esta sesión?"
                      rows={3}
                      maxLength={500}
                      value={r.comment}
                      onChange={(e) => updateRating(session.id, 'comment', e.target.value)}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: 10 }}>
                    <Button
                      variant="primary"
                      size="md"
                      loading={isSubmitting}
                      onClick={() => handleSubmit(session)}
                      style={{ flex: 1 }}
                    >
                      Enviar valoración
                    </Button>
                    <Button
                      variant="ghost"
                      size="md"
                      onClick={() => setDismissed((prev) => new Set(prev).add(session.id))}
                      disabled={isSubmitting}
                    >
                      Omitir por ahora
                    </Button>
                  </div>
                </Card>
              );
            })
          )}

          {/* Previous reviews */}
          <div>
            <h2 style={{ margin: '0 0 16px', fontSize: 18, fontWeight: 700, color: 'var(--brand-dark)', fontFamily: 'var(--font-sora, Sora, sans-serif)' }}>
              Mis valoraciones anteriores
            </h2>
            {loadingReviews ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <SkeletonCard />
                <SkeletonCard />
              </div>
            ) : (reviews ?? []).length === 0 ? (
              <Card padding={24} style={{ textAlign: 'center' }}>
                <Star size={32} style={{ color: 'var(--brand-slate-light)', marginBottom: 8 }} />
                <p style={{ margin: 0, fontSize: 14, color: 'var(--brand-slate)' }}>
                  Aún no has enviado valoraciones
                </p>
              </Card>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {(reviews ?? []).map((r) => <ReviewCard key={r.id} review={r} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
