'use client';

import { Video, Calendar, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import type { Session } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatDate, formatDuration } from '@/lib/utils';

interface SessionCardProps {
  session: Session;
  onJoin?: (session: Session) => void;
  onCancel?: (session: Session) => void;
  onReview?: (session: Session) => void;
  onAccept?: (session: Session) => void;
}

const statusConfig = {
  upcoming: { label: 'Próxima', variant: 'info' as const },
  completed: { label: 'Completada', variant: 'success' as const },
  pending: { label: 'Pendiente', variant: 'warning' as const },
  cancelled: { label: 'Cancelada', variant: 'danger' as const },
};

export function SessionCard({ session, onJoin, onCancel, onReview, onAccept }: SessionCardProps) {
  const mentor = session.mentor;
  const { label, variant } = statusConfig[session.status];

  return (
    <Card padding={18}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <Avatar initials={mentor?.avatar || 'ME'} size={44} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 4 }}>
            <h4
              style={{
                margin: 0,
                fontSize: 14,
                fontWeight: 700,
                color: 'var(--brand-dark)',
                fontFamily: 'var(--font-sora, Sora, sans-serif)',
              }}
            >
              {mentor?.name || 'Mentor'}
            </h4>
            <Badge variant={variant}>{label}</Badge>
          </div>

          <p
            style={{
              margin: '0 0 8px',
              fontSize: 13,
              color: 'var(--brand-slate)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {session.topic}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--brand-slate-light)' }}>
              <Calendar size={12} />
              {formatDate(session.date, 'dd MMM')} · {session.time}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--brand-slate-light)' }}>
              <Clock size={12} />
              {formatDuration(session.duration)}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--brand-slate-light)' }}>
              <Video size={12} />
              Video llamada
            </span>
          </div>
        </div>
      </div>

      {(session.status === 'upcoming' || session.status === 'completed' || session.status === 'pending') && (
        <div
          style={{
            display: 'flex',
            gap: 8,
            marginTop: 14,
            paddingTop: 14,
            borderTop: '1px solid var(--brand-border)',
          }}
        >
          {session.status === 'upcoming' && (
            <>
              <Button variant="primary" size="sm" icon={<Video size={13} />} onClick={() => onJoin?.(session)}>
                Unirse
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onCancel?.(session)}>
                Cancelar
              </Button>
            </>
          )}
          {session.status === 'completed' && (
            <>
              <Button variant="ghost" size="sm" icon={<CheckCircle size={13} />}>
                Ver resumen
              </Button>
              <Button variant="secondary" size="sm" icon={<AlertCircle size={13} />} onClick={() => onReview?.(session)}>
                Valorar
              </Button>
            </>
          )}
          {session.status === 'pending' && (
            <>
              <Button variant="success" size="sm" onClick={() => onAccept?.(session)}>
                Aceptar
              </Button>
              <Button variant="ghost" size="sm">
                Reagendar
              </Button>
            </>
          )}
        </div>
      )}
    </Card>
  );
}
