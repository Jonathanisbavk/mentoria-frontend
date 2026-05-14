'use client';

import { useRouter } from 'next/navigation';
import { Video } from 'lucide-react';
import type { Mentor } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { StarRating } from '@/components/ui/StarRating';
import { Button } from '@/components/ui/Button';

interface MentorCardProps {
  mentor: Mentor;
}

export function MentorCard({ mentor }: MentorCardProps) {
  const router = useRouter();
  const user = mentor.user;

  return (
    <Card
      padding={20}
      className="flex flex-col gap-4 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
      style={{ cursor: 'default' }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <Avatar initials={user?.avatar || mentor.userId.slice(0, 2).toUpperCase()} size={48} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
            <h3
              style={{
                margin: 0,
                fontSize: 15,
                fontWeight: 700,
                color: 'var(--brand-dark)',
                fontFamily: 'var(--font-sora, Sora, sans-serif)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {user?.name || 'Mentor'}
            </h3>
            <Badge variant={mentor.available ? 'success' : 'default'} dot>
              {mentor.available ? 'Disponible' : 'Ocupado'}
            </Badge>
          </div>
          <p style={{ margin: '2px 0 0', fontSize: 13, color: 'var(--brand-slate)' }}>
            {mentor.specialty} · {user?.cycle}
          </p>
          <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
            <StarRating rating={mentor.rating} size={13} />
            <span style={{ fontSize: 12, color: 'var(--brand-slate-light)' }}>
              {mentor.rating} ({mentor.totalSessions} sesiones)
            </span>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {mentor.tags.slice(0, 3).map((tag) => (
          <Badge key={tag} variant="info">
            {tag}
          </Badge>
        ))}
        {mentor.tags.length > 3 && (
          <Badge variant="default">+{mentor.tags.length - 3}</Badge>
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: 12,
          borderTop: '1px solid var(--brand-border)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Video size={13} style={{ color: 'var(--brand-slate-light)' }} />
          <span style={{ fontSize: 12, color: 'var(--brand-slate-light)' }}>
            {mentor.totalSessions} sesiones
          </span>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => router.push(`/mentores/${mentor.userId}`)}
          aria-label={`Ver perfil de ${user?.name || 'mentor'}`}
        >
          Ver perfil
        </Button>
      </div>
    </Card>
  );
}
