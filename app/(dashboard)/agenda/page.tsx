'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import useSWR from 'swr';
import { ChevronLeft, ChevronRight, CheckCircle, Calendar, User, Clock, Video } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Mentor } from '@/lib/types';
import { Topbar } from '@/components/layout/Topbar';
import { SessionCard } from '@/components/features/SessionCard';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { SkeletonCard } from '@/components/ui/SkeletonCard';
import { useSessions } from '@/hooks/useSessions';
import { useAuth } from '@/context/AuthContext';
import { formatDate } from '@/lib/utils';

const fetcher = (url: string) => fetch(url).then((r) => r.json()).then((j) => j.data);

const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const hours = Array.from({ length: 11 }, (_, i) => `${9 + i}:00`);
const unavailableSlots = ['10:00', '13:00', '16:00', '18:00'];

function AgendaContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mentorId = searchParams.get('mentorId');
  const { user } = useAuth();

  const today = new Date();
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'upcoming' | 'completed' | 'pending'>('all');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: mentor } = useSWR<Mentor>(mentorId ? `/api/mentors/${mentorId}` : null, fetcher);
  const { sessions, isLoading, mutate } = useSessions({ userId: user?.id });

  const filteredSessions = statusFilter === 'all' ? sessions : sessions.filter((s) => s.status === statusFilter);

  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() + weekOffset * 7 - today.getDay() + 1);

  const weekDates = days.map((_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d;
  });

  const selectedDate = weekDates[selectedDay];
  const selectedDateStr = selectedDate.toISOString().split('T')[0];

  const handleConfirm = async () => {
    if (!selectedTime || !mentorId) {
      toast.error('Selecciona un horario antes de confirmar');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mentorId,
          apprenticeId: user?.id || 'u1',
          topic: 'Sesión de mentoría agendada desde el calendario',
          date: selectedDateStr,
          time: selectedTime,
          duration: 60,
          type: 'videocall',
        }),
      });
      const json = await res.json();
      if (json.status === 'ok') {
        toast.success('Sesión agendada correctamente');
        mutate();
        setSelectedTime(null);
        router.push('/agenda');
      }
    } catch {
      toast.error('Error al agendar la sesión');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Topbar title="Mi Agenda" subtitle="Gestiona y agenda tus sesiones de mentoría" />
      <div style={{ padding: '32px 36px', flex: 1, display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        {/* Main */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 20, minWidth: 0 }}>
          {/* Week selector */}
          <Card padding={20}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--brand-dark)', fontFamily: 'var(--font-sora, Sora, sans-serif)' }}>
                {weekDates[0].toLocaleString('es', { month: 'long', year: 'numeric' })}
              </h3>
              <div style={{ display: 'flex', gap: 8 }}>
                <Button variant="ghost" size="sm" icon={<ChevronLeft size={14} />} onClick={() => setWeekOffset((w) => w - 1)} aria-label="Semana anterior" />
                <Button variant="ghost" size="sm" icon={<ChevronRight size={14} />} onClick={() => setWeekOffset((w) => w + 1)} aria-label="Semana siguiente" />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {days.map((day, i) => {
                const date = weekDates[i];
                const isSelected = selectedDay === i;
                const isToday = date.toDateString() === today.toDateString();
                return (
                  <button
                    key={day}
                    onClick={() => { setSelectedDay(i); setSelectedTime(null); }}
                    style={{
                      flex: 1,
                      padding: '10px 6px',
                      borderRadius: 10,
                      border: 'none',
                      cursor: 'pointer',
                      backgroundColor: isSelected ? 'var(--brand-primary)' : isToday ? 'var(--brand-primary-bg)' : 'var(--brand-surface)',
                      color: isSelected ? 'white' : isToday ? 'var(--brand-primary)' : 'var(--brand-slate)',
                      transition: 'all 0.15s',
                      textAlign: 'center',
                    }}
                    aria-pressed={isSelected}
                    aria-label={`${day} ${date.getDate()}`}
                  >
                    <div style={{ fontSize: 11, marginBottom: 4, fontWeight: 500 }}>{day}</div>
                    <div style={{ fontSize: 16, fontWeight: 700, fontFamily: 'var(--font-sora, Sora, sans-serif)' }}>
                      {date.getDate()}
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Time slots */}
          <Card padding={20}>
            <h3 style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 700, color: 'var(--brand-dark)', fontFamily: 'var(--font-sora, Sora, sans-serif)' }}>
              Horarios disponibles · {days[selectedDay]} {weekDates[selectedDay].getDate()} de{' '}
              {weekDates[selectedDay].toLocaleString('es', { month: 'long' })}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
              {hours.map((h) => {
                const isUnavailable = unavailableSlots.includes(h);
                const isSelected = selectedTime === h;
                return (
                  <button
                    key={h}
                    onClick={() => !isUnavailable && setSelectedTime(isSelected ? null : h)}
                    disabled={isUnavailable}
                    style={{
                      padding: '10px 6px',
                      borderRadius: 10,
                      border: '1px solid',
                      borderColor: isSelected ? 'var(--brand-primary)' : isUnavailable ? 'var(--brand-border)' : 'var(--brand-primary-bg)',
                      backgroundColor: isSelected ? 'var(--brand-primary)' : isUnavailable ? 'var(--brand-surface)' : 'var(--brand-primary-bg)',
                      color: isSelected ? 'white' : isUnavailable ? 'var(--brand-slate-light)' : 'var(--brand-primary)',
                      cursor: isUnavailable ? 'not-allowed' : 'pointer',
                      fontSize: 13,
                      fontWeight: 500,
                      opacity: isUnavailable ? 0.5 : 1,
                      transition: 'all 0.15s',
                    }}
                    aria-pressed={isSelected}
                    aria-label={`${isUnavailable ? 'No disponible' : 'Disponible'}: ${h}`}
                  >
                    {h}
                  </button>
                );
              })}
            </div>

            {selectedTime && (
              <div
                style={{
                  marginTop: 16,
                  padding: '12px 16px',
                  borderRadius: 10,
                  backgroundColor: 'var(--brand-primary-bg)',
                  border: '1px solid var(--brand-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
                role="status"
              >
                <CheckCircle size={16} style={{ color: 'var(--brand-primary)', flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: 'var(--brand-primary)', fontWeight: 500 }}>
                  Sesión seleccionada: {formatDate(selectedDateStr, 'dd MMM')} · {selectedTime} · 60 min
                </span>
              </div>
            )}
          </Card>

          {/* My sessions */}
          <div>
            <h3 style={{ margin: '0 0 14px', fontSize: 16, fontWeight: 700, color: 'var(--brand-dark)', fontFamily: 'var(--font-sora, Sora, sans-serif)' }}>
              Mis Sesiones
            </h3>
            {/* Tabs */}
            <div style={{ display: 'flex', gap: 4, marginBottom: 16, backgroundColor: 'var(--brand-border)', borderRadius: 10, padding: 4 }}>
              {[
                { value: 'all', label: 'Todas' },
                { value: 'upcoming', label: 'Próximas' },
                { value: 'completed', label: 'Completadas' },
                { value: 'pending', label: 'Pendientes' },
              ].map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setStatusFilter(value as typeof statusFilter)}
                  style={{
                    flex: 1,
                    padding: '7px 10px',
                    borderRadius: 7,
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: statusFilter === value ? 'white' : 'transparent',
                    color: statusFilter === value ? 'var(--brand-dark)' : 'var(--brand-slate)',
                    fontSize: 13,
                    fontWeight: statusFilter === value ? 600 : 400,
                    boxShadow: statusFilter === value ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                    transition: 'all 0.15s',
                  }}
                  aria-pressed={statusFilter === value}
                >
                  {label}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {isLoading ? (
                [1, 2].map((i) => <SkeletonCard key={i} />)
              ) : filteredSessions.length === 0 ? (
                <Card padding={24} style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: 14, color: 'var(--brand-slate)' }}>Sin sesiones en esta categoría</p>
                </Card>
              ) : (
                filteredSessions.map((s) => (
                  <SessionCard key={s.id} session={s} />
                ))
              )}
            </div>
          </div>
        </div>

        {/* Booking sidebar */}
        <div style={{ width: 320, flexShrink: 0, position: 'sticky', top: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {mentor && (
            <Card padding={20}>
              <h4 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 700, color: 'var(--brand-dark)', fontFamily: 'var(--font-sora, Sora, sans-serif)' }}>
                Mentor seleccionado
              </h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid var(--brand-border)' }}>
                <Avatar initials={mentor.user?.avatar || 'ME'} size={44} />
                <div>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: 'var(--brand-dark)' }}>{mentor.user?.name}</p>
                  <p style={{ margin: 0, fontSize: 12, color: 'var(--brand-slate)' }}>{mentor.specialty}</p>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { icon: Calendar, label: 'Fecha', value: selectedDate ? formatDate(selectedDateStr, 'EEEE, dd MMM') : 'Sin seleccionar' },
                  { icon: Clock, label: 'Hora', value: selectedTime || 'Sin seleccionar' },
                  { icon: Clock, label: 'Duración', value: '60 minutos' },
                  { icon: Video, label: 'Modalidad', value: 'Video llamada' },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Icon size={14} style={{ color: 'var(--brand-slate-light)', flexShrink: 0 }} />
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 12, color: 'var(--brand-slate)' }}>{label}</span>
                      <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--brand-dark)' }}>{value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          <Card padding={20}>
            <Button
              variant="primary"
              size="lg"
              icon={<CheckCircle size={16} />}
              style={{ width: '100%', marginBottom: 10 }}
              loading={isSubmitting}
              disabled={!selectedTime || !mentorId}
              onClick={handleConfirm}
            >
              Confirmar sesión
            </Button>
            <Button
              variant="ghost"
              size="md"
              style={{ width: '100%' }}
              onClick={() => { setSelectedTime(null); router.back(); }}
            >
              Cancelar
            </Button>
            {mentorId && !selectedTime && (
              <p style={{ margin: '10px 0 0', fontSize: 11, color: 'var(--brand-slate-light)', textAlign: 'center' }}>
                Selecciona un horario disponible para continuar
              </p>
            )}

            <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8, padding: 12, borderRadius: 8, backgroundColor: 'var(--brand-surface)' }}>
              <Calendar size={14} style={{ color: 'var(--brand-slate-light)', flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: 'var(--brand-slate-light)' }}>
                La sesión confirmada se agregará automáticamente a tu calendario
              </span>
            </div>
          </Card>

          {!mentorId && (
            <Card padding={20} style={{ textAlign: 'center' }}>
              <User size={32} style={{ color: 'var(--brand-slate-light)', marginBottom: 8 }} />
              <p style={{ margin: 0, fontSize: 13, color: 'var(--brand-slate)' }}>
                Selecciona un mentor desde el <button onClick={() => router.push('/mentores')} style={{ color: 'var(--brand-primary)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 13 }}>directorio</button> para agendar
              </p>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}

export default function AgendaPage() {
  return (
    <Suspense fallback={<div style={{ padding: '32px 36px' }}><SkeletonCard /></div>}>
      <AgendaContent />
    </Suspense>
  );
}
