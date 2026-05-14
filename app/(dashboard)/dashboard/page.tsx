'use client';

import Link from 'next/link';
import { BookOpen, Clock, Star, Users, Activity, TrendingUp, ChevronRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useSessions } from '@/hooks/useSessions';
import { useMentors } from '@/hooks/useMentors';
import { useStats } from '@/hooks/useStats';
import { Topbar } from '@/components/layout/Topbar';
import { StatCard } from '@/components/features/StatCard';
import { SessionCard } from '@/components/features/SessionCard';
import { MentorCard } from '@/components/features/MentorCard';
import { SkeletonCard } from '@/components/ui/SkeletonCard';
import { Card } from '@/components/ui/Card';

export default function DashboardPage() {
  const { user } = useAuth();
  const { sessions, isLoading: loadingSessions } = useSessions({ userId: user?.id, status: 'upcoming', limit: 2 });
  const { mentors, isLoading: loadingMentors } = useMentors({ recommended: true, limit: 4 });
  const { stats } = useStats();

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Buenos días' : hour < 18 ? 'Buenas tardes' : 'Buenas noches';

  const upcomingCount = sessions.length;
  const subtitle = upcomingCount > 0
    ? `Tienes ${upcomingCount} sesión${upcomingCount !== 1 ? 'es' : ''} próxima${upcomingCount !== 1 ? 's' : ''} esta semana`
    : 'Sin sesiones pendientes esta semana — ¡agenda una!';

  const progress = [
    { label: 'Diseño UX/UI', pct: 72, color: 'var(--brand-primary)' },
    { label: 'Programación', pct: 55, color: 'var(--brand-info)' },
    { label: 'Base de Datos', pct: 40, color: 'var(--brand-success)' },
  ];

  const activity = [
    { icon: Star, text: 'Valoraste la sesión con Ana Lucía', time: 'Hace 2 días', color: 'var(--brand-warning)' },
    { icon: BookOpen, text: 'Sesión completada con Carlos Mendoza', time: 'Hace 3 días', color: 'var(--brand-info)' },
    { icon: TrendingUp, text: 'Nuevo logro: 10 horas de mentoría', time: 'Hace 1 semana', color: 'var(--brand-success)' },
  ];

  return (
    <>
      <Topbar
        title={`${greeting}, ${user?.name.split(' ')[0]}`}
        subtitle={subtitle}
      />
      <div style={{ padding: '32px 36px', flex: 1 }}>
        {/* Stats row */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 28 }}>
          <StatCard icon={BookOpen} label="Sesiones Totales" value={stats?.sessionsThisMonth ? 12 : 12} iconColor="var(--brand-primary)" trend="+3 este mes" />
          <StatCard icon={Clock} label="Horas de Mentoría" value="18h" iconColor="var(--brand-info)" trend="+4h esta semana" />
          <StatCard icon={Star} label="Valoración Promedio" value="4.8" iconColor="var(--brand-warning)" />
          <StatCard icon={Users} label="Mentores Activos" value={3} iconColor="var(--brand-success)" />
        </div>

        {/* Main content */}
        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
          {/* Left column */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 24, minWidth: 0 }}>
            {/* Upcoming sessions */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: 'var(--brand-dark)', fontFamily: 'var(--font-sora, Sora, sans-serif)' }}>
                  Próximas Sesiones
                </h2>
                <Link href="/agenda" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: 'var(--brand-primary)', textDecoration: 'none', fontWeight: 500 }}>
                  Ver agenda <ChevronRight size={14} />
                </Link>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {loadingSessions ? (
                  <>
                    <SkeletonCard />
                    <SkeletonCard />
                  </>
                ) : sessions.length === 0 ? (
                  <Card padding={24} style={{ textAlign: 'center' }}>
                    <Activity size={32} style={{ color: 'var(--brand-slate-light)', marginBottom: 8 }} />
                    <p style={{ margin: 0, fontSize: 14, color: 'var(--brand-slate)' }}>
                      Sin sesiones próximas. <Link href="/mentores" style={{ color: 'var(--brand-primary)' }}>Busca un mentor</Link>
                    </p>
                  </Card>
                ) : (
                  sessions.map((s) => <SessionCard key={s.id} session={s} />)
                )}
              </div>
            </div>

            {/* Recommended mentors */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: 'var(--brand-dark)', fontFamily: 'var(--font-sora, Sora, sans-serif)' }}>
                  Mentores Recomendados
                </h2>
                <Link href="/mentores" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: 'var(--brand-primary)', textDecoration: 'none', fontWeight: 500 }}>
                  Ver todos <ChevronRight size={14} />
                </Link>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                {loadingMentors ? (
                  [1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)
                ) : (
                  mentors.map((m) => <MentorCard key={m.userId} mentor={m} />)
                )}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div style={{ width: 320, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 20, position: 'sticky', top: 24 }}>
            {/* Progress */}
            <Card padding={24}>
              <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700, color: 'var(--brand-dark)', fontFamily: 'var(--font-sora, Sora, sans-serif)' }}>
                Mi Progreso
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {progress.map(({ label, pct, color }) => (
                  <div key={label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 13, color: 'var(--brand-slate)' }}>{label}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--brand-dark)' }}>{pct}%</span>
                    </div>
                    <div style={{ height: 6, backgroundColor: 'var(--brand-border)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', backgroundColor: color, borderRadius: 3, transition: 'width 0.8s ease' }} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Activity */}
            <Card padding={24}>
              <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700, color: 'var(--brand-dark)', fontFamily: 'var(--font-sora, Sora, sans-serif)' }}>
                Actividad Reciente
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {activity.map(({ icon: Icon, text, time, color }, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        backgroundColor: `${color}18`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={14} style={{ color }} />
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: 12, color: 'var(--brand-slate)', lineHeight: 1.4 }}>{text}</p>
                      <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--brand-slate-light)' }}>{time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
