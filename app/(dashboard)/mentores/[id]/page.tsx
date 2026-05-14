'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { Bookmark, Mail, Video, MessageSquare, Calendar, Clock, Star, ChevronLeft } from 'lucide-react';
import type { Mentor } from '@/lib/types';
import { Topbar } from '@/components/layout/Topbar';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { StarRating } from '@/components/ui/StarRating';
import { Textarea } from '@/components/ui/Textarea';
import { ReviewCard } from '@/components/features/ReviewCard';
import { SkeletonCard } from '@/components/ui/SkeletonCard';

const fetcher = (url: string) => fetch(url).then((r) => r.json()).then((j) => j.data);

export default function MentorProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: mentor, isLoading } = useSWR<Mentor>(`/api/mentors/${id}`, fetcher);

  const [sessionType, setSessionType] = useState<'videocall' | 'chat'>('videocall');
  const [duration, setDuration] = useState(45);
  const [topic, setTopic] = useState('');
  const [reviewTab, setReviewTab] = useState<'all' | '5' | '4'>('all');

  if (isLoading) {
    return (
      <>
        <Topbar title="Perfil del Mentor" subtitle="Cargando información..." />
        <div style={{ padding: '32px 36px', display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <SkeletonCard />
            <SkeletonCard />
          </div>
          <SkeletonCard />
        </div>
      </>
    );
  }

  if (!mentor) {
    return (
      <>
        <Topbar title="Mentor no encontrado" />
        <div style={{ padding: '32px 36px' }}>
          <Card padding={24} style={{ textAlign: 'center' }}>
            <p style={{ color: 'var(--brand-slate)' }}>No se encontró el mentor solicitado.</p>
            <Button variant="secondary" size="md" onClick={() => router.back()} style={{ marginTop: 12 }}>
              Volver
            </Button>
          </Card>
        </div>
      </>
    );
  }

  const user = mentor.user;
  const reviews = mentor.reviews ?? [];
  const filteredReviews = reviewTab === 'all' ? reviews : reviews.filter((r) => r.rating === parseInt(reviewTab));

  return (
    <>
      <Topbar title={user?.name || 'Perfil del Mentor'} subtitle={`${mentor.specialty} · ${user?.cycle} ciclo`} />
      <div style={{ padding: '32px 36px', display: 'flex', gap: 24, alignItems: 'flex-start', flex: 1 }}>
        {/* Main content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 20, minWidth: 0 }}>
          {/* Back link */}
          <button
            onClick={() => router.back()}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: 'var(--brand-slate)', padding: 0, width: 'fit-content' }}
          >
            <ChevronLeft size={16} /> Volver a mentores
          </button>

          {/* Cover card */}
          <Card padding={0} style={{ overflow: 'hidden' }}>
            <div
              style={{
                height: 120,
                background: `linear-gradient(135deg, var(--brand-dark) 0%, var(--brand-primary-dark) 60%, var(--brand-primary) 100%)`,
              }}
            />
            <div style={{ padding: '0 24px 24px', marginTop: -32 }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, marginBottom: 14 }}>
                <div style={{ border: '3px solid white', borderRadius: '50%', flexShrink: 0 }}>
                  <Avatar initials={user?.avatar || 'ME'} size={72} />
                </div>
                <div style={{ flex: 1, paddingBottom: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: 'var(--brand-dark)', fontFamily: 'var(--font-sora, Sora, sans-serif)' }}>
                      {user?.name}
                    </h2>
                    <Badge variant={mentor.available ? 'success' : 'default'} dot>
                      {mentor.available ? 'Disponible' : 'No disponible'}
                    </Badge>
                  </div>
                  <p style={{ margin: '4px 0', fontSize: 14, color: 'var(--brand-slate)' }}>
                    {mentor.specialty} · {user?.cycle} ciclo
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <StarRating rating={mentor.rating} size={14} showLabel />
                    <span style={{ fontSize: 12, color: 'var(--brand-slate-light)' }}>
                      {mentor.totalSessions} sesiones completadas
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Button variant="ghost" size="sm" icon={<Bookmark size={14} />} aria-label="Guardar mentor" />
                  <Button variant="ghost" size="sm" icon={<Mail size={14} />} aria-label="Enviar mensaje" />
                </div>
              </div>
            </div>
          </Card>

          {/* About */}
          <Card padding={24}>
            <h3 style={{ margin: '0 0 12px', fontSize: 16, fontWeight: 700, color: 'var(--brand-dark)', fontFamily: 'var(--font-sora, Sora, sans-serif)' }}>
              Acerca del mentor
            </h3>
            <p style={{ margin: '0 0 16px', fontSize: 14, color: 'var(--brand-slate)', lineHeight: 1.7 }}>
              {mentor.bio}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {mentor.tags.map((tag) => (
                <Badge key={tag} variant="info">{tag}</Badge>
              ))}
            </div>
          </Card>

          {/* Reviews */}
          <Card padding={24}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--brand-dark)', fontFamily: 'var(--font-sora, Sora, sans-serif)' }}>
                Valoraciones ({reviews.length})
              </h3>
              <div style={{ display: 'flex', gap: 4 }}>
                {(['all', '5', '4'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setReviewTab(tab)}
                    style={{
                      padding: '4px 12px',
                      borderRadius: 20,
                      border: '1px solid',
                      borderColor: reviewTab === tab ? 'var(--brand-primary)' : 'var(--brand-border)',
                      backgroundColor: reviewTab === tab ? 'var(--brand-primary-bg)' : 'transparent',
                      color: reviewTab === tab ? 'var(--brand-primary)' : 'var(--brand-slate)',
                      fontSize: 12,
                      fontWeight: 500,
                      cursor: 'pointer',
                    }}
                  >
                    {tab === 'all' ? 'Todas' : `${tab}★`}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {filteredReviews.length === 0 ? (
                <p style={{ fontSize: 13, color: 'var(--brand-slate-light)', textAlign: 'center', padding: '16px 0' }}>
                  Sin valoraciones con este filtro
                </p>
              ) : (
                filteredReviews.map((r) => <ReviewCard key={r.id} review={r} />)
              )}
            </div>
          </Card>
        </div>

        {/* Booking sidebar */}
        <div style={{ width: 320, flexShrink: 0, position: 'sticky', top: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card padding={24}>
            <h3 style={{ margin: '0 0 18px', fontSize: 16, fontWeight: 700, color: 'var(--brand-dark)', fontFamily: 'var(--font-sora, Sora, sans-serif)' }}>
              Solicitar sesión
            </h3>

            {/* Session type */}
            <div style={{ marginBottom: 16 }}>
              <p style={{ margin: '0 0 8px', fontSize: 12, fontWeight: 600, color: 'var(--brand-slate)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Modalidad
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {[
                  { value: 'videocall' as const, label: 'Video llamada', icon: Video },
                  { value: 'chat' as const, label: 'Chat en vivo', icon: MessageSquare },
                ].map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => setSessionType(value)}
                    style={{
                      padding: '10px 8px',
                      borderRadius: 10,
                      border: '1px solid',
                      borderColor: sessionType === value ? 'var(--brand-primary)' : 'var(--brand-border)',
                      backgroundColor: sessionType === value ? 'var(--brand-primary-bg)' : 'white',
                      color: sessionType === value ? 'var(--brand-primary)' : 'var(--brand-slate)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 4,
                      fontSize: 12,
                      fontWeight: 500,
                      transition: 'all 0.15s',
                    }}
                    aria-pressed={sessionType === value}
                  >
                    <Icon size={16} />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div style={{ marginBottom: 16 }}>
              <p style={{ margin: '0 0 8px', fontSize: 12, fontWeight: 600, color: 'var(--brand-slate)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Duración
              </p>
              <div style={{ display: 'flex', gap: 8 }}>
                {[30, 45, 60].map((d) => (
                  <button
                    key={d}
                    onClick={() => setDuration(d)}
                    style={{
                      flex: 1,
                      padding: '8px 4px',
                      borderRadius: 10,
                      border: '1px solid',
                      borderColor: duration === d ? 'var(--brand-primary)' : 'var(--brand-border)',
                      backgroundColor: duration === d ? 'var(--brand-primary-bg)' : 'white',
                      color: duration === d ? 'var(--brand-primary)' : 'var(--brand-slate)',
                      cursor: 'pointer',
                      fontSize: 13,
                      fontWeight: 500,
                      transition: 'all 0.15s',
                    }}
                    aria-pressed={duration === d}
                  >
                    {d} min
                  </button>
                ))}
              </div>
            </div>

            {/* Topic */}
            <div style={{ marginBottom: 20 }}>
              <Textarea
                label="¿En qué necesitas ayuda?"
                placeholder="Describe el tema que quieres trabajar en esta sesión..."
                rows={3}
                maxLength={300}
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>

            <Button
              variant="primary"
              size="lg"
              icon={<Calendar size={16} />}
              style={{ width: '100%' }}
              onClick={() => router.push(`/agenda?mentorId=${id}`)}
              disabled={!mentor.available}
            >
              Ver disponibilidad
            </Button>

            {!mentor.available && (
              <p style={{ margin: '8px 0 0', fontSize: 12, color: 'var(--brand-slate-light)', textAlign: 'center' }}>
                Este mentor no está disponible actualmente
              </p>
            )}
          </Card>

          {/* Info card */}
          <Card padding={20}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { icon: Clock, label: 'Tiempo de respuesta', value: mentor.responseTime },
                { icon: Star, label: 'Valoración', value: `${mentor.rating} / 5.0` },
                { icon: Video, label: 'Sesiones', value: `${mentor.totalSessions} completadas` },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: 'var(--brand-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={14} style={{ color: 'var(--brand-slate)' }} />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: 11, color: 'var(--brand-slate-light)' }}>{label}</p>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: 'var(--brand-dark)' }}>{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
